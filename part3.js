const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={L:0,role:'visitor',name:'',tab:'feed',stack:[],sheet:null,theme:'auto',liked:{},saved:{},going:{},joined:{},checks:{},eq:{},cmt:{},played:{},steps:{},streak:6,today:false,notif:true,verified:false,footer:false,mcat:'all',dcat:'all',dview:'list',dsel:null,posts:POSTS.slice(),listings:LISTINGS.slice(),meetups:[],clips:CLIPS.slice(),dir:DIR.slice(),su:{step:1,type:'ind',dir:true},unread:3,clip:null,member:false,appos:'ios',cr:null};
try{const l=localStorage.getItem('inc_l');if(l!==null&&D.tagline[+l])S.L=+l;const t=localStorage.getItem('inc_t');if(t)S.theme=t}catch(e){}
const T=k=>{const v=D[k];return v?v[S.L]:k};
const F=(k,o)=>T(k).replace(/\{(\w+)\}/g,(m,x)=>o[x]);
const A=x=>Array.isArray(x)?x[S.L]:x;
const ic=(n,c)=>`<svg class="ic ${c||''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const isM=()=>S.role!=='visitor';
function av(k,sz){const p=P[k];return `<span class="ring${p.biz||p.org?' bz':''}" style="--s:${sz||44}px"><span class="av" style="--h:${p.h}">${p.img?`<img src="${p.img}" alt="">`:esc(p.i)}</span></span>`}
function ago(m){return m<60?F('ago_m',{n:Math.max(1,m)}):m<1440?F('ago_h',{n:Math.round(m/60)}):F('ago_d',{n:Math.round(m/1440)})}
function fdate(iso,long){try{return new Date(iso+'T12:00:00').toLocaleDateString(LOC[S.L],long?{weekday:'long',day:'numeric',month:'long',year:'numeric'}:{day:'numeric',month:'short',year:'numeric'})}catch(e){return iso}}
const evT=e=>typeof e.t==='string'?T(e.t):A(e.t);
const offer=b=>b.pct?F('off_pct',{n:b.pct}):T(b.off);
const audI={public:'eye',members:'shield',clubs:'users'};
const audK={public:'aud_public',members:'aud_members',clubs:'aud_clubs'};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2300)}
function copy(txt){const ok=()=>toast(T('copied')+': '+txt);try{navigator.clipboard.writeText(txt).then(ok,()=>toast(txt))}catch(e){toast(txt)}}
function applyTheme(){const r=document.documentElement;if(S.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.theme)}


/* ---------- media (illustrated gallery + uploads) ---------- */
const LK={l1:'garden',l2:'ac',l3:'bike',l4:'books',l5:'kayak',l6:'sofa'},CATK={home:'sofa',garden:'garden',sport:'bike',books:'books',free:'sofa'};
const BK={b1:'tools',b2:'tooth',b3:'plate',b4:'doc',b5:'music',b6:'scales',b7:'physio',b8:'villa'},BCAT={home:'tools',health:'physio',food:'plate',legal:'scales',prop:'villa'};
const lkey=l=>LK[l.id]||CATK[l.cat]||'tag',bkey=b=>BK[b.id]||BCAT[b.cat]||'tag';
const hueOf=s=>[...String(s)].reduce((a,c)=>a+c.charCodeAt(0),0)*37%360;
function locSvg(lab){return `<path class="fs" d="M0 100V74C16 74 40 66 64 60S128 46 160 36V100z" style="opacity:.0"/><path d="M0 0H160V36C128 46 96 52 64 60S16 74 0 74Z" style="fill:var(--g);opacity:.3"/><path d="M0 74C16 74 40 66 64 60S128 46 160 36" class="s" stroke-dasharray="4 3" style="stroke-width:1.5;opacity:.6"/><path class="f4" d="M80 78c-10-12-14-19-14-26a14 14 0 0 1 28 0c0 7-4 14-14 26z"/><circle class="f1" cx="80" cy="52" r="5"/><text x="80" y="95" text-anchor="middle" font-size="8" font-weight="600" style="fill:var(--fg)">${esc(lab||'')}</text>`}
function art(k,h,v,lab){
 const bg=`style="fill:color-mix(in srgb,hsl(${(h+v*50)%360} 45% 55%) ${v===1?36:26}%,var(--card))"`,sc=SCN[k]||SCN.tag;
 const inner=v===2?locSvg(lab):v===1?`<g transform="translate(-40 -26) scale(1.5)">${sc}</g>`:sc;
 return `<svg class="art" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(v===2?'':lab||'')}"><rect width="160" height="100" ${bg}/>${inner}</svg>`;
}
const GM={property:'gp',vehicles:'gv',residency:'gr',living:'gl',finance:'gf',funerals:'gu',welfare:'gw',explore:'ge'};
const hu=id=>MV[id]?MV[id][1]:hueOf(id);
const vidEl=id=>`<video class="art" muted loop playsinline autoplay preload="metadata" poster="media/${id}.jpg"><source src="media/${id}.mp4" type="video/mp4"><source src="media/${id}.webm" type="video/webm"></video>`;
function gal(id,k,h,loc,up,nonote){
 up=up||{};const sl=[];
 sl.push(up.img?`<img class="art" src="${up.img}" alt="">`:art(k,h,0,''));
 if(up.vid)sl.push(`<video class="art" src="${up.vid}" controls playsinline preload="metadata"></video>`);else if(MV[id])sl.push(vidEl(id));
 if(loc)sl.push(art(k,h,2,loc));
 const real=up.img||up.vid;
 return `<div class="galw"><div class="gal">${sl.map(s=>`<div class="sl">${s}</div>`).join('')}</div>${sl.length>1?`<span class="gc">1/${sl.length}</span>`:''}</div>${real||nonote?'':`<p class="xs mut" style="margin-top:8px">${T('gal_note')}</p>`}`;
}
const thmArt=gid=>{const m=MV[GM[gid]];return art(m[0],m[1],0,'')};
const thmRaw=(k,h)=>`<span class="th">${art(k,h,0,'')}</span>`;
const thm=id=>thmRaw(MV[id][0],MV[id][1]);
function rowt(act,v,id,th,title,sub,right){return `<button class="listrow" data-act="${act}" data-v="${v}" data-id="${id}">${th}<span class="grow"><b>${title}</b>${sub?`<span class="xs mut">${sub}</span>`:''}</span>${right===undefined?ic('right'):right}</button>`}
function postMedia(p){const m=MV['p'+p.id];if(!m&&!p.up)return '';return `<div style="margin-top:12px">${gal('p'+p.id,m?m[0]:'tag',m?m[1]:150,'',p.up,1)}</div>`}

/* ---------- chrome ---------- */
function renderTop(){
 $('#top').innerHTML=`<button class="logo" data-act="tab" data-id="feed" title="${SITE_NAME}"><span class="mark">${ic('island','l')}</span><span class="t">${SITE_SHORT}</span></button>
 <button class="ib" data-act="push" data-v="search" title="${T('search')}" aria-label="${T('search')}">${ic('search')}</button>
 <button class="ib" data-act="sheet" data-v="lang" title="${T('lang')}" aria-label="${T('lang')}">${ic('globe')}</button>
 <button class="ib" data-act="bell" title="${T('notifs')}" aria-label="${T('notifs')}">${ic('bell')}${isM()&&S.nunread?`<span class="dot">${S.nunread}</span>`:''}</button>
 <button class="sosb" data-act="sheet" data-v="sos" aria-label="${T('sos')}">${ic('buoy','s')}${T('sos')}</button>`;
}
function renderNav(){
 const nb=(id,i,k)=>`<button class="nb ${S.tab===id?'on':''}" data-act="tab" data-id="${id}" title="${T(k)}">${ic(i)}<span>${T(k)}</span></button>`;
 $('#navin').innerHTML=nb('feed','home','nav_feed')+nb('explore','compass','nav_explore')+
 `<div style="display:grid;justify-items:center;gap:1px"><button class="createb" data-act="create" title="${T('nav_create')}" aria-label="${T('nav_create')}">${ic('plus')}</button><span class="cap">${T('nav_create')}</span></div>`+
 nb('market','bag','nav_market')+nb('me','user','nav_me');
}
function renderMain(){$('#main').innerHTML=({feed:feedV,explore:exploreV,market:marketV,me:meV})[S.tab]()}
function render(){document.documentElement.lang=LANGS[S.L];applyTheme();renderTop();renderNav();renderMain();renderOv(true);renderSheet()}

/* ---------- feed ---------- */
function notes(){
 let h=payNote();
 if(S.role==='visitor')h+=`<div class="note g">${ic('info')}<div style="flex:1"><div>${T('visitor_bar')}</div><button class="btn block" style="margin-top:10px;min-height:40px" data-act="signup">${ic('user','s')}${T('join_free')}</button></div></div>`;
 if(S.role==='business'&&!S.verified)h+=`<div class="note sticky">${ic('shield')}<div><b>${T('verify_t')}</b><div class="sm">${T('verify_d')}</div></div></div>`;
 return h+bannerHtml('top');
}
function feedV(){
 let h='<div class="stack">'+notes();
 h+=`<section><h2 class="h3">${T('friends')}</h2><div class="leaves">`+
  ['marek','olga','elif','john','anna'].map(k=>`<button class="leaf" data-act="push" data-v="person" data-id="${k}"><span class="lf" style="--h:${P[k].h}">${esc(P[k].i)}</span><span class="n">${esc(P[k].n.split(' ')[0])}</span></button>`).join('')+
  `<button class="leaf inv" data-act="invite"><span class="lf">${ic('plus')}</span><span class="n">${T('invite')}</span></button></div></section>`;
 if(isM()){
  h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="create">${av('me',40)}<span class="grow mut">${T('compose_ph')}</span>${ic('image','s')}</button>`;
  h+=checkin();
 }
 const list=S.posts.slice().sort((a,b)=>a.m-b.m);
 const lim=S.role==='visitor'?3:list.length;
 list.slice(0,lim).forEach(p=>h+=post(p));
 if(S.role==='visitor'){
  h+=`<div class="gate"><div class="blur" aria-hidden="true">${post(list[3]).replace(/data-act/g,'data-x').replace(/href=/g,'data-h=')}</div><div class="gc"><div><h3 class="h2">${T('gate_t')}</h3><p class="mut" style="margin:6px 0 12px">${T('gate_d')}</p><button class="btn block" data-act="signup">${T('join_free')}</button></div></div></div>`;
 }else{
  h+=`<div class="card" style="text-align:center"><div class="mark" style="margin:0 auto 8px;width:44px;height:44px">${ic('check','l')}</div><div class="mut">${T('caught')}</div><button class="btn soft" style="margin-top:12px" data-act="refresh">${ic('refresh','s')}${T('refresh')}</button><p class="xs mut" style="margin-top:12px">${T('member_note')}</p></div>`;
 }
 return h+'</div>';
}
function checkin(){
 return `<div class="card" style="background:linear-gradient(135deg,var(--card),var(--gs))"><div class="row"><span class="lf" style="background:var(--rs);color:var(--r);width:48px;height:48px">${ic('zap','l')}</span><div class="grow"><b>${T('checkin_t')}</b><div class="xs mut">${F('days',{n:S.streak})}</div></div></div><p class="sm mut" style="margin:10px 0 12px">${T('checkin_d')}</p>${S.today?`<button class="btn soft block" disabled>${ic('check','s')}${T('checkin_done')}</button>`:`<button class="btn block" data-act="checkin">${ic('check','s')}${T('checkin_btn')}</button>`}</div>`;
}
function post(p){
 const P0=P[p.who],k='p'+p.id,lk=!!S.liked[k],n=p.likes+(lk?1:0);
 const cms=S.cmt[k];
 const wa='https://wa.me/?text='+encodeURIComponent(A(p.txt).slice(0,120)+' — '+SITE_NAME+' '+itemUrl('post',p.id));
 return `<article class="card post"><div class="ph">${av(p.who)}<div style="min-width:0"><b>${esc(P0.n)}${P0.org||P0.biz?` <span class="pill" style="vertical-align:1px">${ic('vcheck','s')}${P0.org?T('staff'):T('verified')}</span>`:''}</b><small>${ago(p.m)} · ${ic(audI[p.aud],'s')} ${T(audK[p.aud])}${p.help?' · '+T('help_tag'):''}</small></div></div>
 <div class="txt">${esc(A(p.txt))}</div>${postMedia(p)}${p.ref?refCard(p.ref):''}
 <div class="acts">
  <button class="actb ${lk?'on':''}" data-act="like" data-id="${p.id}" title="${T('like')}">${ic('heart')}<span>${n}</span></button>
  <button class="actb" data-act="cmt" data-id="${p.id}" title="${T('comment')}">${ic('msg')}<span>${p.cm.length||T('comment')}</span></button>
  <button class="actb" data-act="share" data-k="post" data-id="${p.id}" data-t="${esc(A(p.txt).slice(0,100))}" title="${T('share')}">${ic('share')}<span>${T('share')}</span></button>
  <a class="actb" href="${wa}" target="_blank" rel="noopener" title="${T('whatsapp')}">${ic('wa')}<span>${T('whatsapp')}</span></a>
  ${(p.who==='me'||S.admin)?`<button class="actb" data-act="delpost" data-id="${p.id}" title="${T('delete')}" aria-label="${T('delete')}">${ic('trash')}</button>`:''}<button class="actb" data-act="report" data-kind="post" data-id="${p.id}" title="${T('report')}">${ic('flag')}<span>${T('report')}</span></button>
 </div>
 ${cms?`<div class="cmts">${p.cm.map(c=>`<div class="cm">${av(c[0],30)}<div class="bub"><b>${esc(P[c[0]].n)}</b> ${esc(c[1])}</div></div>`).join('')}<div class="cform"><input id="ci-${p.id}" placeholder="${T('add_comment')}" maxlength="200"><button class="btn" data-act="cmtsend" data-id="${p.id}" aria-label="${T('send')}" title="${T('send')}">${ic('send','s')}</button></div></div>`:''}
 </article>`;
}

/* ---------- explore ---------- */
function footerV(){
 return `<div class="foot"><button class="fx" data-act="footer" aria-expanded="${S.footer}" title="${T('footer')}" aria-label="${T('footer')}">${ic(S.footer?'up':'down')}</button>${S.footer?`<div class="fb card"><div class="row" style="flex-wrap:wrap;gap:16px"><a href="#" data-act="noop">${T('f_about')}</a><a href="#" data-act="noop">${T('f_priv')}</a><a href="#" data-act="noop">${T('f_terms')}</a><a href="#" data-act="noop">${T('f_contact')}</a></div><div class="xs mut">${T('mem_np')}</div><div class="xs mut">${T('f_demo')}</div></div>`:''}</div>`;
}
function appCard(){return `<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="app"><span class="lf" style="width:46px;height:46px;background:var(--gs);color:var(--gd)">${ic('phone2')}</span><div class="grow"><b>${T('get_app')}</b><div class="sm mut">${T('app_d')}</div></div>${ic('right')}</button>`}
function exploreV(){
 const mods=[['guides','book',T('m_guides'),F('cnt_guides',{n:GC.length})],['dirlist','pin',T('m_dir'),F('cnt_dir',{n:S.dir.length})],['events','cal',T('m_events'),F('cnt_events',{n:EV.length+S.meetups.length})],['clubs','users',T('m_clubs'),F('cnt_clubs',{n:CLUBS.length})],['watch','video',T('m_watch'),F('cnt_watch',{n:S.clips.length})],['equip','tool',T('m_equip'),F('cnt_equip',{n:EQ.length})],['checklist','ck',T('m_check'),F('cnt_check',{n:CK.length})],['updates','bell',T('m_updates'),F('cnt_updates',{n:UPD.length})],['member','shield',T('m_member'),T('cnt_member')]];
 return `<div class="stack">${notes()}<div class="hero"><h1 class="h1" style="max-width:85%">${T('tagline')}</h1><p style="margin-top:8px;max-width:85%" class="mut">${T('exp_hero_d')}</p></div>
 <div class="grid2">${mods.map(m=>`<button class="mod" data-act="push" data-v="${m[0]}"><span class="lf">${ic(m[1])}</span><b>${m[2]}</b><small>${m[3]}</small></button>`).join('')}</div>
 ${appCard()}${footerV()}</div>`;
}

/* ---------- marketplace ---------- */
const MC=['all','home','garden','sport','books','free'];
function priceT(l){return l.price?l.price.toLocaleString(LOC[S.L])+' TL':T('free')}
function marketV(){
 const ls=S.listings.filter(l=>S.mcat==='all'||l.cat===S.mcat);
 return `<div class="stack">${notes()}<div class="row"><h1 class="h1 grow">${T('nav_market')}</h1><button class="btn out" data-act="create" data-type="listing">${ic('plus','s')}${T('sell')}</button></div>
 <div class="chips">${MC.map(c=>`<button class="chip ${S.mcat===c?'on':''}" data-act="mcat" data-id="${c}">${c==='all'?T('all'):T('mc_'+c)}</button>`).join('')}</div>
 <div class="grid2">${ls.map(l=>`<button class="tile" data-act="push" data-v="listing" data-id="${l.id}"><span class="pic">${l.img?`<img class="art" src="${l.img}" alt="">`:art(lkey(l),hu(l.id),0,l.t)}<span class="pr">${priceT(l)}</span></span><span class="tb"><b>${esc(l.t)}</b><span class="xs mut">${esc(l.area)}</span></span></button>`).join('')}</div>
 <div class="note g">${ic('info')}<div class="sm">${T('mk_note')}</div></div></div>`;
}

/* ---------- me ---------- */
function themeSeg(){return `<div class="seg" style="margin-top:10px">${[['auto','th_auto','compass'],['light','th_light','sun'],['dark','th_dark','moon']].map(t=>`<button class="${S.theme===t[0]?'on':''}" data-act="theme" data-id="${t[0]}">${ic(t[2],'s')}${T(t[1])}</button>`).join('')}</div>`}
function meV(){
 let h=`<div class="stack">`;
 if(!isM()){
  h+=`<div class="card" style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('user','l')}</div><h2 class="h2">${T('me_vis_t')}</h2><p class="mut" style="margin:6px 0 14px">${T('me_vis_d')}</p><button class="btn block" data-act="signup">${T('join_free')}</button></div>`;
 }else{
  const biz=S.role==='business';
  h+=notes();
  h+=`<div class="card"><div class="row">${av('me',64)}<div class="grow"><h2 class="h2">${esc(P.me.n)}</h2><div class="mut sm">${esc(P.me.area||'')}</div><label class="btn soft" for="c-pf" style="margin-top:8px;display:inline-flex">${ic('image','s')}${T('chg_photo')}</label><input id="c-pf" type="file" accept="image/*" class="pfx"><div style="margin-top:6px"><span class="pill">${ic('lock','s')}${T('me_acct')}: ${T(biz?'su_biz':'su_ind')} · ${T('me_locked')}</span></div></div></div></div>`;
  h+=checkin();
  h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="member"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('shield')}</span><div class="grow"><b>${T('m_member')}</b><div class="sm mut">${S.member?T('mem_ok'):T('mem_price')}</div></div>${ic('right')}</button>`;
  const sv=Object.keys(S.saved).filter(k=>S.saved[k]);
  h+=`<div class="card"><b>${T('saved_items')}</b><div class="stack" style="margin-top:10px">${sv.length?sv.map(k=>{const [c,i]=k.split(':');const g=GC.find(x=>x.id===c);return row('push','guide',k,g.ic,A(g.it[+i]),A(g.n))}).join(''):`<span class="mut sm">${T('none_yet')}</span>`}</div></div>`;
 }
 h+=`<div class="card"><div class="row"><span class="grow"><b>${T('nf_t')}</b><div class="sm mut">${S.notif?T('nf_on'):T('nf_off')}</div></span><button class="tg ${S.notif?'on':''}" role="switch" aria-checked="${S.notif}" data-act="notif" aria-label="${T('notifs')}"><i></i></button></div></div>`;
 h+=`<div class="card"><b>${T('theme')}</b>${themeSeg()}<b style="display:block;margin-top:16px">${T('lang')}</b><div class="seg" style="margin-top:10px">${NATIVE.map((n,i)=>`<button class="${S.L===i?'on':''}" data-act="setlang" data-id="${i}">${n}</button>`).join('')}</div></div>`;
 h+=appCard();
 if(isM())h+=`<button class="btn line block" data-act="reset">${T('reset')}</button>`;
 return h+footerV()+'</div>';
}

/* ---------- overlay views ---------- */
function row(act,v,id,icon,title,sub,right){return `<button class="listrow" data-act="${act}" data-v="${v}" data-id="${id}">${icon?`<span class="lf sq" style="background:var(--gs);color:var(--gd)">${ic(icon)}</span>`:''}<span class="grow"><b>${title}</b>${sub?`<span class="xs mut">${sub}</span>`:''}</span>${right===undefined?ic('right'):right}</button>`}
function dcard(b){return `<button class="listrow" data-act="push" data-v="dir" data-id="${b.id}"><span class="th">${art(bkey(b),hu(b.id),0,b.n)}</span><span class="grow"><b>${esc(b.n)}</b><span class="xs mut">${esc(b.area)} · ${offer(b)}</span></span>${b.ver?`<span class="pill">${ic('vcheck','s')}</span>`:`<span class="pill red">${ic('info','s')}</span>`}</button>`}
const V={
guides(){return {t:T('m_guides'),b:`<p class="mut" style="margin-bottom:12px">${T('guides_sub')}</p><div class="grid2">${GC.map(g=>`<button class="mod" data-act="push" data-v="gcat" data-id="${g.id}"><span class="mp">${thmArt(g.id)}</span><b>${A(g.n)}</b><small>${F('gcount',{n:g.it.length})}</small></button>`).join('')}</div>`}},
gcat(o){const g=GC.find(x=>x.id===o.id),m=GM[g.id];return {t:A(g.n),b:`<div class="stack">${gal(m,MV[m][0],MV[m][1],'')}<p class="mut">${F('gcount',{n:g.it.length})}</p>${g.it.map((it,i)=>rowt('push','guide',g.id+':'+i,thmRaw(MV[m][0],(MV[m][1]+i*25)%360),A(it),'',S.saved[g.id+':'+i]?ic('star','s'):undefined)).join('')}</div>`}},
guide(o){const [c,i]=o.id.split(':');const g=GC.find(x=>x.id===c),name=A(g.it[+i]),sv=!!S.saved[o.id];
 const st=['g_s1','g_s2','g_s3'].map((k,j)=>{const key=o.id+':'+j,d=S.steps[key];return `<button class="step ${d?'done':''}" data-act="step" data-id="${key}"><span class="num">${d?ic('check','s'):j+1}</span><span class="tx" style="flex:1">${T(k)}</span></button>`}).join('');
 return {t:A(g.n),b:`<div class="stack">${gal(GM[c],MV[GM[c]][0],(MV[GM[c]][1]+(+i)*25)%360,'')}<div><span class="pill">${ic(g.ic,'s')}${A(g.n)}</span><h1 class="h1" style="margin-top:10px">${name}</h1><p class="xs mut" style="margin-top:6px">${T('g_upd')}</p></div>
 <div class="card"><h2 class="h3">${T('g_what')}</h2><p style="margin-top:6px">${T('g_sum')}</p></div><div class="stack">${st}</div>
 <div class="row"><button class="btn grow" data-act="msg" data-to="TFR Team">${ic('msg','s')}${T('g_ask')}</button><button class="btn soft" data-act="save" data-id="${o.id}">${ic('star','s')}${sv?T('g_saved'):T('g_save')}</button></div>
 <div class="note g">${ic('info')}<div class="sm">${T('g_demo')}</div></div>
 <div><h2 class="h3" style="margin-bottom:10px">${T('related')}</h2><div class="stack">${g.it.map((it,j)=>j===+i?'':row('push','guide',c+':'+j,g.ic,A(it))).join('')}</div></div></div>`}},
dirlist(){
 const cats=['all','home','health','food','legal','prop'],ls=S.dir.filter(b=>S.dcat==='all'||b.cat===S.dcat);
 let view;
 if(S.dview==='map'){
  const sel=S.dsel&&ls.find(b=>b.id===S.dsel);
  view=`<div class="map"><svg class="bg" viewBox="0 0 100 69" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="69" fill="var(--gs)"/><path d="M0 0H100V24C90 30 84 33 76 34C68 36 62 37 54 39C46 40 38 40 32 44C24 49 14 54 0 53Z" fill="var(--g)" opacity=".28"/><path d="M0 53C14 54 24 49 32 44C38 40 46 40 54 39C62 37 68 36 76 34C84 33 90 30 100 24" fill="none" stroke="var(--gd)" stroke-width=".7" stroke-dasharray="1.6 1.2" opacity=".6"/><path d="M0 63C20 59 34 57 52 55C70 53 86 49 100 45" fill="none" stroke="var(--g)" stroke-width=".5" opacity=".6"/></svg>
  ${TOWNS.map(t=>`<span class="town" style="left:${t[1]}%;top:${t[2]}%">${t[0]}</span>`).join('')}
  ${ls.map(b=>`<button class="pin ${S.dsel===b.id?'on':''}" style="left:${b.x}%;top:${b.y}%" data-act="dsel" data-id="${b.id}" aria-label="${esc(b.n)}">${ic('pin')}</button>`).join('')}</div>
  ${sel?`<div style="margin-top:12px">${dcard(sel)}</div>`:''}`;
 }else view=`<div class="stack">${ls.map(dcard).join('')}</div>`;
 return {t:T('m_dir'),b:`<p class="mut" style="margin-bottom:10px">${T('dir_sub')}</p><div class="seg" style="margin-bottom:12px"><button class="${S.dview==='list'?'on':''}" data-act="dview" data-id="list">${ic('list','s')}${T('list_t')}</button><button class="${S.dview==='map'?'on':''}" data-act="dview" data-id="map">${ic('map','s')}${T('map_t')}</button></div><div class="chips">${cats.map(c=>`<button class="chip ${S.dcat===c?'on':''}" data-act="dcat" data-id="${c}">${c==='all'?T('all'):T('dc_'+c)}</button>`).join('')}</div>${view}`}},
dir(o){const b=S.dir.find(x=>x.id===o.id);return {t:esc(b.n),b:`<div class="stack"><div>${gal(b.id,bkey(b),hu(b.id),F('loc_biz',{a:b.area}))}</div><div class="card"><div class="row"><span class="lf" style="--h:${b.cat==='food'?20:140}">${esc(b.n[0])}</span><div class="grow"><h1 class="h2">${esc(b.n)}</h1><div class="sm mut">${T('dc_'+b.cat)} · ${esc(b.area)}</div></div></div><div style="margin-top:10px"><span class="pill ${b.ver?'':'red'}">${ic(b.ver?'vcheck':'info','s')}${b.ver?T('verified'):T('unverified')}</span></div></div>
 <div class="card" style="background:var(--gs)"><div class="xs mut" style="text-transform:uppercase;letter-spacing:.06em">${T('offer_t')}</div><div class="h2" style="margin-top:4px">${offer(b)}</div></div>
 <div class="row"><button class="btn grow" data-act="msg" data-to="${esc(b.n)}">${ic('msg','s')}${T('msg_biz')}</button><button class="btn soft grow" data-act="mcard" data-id="${b.id}">${ic('card','s')}${T('show_card')}</button></div>
 <button class="btn line block" data-act="report" data-kind="biz" data-id="${b.id}">${ic('flag','s')}${T('report_biz')}</button></div>`}},
events(){
 const wk=EV.filter(e=>e.w),an=EV.filter(e=>e.date);
 const card=e=>rowt('push','event',e.id,MV[e.id]?thm(e.id):thmRaw('group',hueOf(e.id)),esc(evT(e)),e.w?T(e.when):(e.date?fdate(e.date):esc(e.whenx||'')),S.going[e.id]?`<span class="pill">${ic('check','s')}${T('going_on')}</span>`:undefined);
 return {t:T('m_events'),b:`<div class="stack"><h2 class="h3">${T('ev_weekly')}</h2>${wk.map(card).join('')}<h2 class="h3" style="margin-top:8px">${T('ev_annual')}</h2>${an.map(card).join('')}${S.meetups.length?`<h2 class="h3" style="margin-top:8px">${T('ev_meetups')}</h2>${S.meetups.map(card).join('')}`:''}</div>`}},
event(o){const e=EV.concat(S.meetups).find(x=>x.id===o.id),g=!!S.going[e.id],n=e.n+(g?1:0);
 return {t:esc(evT(e)),b:`<div class="stack">${gal(e.id,MV[e.id]?MV[e.id][0]:'group',hu(e.id),e.where||'',e.up)}<div><span class="pill">${ic(e.ic||'cal','s')}${e.w?T('ev_weekly'):T('m_events')}</span><h1 class="h1" style="margin-top:10px">${esc(evT(e))}</h1></div>
 <div class="card stack"><div class="row">${ic('cal')}<div class="grow"><div class="xs mut">${T('ev_when')}</div><b>${e.w?T(e.when):e.date?fdate(e.date,1):esc(e.whenx||'')}</b></div></div><div class="row">${ic('pin')}<div class="grow"><div class="xs mut">${T('ev_where')}</div><b>${esc(e.where||T('ev_venue'))}</b></div></div><div class="row">${ic('users')}<div class="grow"><b>${F('ev_who',{n})}</b></div></div></div>
 <button class="btn block ${g?'soft':''}" data-act="going" data-id="${e.id}">${ic(g?'check':'plus','s')}${g?T('going_on'):T('going')}</button>
 <div class="row"><button class="btn soft grow" data-act="share">${ic('share','s')}${T('ev_invite')}</button><button class="btn line" data-act="report" data-kind="event" data-id="${e.id}" title="${T('report')}" aria-label="${T('report')}">${ic('flag','s')}</button></div></div>`}},
clubs(){return {t:T('m_clubs'),b:`<div class="stack">${CLUBS.map(c=>rowt('push','club',c.id,thm(c.id),esc(c.n),F('members_n',{n:c.m+(S.joined[c.id]?1:0)}),S.joined[c.id]?`<span class="pill">${ic('check','s')}</span>`:undefined)).join('')}</div>`}},
club(o){const c=CLUBS.find(x=>x.id===o.id),j=!!S.joined[c.id];return {t:esc(c.n),b:`<div class="stack">${gal(c.id,MV[c.id][0],MV[c.id][1],'')}<div class="hero"><h1 class="h1" style="max-width:100%">${esc(c.n)}</h1><p class="mut" style="margin-top:6px">${A(c.d)}</p><p class="sm mut" style="margin-top:6px">${F('members_n',{n:c.m+(j?1:0)})}</p></div>
 <button class="btn block ${j?'soft':''}" data-act="joinclub" data-id="${c.id}">${ic(j?'check':'plus','s')}${j?T('joined'):T('join_club')}</button>
 <h2 class="h3">${T('club_posts')}</h2>${c.say.map(s=>`<div class="card row">${av(s[0],40)}<div class="grow"><b>${esc(P[s[0]].n)}</b><div>${esc(s[1])}</div></div></div>`).join('')}</div>`}},
watch(){return {t:T('m_watch'),b:`<p class="mut" style="margin-bottom:12px">${T('watch_sub')}</p><div class="grid2">${S.clips.map(c=>`<button class="tile" data-act="push" data-v="clip" data-id="${c.id}"><span class="thumb" style="--h:${c.h}">${MV[c.id]?`<img class="art" src="media/${c.id}.jpg" alt="" loading="lazy">`:''}${ic('play','l')}<span class="du">${F('secs',{n:c.dur})}</span></span><span class="tb"><b>${esc(A(c.t))}</b><span class="xs mut">${esc(P[c.by].n)}${S.played[c.id]?' · ✓':''}</span></span></button>`).join('')}</div>`}},
clip(o){const c=S.clips.find(x=>x.id===o.id),done=S.played[c.id];const next=S.clips.find(x=>x.id!==c.id&&!S.played[x.id])||S.clips.find(x=>x.id!==c.id)||c;
 const poster=MV[c.id]?`media/${c.id}.jpg`:'';
 const vid=c.src?`<video id="cv" src="${c.src}" playsinline preload="metadata" ${poster?`poster="${poster}"`:''}></video>`:`<video id="cv" playsinline preload="metadata" poster="${poster}"><source src="media/${c.id}.mp4" type="video/mp4"><source src="media/${c.id}.webm" type="video/webm"></video>`;
 return {t:esc(A(c.t)),b:`<div class="stack"><div class="clipv" style="--h:${c.h}">${done?(poster?`<img class="art" src="${poster}" alt="" style="filter:brightness(.55)">`:'')+ic('check'):vid}<span class="tt">${esc(A(c.t))} · ${F('secs',{n:c.dur})}</span></div>
 <div class="prog"><i id="cp" style="width:${done?100:0}%"></i></div>
 ${done?`<p class="mut" style="text-align:center">${T('clip_end')}</p><button class="btn block" data-act="push" data-v="clip" data-id="${next.id}">${ic('play','s')}${T('watch_more')}</button>`:`<button class="btn block" id="cpb" data-act="playclip" data-id="${c.id}">${ic('play','s')}${T('play')}</button>`}
 <div class="row"><button class="btn soft grow" data-act="share">${ic('share','s')}${T('share')}</button><button class="btn line" data-act="report" data-kind="clip" data-id="${c.id}" title="${T('report')}" aria-label="${T('report')}">${ic('flag','s')}</button></div></div>`}},
equip(){return {t:T('m_equip'),b:`<div class="stack"><p class="mut">${T('eq_sub')}</p>${EQ.map(e=>`<div class="card row"><button class="th btn0" data-act="push" data-v="equipitem" data-id="${e.id}" aria-label="${A(e.n)}">${art(MV[e.id][0],MV[e.id][1],0,'')}</button><div class="grow"><b>${A(e.n)}</b><div class="xs mut">${S.eq[e.id]?T('requested'):T('avail')}</div></div><button class="btn ${S.eq[e.id]?'soft':''}" style="min-height:40px" data-act="eq" data-id="${e.id}">${S.eq[e.id]?ic('check','s'):T('request')}</button></div>`).join('')}</div>`}},
equipitem(o){const e=EQ.find(x=>x.id===o.id);return {t:A(e.n),b:`<div class="stack">${gal(e.id,MV[e.id][0],MV[e.id][1],'')}<h1 class="h1">${A(e.n)}</h1><p class="mut">${T('eq_one')} · ${S.eq[e.id]?T('requested'):T('avail')}</p><button class="btn block ${S.eq[e.id]?'soft':''}" data-act="eq" data-id="${e.id}">${S.eq[e.id]?T('requested'):T('request')}</button><div class="note g">${ic('info')}<div class="sm">${T('eq_sub')}</div></div></div>`}},
checklist(){const n=CK.filter((x,i)=>S.checks[i]).length;return {t:T('m_check'),b:`<div class="stack"><p class="mut">${T('ck_sub')}</p><div class="card"><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${F('ck_prog',{a:n,b:CK.length})}</b><span class="bignum" style="font-size:24px">${Math.round(n/CK.length*100)}%</span></div><div class="prog"><i style="width:${n/CK.length*100}%"></i></div></div>${CK.map((x,i)=>`<button class="step ${S.checks[i]?'done':''}" data-act="check" data-id="${i}"><span class="num">${S.checks[i]?ic('check','s'):i+1}</span><span class="tx" style="flex:1">${A(x)}</span></button>`).join('')}</div>`}},
updates(){return {t:T('m_updates'),b:`<div class="stack">${UPD.map(u=>rowt('push','update',u.id,thm(u.id),A(u.t),fdate(u.date))).join('')}</div>`}},
update(o){const u=UPD.find(x=>x.id===o.id);return {t:T('m_updates'),b:`<div class="stack">${gal(u.id,MV[u.id][0],MV[u.id][1],'')}<span class="pill">${ic('cal','s')}${fdate(u.date)}</span><h1 class="h1">${A(u.t)}</h1><p>${A(u.b)}</p><div class="note g">${ic('info')}<div class="sm">${T('up_from')}</div></div><div class="row"><button class="btn soft grow" data-act="share">${ic('share','s')}${T('share')}</button><button class="btn line" data-act="report" data-kind="update" data-id="${u.id}" title="${T('report')}" aria-label="${T('report')}">${ic('flag','s')}</button></div></div>`}},
member(){return {t:T('m_member'),b:`<div class="stack">${gal('mem','group',150,'')}<div class="hero"><span class="bignum">150 TL</span><p class="mut">${T('mem_price')}</p></div><div class="card stack">${['mem_p1','mem_p2','mem_p3','mem_p4','mem_p5'].map(k=>`<div class="row">${ic('check')}<span class="grow">${T(k)}</span></div>`).join('')}</div>
 <button class="btn block ${S.member?'soft':''}" data-act="joinmem">${S.member?T('mem_ok'):T('mem_join')}</button><p class="xs mut" style="text-align:center">${T('mem_note')}</p><p class="xs mut" style="text-align:center">${T('mem_np')}</p></div>`}},
listing(o){const l=S.listings.find(x=>x.id===o.id),w=P[l.who];return {t:T('nav_market'),b:`<div class="stack"><div>${gal(l.id,lkey(l),hu(l.id),F('loc_pick',{a:l.area}),{img:l.img,vid:l.vid})}</div><div><span class="pill">${T('mc_'+l.cat)}</span><h1 class="h1" style="margin-top:8px">${esc(l.t)}</h1><div class="h2" style="color:var(--gd);margin-top:4px">${priceT(l)}</div></div><p>${esc(l.d)}</p>
 <button class="listrow" data-act="push" data-v="person" data-id="${l.who}">${av(l.who,44)}<span class="grow"><span class="xs mut">${T('sold_by')}</span><b>${esc(w.n)}</b><span class="xs mut">${esc(l.area)}</span></span>${ic('right')}</button>
 <button class="btn block" data-act="msg" data-to="${esc(w.n)}">${ic('msg','s')}${T('msg_seller')}</button>
 <div class="row"><button class="btn line grow" data-act="report" data-kind="seller" data-id="${l.who}">${ic('flag','s')}${T('report_seller')}</button><button class="btn line grow" data-act="report" data-kind="listing" data-id="${l.id}">${ic('flag','s')}${T('report_listing')}</button></div>
 <div class="note g">${ic('info')}<div class="sm">${T('mk_note')}</div></div></div>`}},
person(o){const p=P[o.id],ps=S.posts.filter(x=>x.who===o.id);return {t:esc(p.n),b:`<div class="stack"><div class="card" style="text-align:center">${av(o.id,84)}<h1 class="h2" style="margin-top:10px">${esc(p.n)}</h1><div class="mut sm">${esc(p.area||'')}</div><button class="btn" style="margin-top:12px" data-act="msg" data-to="${esc(p.n)}" data-pre="${esc(T('hello_msg'))}">${ic('msg','s')}${T('hello')}</button></div>${ps.map(post).join('')}</div>`}},
notifs(){const it=[['n1','bell'],['n2','cal'],['n3','msg'],['n4','heart']];return {t:T('notifs'),b:`<div class="stack"><div class="card"><div class="row"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('bell')}</span><div class="grow"><b>${T('nf_t')}</b></div><button class="tg ${S.notif?'on':''}" role="switch" aria-checked="${S.notif}" data-act="notif" aria-label="${T('notifs')}"><i></i></button></div><p class="sm mut" style="margin-top:10px">${T('nf_d')}</p></div>${isM()?it.map((n,i)=>`<div class="card row"><span class="lf sq" style="background:${i<3?'var(--rs)':'var(--gs)'};color:${i<3?'var(--r)':'var(--gd)'}">${ic(n[1])}</span><span class="grow">${T(n[0])}</span></div>`).join(''):`<button class="btn block" data-act="signup">${T('join_free')}</button>`}</div>`}},
search(){return {t:T('search'),b:`<div class="stack"><input id="sq" type="search" placeholder="${T('search_ph')}" autocomplete="off"><div class="chips">${['sg1','sg2','sg3','sg4'].map(k=>`<button class="chip" data-act="sq" data-q="${esc(T(k))}">${T(k)}</button>`).join('')}</div><div id="sres" class="stack"></div></div>`}},
app(){const ios=S.appos==='ios';return {t:T('get_app'),b:`<div class="stack"><div class="hero"><span class="lf" style="background:var(--card);color:var(--gd)">${ic('phone2','l')}</span><h1 class="h1" style="margin-top:12px;max-width:100%">${T('get_app')}</h1><p class="mut" style="margin-top:6px">${T('app_d')}</p></div><div class="seg"><button class="${ios?'on':''}" data-act="appos" data-id="ios">${T('app_ios')}</button><button class="${ios?'':'on'}" data-act="appos" data-id="and">${T('app_and')}</button></div>${(ios?['ai1','ai2','ai3']:['aa1','aa2','aa3']).map((k,i)=>`<div class="step"><span class="num">${i+1}</span><span style="flex:1">${T(k)}</span></div>`).join('')}<button class="btn block" data-act="pop">${T('gotit')}</button></div>`}},
signup(){const u=S.su,biz=u.type==='biz';
 if(u.step===1)return {t:T('join_free'),b:`<div class="stack"><div class="hero"><h1 class="h1" style="max-width:100%">${T('tagline')}</h1></div><h2 class="h3">${T('su_pick')}</h2>
  <button class="opt ${biz?'':'on'}" data-act="sutype" data-id="ind"><span class="lf">${ic('user')}</span><span style="flex:1"><b>${T('su_ind')}</b><div class="sm mut">${T('su_ind_d')}</div></span></button>
  <button class="opt ${biz?'on':''}" data-act="sutype" data-id="biz"><span class="lf">${ic('bag')}</span><span style="flex:1"><b>${T('su_biz')}</b><div class="sm mut">${T('su_biz_d')}</div></span></button>
  <p class="xs mut">${ic('lock','s')} ${T('su_lock')}</p>
  ${[['sc1t','sc1d','home'],['sc2t','sc2d','bag'],['sc3t','sc3d','vcheck']].map(c=>`<div class="sc"><span class="lf">${ic(c[2])}</span><div><b>${T(c[0])}</b><div class="sm mut">${T(c[1])}</div></div></div>`).join('')}
  <button class="btn block" data-act="sunext">${T('cont')}</button></div>`};
 if(u.step===2)return {t:T('join_free'),b:`<div class="stack"><span class="pill">${ic(biz?'bag':'user','s')}${T(biz?'su_biz':'su_ind')}</span><div class="card"><label class="f" for="su-n">${T('su_name')}</label><input id="su-n" value="${esc(u.name||'')}" maxlength="40">${biz?`<label class="f" for="su-b">${T('su_biz_name')}</label><input id="su-b" value="${esc(u.biz||'')}" maxlength="50"><label class="f" for="su-c">${T('su_biz_cat')}</label><select id="su-c">${['home','health','food','legal','prop'].map(c=>`<option value="${c}" ${u.cat===c?'selected':''}>${T('dc_'+c)}</option>`).join('')}</select>`:''}<label class="f" for="su-a">${T('su_area')}</label><input id="su-a" value="${esc(u.area||'')}" maxlength="40" placeholder="Lapta, Çatalköy, Esentepe…"></div>
  ${biz?`<button class="opt ${u.dir?'on':''}" data-act="sudir"><span class="lf">${ic(u.dir?'check':'plus')}</span><span style="flex:1"><b>${T('su_dir')}</b><div class="sm mut">${T('su_dir_d')}</div></span></button>`:''}
  <button class="btn block" data-act="sunext">${T('finish')}</button></div>`};
 return {t:T('welcome'),b:`<div class="stack"><div class="hero"><div class="mark" style="width:56px;height:56px;margin-bottom:12px">${ic('check','l')}</div><h1 class="h1" style="max-width:100%">${T('welcome')}, ${esc(P.me.n)}</h1><p class="mut" style="margin-top:6px">${T('welcome_d')}</p></div>
  <div class="card"><div class="row"><span class="grow"><b>${T('nf_t')}</b></span><button class="tg ${S.notif?'on':''}" role="switch" aria-checked="${S.notif}" data-act="notif" aria-label="${T('notifs')}"><i></i></button></div><p class="sm mut" style="margin-top:10px">${T('nf_d')}</p></div>
  ${biz?`<div class="note">${ic('shield')}<div><b>${T('verify_t')}</b><div class="sm">${T('verify_d')}</div></div></div>`:''}
  <button class="btn block" data-act="sudone">${T('start')}</button></div>`};
}
};
function renderOv(keep){
 const el=$('#ov');
 if(!S.stack.length){el.hidden=true;el.innerHTML='';return}
 const top=S.stack[S.stack.length-1],sy=el.scrollTop;
 const v=V[top.v](top);
 el.hidden=false;
 el.innerHTML=`<div class="ovh"><div class="wrap"><button class="ib" data-act="pop" title="${T('back')}" aria-label="${T('back')}">${ic('left')}</button><h2>${v.t}</h2><button class="ib" data-act="popall" title="${T('close')}" aria-label="${T('close')}">${ic('x')}</button></div></div><div class="wrap ovb">${v.b}</div>`;
 el.scrollTop=keep?sy:(top.sy||0);
 if(top.v==='search'){if(!keep){const i=$('#sq');if(i)i.focus()}doSearch($('#sq')?$('#sq').value:'')}
}
function push(v,o){clearClip();const el=$('#ov');if(S.stack.length)S.stack[S.stack.length-1].sy=el.scrollTop;S.stack.push(Object.assign({v},o||{}));renderOv(false);el.scrollTop=0}
function pop(){clearClip();S.stack.pop();renderOv(false);renderMain();renderTop()}
function popall(){clearClip();S.stack=[];renderOv();renderMain();renderTop()}

/* ---------- clips ---------- */
function clearClip(){const v=$('#cv');if(v)try{v.pause()}catch(e){}S.clip=null}
function endClip(){if(!S.clip)return;S.played[S.clip.id]=true;const v=$('#cv');if(v)try{v.pause()}catch(e){}S.clip=null;renderOv(true)}
document.addEventListener('timeupdate',e=>{const v=e.target;if(!v||v.id!=='cv'||!S.clip)return;const cap=Math.min(30,v.duration||30),b=$('#cp');if(b)b.style.width=Math.min(100,v.currentTime/cap*100)+'%';if(v.currentTime>=30)endClip()},true);
document.addEventListener('ended',e=>{if(e.target&&e.target.id==='cv')endClip()},true);

/* ---------- search ---------- */
function index(){
 const j=a=>Array.isArray(a)?a.join(' '):String(a),r=[];
 GC.forEach(g=>g.it.forEach((it,i)=>r.push({l:A(it),s:A(g.n),ic:g.ic,v:'guide',id:g.id+':'+i,h:j(it)})));
 S.dir.forEach(b=>r.push({l:b.n,s:T('dc_'+b.cat)+' · '+b.area,ic:'pin',v:'dir',id:b.id,h:b.n+' '+b.area+' '+(b.k||'')+' '+j(D['dc_'+b.cat])}));
 EV.concat(S.meetups).forEach(e=>r.push({l:evT(e),s:T('m_events'),ic:e.ic||'cal',v:'event',id:e.id,h:(typeof e.t==='string'?j(D[e.t]):j(e.t))+' '+(e.where||'')}));
 CLUBS.forEach(c=>r.push({l:c.n,s:T('m_clubs'),ic:c.ic,v:'club',id:c.id,h:c.n+' '+j(c.d)}));
 UPD.forEach(u=>r.push({l:A(u.t),s:T('m_updates'),ic:'bell',v:'update',id:u.id,h:j(u.t)}));
 S.listings.forEach(l=>r.push({l:l.t,s:T('nav_market'),ic:l.ic,v:'listing',id:l.id,h:l.t+' '+l.area}));
 S.clips.forEach(c=>r.push({l:A(c.t),s:T('m_watch'),ic:'video',v:'clip',id:c.id,h:j(c.t)}));
 return r;
}
function doSearch(q){
 const el=$('#sres');if(!el)return;q=(q||'').trim().toLowerCase();
 if(!q){el.innerHTML='';return}
 const r=index().filter(x=>(x.l+' '+x.h).toLowerCase().includes(q)).slice(0,20);
 el.innerHTML=r.length?r.map(x=>row('push',x.v,x.id,x.ic,esc(x.l),esc(x.s))).join(''):`<p class="mut" style="text-align:center">${T('no_res')}</p>`;
}

/* ---------- sheets ---------- */
function openSheet(o){S.sheet=o;renderSheet()}
function closeSheet(){S.sheet=null;renderSheet()}
function renderSheet(){
 const el=$('#sh'),s=S.sheet;
 if(!s){el.hidden=true;el.innerHTML='';return}
 const x=SH[s.v](s);el.hidden=false;
 el.innerHTML=`<div class="bd" data-act="sclose"></div><div class="pn" role="dialog" aria-modal="true">${'<div class="grab"></div>'+x}</div>`;
}
function sosRow(l,n,s,nc){return `<div class="card row" style="box-shadow:none;background:var(--bg)"><div class="grow"><div class="xs mut">${l}</div><div class="h2">${n}</div>${s?`<div class="xs mut">${s}</div>`:''}</div>${nc?'':`<button class="btn soft" data-act="copy" data-t="${n}">${ic('copy','s')}${T('copy')}</button>`}</div>`}
const MF=v=>`<label class="f" for="c-m">${T(v?'cr_vid':'cr_media')}</label><input id="c-m" type="file" accept="${v?'video/*':'image/*,video/*'}"><div id="c-pv" style="margin-top:8px"></div>`;
const SH={
lang(){return `<h2 class="h2" style="margin-bottom:12px">${T('lang')}</h2><div class="stack">${NATIVE.map((n,i)=>`<button class="listrow" data-act="setlang" data-id="${i}"><span class="grow"><b>${n}</b></span>${S.L===i?ic('check'):''}</button>`).join('')}</div><b style="display:block;margin:16px 0 0">${T('theme')}</b>${themeSeg()}`},
sos(){return `<div class="row"><span class="lf" style="background:var(--rs);color:var(--r)">${ic('buoy','l')}</span><div><h2 class="h2">${T('sos_t')}</h2><div class="sm mut">${T('sos_d')}</div></div></div><div class="stack" style="margin-top:14px">${sosRow(T('sos_pol'),'112')}${sosRow(T('sos_fire'),'199')}${sosRow(T('sos_wel'),T('sos_wel_n'),'',1)}<button class="btn out block" data-act="buddy">${ic('heart','s')}${T('sos_buddy')}</button></div>`},
join(){return `<h2 class="h2">${T('j_t')}</h2><p class="mut" style="margin:6px 0 14px">${T('j_d')}</p><div class="stack"><button class="btn block" data-act="signup">${T('j_create')}</button><button class="btn soft block" data-act="demo" data-id="ind">${T('j_demo')}</button><button class="btn line block" data-act="demo" data-id="biz">${T('j_demo_biz')}</button></div>`},
report(s){if(s.done)return `<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('check','l')}</div><p>${T('rep_thanks')}</p><button class="btn block" style="margin-top:14px" data-act="sclose">${T('gotit')}</button></div>`;
 return `<h2 class="h2">${T('report')}</h2><p class="mut" style="margin:4px 0 12px">${T('rep_why')}</p><div class="stack">${['rr_spam','rr_scam','rr_off','rr_wrong','rr_other'].map(k=>`<button class="step ${s.r===k?'done':''}" data-act="rr" data-id="${k}"><span class="num">${s.r===k?ic('check','s'):''}</span><span class="tx" style="flex:1;text-decoration:none">${T(k)}</span></button>`).join('')}<button class="btn block" data-act="repsend" ${s.r?'':'disabled'}>${T('rep_send')}</button></div>`},
msg(s){return `<h2 class="h2">${esc(s.to)}</h2><div class="stack" style="margin-top:12px"><textarea id="mt" maxlength="300" aria-label="${T('send')}">${esc(s.pre||T('msg_ph'))}</textarea><button class="btn block" data-act="msgsend">${ic('send','s')}${T('send')}</button></div>`},
mcard(s){const b=S.dir.find(x=>x.id===s.id);return `<div style="text-align:center"><div class="card" style="background:linear-gradient(135deg,var(--gs),var(--card));border:2px solid var(--g)"><div class="mark" style="margin:0 auto 8px">${ic('island','l')}</div><h2 class="h2">${T('mcard_t')}</h2><div class="row" style="justify-content:center;margin:12px 0">${av('me',56)}<b>${esc(P.me.n)}</b></div><div class="pill">${offer(b)}</div></div><p class="mut sm" style="margin:12px 0">${T('mcard_d')}</p><button class="btn block" data-act="sclose">${T('close')}</button></div>`},
create(s){
 if(!s.type)return `<h2 class="h2" style="margin-bottom:12px">${T('cr_choose')}</h2><div class="grid2">${[['post','msg','cr_post'],['listing','bag','cr_listing'],['meetup','cal','cr_meetup'],['help','buoy','cr_help'],['clip','video','cr_clip']].map(t=>`<button class="mod" style="min-height:96px" data-act="crtype" data-id="${t[0]}"><span class="lf" style="${t[0]==='help'?'background:var(--rs);color:var(--r)':''}">${ic(t[1])}</span><b style="font-size:15px">${T(t[2])}</b></button>`).join('')}</div>`;
 const t=s.type,au=S.cr.aud;
 const f=({post:`<textarea id="c-x" placeholder="${T('cr_text')}" aria-label="${T('cr_text')}"></textarea>${MF()}`,help:`<textarea id="c-x" placeholder="${T('cr_text')}" aria-label="${T('cr_text')}"></textarea>${MF()}<p class="xs mut" style="margin-top:6px">${T('cr_help_note')}</p>`,
 listing:`${MF()}<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t"><label class="f" for="c-p">${T('cr_price')}</label><input id="c-p" type="number" inputmode="numeric" min="0"><label class="f" for="c-c">${T('nav_market')}</label><select id="c-c">${['home','garden','sport','books','free'].map(c=>`<option value="${c}">${T('mc_'+c)}</option>`).join('')}</select>`,
 meetup:`<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t"><label class="f" for="c-w">${T('cr_when')}</label><input id="c-w"><label class="f" for="c-r">${T('cr_where')}</label><input id="c-r">${MF()}`,
 clip:`${MF(1)}<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t"><div class="note g" style="margin-top:12px">${ic('video')}<div class="sm">${T('cr_clip_note')}</div></div>`})[t];
 return `<div class="row" style="margin-bottom:8px"><button class="ib" data-act="crback" aria-label="${T('back')}">${ic('left')}</button><h2 class="h2">${T(({post:'cr_post',listing:'cr_listing',meetup:'cr_meetup',help:'cr_help',clip:'cr_clip'})[t])}</h2></div>${f}<label class="f">${T('audience')}</label><div class="seg" id="aud">${['public','members','clubs'].map(a=>`<button class="${au===a?'on':''}" data-act="aud" data-id="${a}">${ic(audI[a],'s')}${T(audK[a])}</button>`).join('')}</div><button class="btn block" style="margin-top:16px" data-act="crpub">${T('cr_pub')}</button>`}
};

/* ---------- actions ---------- */
const val=id=>{const e=$('#'+id);return e?e.value.trim():''};
function gate(){if(isM())return false;openSheet({v:'join'});return true}
function startSignup(){S.sheet=null;renderSheet();S.su={step:1,type:'ind',dir:true};S.stack=[];push('signup')}
function become(type,name,area,biz,cat,dir){
 P.me.n=name||(type==='biz'?(biz||'Your Business'):'Demo member');P.me.i=(P.me.n[0]||'Y').toUpperCase();P.me.area=area||'Kyrenia';S.verified=false;
 if(type==='biz'){S.role='business';if(dir&&!S.dir.some(b=>b.id==='mine'))S.dir.push({id:'mine',n:biz||P.me.n,cat:cat||'home',area:P.me.area,off:'free_consult',x:36,y:71,ver:0,k:''})}else S.role='individual';
}
function grabSu(){const u=S.su,g=id=>{const e=$('#'+id);return e?e.value.trim():undefined};const n=g('su-n');if(n!==undefined)u.name=n;const a=g('su-a');if(a!==undefined)u.area=a;const b=g('su-b');if(b!==undefined)u.biz=b;const c=g('su-c');if(c!==undefined)u.cat=c}
const ACT={
noop(){},
tab(d){S.tab=d.id;S.stack=[];clearClip();renderOv();renderMain();renderTop();renderNav();window.scrollTo(0,0)},
push(d){push(d.v,{id:d.id})},pop,popall,
bell(){push('notifs');if(isM()&&S.unread){S.unread=0;renderTop()}},
sheet(d){openSheet({v:d.v})},sclose:closeSheet,
signup:startSignup,
demo(d){become(d.id==='biz'?'biz':'ind','','Kyrenia','Kyrenia Garden Care','home',true);closeSheet();render();toast(T('welcome'))},
like(d){if(gate())return;const k='p'+d.id;S.liked[k]=!S.liked[k];renderMain();renderOv(true)},
cmt(d){const k='p'+d.id;S.cmt[k]=!S.cmt[k];renderMain();renderOv(true)},
cmtsend(d){if(gate())return;const v=val('ci-'+d.id);if(!v)return;S.posts.find(p=>p.id==d.id).cm.push(['me',v]);renderMain();renderOv(true)},
share(){copy(location.origin+'/')},
invite(){copy(location.origin+'/')},
report(d){if(gate())return;openSheet({v:'report',kind:d.kind,id:d.id})},
rr(d){S.sheet.r=d.id;renderSheet()},repsend(){S.sheet.done=true;renderSheet()},
msg(d){if(gate())return;openSheet({v:'msg',to:d.to,pre:d.pre})},
msgsend(){closeSheet();toast(T('msg_sent'))},
mcard(d){if(gate())return;openSheet({v:'mcard',id:d.id})},
refresh(){toast(T('refreshed'))},
checkin(){if(S.today)return;S.today=true;S.streak++;renderMain();renderOv(true);toast(T('checkin_ok'))},
buddy(){closeSheet();toast(T('sos_buddy_ok'))},
copy(d){copy(d.t)},
footer(){S.footer=!S.footer;renderMain()},
notif(){S.notif=!S.notif;renderMain();renderOv(true)},
theme(d){S.theme=d.id;try{localStorage.setItem('inc_t',d.id)}catch(e){}applyTheme();renderMain();renderSheet()},
setlang(d){S.L=+d.id;try{localStorage.setItem('inc_l',d.id)}catch(e){}closeSheet();render()},
mcat(d){S.mcat=d.id;renderMain()},
dcat(d){S.dcat=d.id;S.dsel=null;renderOv(true)},dview(d){S.dview=d.id;renderOv(true)},dsel(d){S.dsel=d.id;renderOv(true)},
step(d){S.steps[d.id]=!S.steps[d.id];renderOv(true)},
save(d){if(gate())return;S.saved[d.id]=!S.saved[d.id];renderOv(true);renderMain();toast(S.saved[d.id]?T('g_saved'):T('g_save'))},
going(d){if(gate())return;S.going[d.id]=!S.going[d.id];renderOv(true)},
joinclub(d){if(gate())return;S.joined[d.id]=!S.joined[d.id];renderOv(true)},
joinmem(){if(gate())return;S.member=true;renderOv(true);renderMain();toast(T('mem_ok'))},
eq(d){if(gate())return;S.eq[d.id]=true;renderOv(true)},
check(d){S.checks[d.id]=!S.checks[d.id];renderOv(true)},
playclip(d){const v=$('#cv');if(!v)return;S.clip={id:d.id};const b=$('#cpb');if(b)b.hidden=true;const p=v.play();if(p&&p.catch)p.catch(()=>{S.clip=null;if(b)b.hidden=false})},
sq(d){const i=$('#sq');i.value=d.q;doSearch(d.q)},
appos(d){S.appos=d.id;renderOv(true)},
reset(){clearClip();Object.assign(S,{role:'visitor',today:false,streak:6,unread:3,verified:false,member:false,tab:'feed',stack:[],sheet:null});S.dir=DIR.slice();S.posts=POSTS.slice();S.listings=LISTINGS.slice();S.meetups=[];P.me.n='You';P.me.i='Y';render();window.scrollTo(0,0)},
sutype(d){S.su.type=d.id;renderOv(true)},
sudir(){grabSu();S.su.dir=!S.su.dir;renderOv(true)},
sunext(){const u=S.su;if(u.step===2){grabSu();become(u.type,u.name,u.area,u.biz,u.cat,u.dir);u.step=3;renderTop();renderMain();renderOv(false);return}u.step++;renderOv(false);$('#ov').scrollTop=0},
sudone(){popall();window.scrollTo(0,0)},
create(d){if(gate())return;S.cr={aud:'public'};openSheet({v:'create',type:d.type||null})},
crtype(d){S.sheet.type=d.id;S.cr.img='';S.cr.vid='';renderSheet()},crback(){S.sheet.type=null;renderSheet()},
aud(d){S.cr.aud=d.id;document.querySelectorAll('#aud button').forEach(b=>b.classList.toggle('on',b.dataset.id===d.id))},
crpub(){
 const t=S.sheet.type,id=Date.now(),au=S.cr.aud;
 if(t==='post'||t==='help'){const x=val('c-x');if(!x)return toast(T('cr_text'));S.posts.unshift({id,who:'me',m:0,aud:au,txt:x,likes:0,cm:[],help:t==='help',up:(S.cr.img||S.cr.vid)?{img:S.cr.img,vid:S.cr.vid}:null});S.tab='feed'}
 else if(t==='listing'){const x=val('c-t');if(!x)return toast(T('cr_title'));S.listings.unshift({id:'n'+id,t:x,price:+val('c-p')||0,cat:val('c-c')||'home',who:'me',area:P.me.area||'',ic:'tag',d:x,img:S.cr.img||'',vid:S.cr.vid||''});S.tab='market'}
 else if(t==='meetup'){const x=val('c-t');if(!x)return toast(T('cr_title'));S.meetups.unshift({id:'m'+id,ic:'users',t:[x,x,x,x],whenx:val('c-w'),where:val('c-r'),n:1,up:(S.cr.img||S.cr.vid)?{img:S.cr.img,vid:S.cr.vid}:null});S.tab='explore'}
 else if(t==='clip'){const x=val('c-t');if(!x)return toast(T('cr_title'));if(!S.cr.vid)return toast(T('cr_vid_pick'));S.clips.unshift({id:'n'+id,h:150,dur:S.cr.vdur||24,t:[x,x,x,x],by:'me',src:S.cr.vid});S.tab='explore'}
 closeSheet();S.stack=[];clearClip();render();window.scrollTo(0,0);toast(T('cr_done'));
}
};
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-act]');if(!el)return;
 const a=el.dataset.act;if(!ACT[a])return;
 if(el.tagName==='A'&&el.getAttribute('href')==='#')e.preventDefault();
 ACT[a](el.dataset,el,e);
});
document.addEventListener('change',e=>{if(e.target.id!=='c-m'||!S.cr)return;const f=e.target.files[0];if(!f)return;const pv=$('#c-pv');
 if(f.type.indexOf('video')===0){const u=URL.createObjectURL(f);S.cr.vid=u;S.cr.img='';const v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=()=>{S.cr.vdur=Math.min(30,Math.max(1,Math.round(v.duration||24)))};v.src=u;if(pv)pv.innerHTML='<video src="'+u+'" controls muted playsinline style="width:100%;max-height:200px;border-radius:14px"></video>';return}
 const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,720/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);S.cr.img=c.toDataURL('image/jpeg',.8);S.cr.vid='';if(pv)pv.innerHTML='<img src="'+S.cr.img+'" alt="" style="width:100%;max-height:180px;object-fit:cover;border-radius:14px">'};im.src=r.result};r.readAsDataURL(f)});
document.addEventListener('scroll',e=>{const g=e.target;if(g&&g.classList&&g.classList.contains('gal')){const i=Math.round(g.scrollLeft/g.clientWidth)+1,c=g.parentNode.querySelector('.gc');if(c)c.textContent=i+'/'+g.children.length}},true);
document.addEventListener('input',e=>{if(e.target.id==='sq')doSearch(e.target.value)});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(S.sheet)closeSheet();else if(S.stack.length)pop()});
document.addEventListener('change',e=>{if(e.target.id!=='c-pf')return;const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const n=240,m=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=n;c.getContext('2d').drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,n,n);savePhoto(c.toDataURL('image/jpeg',.82))};im.src=r.result};r.readAsDataURL(f)});
