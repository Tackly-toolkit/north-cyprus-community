/* ================= part 7: "Spotted a fault?" and "Got an idea?" (members only) ================= */
N({
 fb_flt_t:["Spotted a fault or a mistake?","Bir hata mı gördünüz?","Zauważyłeś błąd lub usterkę?","Заметили ошибку или сбой?"],
 fb_flt_d:["If something is not working, or you have seen a mistake, please tell us. We can only improve with your help.","Çalışmayan bir şey ya da bir yanlışlık gördüyseniz lütfen bize bildirin. Ancak sizin yardımınızla gelişebiliriz.","Jeśli coś nie działa lub zauważyłeś pomyłkę, daj nam znać. Możemy się poprawiać tylko dzięki Twojej pomocy.","Если что-то не работает или вы заметили ошибку, пожалуйста, сообщите нам. Мы можем стать лучше только с вашей помощью."],
 fb_flt_ph:["What happened? What were you doing when you saw it?","Ne oldu? Gördüğünüzde ne yapıyordunuz?","Co się stało? Co robiłeś, gdy to zauważyłeś?","Что произошло? Что вы делали, когда это заметили?"],
 fb_shots:["Screenshots (up to 4, optional)","Ekran görüntüleri (en fazla 4, isteğe bağlı)","Zrzuty ekranu (do 4, opcjonalnie)","Скриншоты (до 4, по желанию)"],
 fb_idea_t:["What would you like to see?","Neler görmek istersiniz?","Co chciałbyś zobaczyć?","Что бы вы хотели увидеть?"],
 fb_idea_d:["What improvements, or what additions, would make this more fun and better between you and your friends? We are open to any ideas and always welcome new ones. It is exciting to hear how we can make the community even better for you and your friends.","Hangi iyileştirmeler ya da eklemeler burayı sizin ve arkadaşlarınız arasında daha eğlenceli ve daha iyi yapar? Her fikre açığız ve yenilerini her zaman memnuniyetle karşılarız. Topluluğu sizin ve arkadaşlarınız için nasıl daha da iyi yapabileceğimizi duymak çok heyecan verici.","Jakie ulepszenia lub dodatki sprawiłyby, że będzie tu zabawniej i lepiej dla Ciebie i Twoich znajomych? Jesteśmy otwarci na każdy pomysł i zawsze chętnie słuchamy nowych. Ekscytuje nas, jak jeszcze możemy ulepszyć społeczność dla Ciebie i Twoich znajomych.","Какие улучшения или дополнения сделают это место веселее и лучше для вас и ваших друзей? Мы открыты для любых идей и всегда рады новым. Нам интересно узнать, как сделать сообщество ещё лучше для вас и ваших друзей."],
 fb_idea_ph:["Tell us what you would like to see...","Görmek istediklerinizi bize anlatın...","Napisz, co chciałbyś zobaczyć...","Расскажите, что бы вы хотели увидеть..."],
 fb_flt_ok:["Thank you. We have your report and will look into it.","Teşekkürler. Bildiriminiz bize ulaştı, inceleyeceğiz.","Dziękujemy. Otrzymaliśmy zgłoszenie i je sprawdzimy.","Спасибо. Мы получили ваше сообщение и разберёмся."],
 fb_idea_ok:["Thank you for your idea. We read every one and will make it happen the best way to suit everyone.","Fikriniz için teşekkürler. Hepsini okuyoruz ve herkese uygun en iyi şekilde hayata geçireceğiz.","Dziękujemy za pomysł. Czytamy każdy i wprowadzimy go w życie w sposób najlepszy dla wszystkich.","Спасибо за идею. Мы читаем каждую и воплотим её так, чтобы было лучше для всех."],
 fb_short:["Please write a little more.","Lütfen biraz daha yazın.","Napisz proszę trochę więcej.","Пожалуйста, напишите чуть подробнее."],
 fb_f_flt:["Report a fault","Hata bildir","Zgłoś błąd","Сообщить об ошибке"],
 fb_f_idea:["Share an idea","Fikir paylaş","Podziel się pomysłem","Поделиться идеей"]
});
S.fb={imgs:[],busy:false};
function fbPage(){try{const t=S.stack&&S.stack.length?S.stack[S.stack.length-1]:null;return (t&&t.v)?String(t.v):String(S.tab||'')}catch(e){return ''}}
function fbDevice(){try{return (navigator.userAgent||'').slice(0,140)+' | '+screen.width+'x'+screen.height}catch(e){return ''}}
SH.fault=s=>{
 if(s.done)return `<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('check','l')}</div><p>${T('fb_flt_ok')}</p><button class="btn block" style="margin-top:14px" data-act="sclose">${T('gotit')}</button></div>`;
 return `<div class="row"><span class="lf" style="background:var(--rs);color:var(--r)">${ic('tool','l')}</span><div><h2 class="h2">${T('fb_flt_t')}</h2><div class="sm mut">${T('fb_flt_d')}</div></div></div><div class="stack" style="margin-top:12px"><textarea id="fb-t" maxlength="2000" placeholder="${esc(T('fb_flt_ph'))}" aria-label="${esc(T('fb_flt_ph'))}" style="min-height:120px"></textarea><label class="f" for="fb-m">${T('fb_shots')}</label><input id="fb-m" type="file" accept="image/*" multiple><div id="fb-pv" style="display:flex;gap:8px;flex-wrap:wrap"></div><button class="btn block" data-act="fbsend" data-k="fault">${ic('send','s')}${T('send')}</button></div>`;
};
SH.idea=s=>{
 if(s.done)return `<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('check','l')}</div><p>${T('fb_idea_ok')}</p><button class="btn block" style="margin-top:14px" data-act="sclose">${T('gotit')}</button></div>`;
 return `<div class="row"><span class="lf" style="background:var(--gs);color:var(--gd)">${ic('zap','l')}</span><div><h2 class="h2">${T('fb_idea_t')}</h2><div class="sm mut">${T('fb_idea_d')}</div></div></div><div class="stack" style="margin-top:12px"><textarea id="fb-t" maxlength="2000" placeholder="${esc(T('fb_idea_ph'))}" aria-label="${esc(T('fb_idea_ph'))}" style="min-height:140px"></textarea><button class="btn block" data-act="fbsend" data-k="idea">${ic('send','s')}${T('send')}</button></div>`;
};
ACT.faultopen=()=>{if(!S.uid)return ACT.signup&&ACT.signup({});S.fb={imgs:[],busy:false,page:fbPage()};openSheet({v:'fault'})};
ACT.ideaopen=()=>{if(!S.uid)return ACT.signup&&ACT.signup({});S.fb={imgs:[],busy:false,page:fbPage()};openSheet({v:'idea'})};
document.addEventListener('change',async e=>{
 if(e.target.id!=='fb-m')return;
 const files=[...e.target.files].slice(0,4),out=[];
 for(const f of files){const d=await readImg(f);if(d)out.push(d)}
 S.fb.imgs=out;
 const pv=$('#fb-pv');if(pv)pv.innerHTML=out.map(u=>`<img src="${u}" alt="" style="width:76px;height:76px;object-fit:cover;border-radius:12px">`).join('');
});
ACT.fbsend=async d=>{
 const k=d.k==='idea'?'idea':'fault';
 if(S.fb.busy)return;
 const body=val('fb-t');if(body.length<3)return toast(T('fb_short'));
 S.fb.busy=true;const btn=document.querySelector('[data-act="fbsend"]');if(btn)btn.disabled=true;
 try{
  const urls=[];if(k==='fault')for(const x of (S.fb.imgs||[]))urls.push(await uploadDataUrl(x,'fault'));
  const {error}=await sb.from('feedback').insert({kind:k,body,page:S.fb.page||fbPage(),device:fbDevice(),lang:LANGS[S.L],images:urls,member:S.uid});
  if(error)throw error;
  S.sheet={v:k==='idea'?'idea':'fault',done:true};renderSheet();
 }catch(e){toast(e.message||'Something went wrong')}
 S.fb.busy=false;if(btn)btn.disabled=false;
};

/* ---------- admin: Faults and Ideas ---------- */
const _admLoad7=admLoad;
admLoad=async function(sec,x){
 if(sec==='faults'||sec==='ideas'){
  const kind=sec==='faults'?'fault':'idea';
  const r=await aok(sb.from('feedback').select('*').eq('kind',kind).order('created_at',{ascending:false}).limit(200));
  r.sort((a,b)=>(a.status==='done')-(b.status==='done'));
  ADM[sec]=r;await loadPeople(r.map(z=>z.member));return;
 }
 return _admLoad7.apply(this,arguments);
};
function fbCards(rows,kind){
 if(!rows.length)return `<div class="card" style="text-align:center"><p class="mut">${kind==='fault'?'No faults reported.':'No ideas yet.'}</p></div>`;
 return rows.map(r=>`<div class="card stack" style="${r.status==='done'?'opacity:.55':''}">
 <div class="row"><b class="grow">${esc((P[r.member]||{}).n||'Member')}</b><span class="pill ${r.status==='new'?'red':''}">${r.status==='new'?'New':r.status==='seen'?'Seen':'Done'}</span></div>
 <div class="xs mut">${aTime(r.created_at)}${r.lang?' · '+esc(r.lang.toUpperCase()):''}</div>
 <div style="overflow-wrap:anywhere;white-space:pre-wrap">${U(r.body)}</div>
 ${kind==='fault'?`<div class="xs mut" style="overflow-wrap:anywhere">Page: ${esc(r.page||'not given')}<br>Device: ${esc(r.device||'not given')}</div>`:''}
 ${(r.images||[]).length?`<div style="display:flex;gap:8px;flex-wrap:wrap">${r.images.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Screenshot" style="width:96px;height:96px;object-fit:cover;border-radius:12px"></a>`).join('')}</div>`:''}
 <div class="row" style="flex-wrap:wrap">${r.status==='new'?aBtn('afb',`data-id="${r.id}" data-s="seen" data-sec="${kind==='fault'?'faults':'ideas'}"`,'Mark seen','line'):''}${r.status!=='done'?aBtn('afb',`data-id="${r.id}" data-s="done" data-sec="${kind==='fault'?'faults':'ideas'}"`,'Done'):''}${aBtn('admgo',`data-sec="member" data-x="${r.member}"`,'Open member','line')}</div></div>`).join('');
}
V.adm_faults=function(){return {t:'Faults and mistakes',b:`<div class="stack"><p class="sm mut">Members who spotted something wrong. Screenshots open in full when tapped.</p>${fbCards(ADM.faults||[],'fault')}</div>`}};
V.adm_ideas=function(){return {t:'Ideas',b:`<div class="stack"><p class="sm mut">What members would like to see on the platform.</p>${fbCards(ADM.ideas||[],'idea')}</div>`}};
ACT.afb=async d=>{await aok(sb.from('feedback').update({status:d.s}).eq('id',d.id));aLog('feedback_'+d.s,{id:d.id});admReload()};
