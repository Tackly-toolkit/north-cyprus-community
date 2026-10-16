/* =====================================================================
   part5.js  –  admin area. Full control of members, payments, content,
   sign-up mode, banners, places, categories, clubs and settings.
   Visible only to accounts with role = admin (also enforced by the
   database: every table has an admin-only policy).
   ===================================================================== */
const ADM={};
const aok=async p=>{const r=await p;if(r.error){toast(r.error.message||'Error');throw r.error}return r.data};
const aLog=(a,d)=>{try{sb.rpc('admin_log',{p_action:a,p_detail:d||{}}).then(()=>{},()=>{})}catch(e){}};
const aBtn=(act,label,attrs,cls)=>{if(/^\s*(data-|aria-)/.test(label||'')&&!/^\s*(data-|aria-)/.test(attrs||'')){const t=label;label=attrs;attrs=t}return `<button class="btn ${cls||'soft'}" data-act="${act}" ${attrs||''}>${label}</button>`};
const aTime=iso=>iso?new Date(iso).toLocaleString(LOC[S.L],{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
const aDate=iso=>iso?new Date(iso).toLocaleDateString(LOC[S.L],{day:'numeric',month:'short',year:'numeric'}):'';
const aRow=(act,attrs,title,sub,right)=>`<button class="listrow" data-act="${act}" ${attrs||''}><span class="grow" style="min-width:0"><b style="overflow-wrap:anywhere">${title}</b>${sub?`<span class="xs mut" style="display:block;overflow-wrap:anywhere">${sub}</span>`:''}</span>${right===undefined?ic('right'):right}</button>`;
const aStatePill=m=>{
 if(m.suspended||m.state==='suspended')return '<span class="pill red">Suspended</span>';
 if(m.role==='admin')return '<span class="pill">Admin</span>';
 if(m.state==='locked')return '<span class="pill red">Locked</span>';
 if(m.state==='grace')return `<span class="pill red">Due · ${m.days_left} d</span>`;
 return '<span class="pill">Active</span>';
};
const bill=()=>true;const live=()=>!!(DB.cfg&&DB.cfg.billing_on);
const aSw=(on,act,attrs,label)=>`<button class="tg ${on?'on':''}" role="switch" aria-checked="${!!on}" data-act="${act}" ${attrs||''} aria-label="${esc(label||'')}"><i></i></button>`;

/* ---------- loading ---------- */
async function admLoad(sec,x){
 if(sec==='members'||sec==='member'||sec==='due'){ADM.members=await aok(sb.rpc('admin_members'))}
 if(sec==='member'){ADM.pay=await aok(sb.from('payments').select('*').eq('profile_id',x).order('created_at',{ascending:false}))}
 if(sec==='invites'){ADM.invites=await aok(sb.from('invites').select('*').order('created_at',{ascending:false}));ADM.settings=await aok(sb.from('app_settings').select('*').eq('id',1).single())}
 if(sec==='settings'){ADM.settings=await aok(sb.from('app_settings').select('*').eq('id',1).single())}
 if(sec==='reports'){
  const rows=await aok(sb.from('reports').select('*').order('status').order('created_at',{ascending:false}).limit(80));
  const by=k=>rows.filter(r=>r.kind===k).map(r=>r.target_id);
  const ids=(t,col,ks)=>{const a=[].concat(...ks.map(by));return a.length?aok(sb.from(t).select(col).in('id',a)):Promise.resolve([])};
  const [po,li,me,di,pr]=await Promise.all([ids('posts','id,body',['post']),ids('listings','id,title',['listing']),ids('meetups','id,title',['event']),ids('directory','id,name',['biz']),ids('profiles','id,display_name',['seller'])]);
  const prev={};po.forEach(r=>prev[r.id]=r.body.slice(0,120));li.forEach(r=>prev[r.id]=r.title);me.forEach(r=>prev[r.id]=r.title);di.forEach(r=>prev[r.id]=r.name);pr.forEach(r=>prev[r.id]=r.display_name);
  ADM.reports=rows;ADM.prev=prev;await loadPeople(rows.map(r=>r.reporter));
 }
 if(sec==='directory'){ADM.dir=await aok(sb.from('directory').select('*').order('status',{ascending:false}).order('created_at',{ascending:false}))}
 if(sec==='guides'){const g=await aok(sb.from('guide_texts').select('*'));ADM.gt={};g.forEach(x=>{ADM.gt[x.guide_key]=x})}
 if(sec==='sources'){ADM.src=await aok(sb.from('official_sources').select('*').order('created_at'));ADM.rev=await aok(sb.from('update_review').select('*').order('created_at',{ascending:false}).limit(60))}
 if(sec==='news'){ADM.gt=ADM.gt||{}}
 if(sec==='info'){ADM.info=await aok(sb.from('info_items').select('*').order('kind').order('category').order('title'))}
 if(sec==='banners'){ADM.banners=await aok(sb.from('banners').select('*').order('created_at',{ascending:false}))}
 if(sec==='requests'){ADM.req=await aok(sb.from('other_requests').select('*').order('status',{ascending:false}).order('created_at',{ascending:false}).limit(100));await loadPeople(ADM.req.map(r=>r.requested_by))}
 if(sec==='places'){ADM.geo=await aok(sb.from('geo').select('*').order('sort').order('id'))}
 if(sec==='cats'){ADM.cats=await aok(sb.from('categories').select('*').order('sort').order('id'))}
 if(sec==='lists'){ADM.lists=await aok(sb.from('lists').select('*').order('kind').order('sort'))}
 if(sec==='clubs'){ADM.clubs=await aok(sb.from('clubs').select('*').order('created_at'))}
 if(sec==='content'){
  const [p,l,m]=await Promise.all([aok(sb.from('posts').select('id,author,body,created_at,club_id').order('created_at',{ascending:false}).limit(30)),aok(sb.from('listings').select('id,author,title,status,created_at').order('created_at',{ascending:false}).limit(30)),aok(sb.from('meetups').select('id,author,title,starts_at').order('created_at',{ascending:false}).limit(30))]);
  ADM.cp=p;ADM.cl=l;ADM.cm=m;await loadPeople([].concat(p.map(x=>x.author),l.map(x=>x.author),m.map(x=>x.author)));
 }
 if(sec==='news'){ADM.news=await aok(sb.from('updates').select('*').order('created_at',{ascending:false}).limit(60))}
 if(sec==='payments'){ADM.pay=await aok(sb.from('payments').select('*,profiles(display_name)').order('created_at',{ascending:false}).limit(200))}
 if(sec==='audit'){ADM.audit=await aok(sb.from('audit_log').select('*').order('created_at',{ascending:false}).limit(80))}
 if(sec==='home'){ADM.sum=await aok(sb.rpc('admin_summary'));try{const t=await sb.rpc('admin_support_threads');ADM.supn=(t.data||[]).reduce((a,y)=>a+Number(y.unread),0)}catch(e){}try{const j=await sb.from('join_requests').select('id',{count:'exact',head:true}).eq('status','new');ADM.jrn=j.count||0}catch(e){}}
 if(sec==='support'){ADM.threads=await aok(sb.rpc('admin_support_threads'))}
 if(sec==='joinreq'){ADM.jr=await aok(sb.from('join_requests').select('*').order('created_at',{ascending:false}).limit(200))}
 if(sec==='sthread'){ADM.sm=await aok(sb.from('support_messages').select('*').eq('member',x).order('created_at'));const pr=await sb.from('profiles').select('display_name').eq('id',x).maybeSingle();ADM.smn=(pr.data&&pr.data.display_name)||'Member';await sb.from('support_messages').update({read:true}).eq('member',x).eq('from_admin',false).eq('read',false);supLoad()}
}
async function admGo(sec,x,view){
 try{await admLoad(sec,x)}catch(e){return}
 push(view||('adm_'+sec),{sec,x});
}
async function admReload(){
 const t=S.stack[S.stack.length-1];if(!t||!t.sec)return;
 try{await admLoad(t.sec,t.x)}catch(e){return}
 renderOv(true);
}
ACT.admgo=d=>admGo(d.sec,d.x,d.view);
ACT.admback=()=>pop();
V.admin=function(){
 const s=ADM.sum||{};
 const c=(n,l)=>`<div class="card" style="text-align:center;padding:12px 8px"><div class="h2">${n===undefined?'–':n}</div><div class="xs mut">${l}</div></div>`;
 const r=(sec,l,sub,view,n)=>aRow('admgo',`data-sec="${sec}" ${view?`data-view="${view}"`:''}`,l,sub,n?`<span class="pill red">${n}</span>`:undefined);
 return {t:T('admin_t'),b:`<div class="stack"><div class="grid2" style="gap:10px">${c(s.members,'Members')}${c(s.businesses,'Businesses')}${bill()?c(s.in_grace,'Payment due'):''}${c(s.locked,'Locked')}</div>
 ${r('support','Chat messages','Members writing to you through the chat bubble',0,ADM.supn)}
 ${bill()?r('due','Payments due','Reminders, mark paid, lock, spreadsheet download','adm_due',s.in_grace):''}
 ${r('joinreq','Applications','People asking to join (Apply to join)',0,ADM.jrn)}
 ${r('members','Members','Search, lock, suspend')}
 ${r('reports','Reports','Flagged posts, listings and members',0,s.open_reports)}
 ${r('info','Places and useful contacts','Places to visit, pharmacies, muktars, government, airports and borders')}
 ${r('directory','Business directory','Approve, verify, edit',0,s.pending_directory)}
 ${r('requests','"Other, please tell us" requests','New towns, areas and categories asked for',0,s.open_requests)}
 ${r('invites','Sign-up and invites','Open or invitation only, invite codes')}
 ${r('banners','Banners','Pick the page for each banner. All off until you switch them on')}
 ${r('places','Places','Districts, towns, areas and alternative names','adm_places')}
 ${r('cats','Categories','Marketplace and directory categories','adm_cats')}
 ${r('lists','Dropdown lists','Condition, currency, handover','adm_lists')}
 ${r('clubs','Clubs','Add, rename, hide')}
 ${r('guides','Guides','Write guide text with the official source and date checked')}
 ${r('sources','Official sources','Source list and updates to review')}
 ${r('news','Community news','Post updates members see on the feed')}
 ${r('content','Latest content','Remove posts, listings, meetups')}
 ${bill()?r('payments','Payments log','Every recorded payment'):''}
 ${r('settings','Settings','Charging switch, contact email')}
 ${r('audit','Activity log','Who changed what')}</div>`};
};
ACT.adminhome=async()=>{try{await admLoad('home')}catch(e){return}push('admin',{sec:'home'})};
/* the Me card opens admin through push('admin'); load numbers first */
const pushRaw=push;
ACT.push=function(d){if(d.v==='admin'&&S.admin){return ACT.adminhome()}return pushRaw(d.v,{id:d.id})};

/* ---------- members ---------- */
V.adm_members=function(){
 const f=S.amf||'all';
 const chips=[['all','All'],...(bill()?[['grace','Payment due']]:[]),['locked','Locked'],['suspended','Suspended'],['business','Businesses'],['admin','Admins']];
 return {t:'Members',b:`<div class="stack"><input id="a-q" type="search" placeholder="Search name or email" value="${esc(S.amq||'')}" autocomplete="off"><div class="chips">${chips.map(c=>`<button class="chip ${f===c[0]?'on':''}" data-act="amf" data-id="${c[0]}">${c[1]}</button>`).join('')}</div><div id="a-list" class="stack">${memList()}</div></div>`};
};
function memList(){
 const f=S.amf||'all',q=(S.amq||'').toLowerCase();
 const ls=(ADM.members||[]).filter(m=>{
  if(q&&!((m.display_name||'')+' '+(m.email||'')).toLowerCase().includes(q))return false;
  if(f==='grace')return m.state==='grace';if(f==='locked')return m.state==='locked'&&!m.suspended;if(f==='suspended')return m.suspended;
  if(f==='business')return m.account_type==='business';if(f==='admin')return m.role==='admin';return true});
 return `<div class="xs mut">${ls.length} of ${(ADM.members||[]).length}</div>`+ls.map(m=>aRow('admgo',`data-sec="member" data-x="${m.id}"`,esc(m.display_name||'(no name)'),`${esc(m.email)} · ${m.account_type==='business'?'Business':'Member'} · due ${aDate(m.due_on)}`,aStatePill(m)+ic('right'))).join('');
}
ACT.amf=d=>{S.amf=d.id;renderOv(true)};
document.addEventListener('input',e=>{if(e.target.id==='a-q'){S.amq=e.target.value;const l=$('#a-list');if(l)l.innerHTML=memList()}});
V.adm_member=function(o){
 const m=(ADM.members||[]).find(x=>x.id===o.x);if(!m)return {t:'Member',b:''};
 const fee=(DB.cfg&&DB.cfg.monthly_fee_try)||'';
 const pay=(ADM.pay||[]);
 const place=areaLabel(m.district_id,m.town_id,m.area_id);
 return {t:esc(m.display_name||'Member'),b:`<div class="stack">
 <div class="card stack"><div class="row"><div class="grow" style="min-width:0"><h2 class="h2">${esc(m.display_name||'(no name)')}</h2><div class="sm mut" style="overflow-wrap:anywhere">${esc(m.email)}</div></div>${aStatePill(m)}</div>
 <div class="sm">${m.account_type==='business'?'Business':'Member'}${place?' · '+esc(place):''}</div>
 <div class="sm mut">Joined ${aDate(m.joined_at)} · Free until ${aDate(m.free_until)}${m.paid_until?' · Paid until '+aDate(m.paid_until):''}</div>
 ${live()?`<div class="sm"><b>Next due: ${aDate(m.due_on)}</b>`:`<div class="sm"><b>Free member</b> · charging is off. If you switch it on, their next due date would be ${aDate(m.paid_until||m.free_until)}`}${live()&&m.state==='grace'?` · ${m.days_left} day(s) left before lock`:''}</div></div>
 ${bill()?`<div class="card stack"><b>Record a payment</b><div class="grid2" style="gap:10px"><div><label class="f" for="a-amt">Amount (TL)</label><input id="a-amt" type="number" inputmode="decimal" value="${esc(fee)}"></div><div><label class="f" for="a-mo">Months</label><select id="a-mo">${[1,2,3,6,12].map(n=>`<option value="${n}">${n}</option>`).join('')}</select></div></div><label class="f" for="a-nt">Note (optional)</label><input id="a-nt" maxlength="120" placeholder="e.g. cash, 14 Oct">${aBtn('apay',`${ic('check','s')}Record payment and open account`,`data-id="${m.id}"`,'')}</div>`:''}
 <div class="card stack"><b>Account control</b>
 <div class="row" style="flex-wrap:wrap">${aBtn('alock',m.manual_lock?'Remove manual lock':'Lock account now',`data-id="${m.id}" data-v="${m.manual_lock?0:1}"`)}${aBtn('asusp',m.suspended?'Reinstate':'Suspend',`data-id="${m.id}" data-v="${m.suspended?0:1}"`,m.suspended?'soft':'line')}</div>
 <div class="row" style="flex-wrap:wrap">${aBtn('aext','+30 free days',`data-id="${m.id}"`)}${aBtn('aadmin',m.role==='admin'?'Remove admin':'Make admin',`data-id="${m.id}" data-v="${m.role==='admin'?'member':'admin'}"`,'line')}</div>
 <label class="f" for="a-note">Private note</label><textarea id="a-note" maxlength="500" style="min-height:70px">${esc(m.admin_note||'')}</textarea>${aBtn('anote','Save note',`data-id="${m.id}"`)}
 ${aBtn('adel',S.adelc===m.id?'Tap again to delete for good':'Delete account and all content',`data-id="${m.id}"`,'line')}</div>
 ${bill()?`<div class="card stack"><b>Payment history</b>${pay.length?pay.map(p=>`<div class="row"><span class="grow sm">${aDate(p.paid_on)} · ${p.months} month(s)${p.note?' · '+esc(p.note):''}</span><b>${p.amount_try!=null?Number(p.amount_try).toLocaleString(LOC[S.L])+' TL':'–'}</b></div>`).join(''):'<span class="mut sm">No payments yet.</span>'}</div>`:''}</div></div>`};
};
ACT.apay=async d=>{
 const amt=parseFloat(val('a-amt')),mo=parseInt(val('a-mo'))||1;
 await aok(sb.rpc('mark_paid',{p_profile:d.id,p_months:mo,p_amount:isNaN(amt)?null:amt,p_note:val('a-nt')||null}));
 toast('Payment recorded');await admReload();
};
ACT.alock=async d=>{await aok(sb.from('profiles').update({manual_lock:d.v==='1'}).eq('id',d.id));aLog(d.v==='1'?'lock':'unlock',{profile:d.id});toast('Saved');admReload()};
ACT.asusp=async d=>{await aok(sb.from('profiles').update({suspended:d.v==='1'}).eq('id',d.id));aLog(d.v==='1'?'suspend':'reinstate',{profile:d.id});toast('Saved');admReload()};
ACT.aext=async d=>{const m=ADM.members.find(x=>x.id===d.id);const base=new Date(Math.max(Date.now(),new Date(m.free_until).getTime()));base.setDate(base.getDate()+30);await aok(sb.from('profiles').update({free_until:base.toISOString()}).eq('id',d.id));aLog('extend_free',{profile:d.id});toast('Free period extended');admReload()};
ACT.aadmin=async d=>{await aok(sb.from('profiles').update({role:d.v}).eq('id',d.id));aLog('role',{profile:d.id,role:d.v});toast('Saved');admReload()};
ACT.anote=async d=>{await aok(sb.from('profiles').update({admin_note:val('a-note')}).eq('id',d.id));toast('Saved');admReload()};
ACT.adel=async d=>{
 if(S.adelc!==d.id){S.adelc=d.id;renderOv(true);return}
 S.adelc=null;await aok(sb.rpc('admin_delete_user',{p_id:d.id}));toast('Deleted');pop();admReload();
};

/* ---------- places and useful contacts ---------- */
const ICAT={place:INFO_P,contact:INFO_C};
V.adm_info=function(){
 const k=S.aik||'contact',its=(ADM.info||[]).filter(i=>i.kind===k);
 const fld=(i,id,label,type)=>`<label class="f" for="i-${id}-${i.id}">${label}</label><input id="i-${id}-${i.id}" ${type?`type="${type}"`:''} value="${esc(i[id]==null?'':i[id])}">`;
 const form=i=>`<label class="f" for="i-category-${i.id}">Category</label><select id="i-category-${i.id}">${ICAT[i.kind].map(c=>`<option value="${c}" ${i.category===c?'selected':''}>${T('ic_'+c)}</option>`).join('')}</select>${fld(i,'title','Name')}<label class="f" for="i-body-${i.id}">Details</label><textarea id="i-body-${i.id}" maxlength="1200" style="min-height:70px">${esc(i.body||'')}</textarea>${fld(i,'hours','Opening times')}${i.kind==='place'?fld(i,'fee','Entry fee'):''}${fld(i,'phone','Phone (with country code)')}${fld(i,'website','Website')}${fld(i,'map_query','Place name for Google Maps')}${fld(i,'source_url','Source link (official page)')}${fld(i,'checked_on','Last checked','date')}`;
 return {t:'Places and contacts',b:`<div class="stack"><div class="seg"><button class="${k==='contact'?'on':''}" data-act="aik" data-id="contact">Useful contacts</button><button class="${k==='place'?'on':''}" data-act="aik" data-id="place">Places to visit</button></div>
 <div class="note g">${ic('info')}<div class="sm">Only add what you have checked on the official page. Add the source link and the date you checked. Members see nothing here until you add entries.</div></div>
 <div class="card stack"><b>Add new</b>${form({id:'new',kind:k,category:ICAT[k][0]})}${aBtn('ainfoadd',`${ic('plus','s')}Add`,`data-k="${k}"`,'')}</div>
 ${its.map(i=>`<div class="card stack" style="${i.active?'':'opacity:.55'}"><b style="overflow-wrap:anywhere">${esc(i.title)}</b>${form(i)}<div class="row" style="flex-wrap:wrap">${aBtn('ainfosave',`data-id="${i.id}" data-k="${i.kind}"`,'Save')}${aBtn('ainfotog',`data-id="${i.id}" data-v="${i.active?0:1}"`,i.active?'Hide':'Show','line')}${aBtn('ainfodel',`data-id="${i.id}"`,ic('trash','s'),'line')}</div></div>`).join('')}</div>`};
};
const infoRow=(id,k)=>{const g=f=>val('i-'+f+'-'+id)||null;return {kind:k,category:val('i-category-'+id),title:val('i-title-'+id),body:g('body'),hours:g('hours'),fee:k==='place'?g('fee'):null,phone:g('phone'),website:g('website'),map_query:g('map_query'),source_url:g('source_url'),checked_on:g('checked_on')}};
ACT.aik=d=>{S.aik=d.id;renderOv(true)};
ACT.ainfoadd=async d=>{const r=infoRow('new',d.k);if(!r.title||r.title.length<2)return toast('Add a name');await aok(sb.from('info_items').insert(r));aLog('info_add',{t:r.title});toast('Added');await admReload();loadInfo()};
ACT.ainfosave=async d=>{const r=infoRow(d.id,d.k);await aok(sb.from('info_items').update(r).eq('id',d.id));aLog('info_edit',{id:d.id});toast('Saved');await admReload();loadInfo()};
ACT.ainfotog=async d=>{await aok(sb.from('info_items').update({active:d.v==='1'}).eq('id',d.id));await admReload();loadInfo()};
ACT.ainfodel=async d=>{await aok(sb.from('info_items').delete().eq('id',d.id));await admReload();loadInfo()};

/* ---------- invites + sign-up mode ---------- */
V.adm_invites=function(){
 const st=ADM.settings||{},inv=ADM.invites||[],open=st.signup_mode!=='invite';
 return {t:'Sign-up and invites',b:`<div class="stack"><div class="card"><div class="row"><div class="grow"><b>${open?'Sign-up is open to everyone':'Sign-up is invitation only'}</b><div class="sm mut">${open?'Anyone can create an account and gets '+st.free_months+' months free.':'Only people with an invite code can sign up. Existing members are not affected.'}</div></div>${aSw(!open,'amode','','Invitation only')}</div></div>
 <div class="card stack"><b>New invite</b><label class="f" for="a-ie">Email (optional, locks the code to that email)</label><input id="a-ie" type="email" inputmode="email">${aBtn('anewinv',`${ic('plus','s')}Create code`,'','')}</div>
 ${inv.map(i=>`<div class="card"><div class="row" style="flex-wrap:wrap;gap:8px"><div class="grow" style="min-width:0"><b style="font-size:17px;letter-spacing:.04em">${esc(i.code)}</b><div class="xs mut" style="overflow-wrap:anywhere">${i.email?esc(i.email)+' · ':''}${i.used_by?'Used '+aDate(i.used_at):'Not used yet'} · ${aDate(i.created_at)}</div></div>${i.used_by?'':aBtn('acopy',ic('copy','s'),`data-t="${esc(location.origin+'/?invite='+i.code)}" aria-label="Copy link"`)+aBtn('adelinv',ic('trash','s'),`data-id="${esc(i.code)}" aria-label="Delete"`,'line')}</div></div>`).join('')}</div>`};
};
ACT.acopy=d=>copy(d.t);
ACT.amode=async()=>{const nm=ADM.settings.signup_mode==='invite'?'open':'invite';await aok(sb.from('app_settings').update({signup_mode:nm,updated_at:new Date().toISOString()}).eq('id',1));aLog('signup_mode',{mode:nm});DB.cfg.signup_mode=nm;toast('Saved');admReload()};
ACT.anewinv=async()=>{const e=val('a-ie');const r=await aok(sb.from('invites').insert({email:e||null,created_by:S.uid}).select().single());copy(location.origin+'/?invite='+r.code);aLog('invite',{code:r.code});admReload()};
ACT.adelinv=async d=>{await aok(sb.from('invites').delete().eq('code',d.id));admReload()};

/* ---------- chat inbox ---------- */
V.adm_support=function(){
 const t=ADM.threads||[];
 return {t:'Chat messages',b:`<div class="stack">${t.length?t.map(x=>aRow('admgo',`data-sec="sthread" data-x="${x.member}"`,esc(x.display_name||'(no name)'),`${x.last_from_admin?'You: ':''}${esc((x.last_body||'').slice(0,90))} · ${aTime(x.last_at)}`,(Number(x.unread)?`<span class="pill red">${x.unread}</span>`:'')+ic('right'))).join(''):'<div class="card" style="text-align:center"><p class="mut">No messages yet.</p></div>'}</div>`};
};
V.adm_sthread=function(o){
 const m=ADM.sm||[];
 return {t:esc(ADM.smn||'Member'),b:`<div class="stack">${m.map(x=>`<div class="card" style="${x.from_admin?'background:var(--gs);margin-left:32px':'margin-right:32px'}"><div class="xs mut">${x.from_admin?'You':esc(ADM.smn||'Member')} · ${aTime(x.created_at)}</div><div style="margin-top:4px;overflow-wrap:anywhere;white-space:pre-wrap">${esc(x.body)}</div></div>`).join('')}<textarea id="a-sr" maxlength="1000" placeholder="Write a reply" aria-label="Write a reply"></textarea>${aBtn('asupsend',`data-x="${o.x}"`,`${ic('send','s')}Send reply`,'')}${aBtn('admgo',`data-sec="member" data-x="${o.x}"`,'Open member profile','line')}</div>`};
};
ACT.asupsend=async d=>{
 const b=val('a-sr');if(!b)return;
 await aok(sb.from('support_messages').insert({member:d.x,from_admin:true,body:b}));
 toast('Sent');admReload();
};
ACT.adminsupport=async()=>{try{await admLoad('support')}catch(e){return}push('adm_support',{sec:'support'})};

/* ---------- payments due, reminders, spreadsheet ---------- */
function dueList(){
 const now=Date.now(),soon=now+14*864e5;
 return (ADM.members||[]).filter(m=>m.role!=='admin'&&!m.suspended&&(m.state==='grace'||m.state==='locked'||(m.due_on&&new Date(m.due_on).getTime()<=soon))).sort((a,b)=>new Date(a.due_on||0)-new Date(b.due_on||0));
}
V.adm_due=function(){
 const ls=dueList(),fee=(DB.cfg&&DB.cfg.monthly_fee_try)||'';
 return {t:'Payments due',b:`<div class="stack">${live()?'':'<div class="note">'+ic('info')+'<div class="sm">Charging is off, so nobody is due and members see no fees. Switch it on under Settings when you are ready. Until then you can still record payments in advance and download the member spreadsheet.</div></div>'}<div class="card stack"><div class="sm mut">Everyone whose payment is due in the next 14 days, in the 4-day grace period, or already locked. Soonest first.</div>${aBtn('acsv',`${ic('copy','s')}Download spreadsheet (all members)`,'','')}</div>
 ${ls.length?ls.map(m=>{const k='p'+m.id;return `<div class="card stack"><div class="row"><div class="grow" style="min-width:0"><b style="overflow-wrap:anywhere">${esc(m.display_name||'(no name)')}</b><div class="xs mut" style="overflow-wrap:anywhere">${esc(m.email)} · due ${aDate(m.due_on)}</div></div>${aStatePill(m)}</div>
 <div class="row" style="flex-wrap:wrap">${aBtn('aremind',`data-id="${m.id}"`,`${ic('msg','s')}Send reminder`)}${aBtn('apaynow',`data-id="${m.id}"`,S.apc===m.id?'Tap again: paid '+fee+' TL, 1 month':`${ic('check','s')}Mark paid`,S.apc===m.id?'':'line')}${m.state==='locked'||m.manual_lock?'':aBtn('alock',`data-id="${m.id}" data-v="1"`,'Lock now','line')}${aBtn('admgo',`data-sec="member" data-x="${m.id}"`,'Open','line')}</div></div>`}).join(''):'<div class="card" style="text-align:center"><p class="mut">Nobody is due yet.</p></div>'}</div>`};
};
ACT.aremind=async d=>{
 const m=ADM.members.find(x=>x.id===d.id);if(!m)return;
 const fee=(DB.cfg&&DB.cfg.monthly_fee_try)||'250';
 const txt=`Hello ${m.display_name||''}, a friendly reminder that your membership payment of ${fee} TL is due on ${aDate(m.due_on)}. Please reply here and we will arrange it with you. Thank you!`;
 await aok(sb.from('support_messages').insert({member:d.id,from_admin:true,body:txt}));
 aLog('reminder',{profile:d.id});toast('Reminder sent to their chat');
};
ACT.apaynow=async d=>{
 if(S.apc!==d.id){S.apc=d.id;renderOv(true);return}
 S.apc=null;
 const fee=parseFloat((DB.cfg&&DB.cfg.monthly_fee_try)||'')||null;
 await aok(sb.rpc('mark_paid',{p_profile:d.id,p_months:1,p_amount:fee,p_note:'cash'}));
 toast('Payment recorded');await admReload();
};
const csvq=v=>{v=v==null?'':String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
ACT.acsv=async()=>{
 const ms=ADM.members||[];
 const pay=await aok(sb.from('payments').select('profile_id,paid_on,amount_try,months').order('paid_on',{ascending:false}));
 const last={};pay.forEach(p=>{if(!last[p.profile_id])last[p.profile_id]=p});
 const d=iso=>iso?String(iso).slice(0,10):'';
 const rows=[['Name','Email','Type','Joined','Free until','Paid until','Next due','Days left','Status','Last payment date','Last payment TL']].concat(ms.map(m=>{const p=last[m.id]||{};return [m.display_name,m.email,m.account_type==='business'?'Business':'Member',d(m.joined_at),d(m.free_until),d(m.paid_until),d(m.due_on),m.days_left,m.suspended?'suspended':m.state,d(p.paid_on),p.amount_try]}));
 const csv='﻿'+rows.map(r=>r.map(csvq).join(',')).join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='members-'+new Date().toISOString().slice(0,10)+'.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
 toast('Spreadsheet downloaded');
};

/* ---------- applications (Apply to join) ---------- */
V.adm_joinreq=function(){
 const rs=ADM.jr||[];
 return {t:'Applications',b:`<div class="stack">${rs.length?rs.map(r=>`<div class="card stack" style="${r.status==='new'?'':'opacity:.6'}"><div class="row"><div class="grow" style="min-width:0"><b>${esc(r.name)}</b><div class="xs mut" style="overflow-wrap:anywhere">${esc(r.email)}${r.country?' · '+esc(r.country):''} · ${aDate(r.created_at)}</div></div><span class="pill ${r.status==='new'?'red':''}">${r.status==='new'?'New':r.status==='invited'?'Invited':'Declined'}</span></div>
 ${r.how_heard?`<div class="sm">Heard about us: ${esc(r.how_heard)}</div>`:''}${r.message?`<div class="sm" style="overflow-wrap:anywhere;white-space:pre-wrap">${esc(r.message)}</div>`:''}
 ${r.status==='new'?`<div class="row" style="flex-wrap:wrap">${aBtn('ajrinv',`data-id="${r.id}"`,`${ic('check','s')}Invite`)}${aBtn('ajrno',`data-id="${r.id}"`,'Decline','line')}</div>`:''}${r.status==='invited'&&r.invite_code?`<div class="row" style="flex-wrap:wrap"><span class="sm">Code <b>${esc(r.invite_code)}</b></span>${aBtn('acopy',`data-t="${esc(location.origin+'/?invite='+r.invite_code)}"`,ic('copy','s')+'Copy invite link','line')}</div>`:''}</div>`).join(''):'<div class="card" style="text-align:center"><p class="mut">No applications yet.</p></div>'}</div>`};
};
ACT.ajrinv=async d=>{
 const r=ADM.jr.find(x=>x.id===d.id);if(!r)return;
 const inv=await aok(sb.from('invites').insert({email:r.email,created_by:S.uid}).select().single());
 await aok(sb.from('join_requests').update({status:'invited',invite_code:inv.code,handled_at:new Date().toISOString()}).eq('id',d.id));
 aLog('invite_application',{code:inv.code});copy(location.origin+'/?invite='+inv.code);admReload();
};
ACT.ajrno=async d=>{await aok(sb.from('join_requests').update({status:'declined',handled_at:new Date().toISOString()}).eq('id',d.id));admReload()};

/* ---------- settings ---------- */
V.adm_settings=function(){
 const s=ADM.settings||{};
 return {t:'Settings',b:`<div class="stack"><div class="card"><div class="row"><div class="grow"><b>Charging members</b><div class="sm mut">${s.billing_on?'On: members see their due date and fee, get the 4-day countdown, and are locked if unpaid.':'Off: membership is free and no fee shows anywhere. Policies say a fee may come in future.'}</div></div>${aSw(s.billing_on,'abilling','','Charging')}</div>
 ${s.billing_on?'':`<label class="f" for="s-lm" style="margin-top:12px">When you switch on: free months for every current member, counted from that day</label><input id="s-lm" type="number" min="0" value="${s.free_months??3}"><div class="xs mut" style="margin-top:6px">Set the fee below and save first. Switching on never locks anyone straight away. Members with longer free time keep it.</div>`}</div><div class="card stack"><b>Fees and timing</b><div class="xs mut">Members see the fee only once charging is on.</div>
 <div class="grid2" style="gap:10px"><div><label class="f" for="s-fm">Free months for new sign-ups</label><input id="s-fm" type="number" min="0" value="${s.free_months}"></div><div><label class="f" for="s-gd">Days to pay after due date</label><input id="s-gd" type="number" min="0" value="${s.grace_days}"></div></div>
 <div class="grid2" style="gap:10px"><div><label class="f" for="s-ft">Monthly fee (TL)</label><input id="s-ft" type="number" min="0" inputmode="decimal" value="${s.monthly_fee_try??''}"></div><div><label class="f" for="s-fg">Monthly fee (GBP, optional)</label><input id="s-fg" type="number" min="0" step="0.01" inputmode="decimal" value="${s.monthly_fee_gbp??''}"></div></div>
 <label class="f" for="s-rate">Pound to lira rate for the converter (£1 = ? TL). You set this by hand.</label><input id="s-rate" type="number" min="0" step="0.0001" inputmode="decimal" value="${s.gbp_try_rate??''}"><div class="xs mut">${s.rate_updated_at?'Last set '+aDate(s.rate_updated_at):'Not set yet. The converter stays empty until you set it.'}</div>
 <label class="f" for="s-em">Contact email (shown on the lock page; add the professional address here later)</label><input id="s-em" type="email" value="${esc(s.contact_email||'')}">
 ${aBtn('asave',`${ic('check','s')}Save settings`,'','')}</div><p class="xs mut">Free months apply to people who sign up after you change them. Days to pay apply to everyone straight away.</p></div>`};
};
ACT.abilling=async()=>{const nb=!ADM.settings.billing_on;
 if(nb){
  const fee=Number(ADM.settings.monthly_fee_try||0)||Number(ADM.settings.monthly_fee_gbp||0);
  if(!fee){toast('Set the monthly fee and save first');return}
  const n=Math.max(0,parseInt(val('s-lm'))||0),d=new Date();d.setMonth(d.getMonth()+n);
  await aok(sb.from('profiles').update({free_until:d.toISOString()}).neq('role','admin').lt('free_until',d.toISOString()));
  aLog('billing_free_from_today',{months:n});
 }await aok(sb.from('app_settings').update({billing_on:nb,updated_at:new Date().toISOString()}).eq('id',1));aLog('billing',{on:nb});DB.cfg.billing_on=nb;toast('Saved');admReload()};
ACT.asave=async()=>{
 const n=id=>{const v=val(id);return v===''?null:Number(v)};
 const row={free_months:n('s-fm')??3,grace_days:n('s-gd')??4,monthly_fee_try:n('s-ft'),monthly_fee_gbp:n('s-fg'),contact_phone:null,contact_whatsapp:null,contact_email:val('s-em')||null,gbp_try_rate:n('s-rate'),rate_updated_at:(n('s-rate')!==(ADM.settings.gbp_try_rate==null?null:Number(ADM.settings.gbp_try_rate)))?new Date().toISOString():ADM.settings.rate_updated_at,updated_at:new Date().toISOString()};
 await aok(sb.from('app_settings').update(row).eq('id',1));aLog('settings',row);
 DB.cfg.gbp_try_rate=row.gbp_try_rate;DB.cfg.rate_updated_at=row.rate_updated_at;DB.cfg.free_months=row.free_months;DB.cfg.grace_days=row.grace_days;DB.cfg.monthly_fee_try=row.monthly_fee_try;DB.cfg.monthly_fee_gbp=row.monthly_fee_gbp;DB.contact={email:row.contact_email||''};
 toast('Saved');admReload();
};

/* ---------- reports ---------- */
V.adm_reports=function(){
 const rs=ADM.reports||[];
 const lab={post:'Post',listing:'Listing',event:'Meetup',biz:'Business',seller:'Member',update:'Update'};
 return {t:'Reports',b:`<div class="stack">${rs.length?rs.map(r=>`<div class="card stack" style="${r.status==='done'?'opacity:.55':''}"><div class="row"><b class="grow">${lab[r.kind]||esc(r.kind)} · ${esc(T(r.reason)||r.reason)}</b><span class="xs mut">${aDate(r.created_at)}</span></div><div class="sm" style="overflow-wrap:anywhere">${esc((ADM.prev||{})[r.target_id]||'(already removed)')}</div><div class="xs mut">Reported by ${esc((P[r.reporter]||{}).n||'member')}</div>
  ${r.status==='open'?`<div class="row" style="flex-wrap:wrap">${r.kind==='seller'?aBtn('admgo',`data-sec="member" data-x="${r.target_id}"`,'Open member'):''}${['post','listing','event','biz'].includes(r.kind)&&(ADM.prev||{})[r.target_id]?aBtn('areprm',`data-id="${r.id}" data-kind="${r.kind}" data-t="${r.target_id}"`,'Remove content','line'):''}${aBtn('arepdone',`data-id="${r.id}"`,'Mark done')}</div>`:''}</div>`).join(''):'<div class="card" style="text-align:center"><p class="mut">No reports.</p></div>'}</div>`};
};
ACT.arepdone=async d=>{await aok(sb.from('reports').update({status:'done'}).eq('id',d.id));admReload()};
ACT.areprm=async d=>{
 const tb={post:'posts',listing:'listings',event:'meetups',biz:'directory'}[d.kind];
 if(d.kind==='biz')await aok(sb.from('directory').update({status:'rejected'}).eq('id',d.t));else await aok(sb.from(tb).delete().eq('id',d.t));
 await aok(sb.from('reports').update({status:'done'}).eq('id',d.id));aLog('remove_content',{kind:d.kind,id:d.t});toast('Removed');admReload();
};

/* ---------- directory ---------- */
V.adm_directory=function(){
 const ds=ADM.dir||[];
 return {t:'Business directory',b:`<div class="stack">${ds.length?ds.map(b=>`<div class="card stack"><div class="row"><div class="grow" style="min-width:0"><b style="overflow-wrap:anywhere">${esc(b.name)}</b><div class="xs mut">${esc(cName(b.category_id))} · ${esc(areaLabel(b.district_id,b.town_id,b.area_id))}${b.address?' · '+esc(b.address):''}</div></div><span class="pill ${b.status==='approved'?'':'red'}">${b.status}</span></div>
  <label class="f" for="d-o-${b.id}">Offer shown to members (shows under Discounts)</label><input id="d-o-${b.id}" maxlength="100" value="${esc(b.offer||'')}">
  <div class="grid2" style="gap:10px"><div><label class="f" for="d-p-${b.id}">Phone (with country code)</label><input id="d-p-${b.id}" maxlength="30" value="${esc(b.phone||'')}"></div><div><label class="f" for="d-w-${b.id}">WhatsApp</label><input id="d-w-${b.id}" maxlength="30" value="${esc(b.whatsapp||'')}"></div></div>
  <label class="f" for="d-u-${b.id}">Website</label><input id="d-u-${b.id}" maxlength="200" value="${esc(b.website||'')}"><label class="f" for="d-h-${b.id}">Opening times</label><input id="d-h-${b.id}" maxlength="300" value="${esc(b.opening_hours||'')}"><label class="f" for="d-a-${b.id}">Address</label><input id="d-a-${b.id}" maxlength="120" value="${esc(b.address||'')}">
  <div class="row" style="flex-wrap:wrap">${b.status!=='approved'?aBtn('adir',`data-id="${b.id}" data-s="approved"`,'Approve',''):aBtn('adir',`data-id="${b.id}" data-s="rejected"`,'Hide')}${b.status==='pending'?aBtn('adir',`data-id="${b.id}" data-s="rejected"`,'Reject','line'):''}${aBtn('adirv',`data-id="${b.id}" data-v="${b.verified?0:1}"`,b.verified?'Remove verified':'Mark verified')}${aBtn('adiro',`data-id="${b.id}"`,'Save details')}${aBtn('adirf',`data-id="${b.id}" data-v="${b.featured?0:1}"`,b.featured?'Remove featured':'Make featured','line')}${aBtn('adirdel',`data-id="${b.id}"`,ic('trash','s'),'line')}</div></div>`).join(''):'<div class="card" style="text-align:center"><p class="mut">No businesses yet.</p></div>'}</div>`};
};
ACT.adir=async d=>{await aok(sb.from('directory').update({status:d.s}).eq('id',d.id));aLog('directory',{id:d.id,status:d.s});admReload();loadContent()};
ACT.adirv=async d=>{await aok(sb.from('directory').update({verified:d.v==='1'}).eq('id',d.id));aLog('verify',{id:d.id,v:d.v});admReload();loadContent()};
ACT.adiro=async d=>{const g=k=>val(k+d.id)||null;await aok(sb.from('directory').update({offer:g('d-o-'),phone:g('d-p-'),whatsapp:g('d-w-'),website:g('d-u-'),opening_hours:g('d-h-'),address:g('d-a-')}).eq('id',d.id));toast('Saved');loadContent()};
ACT.adirf=async d=>{await aok(sb.from('directory').update({featured:d.v==='1'}).eq('id',d.id));aLog('featured',{id:d.id,v:d.v});admReload();loadContent()};
ACT.adirdel=async d=>{await aok(sb.from('directory').delete().eq('id',d.id));aLog('directory_delete',{id:d.id});admReload();loadContent()};

/* ---------- banners ---------- */
const BZ=[['top','Every page'],['feed','Feed'],['explore','Explore'],['market','Marketplace'],['directory','Directory'],['events','Events'],['me','Me tab']];
V.adm_banners=function(){
 const bs=ADM.banners||[];
 return {t:'Banners',b:`<div class="stack"><div class="note g">${ic('info')}<div class="sm">Every banner starts switched off. Nothing shows to members until you switch one on.</div></div>
 ${bs.map(b=>`<div class="card stack"><div class="row"><div class="grow" style="min-width:0"><b style="overflow-wrap:anywhere">${esc(b.headline||'(no headline)')}</b><div class="xs mut">${(BZ.find(z=>z[0]===b.zone)||[0,b.zone])[1]}${b.starts_on?' · from '+b.starts_on:''}${b.ends_on?' · to '+b.ends_on:''}${b.trade?' · '+esc(b.trade):''}</div></div>${aSw(b.enabled,'abtog',`data-id="${b.id}" data-v="${b.enabled?0:1}"`,'Show')}</div>${bannerCard(Object.assign({},b,{link_url:null}))}<label class="f" for="bz-${b.id}">Shows on</label><select id="bz-${b.id}" data-act="abzone" data-id="${b.id}">${BZ.map(z=>`<option value="${z[0]}" ${z[0]===b.zone?'selected':''}>${z[1]}</option>`).join('')}</select>${aBtn('abdel',`${ic('trash','s')}Delete`,`data-id="${b.id}"`,'line')}</div>`).join('')}
 <div class="card stack"><b>New banner</b><label class="f" for="b-z">Shows on (one page, or every page)</label><select id="b-z">${BZ.map(z=>`<option value="${z[0]}">${z[1]}</option>`).join('')}</select>
 <label class="f" for="b-h">Headline</label><input id="b-h" maxlength="80"><label class="f" for="b-b">Text</label><input id="b-b" maxlength="160"><label class="f" for="b-l">Link (optional)</label><input id="b-l" type="url" placeholder="https://"><label class="f" for="b-tr">Business or trade (for your records)</label><input id="b-tr" maxlength="60">
 <div class="grid2" style="gap:10px"><div><label class="f" for="b-s">Starts</label><input id="b-s" type="date"></div><div><label class="f" for="b-e">Ends</label><input id="b-e" type="date"></div></div>
 <label class="f" for="b-i">Image (optional)</label><input id="b-i" type="file" accept="image/*">${aBtn('abnew',`${ic('plus','s')}Save banner (starts off)`,'','')}</div></div>`};
};
document.addEventListener('change',async e=>{const t=e.target;if(t&&t.dataset&&t.dataset.act==='abzone'){await aok(sb.from('banners').update({zone:t.value}).eq('id',t.dataset.id));aLog('banner_page',{id:t.dataset.id,zone:t.value});toast('Moved');admReload();loadContent()}});
ACT.abtog=async d=>{await aok(sb.from('banners').update({enabled:d.v==='1'}).eq('id',d.id));aLog('banner',{id:d.id,on:d.v});admReload();loadContent()};
ACT.abdel=async d=>{await aok(sb.from('banners').delete().eq('id',d.id));admReload();loadContent()};
ACT.abnew=async()=>{
 if(!val('b-h'))return toast('Add a headline');
 let img=null;const f=($('#b-i')||{}).files&&$('#b-i').files[0];
 if(f){const d=await readImg(f);if(d)img=await uploadDataUrl(d,'banner')}
 await aok(sb.from('banners').insert({zone:val('b-z'),headline:val('b-h'),body:val('b-b')||null,link_url:val('b-l')||null,trade:val('b-tr')||null,starts_on:val('b-s')||null,ends_on:val('b-e')||null,image_url:img,enabled:false}));
 toast('Saved. Switch it on when ready.');admReload();
};

/* ---------- "Other, please tell us" requests ---------- */
V.adm_requests=function(){
 const rs=ADM.req||[];
 const lab={town:'Town or village',area:'Area',market_category:'Marketplace category',directory_category:'Directory category'};
 return {t:'Requests',b:`<div class="stack"><p class="sm mut">Members asked for these to be added. Add them under Places or Categories, then mark done.</p>${rs.length?rs.map(r=>`<div class="card stack" style="${r.status!=='pending'?'opacity:.55':''}"><div class="row"><b class="grow">${lab[r.list]||esc(r.list)}</b><span class="xs mut">${aDate(r.created_at)}</span></div><div style="overflow-wrap:anywhere">${esc(r.text)}</div><div class="xs mut">From ${esc((P[r.requested_by]||{}).n||'member')}</div>${r.status==='pending'?`<div class="row">${aBtn('areq',`data-id="${r.id}" data-s="approved"`,'Done')}${aBtn('areq',`data-id="${r.id}" data-s="rejected"`,'Decline','line')}</div>`:`<span class="pill">${r.status}</span>`}</div>`).join(''):'<div class="card" style="text-align:center"><p class="mut">Nothing waiting.</p></div>'}</div>`};
};
ACT.areq=async d=>{await aok(sb.from('other_requests').update({status:d.s}).eq('id',d.id));admReload()};

/* ---------- places & categories: tree editor ---------- */
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
V.adm_places=function(){
 const g=ADM.geo||[],d=S.apd||'',t=S.apt||'';
 const dists=g.filter(x=>x.level==='district'),towns=d?g.filter(x=>x.parent_id===d):[];
 const parent=t||d||null,level=t?'area':d?'town':'district';
 const kids=g.filter(x=>parent?x.parent_id===parent:x.level==='district');
 return {t:'Places',b:`<div class="stack"><div class="card stack"><label class="f" for="p-d">District</label><select id="p-d" data-act-sel="apd"><option value="">(top level: districts)</option>${opts(dists,d,r=>r.names[0],r=>r.id)}</select>
 ${d?`<label class="f" for="p-t">Town or village</label><select id="p-t" data-act-sel="apt"><option value="">(towns in this district)</option>${opts(towns,t,r=>r.names[0],r=>r.id)}</select>`:''}</div>
 <b>${level==='district'?'Districts':level==='town'?'Towns and villages':'Areas'}</b>
 ${kids.map(k=>`<div class="card stack" style="${k.active?'':'opacity:.55'}"><label class="f" for="pk-${k.id}">Names (first is shown, others are alternative names, separate with commas)</label><input id="pk-${k.id}" value="${esc(k.names.join(', '))}"><div class="row">${aBtn('apsave',`data-id="${k.id}"`,'Save')}${aBtn('aptog',`data-id="${k.id}" data-v="${k.active?0:1}"`,k.active?'Hide':'Show','line')}</div></div>`).join('')}
 <div class="card stack"><b>Add a ${level==='district'?'district':level==='town'?'town or village':'area'}</b><input id="p-new" placeholder="Name, alternative name, another name"><button class="btn" data-act="apadd" data-level="${level}" data-parent="${parent||''}">${ic('plus','s')}Add</button></div></div>`};
};
document.addEventListener('change',e=>{
 const id=e.target.id;
 if(id==='p-d'){S.apd=e.target.value;S.apt='';renderOv(true)}
 if(id==='p-t'){S.apt=e.target.value;renderOv(true)}
 if(id==='ac-k'){S.ack=e.target.value;S.acp='';renderOv(true)}
 if(id==='ac-p'){S.acp=e.target.value;renderOv(true)}
});
const names=s=>s.split(',').map(x=>x.trim()).filter(Boolean);
ACT.apsave=async d=>{const n=names(val('pk-'+d.id));if(!n.length)return toast('Add a name');await aok(sb.from('geo').update({names:n}).eq('id',d.id));aLog('geo_edit',{id:d.id});await refreshStatic();admReload()};
ACT.aptog=async d=>{await aok(sb.from('geo').update({active:d.v==='1'}).eq('id',d.id));await refreshStatic();admReload()};
ACT.apadd=async d=>{
 const n=names(val('p-new'));if(!n.length)return toast('Add a name');
 let id=(d.parent?d.parent+'-':'')+slug(n[0]);if((ADM.geo||[]).some(x=>x.id===id))id+='-'+Math.floor(Math.random()*90+10);
 await aok(sb.from('geo').insert({id,level:d.level,parent_id:d.parent||null,names:n}));aLog('geo_add',{id});await refreshStatic();admReload();
};
V.adm_cats=function(){
 const c=ADM.cats||[],k=S.ack||'market',p=S.acp||'';
 const tops=c.filter(x=>x.kind===k&&!x.parent_id),kids=c.filter(x=>x.kind===k&&(p?x.parent_id===p:!x.parent_id));
 return {t:'Categories',b:`<div class="stack"><div class="card stack"><label class="f" for="ac-k">List</label><select id="ac-k"><option value="market" ${k==='market'?'selected':''}>Community marketplace</option><option value="directory" ${k==='directory'?'selected':''}>Business directory</option></select><label class="f" for="ac-p">Inside</label><select id="ac-p"><option value="">(top-level categories)</option>${opts(tops,p,r=>r.name,r=>r.id)}</select></div>
 ${kids.map(x=>`<div class="card stack" style="${x.active?'':'opacity:.55'}"><label class="f" for="ck-${x.id}">Name</label><input id="ck-${x.id}" value="${esc(x.name)}" maxlength="60"><div class="row">${aBtn('acsave',`data-id="${x.id}"`,'Save')}${aBtn('actog',`data-id="${x.id}" data-v="${x.active?0:1}"`,x.active?'Hide':'Show','line')}</div></div>`).join('')}
 <div class="card stack"><b>Add a category</b><input id="c-new" maxlength="60" placeholder="Name"><button class="btn" data-act="acadd" data-kind="${k}" data-parent="${p}">${ic('plus','s')}Add</button></div></div>`};
};
ACT.acsave=async d=>{const n=val('ck-'+d.id);if(!n)return;await aok(sb.from('categories').update({name:n}).eq('id',d.id));await refreshStatic();admReload()};
ACT.actog=async d=>{await aok(sb.from('categories').update({active:d.v==='1'}).eq('id',d.id));await refreshStatic();admReload()};
ACT.acadd=async d=>{const n=val('c-new');if(!n)return;let id=d.kind+'-'+slug(n);if((ADM.cats||[]).some(x=>x.id===id))id+='-'+Math.floor(Math.random()*90+10);await aok(sb.from('categories').insert({id,kind:d.kind,parent_id:d.parent||null,name:n}));await refreshStatic();admReload()};
V.adm_lists=function(){
 const ls=ADM.lists||[],kinds=[['condition','Condition'],['currency','Currency'],['handover','Collection or delivery'],['bedrooms','Bedrooms (property)'],['furnished','Furnishing (property)'],['property_type','Property type'],['bathrooms','Bathrooms (property)']];
 return {t:'Dropdown lists',b:`<div class="stack">${kinds.map(k=>`<div class="card stack"><b>${k[1]}</b>${ls.filter(x=>x.kind===k[0]).map(x=>`<div class="row"><span class="grow" style="${x.active?'':'opacity:.5'}">${esc(x.value)}</span>${aBtn('altog',`data-kind="${k[0]}" data-val="${esc(x.value)}" data-v="${x.active?0:1}"`,x.active?'Hide':'Show','line')}</div>`).join('')}<div class="row"><input id="l-${k[0]}" placeholder="Add a value" maxlength="40">${aBtn('aladd',`data-kind="${k[0]}"`,ic('plus','s'))}</div></div>`).join('')}</div>`};
};
ACT.altog=async d=>{await aok(sb.from('lists').update({active:d.v==='1'}).eq('kind',d.kind).eq('value',d.val));await refreshStatic();admReload()};
ACT.aladd=async d=>{const v=val('l-'+d.kind);if(!v)return;const mx=Math.max(0,...(ADM.lists||[]).filter(x=>x.kind===d.kind).map(x=>x.sort));await aok(sb.from('lists').insert({kind:d.kind,value:v,sort:mx+1}));await refreshStatic();admReload()};
async function refreshStatic(){try{await loadStatic()}catch(e){}}

/* ---------- clubs ---------- */
V.adm_clubs=function(){
 const cs=ADM.clubs||[];
 return {t:'Clubs',b:`<div class="stack">${cs.map(c=>`<div class="card stack" style="${c.active?'':'opacity:.55'}"><label class="f" for="cl-n-${c.id}">Name</label><input id="cl-n-${c.id}" value="${esc(c.name)}" maxlength="60"><label class="f" for="cl-b-${c.id}">Short description</label><input id="cl-b-${c.id}" value="${esc(c.blurb||'')}" maxlength="140"><div class="row" style="flex-wrap:wrap">${aBtn('aclsave',`data-id="${c.id}"`,'Save')}${aBtn('acltog',`data-id="${c.id}" data-v="${c.active?0:1}"`,c.active?'Hide':'Show','line')}${aBtn('acldel',`data-id="${c.id}"`,ic('trash','s'),'line')}</div></div>`).join('')}
 <div class="card stack"><b>Add a club</b><input id="cl-new" placeholder="Name" maxlength="60"><input id="cl-newb" placeholder="Short description" maxlength="140">${aBtn('acladd',`${ic('plus','s')}Add`,'','')}</div></div>`};
};
ACT.aclsave=async d=>{await aok(sb.from('clubs').update({name:val('cl-n-'+d.id),blurb:val('cl-b-'+d.id)}).eq('id',d.id));await refreshStatic();toast('Saved');admReload()};
ACT.acltog=async d=>{await aok(sb.from('clubs').update({active:d.v==='1'}).eq('id',d.id));await refreshStatic();admReload()};
ACT.acldel=async d=>{await aok(sb.from('clubs').delete().eq('id',d.id));await refreshStatic();admReload()};
ACT.acladd=async()=>{const n=val('cl-new');if(!n)return;await aok(sb.from('clubs').insert({name:n,blurb:val('cl-newb')||null,hue:Math.floor(Math.random()*360)}));await refreshStatic();admReload()};

/* ---------- latest content ---------- */
V.adm_content=function(){
 const who=id=>esc((P[id]||{n:'member'}).n);
 const r=(t,id,title,sub)=>`<div class="card row"><div class="grow" style="min-width:0"><b style="overflow-wrap:anywhere">${esc(title)}</b><div class="xs mut">${sub}</div></div>${aBtn('acdel',`data-t="${t}" data-id="${id}"`,ic('trash','s'),'line')}</div>`;
 return {t:'Latest content',b:`<div class="stack"><h2 class="h3">Posts</h2>${(ADM.cp||[]).map(p=>r('posts',p.id,p.body.slice(0,90),`${who(p.author==='x'?'':p.author)} · ${aTime(p.created_at)}${p.club_id?' · club':''}`)).join('')||'<p class="mut sm">None.</p>'}<h2 class="h3">Marketplace listings</h2>${(ADM.cl||[]).map(p=>r('listings',p.id,p.title,`${who(p.author)} · ${p.status} · ${aTime(p.created_at)}`)).join('')||'<p class="mut sm">None.</p>'}<h2 class="h3">Meetups</h2>${(ADM.cm||[]).map(p=>r('meetups',p.id,p.title,`${who(p.author)} · ${aTime(p.starts_at)}`)).join('')||'<p class="mut sm">None.</p>'}</div>`};
};
ACT.acdel=async d=>{await aok(sb.from(d.t).delete().eq('id',d.id));aLog('delete_'+d.t,{id:d.id});toast('Removed');admReload();loadContent()};

/* ---------- payments log + activity log ---------- */
V.adm_payments=function(){
 const p=ADM.pay||[],tot=p.reduce((a,x)=>a+Number(x.amount_try||0),0);
 return {t:'Payments log',b:`<div class="stack"><div class="card"><div class="xs mut">Recorded in this list</div><div class="h2">${tot.toLocaleString(LOC[S.L])} TL</div></div>${p.map(x=>`<div class="card row"><div class="grow" style="min-width:0"><b>${esc((x.profiles||{}).display_name||'Member')}</b><div class="xs mut">${aDate(x.paid_on)} · ${x.months} month(s)${x.note?' · '+esc(x.note):''}</div></div><b>${x.amount_try!=null?Number(x.amount_try).toLocaleString(LOC[S.L])+' TL':'–'}</b></div>`).join('')||'<p class="mut sm">No payments yet.</p>'}</div>`};
};
V.adm_audit=function(){
 return {t:'Activity log',b:`<div class="stack">${(ADM.audit||[]).map(a=>`<div class="card"><b>${esc(a.action)}</b><div class="xs mut">${aTime(a.created_at)}</div><div class="xs" style="overflow-wrap:anywhere;margin-top:4px">${esc(JSON.stringify(a.detail||{}))}</div></div>`).join('')||'<p class="mut sm">Nothing yet.</p>'}</div>`};
};

/* ---------- community news ---------- */
V.adm_news=function(){
 const ns=ADM.news||[],pf=S.nprefill||{};
 return {t:'Community news',b:`<div class="stack"><div class="card stack"><b>New update</b><label class="f" for="n-t">Title</label><input id="n-t" maxlength="120" value="${esc(pf.title||'')}"><label class="f" for="n-c">Category</label><select id="n-c"><option value="">None (community news)</option>${AUC.map(k=>`<option value="${k}">${T('uc_'+k)}</option>`).join('')}</select><label class="f" for="n-b">Text</label><textarea id="n-b" maxlength="3000"></textarea>
 <label class="f" for="n-su">Official source link</label><input id="n-su" maxlength="300" value="${esc(pf.source_url||'')}"><label class="f" for="n-lr">Law or decision number</label><input id="n-lr" maxlength="200"><label class="f" for="n-co">Date you checked the source</label><input id="n-co" type="date" value="${today()}">
 <label class="f" for="n-g">Related guide (optional)</label><select id="n-g"><option value="">None</option>${GC.map(g=>g.it.map((it,i)=>`<option value="${g.id}:${i}">${esc(g.n[0])}: ${esc(it[0])}</option>`).join('')).join('')}</select>
 <label class="f" for="n-i">Image (optional)</label><input id="n-i" type="file" accept="image/*">${aBtn('anewsadd',`${ic('check','s')}Publish`,'','')}</div>
 ${ns.map(n=>`<div class="card stack" style="${n.published?'':'opacity:.55'}"><b style="overflow-wrap:anywhere">${esc(n.title)}</b><div class="xs mut">${aDate(n.created_at)}${n.category?' · '+T('uc_'+n.category):''}</div><div class="row" style="flex-wrap:wrap">${aBtn('anewstog',`data-id="${n.id}" data-v="${n.published?0:1}"`,n.published?'Hide':'Show')}${aBtn('anewsdel',`data-id="${n.id}"`,ic('trash','s'),'line')}</div></div>`).join('')}</div>`};
};
ACT.anewsadd=async()=>{
 const t=val('n-t'),b=val('n-b');if(!t||!b)return toast('Add a title and text');
 const cat=val('n-c')||null,su=val('n-su')||null,co=val('n-co')||null;
 if(cat&&(!su||!co))return toast('Official updates need the source link and the date you checked');
 let img=null;const f=($('#n-i')||{}).files&&$('#n-i').files[0];
 if(f){const d=await readImg(f);if(d)img=await uploadDataUrl(d,'news')}
 await aok(sb.from('updates').insert({title:t,body:b,image_url:img,category:cat,source_url:su,law_ref:val('n-lr')||null,checked_on:cat?co:null,guide_key:val('n-g')||null}));
 if(S.nprefill&&S.nprefill.rid)await aok(sb.from('update_review').update({status:'done'}).eq('id',S.nprefill.rid));
 S.nprefill=null;aLog('news',{title:t});toast('Published');admReload();loadContent().then(()=>renderMain());
};
ACT.anewstog=async d=>{await aok(sb.from('updates').update({published:d.v==='1'}).eq('id',d.id));admReload();loadContent()};
ACT.anewsdel=async d=>{await aok(sb.from('updates').delete().eq('id',d.id));admReload();loadContent()};

/* ---------- stage 4: guides, sources and updates to review ---------- */
const AUC=['residency','property','visas','driving','health','tax','other'];
V.adm_guides=function(){
 const gt=ADM.gt||{},k=S.agk;
 if(k){
  const [c,i]=k.split(':'),g=GC.find(x=>x.id===c),t=gt[k]||{};
  return {t:'Guide text',b:`<div class="stack"><button class="btn soft" data-act="agk" data-id="">${ic('left','s')}All guides</button><div class="card stack"><b>${esc(g.n[0])}: ${esc(g.it[+i][0])}</b>
  <div class="note g">${ic('info')}<div class="sm">Write only what you have read on the official page. Keep a blank line between paragraphs. A short line on its own above a paragraph becomes a heading. Members see nothing until you press Publish.</div></div>
  <label class="f" for="g-b">Text (English)</label><textarea id="g-b" maxlength="12000" style="min-height:260px">${esc(t.body||'')}</textarea>
  <label class="f" for="g-sn">Source name</label><input id="g-sn" maxlength="160" value="${esc(t.source_name||'')}">
  <label class="f" for="g-su">Source link (official page)</label><input id="g-su" maxlength="300" value="${esc(t.source_url||'')}">
  <label class="f" for="g-lr">Law or decision number</label><input id="g-lr" maxlength="200" value="${esc(t.law_ref||'')}">
  <label class="f" for="g-co">Date you checked the source</label><input id="g-co" type="date" value="${esc(t.checked_on||'')}">
  <div class="row" style="flex-wrap:wrap">${aBtn('agsave',`data-k="${k}" data-p="1"`,'Publish','')}${aBtn('agsave',`data-k="${k}" data-p="0"`,t.published?'Hide (keep as draft)':'Save as draft','line')}${t.body?aBtn('agdel',`data-k="${k}"`,ic('trash','s'),'line'):''}</div></div></div>`};
 }
 return {t:'Guides',b:`<div class="stack"><div class="note g">${ic('info')}<div class="sm">Members only see a guide once you have written it and pressed Publish. Guides with no text stay hidden.</div></div>
 ${GC.map(g=>`<div class="card stack"><b>${esc(g.n[0])}</b>${g.it.map((it,i)=>{const key=g.id+':'+i,t=gt[key];const st=t?(t.published?'<span class="pill">Published</span>':'<span class="pill red">Draft</span>'):'<span class="xs mut">No text</span>';return aRow('agk',`data-id="${key}"`,esc(it[0]),t&&t.checked_on?'Checked '+t.checked_on:'',st)}).join('')}</div>`).join('')}</div>`};
};
ACT.agk=d=>{S.agk=d.id||null;renderOv(true)};
ACT.agsave=async d=>{
 const body=val('g-b');if(!body||body.length<20)return toast('Write the guide text first');
 const row={guide_key:d.k,body,source_name:val('g-sn')||null,source_url:val('g-su')||null,law_ref:val('g-lr')||null,checked_on:val('g-co')||null,published:d.p==='1',updated_at:new Date().toISOString()};
 if(row.published&&(!row.source_url||!row.checked_on))return toast('Add the source link and the date you checked before publishing');
 await aok(sb.from('guide_texts').upsert(row));aLog('guide_save',{k:d.k,p:row.published});toast(row.published?'Published':'Saved as draft');await admReload();loadGuides()
};
ACT.agdel=async d=>{await aok(sb.from('guide_texts').delete().eq('guide_key',d.k));aLog('guide_del',{k:d.k});S.agk=null;await admReload();loadGuides()};

V.adm_sources=function(){
 const ss=ADM.src||[],rv=ADM.rev||[],pend=rv.filter(x=>x.status==='pending');
 const rb={yes:'<span class="pill">Can be read</span>',no:'<span class="pill red">A person must read it</span>',unknown:'<span class="pill">Not tested</span>'};
 return {t:'Official sources',b:`<div class="stack">
 <div class="card stack"><b>Updates to review (${pend.length})</b><div class="sm mut">Add a tip-off here when you or Chris see a change, including a headline from TFR or a page that cannot be read automatically. Open the official page, read the full text, then turn it into an update. Nothing reaches members until you publish it.</div>
 <label class="f" for="r-t">What changed</label><input id="r-t" maxlength="200"><label class="f" for="r-u">Official page link</label><input id="r-u" maxlength="300"><label class="f" for="r-n">Note (optional)</label><input id="r-n" maxlength="300">${aBtn('arevadd',`${ic('plus','s')}Add to review list`,'','')}
 ${pend.map(x=>`<div class="card stack"><b style="overflow-wrap:anywhere">${esc(x.title)}</b><div class="xs mut" style="overflow-wrap:anywhere">${aDate(x.created_at)}${x.note?' · '+esc(x.note):''}</div><div class="row" style="flex-wrap:wrap">${x.url?`<a class="btn soft" href="${esc(x.url)}" target="_blank" rel="noopener nofollow">Open page</a>`:''}${aBtn('arevup',`data-id="${x.id}"`,'Write update','')}${aBtn('arevno',`data-id="${x.id}"`,'Dismiss','line')}</div></div>`).join('')}</div>
 <div class="card stack"><b>Add an official source</b><label class="f" for="o-n">Name</label><input id="o-n" maxlength="160"><label class="f" for="o-u">Link</label><input id="o-u" maxlength="300"><label class="f" for="o-b">Body (ministry or department)</label><input id="o-b">${aBtn('asrcadd',`${ic('plus','s')}Add`,'','')}</div>
 ${ss.map(s=>`<div class="card stack" style="${s.active?'':'opacity:.55'}"><b style="overflow-wrap:anywhere">${esc(s.name)}</b><div class="xs mut" style="overflow-wrap:anywhere">${esc(s.body||'')}${s.last_checked?' · checked '+esc(s.last_checked):' · not checked yet'}</div><div>${rb[s.readable]||''}</div>${s.note?`<div class="sm mut">${esc(s.note)}</div>`:''}<div class="row" style="flex-wrap:wrap"><a class="btn soft" href="${esc(s.url)}" target="_blank" rel="noopener nofollow">Open</a>${aBtn('asrcchk',`data-id="${s.id}"`,'I checked it today','line')}${aBtn('asrctog',`data-id="${s.id}" data-v="${s.active?0:1}"`,s.active?'Hide':'Show','line')}${aBtn('asrcdel',`data-id="${s.id}"`,ic('trash','s'),'line')}</div></div>`).join('')}</div>`};
};
const today=()=>new Date().toISOString().slice(0,10);
ACT.arevadd=async()=>{const t=val('r-t');if(!t||t.length<2)return toast('Say what changed');await aok(sb.from('update_review').insert({title:t,url:val('r-u')||null,note:val('r-n')||null}));toast('Added');admReload()};
ACT.arevno=async d=>{await aok(sb.from('update_review').update({status:'dismissed'}).eq('id',d.id));admReload()};
ACT.arevup=async d=>{const x=(ADM.rev||[]).find(r=>r.id===d.id);S.nprefill={title:x.title,source_url:x.url||'',rid:x.id};admGo('news')};
ACT.asrcadd=async()=>{const n=val('o-n'),u=val('o-u');if(!n||!u)return toast('Add a name and a link');await aok(sb.from('official_sources').insert({name:n,url:u,body:val('o-b')||null}));toast('Added');admReload()};
ACT.asrcchk=async d=>{await aok(sb.from('official_sources').update({last_checked:today()}).eq('id',d.id));admReload()};
ACT.asrctog=async d=>{await aok(sb.from('official_sources').update({active:d.v==='1'}).eq('id',d.id));admReload()};
ACT.asrcdel=async d=>{await aok(sb.from('official_sources').delete().eq('id',d.id));admReload()};
