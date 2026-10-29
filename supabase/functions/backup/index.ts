// Nightly backup of this project to a private, encrypted Backblaze B2 bucket.
//   db/<date>/<table>.jsonl.gz  every public table, plus auth users without passwords (snapshots kept 30 days)
//   media/<bucket>/<path>       every uploaded file, copied once
//   db/<date>/manifest.json     row counts, used by ?mode=verify
// Called by pg_cron with a secret token. Credentials live in the locked ops_secrets table, never in the repository.
const SB = Deno.env.get('SUPABASE_URL')!.replace(/\/$/, '');
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// Credentials sit in the locked ops_secrets table (no policies: only this function's service key can read it).
const SEC: Record<string, string> = {};
{
  const r = await fetch(`${SB}/rest/v1/ops_secrets?select=name,value`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  for (const x of await r.json()) SEC[x.name] = x.value;
}
const TOKEN = SEC.BACKUP_TOKEN;
const EP = (SEC.B2_ENDPOINT ?? 'https://s3.invalid').replace(/\/$/, '');
const BUCKET = SEC.B2_BUCKET;
const KID = SEC.B2_KEY_ID;
const AK = SEC.B2_APP_KEY;
const REGION = new URL(EP).hostname.split('.')[1];
const KEEP_DAYS = 30, MAX_FILE = 40 * 1024 * 1024, BUDGET_MS = 110_000;
const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const sha = async (d: string | Uint8Array) => hex(await crypto.subtle.digest('SHA-256', typeof d === 'string' ? enc.encode(d) : d));
async function hmac(key: ArrayBuffer | Uint8Array, msg: string) {
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, enc.encode(msg));
}
const uri = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

async function s3(method: string, key: string, query: Record<string, string> = {}, body: Uint8Array | null = null) {
  const host = new URL(EP).host;
  const path = '/' + BUCKET + (key ? '/' + key.split('/').map(uri).join('/') : '');
  const now = new Date(); const amz = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); const day = amz.slice(0, 8);
  const payload = await sha(body ?? '');
  const cq = Object.keys(query).sort().map((k) => `${uri(k)}=${uri(query[k])}`).join('&');
  const headers: Record<string, string> = { host, 'x-amz-content-sha256': payload, 'x-amz-date': amz };
  const sh = Object.keys(headers).sort();
  const canon = [method, path, cq, sh.map((h) => `${h}:${headers[h]}\n`).join(''), sh.join(';'), payload].join('\n');
  const scope = `${day}/${REGION}/s3/aws4_request`;
  const sts = ['AWS4-HMAC-SHA256', amz, scope, await sha(canon)].join('\n');
  let k: ArrayBuffer = await hmac(enc.encode('AWS4' + AK), day);
  for (const p of [REGION, 's3', 'aws4_request']) k = await hmac(k, p);
  const sig = hex(await hmac(k, sts));
  const res = await fetch(`${EP}${path}${cq ? '?' + cq : ''}`, {
    method, body: body as BodyInit | null,
    headers: { ...headers, Authorization: `AWS4-HMAC-SHA256 Credential=${KID}/${scope}, SignedHeaders=${sh.join(';')}, Signature=${sig}` },
  });
  return res;
}
async function put(key: string, data: Uint8Array) {
  const r = await s3('PUT', key, {}, data); if (!r.ok) throw new Error(`B2 PUT ${key} ${r.status} ${(await r.text()).slice(0, 200)}`);
}
async function exists(key: string) { const r = await s3('HEAD', key); await r.body?.cancel(); return r.status === 200; }
async function list(prefix: string, delimiter = '') {
  const out: string[] = []; const prefixes: string[] = []; let token = '';
  for (;;) {
    const q: Record<string, string> = { 'list-type': '2', prefix }; if (delimiter) q.delimiter = delimiter; if (token) q['continuation-token'] = token;
    const r = await s3('GET', '', q); const x = await r.text(); if (!r.ok) throw new Error(`B2 LIST ${r.status} ${x.slice(0, 200)}`);
    for (const m of x.matchAll(/<Contents>\s*<Key>([^<]+)<\/Key>/g)) out.push(m[1].replaceAll('&amp;', '&'));
    for (const m of x.matchAll(/<CommonPrefixes>\s*<Prefix>([^<]+)<\/Prefix>/g)) prefixes.push(m[1]);
    const n = x.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/); if (!n) break; token = n[1];
  }
  return { keys: out, prefixes };
}
async function del(key: string) { const r = await s3('DELETE', key); await r.body?.cancel(); }
async function gzip(text: string) {
  const cs = new CompressionStream('gzip'); const w = cs.writable.getWriter(); w.write(enc.encode(text)); w.close();
  return new Uint8Array(await new Response(cs.readable).arrayBuffer());
}
async function gunzip(b: Uint8Array) {
  const ds = new DecompressionStream('gzip'); const w = ds.writable.getWriter(); w.write(b); w.close();
  return await new Response(ds.readable).text();
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
async function rpc(fn: string, args: Record<string, unknown> = {}) {
  const r = await fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: H, body: JSON.stringify(args) });
  if (!r.ok) throw new Error(`rpc ${fn} ${r.status} ${(await r.text()).slice(0, 200)}`); return r.json();
}
async function saveStatus(data: unknown) {
  await fetch(`${SB}/rest/v1/backup_status?on_conflict=id`, { method: 'POST', headers: { ...H, Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ id: 1, data, updated_at: new Date().toISOString() }) });
}

async function backup() {
  const t0 = Date.now(); const today = new Date().toISOString().slice(0, 10); const errors: string[] = [];
  const manifest: Record<string, number> = {}; let rows = 0;
  const tables: string[] = await rpc('backup_tables');
  for (const t of tables) {
    try {
      const lines: string[] = []; let off = 0;
      for (;;) {
        const page: unknown[] = await rpc('backup_dump', { t, off, lim: 1000 });
        for (const r of page) lines.push(JSON.stringify(r));
        if (page.length < 1000) break; off += 1000;
      }
      await put(`db/${today}/${t}.jsonl.gz`, await gzip(lines.join('\n'))); manifest[t] = lines.length; rows += lines.length;
    } catch (e) { errors.push(`table ${t}: ${e}`); }
  }
  try {
    const users: unknown[] = []; for (let p = 1; ; p++) {
      const r = await fetch(`${SB}/auth/v1/admin/users?page=${p}&per_page=1000`, { headers: H }); const j = await r.json();
      const batch = j.users ?? []; users.push(...batch); if (batch.length < 1000) break;
    }
    await put(`db/${today}/auth_users.jsonl.gz`, await gzip(users.map((u) => JSON.stringify(u)).join('\n'))); manifest['auth_users'] = users.length; rows += users.length;
  } catch (e) { errors.push(`auth users: ${e}`); }
  await put(`db/${today}/manifest.json`, enc.encode(JSON.stringify({ date: today, tables: manifest })));

  // Media: copy each uploaded file once.
  let mediaTotal = 0, mediaBytes = 0, copied = 0, skipped = 0; const objs: { bucket_id: string; name: string; size: number }[] = await rpc('backup_storage_objects');
  for (const o of objs) {
    mediaTotal++; mediaBytes += o.size ?? 0;
    if (Date.now() - t0 > BUDGET_MS) { skipped++; continue; }
    const key = `media/${o.bucket_id}/${o.name}`;
    try {
      if (await exists(key)) continue;
      if ((o.size ?? 0) > MAX_FILE) { errors.push(`too large ${key}`); continue; }
      const r = await fetch(`${SB}/storage/v1/object/authenticated/${o.bucket_id}/${o.name.split('/').map(uri).join('/')}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
      if (!r.ok) { errors.push(`media read ${key} ${r.status}`); await r.body?.cancel(); continue; }
      await put(key, new Uint8Array(await r.arrayBuffer())); copied++;
    } catch (e) { errors.push(`media ${key}: ${e}`); }
  }
  if (skipped) errors.push(`${skipped} files left for the next run (time budget)`);

  // Keep 30 daily snapshots.
  const { prefixes } = await list('db/', '/'); const days = prefixes.map((p) => p.slice(3, 13)).filter((d) => /^\d{4}-\d\d-\d\d$/.test(d)).sort();
  const cutoff = new Date(Date.now() - KEEP_DAYS * 86400000).toISOString().slice(0, 10);
  for (const d of days) if (d < cutoff) for (const k of (await list(`db/${d}/`)).keys) await del(k);
  const status = { finished: new Date().toISOString(), tables: Object.keys(manifest).length, rows, media_total: mediaTotal, media_bytes: mediaBytes, media_copied: copied, snapshots: days.filter((d) => d >= cutoff).length, errors };
  await saveStatus(status); return status;
}

// Restore test: read the newest snapshot back from B2 and check every file decompresses to the row count in its manifest.
async function verify() {
  const { prefixes } = await list('db/', '/'); const days = prefixes.map((p) => p.slice(3, 13)).sort(); const day = days[days.length - 1];
  if (!day) return { ok: false, why: 'no snapshots' };
  const mr = await s3('GET', `db/${day}/manifest.json`); const man = await mr.json(); const bad: string[] = [];
  for (const [t, n] of Object.entries(man.tables as Record<string, number>)) {
    const r = await s3('GET', `db/${day}/${t}.jsonl.gz`); if (!r.ok) { bad.push(`${t}: missing`); await r.body?.cancel(); continue; }
    const txt = await gunzip(new Uint8Array(await r.arrayBuffer())); const count = txt ? txt.split('\n').length : 0;
    if (count !== n) bad.push(`${t}: ${count} rows read, ${n} expected`);
  }
  return { ok: bad.length === 0, day, tables: Object.keys(man.tables).length, problems: bad };
}

Deno.serve(async (req) => {
  if (req.headers.get('x-backup-token') !== TOKEN) return new Response('forbidden', { status: 403 });
  const mode = new URL(req.url).searchParams.get('mode') ?? 'backup';
  try {
    const out = mode === 'verify' ? await verify() : await backup();
    return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    await saveStatus({ finished: new Date().toISOString(), errors: [String(e)] });
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
