-- 034: Fun Night (bingo and raffle live nights). Everything is hidden behind app_settings.fun_night_on (default OFF).
-- Members never touch the tables: all access is through the functions below. Admins can use the tables directly.

alter table public.app_settings add column if not exists fun_night_on boolean not null default false;

create table if not exists public.fun_nights (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  game text not null check (game in ('bingo','raffle')),
  starts_at timestamptz not null,
  status text not null default 'draft' check (status in ('draft','sales','doors','live','closed')),
  price_text text,
  pay_info text,
  max_players int not null default 40 check (max_players between 2 and 5000),
  max_tickets_each int not null default 4 check (max_tickets_each between 1 and 50),
  prizes jsonb not null default '[]'::jsonb,
  host_name text,
  host_voice text not null default 'auto' check (host_voice in ('auto','live')),
  stream_url text,
  state jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.fun_reservations (
  id uuid primary key default gen_random_uuid(),
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  qty int not null check (qty >= 1),
  status text not null default 'reserved' check (status in ('reserved','paid','expired','refunded')),
  expires_at timestamptz not null,
  paid_at timestamptz,
  paid_by uuid,
  amount numeric,
  receipt text,
  passcode text,
  in_cyprus boolean not null default false,
  created_at timestamptz not null default now(),
  unique (night_id, user_id)
);

create table if not exists public.fun_tickets (
  id uuid primary key default gen_random_uuid(),
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reservation_id uuid references public.fun_reservations(id) on delete cascade,
  number int not null,
  card jsonb,
  created_at timestamptz not null default now(),
  unique (night_id, number)
);

create table if not exists public.fun_seated (
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  entered_at timestamptz not null default now(),
  primary key (night_id, user_id)
);

create table if not exists public.fun_calls (
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  seq int not null,
  n int not null,
  called_at timestamptz not null default now(),
  primary key (night_id, seq),
  unique (night_id, n)
);

create table if not exists public.fun_claims (
  id uuid primary key default gen_random_uuid(),
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  ticket_id uuid not null references public.fun_tickets(id) on delete cascade,
  stage int not null,
  valid boolean not null,
  called_count int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fun_draws (
  id uuid primary key default gen_random_uuid(),
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  prize_no int not null,
  prize_text text,
  ticket_id uuid references public.fun_tickets(id),
  user_id uuid references public.profiles(id),
  number int,
  pool_size int not null,
  pool_hash text not null,
  drawn_by uuid,
  drawn_at timestamptz not null default now(),
  unique (night_id, prize_no)
);

-- how a member's name is spoken by the host voice (admin can respell), plus the clip state
create table if not exists public.fun_name_clips (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  spoken_as text not null,
  status text not null default 'pending' check (status in ('pending','ready','failed')),
  clip_path text,
  updated_at timestamptz not null default now()
);

create index if not exists fun_res_night on public.fun_reservations(night_id, status);
create index if not exists fun_tix_user on public.fun_tickets(night_id, user_id);

-- lock everything down: admin only on the tables, members use functions
do $$ declare t text; begin
  foreach t in array array['fun_nights','fun_reservations','fun_tickets','fun_seated','fun_calls','fun_claims','fun_draws','fun_name_clips'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_admin', t);
    execute format('create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())', t||'_admin', t);
  end loop;
end $$;


-- added after the first draft: money fields, table seating, sent-log, storage bucket
alter table public.fun_nights add column if not exists price_amount numeric;
alter table public.fun_nights add column if not exists currency text not null default 'TL';
alter table public.fun_seated add column if not exists table_no int not null default 1;
create table if not exists public.fun_sent (
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null, sent_at timestamptz not null default now(),
  primary key (night_id, user_id, kind));
alter table public.fun_sent enable row level security;
drop policy if exists fun_sent_admin on public.fun_sent;
create policy fun_sent_admin on public.fun_sent for all using (public.is_admin()) with check (public.is_admin());
insert into storage.buckets (id, name, public) values ('fun', 'fun', true) on conflict (id) do nothing;
drop policy if exists fun_bucket_admin_write on storage.objects;
create policy fun_bucket_admin_write on storage.objects for all to authenticated
  using (bucket_id = 'fun' and public.is_admin()) with check (bucket_id = 'fun' and public.is_admin());

-- ---------- functions (as applied) ----------
CREATE OR REPLACE FUNCTION public.fun_admin_reservations(p_night uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return (select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id, 'user_id', r.user_id, 'name', p.display_name, 'photo', p.photo_url, 'qty', r.qty, 'status', r.status, 'expires_at', r.expires_at,
      'paid_at', r.paid_at, 'paid_by', pb.display_name, 'amount', r.amount, 'receipt', r.receipt, 'passcode', r.passcode, 'created_at', r.created_at,
      'tickets', (select coalesce(jsonb_agg(t.number order by t.number), '[]'::jsonb) from public.fun_tickets t where t.reservation_id = r.id),
      'spoken_as', coalesce(c.spoken_as, p.display_name), 'clip', c.status,
      'seated', exists (select 1 from public.fun_seated s where s.night_id = r.night_id and s.user_id = r.user_id)
    ) order by r.created_at), '[]'::jsonb)
    from public.fun_reservations r
    join public.profiles p on p.id = r.user_id
    left join public.profiles pb on pb.id = r.paid_by
    left join public.fun_name_clips c on c.user_id = r.user_id
    where r.night_id = p_night);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_admin_summary(p_night uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; paid int;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into n from public.fun_nights where id = p_night;
  paid := public.fun_paid_count(p_night);
  return jsonb_build_object(
    'reserved', (select count(*) from public.fun_reservations where night_id = p_night and status = 'reserved'),
    'paid', paid, 'seats_left', greatest(0, n.max_players - (select count(*) from public.fun_reservations where night_id = p_night and status in ('reserved','paid'))),
    'tickets', (select count(*) from public.fun_tickets where night_id = p_night),
    'income', (select coalesce(sum(amount),0) from public.fun_reservations where night_id = p_night and status = 'paid'),
    'prize_cost', (select coalesce(sum(nullif(x->>'value','')::numeric),0) from jsonb_array_elements(n.prizes) x where jsonb_typeof(x) = 'object'),
    'seated', (select count(*) from public.fun_seated where night_id = p_night),
    'room', public.fun_room_for(paid), 'tables', public.fun_tables_for(paid));
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_announce(p_night uuid, p_body text, p_users uuid[])
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; u uuid; c int := 0; msg text;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  if char_length(trim(coalesce(p_body,''))) < 3 then raise exception 'Write a short message first.'; end if;
  select * into n from public.fun_nights where id = p_night;
  if not found then raise exception 'Choose an event first.'; end if;
  msg := '🎉 ' || n.name || ' · ' || to_char(n.starts_at at time zone 'Asia/Famagusta', 'FMDay FMDD FMMonth, HH24:MI') || E'\n\n' || left(trim(p_body), 700)
         || E'\n\n' || 'Open Fun Night in the app to reserve your place.';
  for u in select p.id from public.profiles p where not p.suspended and p.id <> auth.uid() and (p_users is null or p.id = any(p_users)) loop
    perform public.fun_tell(u, msg, n.name, left(trim(p_body), 110));
    c := c + 1;
  end loop;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'fun_announce', jsonb_build_object('night', p_night, 'sent', c, 'all', p_users is null));
  return c;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_call_next(p_night uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; v int; s int;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.game <> 'bingo' or n.status <> 'live' then raise exception 'The game is not live.'; end if;
  select x into v from generate_series(1,90) x where not exists (select 1 from public.fun_calls c where c.night_id = p_night and c.n = x) order by gen_random_uuid() limit 1;
  if v is null then raise exception 'All 90 numbers have been called.'; end if;
  select coalesce(max(seq),0)+1 into s from public.fun_calls where night_id = p_night;
  insert into public.fun_calls(night_id, seq, n) values (p_night, s, v);
  return v;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_cancel(p_night uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  update public.fun_reservations set status = 'expired' where night_id = p_night and user_id = auth.uid() and status = 'reserved';
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_claim(p_night uuid, p_ticket uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; t public.fun_tickets; stage int; called int[]; rows_done int := 0; rw jsonb; ok boolean; v jsonb; valid boolean; first_win boolean := false; nm text;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.status <> 'live' or n.game <> 'bingo' then raise exception 'No game running.'; end if;
  if not exists (select 1 from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()) then raise exception 'Not at the table.'; end if;
  select * into t from public.fun_tickets where id = p_ticket and night_id = p_night and user_id = auth.uid();
  if not found then raise exception 'That is not your card.'; end if;
  stage := coalesce((n.state->>'stage')::int, 1);
  select coalesce(array_agg(c.n), array[]::int[]) into called from public.fun_calls c where c.night_id = p_night;
  for rw in select jsonb_array_elements(t.card) loop
    ok := true;
    for v in select jsonb_array_elements(rw) loop
      if v <> 'null'::jsonb and not ((v #>> '{}')::int = any(called)) then ok := false; end if;
    end loop;
    if ok then rows_done := rows_done + 1; end if;
  end loop;
  valid := rows_done >= stage;
  insert into public.fun_claims(night_id, user_id, ticket_id, stage, valid, called_count) values (p_night, auth.uid(), p_ticket, stage, valid, coalesce(array_length(called,1),0));
  if valid and (n.state->'winners'->(stage::text)) is null then
    select display_name into nm from public.profiles where id = auth.uid();
    update public.fun_nights set state = jsonb_set(jsonb_set(coalesce(state,'{}'::jsonb), '{winners}', coalesce(state->'winners','{}'::jsonb)), array['winners', stage::text], jsonb_build_object('user', auth.uid(), 'name', nm, 'ticket', t.number))
     where id = p_night;
    first_win := true;
  end if;
  return jsonb_build_object('valid', valid, 'stage', stage, 'first', first_win);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_draw_next(p_night uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; k int; prize jsonb; t public.fun_tickets; pool int; h text; nm text;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.game <> 'raffle' or n.status <> 'live' then raise exception 'The raffle is not live.'; end if;
  select count(*) + 1 into k from public.fun_draws where night_id = p_night;
  prize := n.prizes -> (k - 1);
  if prize is null then raise exception 'All prizes have been drawn.'; end if;
  select count(*), md5(coalesce(string_agg(number::text, ',' order by number), '')) into pool, h
    from public.fun_tickets tt where tt.night_id = p_night and not exists (select 1 from public.fun_draws d where d.ticket_id = tt.id);
  if pool = 0 then raise exception 'No tickets left to draw.'; end if;
  select tt.* into t from public.fun_tickets tt
   where tt.night_id = p_night and not exists (select 1 from public.fun_draws d where d.ticket_id = tt.id)
   order by gen_random_uuid() limit 1;
  insert into public.fun_draws(night_id, prize_no, prize_text, ticket_id, user_id, number, pool_size, pool_hash, drawn_by)
  values (p_night, k, coalesce(prize->>'text', prize #>> '{}'), t.id, t.user_id, t.number, pool, h, auth.uid());
  select display_name into nm from public.profiles where id = t.user_id;
  return jsonb_build_object('prize_no', k, 'number', t.number, 'name', nm, 'pool', pool);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_enter(p_night uuid, p_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; r public.fun_reservations; t int; cap int; tb int;
begin
  if auth.uid() is null or not public.fun_visible() then raise exception 'Not available'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.status not in ('doors','live') then raise exception 'The doors are not open yet.'; end if;
  select * into r from public.fun_reservations where night_id = p_night and user_id = auth.uid() and status = 'paid';
  if not found then raise exception 'No ticket found. Nice try, the door is not impressed.'; end if;
  if lower(trim(coalesce(p_code,''))) <> lower(r.passcode) then raise exception 'Wrong passcode. The door is unmoved.'; end if;
  if not exists (select 1 from public.fun_seated where night_id = p_night and user_id = auth.uid()) then
    -- once the host closes the doors nobody new comes in; anyone already inside can always come back
    if coalesce((n.state->>'locked')::boolean, false) then raise exception 'The doors are closed because the game has started. Message Admin if you think this is a mistake.'; end if;
    t := public.fun_tables_for(public.fun_paid_count(p_night)); cap := case when t = 1 then 6 else 7 end;
    select g into tb from generate_series(1, t) g
     where (select count(*) from public.fun_seated s where s.night_id = p_night and s.table_no = g) < cap order by g limit 1;
    insert into public.fun_seated(night_id, user_id, table_no) values (p_night, auth.uid(), coalesce(tb, 1));
  end if;
  return jsonb_build_object('ok', true);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_expire()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n int;
begin
  update public.fun_reservations r set status = 'expired'
   where r.status = 'reserved'
     and (r.expires_at < now() or exists (select 1 from public.fun_nights f where f.id = r.night_id and f.status in ('live','closed')));
  get diagnostics n = row_count;
  return n;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_host_set(p_night uuid, p_key text, p_value jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  if p_key not in ('quiet','talk','muted','announce','autocall','paused','locked') then raise exception 'Unknown control'; end if;
  update public.fun_nights set state = jsonb_set(coalesce(state,'{}'::jsonb), array[p_key], coalesce(p_value,'null'::jsonb)) where id = p_night;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_list()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare out jsonb;
begin
  if auth.uid() is null or not public.fun_visible() then return '[]'::jsonb; end if;
  perform public.fun_expire();
  select coalesce(jsonb_agg(x order by (x->>'starts_at')), '[]'::jsonb) into out from (
    select jsonb_build_object(
      'id', n.id, 'name', n.name, 'game', n.game, 'status', n.status, 'starts_at', n.starts_at,
      'price_text', n.price_text, 'pay_info', n.pay_info, 'max_tickets_each', n.max_tickets_each,
      'prizes', n.prizes, 'host_name', n.host_name, 'host_voice', n.host_voice,
      'players', (select count(*) from public.fun_reservations r where r.night_id = n.id and r.status in ('reserved','paid')),
      'max_players', n.max_players,
      'mine', (select jsonb_build_object('status', r.status, 'qty', r.qty, 'expires_at', r.expires_at, 'passcode', case when r.status = 'paid' then r.passcode end)
                 from public.fun_reservations r where r.night_id = n.id and r.user_id = auth.uid()),
      'seated', exists (select 1 from public.fun_seated s where s.night_id = n.id and s.user_id = auth.uid())
    ) x
    from public.fun_nights n
    where n.status in ('sales','doors','live')
       or (n.status = 'closed' and n.starts_at > now() - interval '12 hours')
  ) q;
  return out;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_make_card()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  cnt int[]; extra int; c int; k int; rc int[]; grid int[]; skip int; lo int; hi int; nums int[]; j int; r int; tries int := 0;
begin
  loop
    tries := tries + 1;
    cnt := array_fill(1, array[9]); extra := 6;
    while extra > 0 loop
      c := 1 + floor(random()*9)::int;
      if cnt[c] < 3 then cnt[c] := cnt[c] + 1; extra := extra - 1; end if;
    end loop;
    rc := array[0,0,0]; grid := array_fill(0, array[27]);
    for c in 1..9 loop
      k := cnt[c];
      if k = 3 then
        grid[c] := 1; grid[9+c] := 1; grid[18+c] := 1; rc := array[rc[1]+1, rc[2]+1, rc[3]+1];
      elsif k = 2 then
        skip := floor(random()*3)::int;
        for r in 0..2 loop if r <> skip then grid[r*9+c] := 1; rc[r+1] := rc[r+1] + 1; end if; end loop;
      else
        r := floor(random()*3)::int; grid[r*9+c] := 1; rc[r+1] := rc[r+1] + 1;
      end if;
    end loop;
    exit when rc[1] = 5 and rc[2] = 5 and rc[3] = 5;
    exit when tries > 2000;
  end loop;
  if not (rc[1] = 5 and rc[2] = 5 and rc[3] = 5) then raise exception 'card generation failed'; end if;
  for c in 1..9 loop
    lo := case when c = 1 then 1 else (c-1)*10 end;
    hi := case when c = 9 then 90 else c*10-1 end;
    select array_agg(q.x order by q.x) into nums from (select gs.x from generate_series(lo, hi) gs(x) order by random() limit cnt[c]) q;
    j := 1;
    for r in 0..2 loop
      if grid[r*9+c] = 1 then grid[r*9+c] := nums[j]; j := j + 1; end if;
    end loop;
  end loop;
  return (select jsonb_agg(rowj order by rr) from (
    select rr, (select jsonb_agg(case when grid[rr*9+cc] = 0 then null else to_jsonb(grid[rr*9+cc]) end order by cc) from generate_series(1,9) cc) rowj
    from generate_series(0,2) rr) z);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_make_passcode()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  select (array['cheeky','sneaky','jolly','lucky','dizzy','wobbly','fancy','cheerful','rowdy','sassy','giddy','mighty','chatty','dapper','zesty','plucky'])[1+floor(random()*16)::int]
  || '-' ||
  (array['biscuit','pelican','kebab','halloumi','donkey','teapot','banana','olive','goat','pickle','lantern','trumpet','sausage','penguin','muffin','walrus'])[1+floor(random()*16)::int]
  || '-' || (10 + floor(random()*90)::int)::text
$function$
;

CREATE OR REPLACE FUNCTION public.fun_mark_paid(p_res uuid, p_amount numeric, p_receipt text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r public.fun_reservations; n public.fun_nights; nums int[]; i int; j int; code text; nm text; cnt int; tl text;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into r from public.fun_reservations where id = p_res for update;
  if not found then raise exception 'Reservation not found'; end if;
  select * into n from public.fun_nights where id = r.night_id for update;
  if r.status = 'paid' then raise exception 'Already marked as paid.'; end if;
  if n.status = 'closed' then raise exception 'This night is closed.'; end if;
  if r.status in ('expired','refunded') then
    select count(*) into cnt from public.fun_reservations where night_id = r.night_id and status in ('reserved','paid');
    if cnt >= n.max_players then raise exception 'This night is full.'; end if;
  end if;
  if n.game = 'raffle' then
    select array_agg(x) into nums from (
      select g x from generate_series(1, 9999) g
       where not exists (select 1 from public.fun_tickets t where t.night_id = r.night_id and t.number = g)
       order by gen_random_uuid() limit r.qty) q;
    if coalesce(array_length(nums,1),0) < r.qty then raise exception 'Not enough ticket numbers left.'; end if;
    for j in 1..r.qty loop
      insert into public.fun_tickets(night_id, user_id, reservation_id, number) values (r.night_id, r.user_id, r.id, nums[j]);
    end loop;
  else
    select coalesce(max(number),0) into i from public.fun_tickets where night_id = r.night_id;
    for j in 1..r.qty loop
      i := i + 1;
      insert into public.fun_tickets(night_id, user_id, reservation_id, number, card) values (r.night_id, r.user_id, r.id, i, public.fun_make_card());
    end loop;
  end if;
  code := public.fun_make_passcode();
  update public.fun_reservations set status = 'paid', paid_at = now(), paid_by = auth.uid(), amount = p_amount, receipt = nullif(trim(coalesce(p_receipt,'')),''), passcode = code where id = p_res;
  select display_name into nm from public.profiles where id = r.user_id;
  insert into public.fun_name_clips(user_id, spoken_as, status) values (r.user_id, coalesce(nm,'friend'), 'pending') on conflict (user_id) do nothing;
  select string_agg(lpad(t.number::text, 4, '0'), ', ' order by t.number) into tl from public.fun_tickets t where t.reservation_id = p_res;
  perform public.fun_tell(r.user_id,
    'You''re in! 🎉 Your place at ' || n.name || ' is confirmed.' || E'\n\n' ||
    'When: ' || to_char(n.starts_at at time zone 'Asia/Famagusta', 'FMDay FMDD FMMonth, HH24:MI') || E'\n' ||
    case when n.game = 'raffle' then 'Your ticket numbers: ' else 'Your bingo cards: ' end || coalesce(tl,'') || E'\n' ||
    'Your secret passcode: ' || code || E'\n\n' ||
    'On the night, open Fun Night, type your passcode and knock on the door. We will remind you before it starts.',
    'You''re in! 🎉', 'Your tickets for ' || n.name || ' have landed. Your passcode is in your messages.');
  insert into public.fun_sent(night_id, user_id, kind) values (r.night_id, r.user_id, 'paid') on conflict do nothing;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'fun_mark_paid', jsonb_build_object('reservation', p_res, 'amount', p_amount));
  return jsonb_build_object('ok', true, 'passcode', code);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_my_tickets(p_night uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'number', t.number, 'card', t.card) order by t.number), '[]'::jsonb)
  from public.fun_tickets t where t.night_id = p_night and t.user_id = auth.uid()
$function$
;

CREATE OR REPLACE FUNCTION public.fun_on()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ select public.fun_visible() $function$
;

CREATE OR REPLACE FUNCTION public.fun_paid_count(p_night uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ select count(*)::int from public.fun_reservations where night_id = p_night and status = 'paid' $function$
;

CREATE OR REPLACE FUNCTION public.fun_refund(p_res uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  delete from public.fun_tickets where reservation_id = p_res;
  delete from public.fun_seated s using public.fun_reservations r where r.id = p_res and s.night_id = r.night_id and s.user_id = r.user_id;
  update public.fun_reservations set status = 'refunded', passcode = null where id = p_res;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'fun_refund', jsonb_build_object('reservation', p_res));
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_reminders()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; r record; c int := 0; k text; ttl text; body text; local_start timestamp;
begin
  for n in select * from public.fun_nights where status in ('sales','doors','live') and starts_at > now() - interval '30 minutes' loop
    local_start := n.starts_at at time zone 'Asia/Famagusta';
    k := null;
    if n.status = 'live' and now() < n.starts_at + interval '20 minutes' then k := 'start';
    elsif n.status in ('doors','live') then k := 'doors';
    elsif now() >= n.starts_at - interval '2 hours' and now() < n.starts_at - interval '20 minutes' then k := 'h2';
    elsif (now() at time zone 'Asia/Famagusta') >= date_trunc('day', local_start) - interval '6 hours' and now() < n.starts_at - interval '3 hours' then k := 'eve';
    end if;
    if k is not null then
      for r in select v.user_id from public.fun_reservations v where v.night_id = n.id and v.status = 'paid'
                 and (k <> 'start' or not exists (select 1 from public.fun_seated s where s.night_id = n.id and s.user_id = v.user_id)) loop
        insert into public.fun_sent(night_id, user_id, kind) values (n.id, r.user_id, k) on conflict do nothing;
        if found then
          ttl := case k when 'eve' then n.name || ' is tomorrow' when 'h2' then 'Two hours to go' when 'doors' then 'The doors are open!' else 'We''re starting' end;
          body := case k
            when 'eve' then 'Tomorrow at ' || to_char(local_start, 'HH24:MI') || ': ' || n.name || '. Charge your phone and warm up your ' || case when n.game = 'bingo' then 'dabbing finger.' else 'lucky ticket.' end
            when 'h2' then 'Two hours to go until ' || n.name || '. Kettle on, slippers on, passcode ready.'
            when 'doors' then 'The doors are open for ' || n.name || '. Come and grab your seat at the table.'
            else n.name || ' is starting. Your seat is still warm, so hop in now.' end;
          perform public.fun_tell(r.user_id, body, ttl, body);
          c := c + 1;
        end if;
      end loop;
    end if;
    for r in select v.user_id from public.fun_reservations v where v.night_id = n.id and v.status = 'reserved'
               and v.expires_at > now() and v.expires_at < now() + interval '24 hours' and v.created_at < now() - interval '6 hours' loop
      insert into public.fun_sent(night_id, user_id, kind) values (n.id, r.user_id, 'unpaid') on conflict do nothing;
      if found then
        perform public.fun_tell(r.user_id, 'Your place at ' || n.name || ' is reserved but not paid yet. Pay Chris or Natalie by ' || to_char(v_exp(n.id, r.user_id), 'FMDay HH24:MI') || ' to keep it.' || coalesce(E'\n\n' || n.pay_info, ''), 'Your ticket is waiting', 'Your place at ' || n.name || ' is reserved but not paid yet.');
        c := c + 1;
      end if;
    end loop;
  end loop;
  return c;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_reserve(p_night uuid, p_qty integer, p_in_cyprus boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; cnt int; r public.fun_reservations;
begin
  if auth.uid() is null or not public.fun_visible() then raise exception 'Not available'; end if;
  if not coalesce(p_in_cyprus, false) then raise exception 'Fun Night is for people in Cyprus. Please confirm you are in Cyprus.'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.status <> 'sales' then raise exception 'Tickets are not on sale for this night.'; end if;
  if p_qty is null or p_qty < 1 or p_qty > n.max_tickets_each then raise exception 'Choose between 1 and % tickets.', n.max_tickets_each; end if;
  perform public.fun_expire();
  select * into r from public.fun_reservations where night_id = p_night and user_id = auth.uid();
  if found and r.status in ('reserved','paid') then raise exception 'You already have a reservation for this night.'; end if;
  select count(*) into cnt from public.fun_reservations where night_id = p_night and status in ('reserved','paid');
  if cnt >= n.max_players then raise exception 'This night is full.'; end if;
  insert into public.fun_reservations(night_id, user_id, qty, status, expires_at, in_cyprus)
  values (p_night, auth.uid(), p_qty, 'reserved', least(now() + interval '2 days', n.starts_at), true)
  on conflict (night_id, user_id) do update
    set qty = excluded.qty, status = 'reserved', expires_at = excluded.expires_at, paid_at = null, paid_by = null, amount = null, receipt = null, passcode = null, in_cyprus = true, created_at = now();
  return jsonb_build_object('ok', true);
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_room_for(p_paid integer)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$ select case when p_paid <= 6 then 'small' when p_paid <= 14 then 'medium' when p_paid <= 28 then 'large' else 'xl' end $function$
;

CREATE OR REPLACE FUNCTION public.fun_set_spoken(p_user uuid, p_spoken text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  insert into public.fun_name_clips(user_id, spoken_as, status) values (p_user, trim(p_spoken), 'pending')
  on conflict (user_id) do update set spoken_as = trim(p_spoken), status = 'pending', updated_at = now();
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_set_stage(p_night uuid, p_stage integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.fun_nights set state = jsonb_set(coalesce(state,'{}'::jsonb), '{stage}', to_jsonb(least(3, greatest(1, p_stage)))) where id = p_night;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_set_status(p_night uuid, p_status text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; r record;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  if p_status not in ('draft','sales','doors','live','closed') then raise exception 'Bad status'; end if;
  update public.fun_nights set status = p_status,
    state = case when p_status = 'live' and (state->>'stage') is null then state || jsonb_build_object('stage', 1) else state end
   where id = p_night returning * into n;
  perform public.fun_expire();
  if p_status in ('doors','live') then perform public.fun_reminders(); end if;
  if p_status = 'closed' then
    for r in select d.user_id, 'Congratulations! 🎉 You won ' || coalesce(nullif(d.prize_text,''), 'prize ' || d.prize_no) || ' at ' || n.name || ' with ticket ' || lpad(d.number::text,4,'0') || '. We will be in touch about collecting it.' m
               from public.fun_draws d where d.night_id = p_night and d.user_id is not null
             union all
             select (w.value->>'user')::uuid, 'Congratulations! 🎉 You won the ' || case w.key when '1' then 'one line' when '2' then 'two lines' else 'full house' end || ' game at ' || n.name || coalesce(': ' || nullif(n.prizes->((w.key::int)-1)->>'text',''), '') || '. We will be in touch about collecting it.'
               from jsonb_each(coalesce(n.state->'winners','{}'::jsonb)) w loop
      insert into public.fun_sent(night_id, user_id, kind) values (p_night, r.user_id, 'won:' || md5(r.m)) on conflict do nothing;
      if found then perform public.fun_tell(r.user_id, r.m, 'You won! 🎉', 'Congratulations on your win at ' || n.name || '.'); end if;
    end loop;
  end if;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_sit(p_night uuid, p_table integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t int; cap int; c int;
begin
  perform 1 from public.fun_nights where id = p_night for update;
  if not exists (select 1 from public.fun_seated where night_id = p_night and user_id = auth.uid()) then raise exception 'Not in the room.'; end if;
  t := public.fun_tables_for(public.fun_paid_count(p_night)); cap := case when t = 1 then 6 else 7 end;
  if p_table < 1 or p_table > t then raise exception 'There is no such table.'; end if;
  select count(*) into c from public.fun_seated where night_id = p_night and table_no = p_table and user_id <> auth.uid();
  if c >= cap then raise exception 'That table is full.'; end if;
  update public.fun_seated set table_no = p_table where night_id = p_night and user_id = auth.uid();
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_state(p_night uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n public.fun_nights; adm boolean := public.is_admin(); paid int; t int;
begin
  if auth.uid() is null then return null; end if;
  select * into n from public.fun_nights where id = p_night;
  if not found then return null; end if;
  if not adm then
    if not public.fun_visible() or n.status not in ('doors','live') then return jsonb_build_object('closed', true, 'status', n.status); end if;
    if not exists (select 1 from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()) then return null; end if;
  end if;
  paid := public.fun_paid_count(p_night); t := public.fun_tables_for(paid);
  return jsonb_build_object(
    'id', n.id, 'name', n.name, 'game', n.game, 'status', n.status, 'state', n.state, 'prizes', n.prizes, 'starts_at', n.starts_at,
    'host_name', n.host_name, 'paid', paid, 'tables', t, 'cap', case when t = 1 then 6 else 7 end, 'room', public.fun_room_for(paid),
    'me', auth.uid(), 'my_table', (select s.table_no from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()),
    'seats', (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'name', p.display_name, 'photo', p.photo_url, 'table', s.table_no, 'say', c.spoken_as) order by s.entered_at), '[]'::jsonb)
                from public.fun_seated s join public.profiles p on p.id = s.user_id left join public.fun_name_clips c on c.user_id = s.user_id where s.night_id = p_night),
    'calls', (select coalesce(jsonb_agg(c.n order by c.seq), '[]'::jsonb) from public.fun_calls c where c.night_id = p_night),
    'last_call_at', (select max(c.called_at) from public.fun_calls c where c.night_id = p_night),
    'draws', (select coalesce(jsonb_agg(jsonb_build_object('prize_no', d.prize_no, 'prize', d.prize_text, 'number', d.number, 'user', d.user_id, 'name', p.display_name, 'at', d.drawn_at) order by d.prize_no), '[]'::jsonb)
                from public.fun_draws d left join public.profiles p on p.id = d.user_id where d.night_id = p_night),
    'claim', (select jsonb_build_object('id', c.id, 'stage', c.stage, 'valid', c.valid, 'user', c.user_id, 'name', case when c.valid then p.display_name end, 'at', c.created_at)
                from public.fun_claims c join public.profiles p on p.id = c.user_id where c.night_id = p_night order by c.created_at desc limit 1),
    'now', now());
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_tables_for(p_paid integer)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
AS $function$ select case when p_paid <= 6 then 1 when p_paid <= 14 then 2 when p_paid <= 28 then 4 when p_paid <= 42 then 6 else ceil(p_paid / 7.0)::int end $function$
;

CREATE OR REPLACE FUNCTION public.fun_tell(p_user uuid, p_body text, p_title text, p_push text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform set_config('fun.nopush', '1', true);
  insert into public.support_messages(member, from_admin, body, read) values (p_user, true, left(p_body, 1000), false);
  perform set_config('fun.nopush', '0', true);
  begin perform public.push_to(array[p_user], p_title, p_push, '/'); exception when others then null; end;
end $function$
;

CREATE OR REPLACE FUNCTION public.fun_visible()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ select coalesce((select fun_night_on from public.app_settings where id = 1), false) or public.is_admin() $function$
;

CREATE OR REPLACE FUNCTION public.tg_push_support()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if coalesce(current_setting('fun.nopush', true), '') = '1' then return null; end if;
  if new.from_admin then
    perform public.push_to(array[new.member], 'Reply from the team', 'Open the chat to read it.', '/');
  else
    perform public.push_to((select coalesce(array_agg(id),'{}') from public.profiles where role = 'admin'), 'New chat message', 'A member wrote to you in the chat.', '/');
  end if;
  return null;
end $function$
;

CREATE OR REPLACE FUNCTION public.v_exp(p_night uuid, p_user uuid)
 RETURNS timestamp without time zone
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ select expires_at at time zone 'Asia/Famagusta' from public.fun_reservations where night_id = p_night and user_id = p_user $function$
;

-- permissions: members call these; nobody anonymous calls anything
do $$ declare f text; begin
  for f in select p.oid::regprocedure::text from pg_proc p where p.pronamespace = 'public'::regnamespace and (p.proname like 'fun\_%' or p.proname = 'v_exp') loop
    execute format('revoke all on function %s from public, anon', f);
  end loop;
  foreach f in array array['fun_on()','fun_visible()','fun_list()','fun_reserve(uuid,int,boolean)','fun_cancel(uuid)','fun_my_tickets(uuid)','fun_claim(uuid,uuid)','fun_enter(uuid,text)','fun_sit(uuid,int)','fun_state(uuid)',
    'fun_admin_reservations(uuid)','fun_admin_summary(uuid)','fun_mark_paid(uuid,numeric,text)','fun_refund(uuid)','fun_set_status(uuid,text)','fun_set_stage(uuid,int)','fun_call_next(uuid)','fun_draw_next(uuid)','fun_set_spoken(uuid,text)','fun_host_set(uuid,text,jsonb)','fun_announce(uuid,text,uuid[])'] loop
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  foreach f in array array['fun_make_card()','fun_make_passcode()','fun_expire()','fun_reminders()','fun_tell(uuid,text,text,text)','fun_paid_count(uuid)','v_exp(uuid,uuid)'] loop
    execute format('revoke all on function public.%s from authenticated', f);
  end loop;
end $$;

select cron.unschedule(jobid) from cron.job where jobname = 'fun_tick';
select cron.schedule('fun_tick', '*/5 * * * *', 'select public.fun_expire(); select public.fun_reminders();');

-- members who may see Fun Night while the switch is still off (for trial runs)
create table if not exists public.fun_testers (user_id uuid primary key references public.profiles(id) on delete cascade, added_at timestamptz not null default now());
alter table public.fun_testers enable row level security;
drop policy if exists fun_testers_admin on public.fun_testers;
create policy fun_testers_admin on public.fun_testers for all using (public.is_admin()) with check (public.is_admin());
create or replace function public.fun_visible() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((select fun_night_on from public.app_settings where id = 1), false) or public.is_admin()
      or exists (select 1 from public.fun_testers t where t.user_id = auth.uid()) $$;


-- ---------- extra bingo rounds: play another round, pay up front or next time ----------
alter table public.fun_tickets add column if not exists round int not null default 1;
alter table public.fun_reservations add column if not exists rounds_paid int not null default 1;
create table if not exists public.fun_round_joins (
  id uuid primary key default gen_random_uuid(),
  night_id uuid not null references public.fun_nights(id) on delete cascade,
  round int not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  qty int not null,
  owes boolean not null default true,
  amount numeric not null default 0,
  settled_at timestamptz, settled_by uuid, receipt text,
  created_at timestamptz not null default now(),
  unique (night_id, round, user_id)
);
alter table public.fun_round_joins enable row level security;
drop policy if exists fun_round_joins_admin on public.fun_round_joins;
create policy fun_round_joins_admin on public.fun_round_joins for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.fun_round(p_night uuid) returns int
language sql stable security definer set search_path = public as
$$ select coalesce((state->>'round')::int, 1) from public.fun_nights where id = p_night $$;

create or replace function public.fun_my_tickets(p_night uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'number', t.number, 'card', t.card) order by t.number), '[]'::jsonb)
  from public.fun_tickets t where t.night_id = p_night and t.user_id = auth.uid()
    and (t.card is null or t.round = public.fun_round(p_night))
$$;

-- winner messages for whatever has been won so far (safe to call more than once)
create or replace function public.fun_send_wins(p_night uuid) returns void
language plpgsql security definer set search_path = public as $$
declare n public.fun_nights; r record; rd int;
begin
  select * into n from public.fun_nights where id = p_night; rd := coalesce((n.state->>'round')::int, 1);
  for r in select d.user_id, 'Congratulations! 🎉 You won ' || coalesce(nullif(d.prize_text,''), 'prize ' || d.prize_no) || ' at ' || n.name || ' with ticket ' || lpad(d.number::text,4,'0') || '. We will be in touch about collecting it.' m
             from public.fun_draws d where d.night_id = p_night and d.user_id is not null
           union all
           select (w.value->>'user')::uuid, 'Congratulations! 🎉 You won the ' || case w.key when '1' then 'one line' when '2' then 'two lines' else 'full house' end || ' game' || case when rd > 1 then ' in round ' || rd else '' end || ' at ' || n.name || coalesce(': ' || nullif(n.prizes->((w.key::int)-1)->>'text',''), '') || '. We will be in touch about collecting it.'
             from jsonb_each(coalesce(n.state->'winners','{}'::jsonb)) w loop
    insert into public.fun_sent(night_id, user_id, kind) values (p_night, r.user_id, 'won:' || md5(r.m)) on conflict do nothing;
    if found then perform public.fun_tell(r.user_id, r.m, 'You won! 🎉', 'Congratulations on your win at ' || n.name || '.'); end if;
  end loop;
end $$;

create or replace function public.fun_set_status(p_night uuid, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  if p_status not in ('draft','sales','doors','live','closed') then raise exception 'Bad status'; end if;
  update public.fun_nights set status = p_status,
    state = case when p_status = 'live' and (state->>'stage') is null then state || jsonb_build_object('stage', 1) else state end
   where id = p_night;
  perform public.fun_expire();
  if p_status in ('doors','live') then perform public.fun_reminders(); end if;
  if p_status = 'closed' then perform public.fun_send_wins(p_night); end if;
end $$;

-- bingo only: wipe the called numbers and start a fresh round; players choose whether to join
create or replace function public.fun_new_round(p_night uuid, p_prizes jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare n public.fun_nights; r int; cost numeric;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.game <> 'bingo' or n.status <> 'live' then raise exception 'Another round can only start while a bingo night is live.'; end if;
  if (n.state->'winners'->'3') is null then raise exception 'Finish this round first: the full house has not been won yet.'; end if;
  if p_prizes is not null and jsonb_array_length(p_prizes) <> 3 then raise exception 'A round needs exactly three prizes.'; end if;
  perform public.fun_send_wins(p_night);
  r := coalesce((n.state->>'round')::int, 1) + 1;
  select coalesce(sum(nullif(x->>'value','')::numeric),0) into cost from jsonb_array_elements(n.prizes) x where jsonb_typeof(x) = 'object';
  delete from public.fun_calls where night_id = p_night;
  update public.fun_nights set prizes = coalesce(p_prizes, prizes),
    state = (state - 'winners') || jsonb_build_object('round', r, 'stage', 1, 'joining', true, 'prev_prize_cost', coalesce((state->>'prev_prize_cost')::numeric,0) + cost)
   where id = p_night;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'fun_new_round', jsonb_build_object('night', p_night, 'round', r));
  return r;
end $$;

create or replace function public.fun_join_round(p_night uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare n public.fun_nights; v public.fun_reservations; r int; pre boolean; i int; j int; amt numeric;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  r := coalesce((n.state->>'round')::int, 1);
  if not found or n.status <> 'live' or r < 2 or not coalesce((n.state->>'joining')::boolean, false) then raise exception 'This round has already started. You can watch, and join the next one.'; end if;
  if not exists (select 1 from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()) then raise exception 'Not in the room.'; end if;
  select * into v from public.fun_reservations where night_id = p_night and user_id = auth.uid() and status = 'paid';
  if not found then raise exception 'No ticket found.'; end if;
  if exists (select 1 from public.fun_round_joins where night_id = p_night and round = r and user_id = auth.uid()) then return jsonb_build_object('ok', true, 'already', true); end if;
  pre := v.rounds_paid >= r; amt := case when pre then 0 else coalesce(n.price_amount,0) * v.qty end;
  insert into public.fun_round_joins(night_id, round, user_id, qty, owes, amount, settled_at) values (p_night, r, auth.uid(), v.qty, not pre, amt, case when pre then now() end);
  select coalesce(max(number),0) into i from public.fun_tickets where night_id = p_night;
  for j in 1..v.qty loop
    i := i + 1;
    insert into public.fun_tickets(night_id, user_id, reservation_id, number, card, round) values (p_night, auth.uid(), v.id, i, public.fun_make_card(), r);
  end loop;
  return jsonb_build_object('ok', true, 'owes', not pre, 'amount', amt);
end $$;

create or replace function public.fun_call_next(p_night uuid) returns int
language plpgsql security definer set search_path = public as $$
declare n public.fun_nights; v int; s int;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.game <> 'bingo' or n.status <> 'live' then raise exception 'The game is not live.'; end if;
  if coalesce((n.state->>'joining')::boolean, false) then update public.fun_nights set state = state || jsonb_build_object('joining', false) where id = p_night; end if;
  select x into v from generate_series(1,90) x where not exists (select 1 from public.fun_calls c where c.night_id = p_night and c.n = x) order by gen_random_uuid() limit 1;
  if v is null then raise exception 'All 90 numbers have been called.'; end if;
  select coalesce(max(seq),0)+1 into s from public.fun_calls where night_id = p_night;
  insert into public.fun_calls(night_id, seq, n) values (p_night, s, v);
  return v;
end $$;

create or replace function public.fun_claim(p_night uuid, p_ticket uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare n public.fun_nights; t public.fun_tickets; stage int; called int[]; rows_done int := 0; rw jsonb; ok boolean; v jsonb; valid boolean; first_win boolean := false; nm text;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.status <> 'live' or n.game <> 'bingo' then raise exception 'No game running.'; end if;
  if not exists (select 1 from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()) then raise exception 'Not at the table.'; end if;
  select * into t from public.fun_tickets where id = p_ticket and night_id = p_night and user_id = auth.uid() and round = coalesce((n.state->>'round')::int, 1);
  if not found then raise exception 'That is not your card for this round.'; end if;
  stage := coalesce((n.state->>'stage')::int, 1);
  select coalesce(array_agg(c.n), array[]::int[]) into called from public.fun_calls c where c.night_id = p_night;
  for rw in select jsonb_array_elements(t.card) loop
    ok := true;
    for v in select jsonb_array_elements(rw) loop
      if v <> 'null'::jsonb and not ((v #>> '{}')::int = any(called)) then ok := false; end if;
    end loop;
    if ok then rows_done := rows_done + 1; end if;
  end loop;
  valid := rows_done >= stage;
  insert into public.fun_claims(night_id, user_id, ticket_id, stage, valid, called_count) values (p_night, auth.uid(), p_ticket, stage, valid, coalesce(array_length(called,1),0));
  if valid and (n.state->'winners'->(stage::text)) is null then
    select display_name into nm from public.profiles where id = auth.uid();
    update public.fun_nights set state = jsonb_set(jsonb_set(coalesce(state,'{}'::jsonb), '{winners}', coalesce(state->'winners','{}'::jsonb)), array['winners', stage::text], jsonb_build_object('user', auth.uid(), 'name', nm, 'ticket', t.number))
     where id = p_night;
    first_win := true;
  end if;
  return jsonb_build_object('valid', valid, 'stage', stage, 'first', first_win);
end $$;

create or replace function public.fun_reserve(p_night uuid, p_qty int, p_in_cyprus boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare n public.fun_nights; cnt int; r public.fun_reservations;
begin
  if auth.uid() is null or not public.fun_visible() then raise exception 'Not available'; end if;
  if not coalesce(p_in_cyprus, false) then raise exception 'Fun Night is for people in Cyprus. Please confirm you are in Cyprus.'; end if;
  if exists (select 1 from public.fun_round_joins j where j.user_id = auth.uid() and j.owes and j.settled_at is null) then
    raise exception 'You still have an extra round to pay for from last time. Please settle it with Chris or Natalie, then reserve again.'; end if;
  select * into n from public.fun_nights where id = p_night for update;
  if not found or n.status <> 'sales' then raise exception 'Tickets are not on sale for this night.'; end if;
  if p_qty is null or p_qty < 1 or p_qty > n.max_tickets_each then raise exception 'Choose between 1 and % tickets.', n.max_tickets_each; end if;
  perform public.fun_expire();
  select * into r from public.fun_reservations where night_id = p_night and user_id = auth.uid();
  if found and r.status in ('reserved','paid') then raise exception 'You already have a reservation for this night.'; end if;
  select count(*) into cnt from public.fun_reservations where night_id = p_night and status in ('reserved','paid');
  if cnt >= n.max_players then raise exception 'This night is full.'; end if;
  insert into public.fun_reservations(night_id, user_id, qty, status, expires_at, in_cyprus)
  values (p_night, auth.uid(), p_qty, 'reserved', least(now() + interval '2 days', n.starts_at), true)
  on conflict (night_id, user_id) do update
    set qty = excluded.qty, status = 'reserved', expires_at = excluded.expires_at, paid_at = null, paid_by = null, amount = null, receipt = null, passcode = null, in_cyprus = true, rounds_paid = 1, created_at = now();
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.fun_set_rounds_paid(p_res uuid, p_rounds int) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.fun_reservations set rounds_paid = least(9, greatest(1, p_rounds)) where id = p_res;
end $$;

create or replace function public.fun_admin_dues(p_night uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return (select coalesce(jsonb_agg(jsonb_build_object('id', j.id, 'name', p.display_name, 'round', j.round, 'qty', j.qty, 'amount', j.amount, 'owes', j.owes,
            'settled_at', j.settled_at, 'night', n.name, 'night_id', j.night_id, 'created_at', j.created_at) order by j.settled_at nulls first, j.created_at), '[]'::jsonb)
          from public.fun_round_joins j join public.profiles p on p.id = j.user_id join public.fun_nights n on n.id = j.night_id
         where (p_night is null and j.owes and j.settled_at is null) or j.night_id = p_night);
end $$;

create or replace function public.fun_settle(p_join uuid, p_amount numeric, p_receipt text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.fun_round_joins set settled_at = now(), settled_by = auth.uid(), amount = coalesce(p_amount, amount), receipt = nullif(trim(coalesce(p_receipt,'')),'') where id = p_join and settled_at is null;
  if not found then raise exception 'Already settled.'; end if;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'fun_settle', jsonb_build_object('join', p_join, 'amount', p_amount));
end $$;

create or replace function public.fun_admin_summary(p_night uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare n public.fun_nights; paid int;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into n from public.fun_nights where id = p_night;
  paid := public.fun_paid_count(p_night);
  return jsonb_build_object(
    'reserved', (select count(*) from public.fun_reservations where night_id = p_night and status = 'reserved'),
    'paid', paid, 'seats_left', greatest(0, n.max_players - (select count(*) from public.fun_reservations where night_id = p_night and status in ('reserved','paid'))),
    'tickets', (select count(*) from public.fun_tickets where night_id = p_night),
    'income', (select coalesce(sum(amount),0) from public.fun_reservations where night_id = p_night and status = 'paid')
            + (select coalesce(sum(amount),0) from public.fun_round_joins where night_id = p_night and owes and settled_at is not null),
    'to_collect', (select coalesce(sum(amount),0) from public.fun_round_joins where night_id = p_night and owes and settled_at is null),
    'prize_cost', (select coalesce(sum(nullif(x->>'value','')::numeric),0) from jsonb_array_elements(n.prizes) x where jsonb_typeof(x) = 'object') + coalesce((n.state->>'prev_prize_cost')::numeric, 0),
    'seated', (select count(*) from public.fun_seated where night_id = p_night),
    'round', coalesce((n.state->>'round')::int, 1),
    'joined', (select count(*) from public.fun_round_joins where night_id = p_night and round = coalesce((n.state->>'round')::int, 1)),
    'room', public.fun_room_for(paid), 'tables', public.fun_tables_for(paid));
end $$;

create or replace function public.fun_state(p_night uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare n public.fun_nights; adm boolean := public.is_admin(); paid int; t int; rd int;
begin
  if auth.uid() is null then return null; end if;
  select * into n from public.fun_nights where id = p_night;
  if not found then return null; end if;
  if not adm then
    if not public.fun_visible() or n.status not in ('doors','live') then return jsonb_build_object('closed', true, 'status', n.status); end if;
    if not exists (select 1 from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()) then return null; end if;
  end if;
  paid := public.fun_paid_count(p_night); t := public.fun_tables_for(paid); rd := coalesce((n.state->>'round')::int, 1);
  return jsonb_build_object(
    'id', n.id, 'name', n.name, 'game', n.game, 'status', n.status, 'state', n.state, 'prizes', n.prizes, 'starts_at', n.starts_at,
    'host_name', n.host_name, 'paid', paid, 'tables', t, 'cap', case when t = 1 then 6 else 7 end, 'room', public.fun_room_for(paid),
    'round', rd, 'price_amount', n.price_amount, 'currency', n.currency,
    'joined', rd = 1 or exists (select 1 from public.fun_round_joins j where j.night_id = p_night and j.round = rd and j.user_id = auth.uid()),
    'prepaid', coalesce((select v.rounds_paid >= rd from public.fun_reservations v where v.night_id = p_night and v.user_id = auth.uid()), false),
    'my_qty', (select v.qty from public.fun_reservations v where v.night_id = p_night and v.user_id = auth.uid()),
    'me', auth.uid(), 'my_table', (select s.table_no from public.fun_seated s where s.night_id = p_night and s.user_id = auth.uid()),
    'seats', (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'name', p.display_name, 'photo', p.photo_url, 'table', s.table_no, 'say', c.spoken_as) order by s.entered_at), '[]'::jsonb)
                from public.fun_seated s join public.profiles p on p.id = s.user_id left join public.fun_name_clips c on c.user_id = s.user_id where s.night_id = p_night),
    'calls', (select coalesce(jsonb_agg(c.n order by c.seq), '[]'::jsonb) from public.fun_calls c where c.night_id = p_night),
    'last_call_at', (select max(c.called_at) from public.fun_calls c where c.night_id = p_night),
    'draws', (select coalesce(jsonb_agg(jsonb_build_object('prize_no', d.prize_no, 'prize', d.prize_text, 'number', d.number, 'user', d.user_id, 'name', p.display_name, 'at', d.drawn_at) order by d.prize_no), '[]'::jsonb)
                from public.fun_draws d left join public.profiles p on p.id = d.user_id where d.night_id = p_night),
    'claim', (select jsonb_build_object('id', c.id, 'stage', c.stage, 'valid', c.valid, 'user', c.user_id, 'name', case when c.valid then p.display_name end, 'at', c.created_at)
                from public.fun_claims c join public.profiles p on p.id = c.user_id where c.night_id = p_night order by c.created_at desc limit 1),
    'now', now());
end $$;

do $$ declare f text; begin
  foreach f in array array['fun_my_tickets(uuid)','fun_set_status(uuid,text)','fun_new_round(uuid,jsonb)','fun_join_round(uuid)','fun_call_next(uuid)','fun_claim(uuid,uuid)','fun_reserve(uuid,int,boolean)','fun_set_rounds_paid(uuid,int)','fun_admin_dues(uuid)','fun_settle(uuid,numeric,text)','fun_admin_summary(uuid)','fun_state(uuid)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  foreach f in array array['fun_round(uuid)','fun_send_wins(uuid)'] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
  end loop;
end $$;

-- ledger shows how many rounds were paid for up front
create or replace function public.fun_admin_reservations(p_night uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return (select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id, 'user_id', r.user_id, 'name', p.display_name, 'photo', p.photo_url, 'qty', r.qty, 'status', r.status, 'expires_at', r.expires_at,
      'paid_at', r.paid_at, 'paid_by', pb.display_name, 'amount', r.amount, 'receipt', r.receipt, 'passcode', r.passcode, 'created_at', r.created_at,
      'rounds_paid', r.rounds_paid,
      'tickets', (select coalesce(jsonb_agg(t.number order by t.number), '[]'::jsonb) from public.fun_tickets t where t.reservation_id = r.id),
      'spoken_as', coalesce(c.spoken_as, p.display_name), 'clip', c.status,
      'seated', exists (select 1 from public.fun_seated s where s.night_id = r.night_id and s.user_id = r.user_id)
    ) order by r.created_at), '[]'::jsonb)
    from public.fun_reservations r
    join public.profiles p on p.id = r.user_id
    left join public.profiles pb on pb.id = r.paid_by
    left join public.fun_name_clips c on c.user_id = r.user_id
    where r.night_id = p_night);
end $function$;
