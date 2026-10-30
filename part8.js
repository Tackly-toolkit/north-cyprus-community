/* ================= part 8: invite a friend (members only) ================= */
N({
 inv_t:["Invite a friend","Bir arkadaşını davet et","Zaproś znajomego","Пригласить друга"],
 inv_d:["Send your friends a link. Use WhatsApp, a text message, Facebook or any app you like. They join straight away, no waiting.","Arkadaşlarına bir bağlantı gönder. WhatsApp, kısa mesaj, Facebook ya da istediğin uygulamayı kullan. Beklemeden hemen katılırlar.","Wyślij znajomym link. Użyj WhatsApp, SMS-a, Facebooka lub dowolnej aplikacji. Dołączają od razu, bez czekania.","Отправьте друзьям ссылку через WhatsApp, SMS, Facebook или любое приложение. Они присоединяются сразу, без ожидания."],
 inv_msg:["Hi! I am on North Cyprus Community, a free place to meet people, find help and get everything about North Cyprus in one place. Come and join me:","Merhaba! Kuzey Kıbrıs Topluluğu'ndayım; insanlarla tanışabileceğin, yardım bulabileceğin ve Kuzey Kıbrıs ile ilgili her şeyi tek yerde bulabileceğin ücretsiz bir platform. Sen de bana katıl:","Cześć! Jestem w North Cyprus Community, darmowym miejscu, gdzie poznasz ludzi, znajdziesz pomoc i wszystko o Cyprze Północnym w jednym miejscu. Dołącz do mnie:","Привет! Я в North Cyprus Community — бесплатном месте, где можно знакомиться, находить помощь и всё о Северном Кипре в одном месте. Присоединяйтесь ко мне:"],
 inv_n:["Friends you have invited: {n}","Davet ettiğin arkadaşlar: {n}","Zaproszeni znajomi: {n}","Приглашено друзей: {n}"],
 inv_pick:["Choose how to send it","Nasıl göndereceğini seç","Wybierz, jak wysłać","Выберите, как отправить"],
 inv_wa:["WhatsApp","WhatsApp","WhatsApp","WhatsApp"],
 inv_sms:["Text message","Kısa mesaj","SMS","SMS"],
 inv_fb:["Facebook","Facebook","Facebook","Facebook"],
 inv_tg:["Telegram","Telegram","Telegram","Telegram"],
 inv_em:["Email","E-posta","E-mail","Эл. почта"],
 inv_copy:["Copy link","Bağlantıyı kopyala","Kopiuj link","Копировать ссылку"],
 inv_sub:["Join me on North Cyprus Community","Kuzey Kıbrıs Topluluğu'nda bana katıl","Dołącz do mnie w North Cyprus Community","Присоединяйтесь ко мне в North Cyprus Community"]
});
/* keep the referral from an invite link until sign-up */
function refSave(){try{const r=new URLSearchParams(location.search).get('ref');if(r&&/^[a-z0-9]{4,16}$/i.test(r))localStorage.setItem('nc_ref',r.toLowerCase())}catch(e){}}
function refGet(){try{return localStorage.getItem('nc_ref')||''}catch(e){return ''}}
refSave();
const invMember=()=>!!(S.uid&&S.prof&&S.prof.ref_code);
const invUrl=()=>location.origin+'/?ref='+encodeURIComponent(S.prof.ref_code);
const invTxt=()=>T('inv_msg');
function loadInvN(){
 if(S.invn!==undefined||S.invnBusy||!S.uid)return;S.invnBusy=true;
 sb.rpc('my_invited_count').then(r=>{S.invnBusy=false;if(r&&typeof r.data==='number'){S.invn=r.data;const e=document.getElementById('invn');if(e)e.textContent=F('inv_n',{n:S.invn})}},()=>{S.invnBusy=false});
}
/* profile card (members only) */
function invCard(){
 if(!invMember())return '';
 loadInvN();
 return `<button class="card row" style="width:100%;border:0;text-align:left" data-act="invite"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('share')}</span><div class="grow"><b>${T('inv_t')}</b><div class="xs mut">${T('inv_d')}</div><div class="xs" style="margin-top:4px;font-weight:700;color:var(--gd)" id="invn">${S.invn!==undefined?F('inv_n',{n:S.invn}):''}</div></div>${ic('right')}</button>`;
}
SH.invite=s=>{
 const u=invMember()?invUrl():location.origin+'/',t=invTxt(),both=t+' '+u,e=encodeURIComponent;
 const L=(href,ico,key)=>`<a class="btn soft block" style="justify-content:flex-start;gap:10px" href="${href}" target="_blank" rel="noopener">${ic(ico,'s')}${T(key)}</a>`;
 return `<div class="row"><span class="lf" style="background:var(--gs);color:var(--gd)">${ic('share','l')}</span><div><h2 class="h2">${T('inv_t')}</h2><div class="sm mut">${T('inv_pick')}</div></div></div>
 <div class="stack" style="margin-top:12px">${L('https://wa.me/?text='+e(both),'msg','inv_wa')}${L('sms:?&body='+e(both),'msg','inv_sms')}${L('https://www.facebook.com/sharer/sharer.php?u='+e(u)+'&quote='+e(t),'users','inv_fb')}${L('https://t.me/share/url?url='+e(u)+'&text='+e(t),'msg','inv_tg')}${L('mailto:?subject='+e(T('inv_sub'))+'&body='+e(both),'msg','inv_em')}
 <button class="btn line block" data-act="invcopy">${ic('copy','s')||''}${T('inv_copy')}</button><div class="xs mut" style="overflow-wrap:anywhere;text-align:center">${esc(u)}</div></div>`;
};
ACT.invcopy=()=>{if(invMember())copy(invUrl())};
ACT.invite=()=>{
 if(!invMember())return;
 const d={title:T('inv_sub'),text:invTxt(),url:invUrl()};
 if(navigator.share){navigator.share(d).catch(()=>{});return}
 openSheet({v:'invite'});
};
/* admin: who invited whom */
const _admLoad8=admLoad;
admLoad=async function(sec,x){
 const r=await _admLoad8.apply(this,arguments);
 if(sec==='members'||sec==='member'){try{const q=await sb.rpc('admin_inviters');const mp={};(q.data||[]).forEach(z=>{if(z.by_name)mp[z.id]=z.by_name});ADM.invby=mp}catch(e){ADM.invby={}}}
 return r;
};
