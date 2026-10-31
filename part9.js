
/* ---------- your alerts: phone alerts + email report, on by default ---------- */
N({
 al_t:["Your alerts","Bildirimleriniz","Twoje powiadomienia","Ваши уведомления"],
 al_d:["Phone alerts and your email report. Both are on unless you switch them off.","Telefon bildirimleri ve e-posta raporunuz. Siz kapatmadıkça ikisi de açıktır.","Powiadomienia na telefonie i raport e-mail. Oba są włączone, dopóki ich nie wyłączysz.","Уведомления на телефоне и отчёт по почте. Оба включены, пока вы их не отключите."],
 al_ph:["Phone alerts","Telefon bildirimleri","Powiadomienia na telefonie","Уведомления на телефоне"],
 al_phd:["A short alert for messages, replies and friend requests.","Mesajlar, yanıtlar ve arkadaşlık istekleri için kısa bildirim.","Krótkie powiadomienie o wiadomościach, odpowiedziach i zaproszeniach.","Короткое уведомление о сообщениях, ответах и заявках в друзья."],
 al_em:["Email report","E-posta raporu","Raport e-mail","Отчёт по почте"],
 al_emd:["Up to 3 times a day, only when there is something new.","Günde en fazla 3 kez, yalnızca yeni bir şey olduğunda.","Do 3 razy dziennie, tylko gdy jest coś nowego.","До 3 раз в день, только если есть что-то новое."],
 al_need:["One more step on this phone: tap Allow when asked.","Bu telefonda bir adım daha: istendiğinde İzin Ver'e dokunun.","Jeszcze jeden krok na tym telefonie: dotknij Zezwól, gdy zostaniesz poproszony.","Ещё один шаг на этом телефоне: нажмите «Разрешить», когда появится запрос."],
 al_fin:["Finish on this phone","Bu telefonda tamamla","Dokończ na tym telefonie","Завершить на этом телефоне"],
 al_how:["How to switch alerts on for your phone","Telefonunuzda bildirimleri nasıl açarsınız","Jak włączyć powiadomienia na telefonie","Как включить уведомления на телефоне"],
 al_i1:["Open ncyprusconnect.com in Safari (iOS 16.4 or newer)","ncyprusconnect.com adresini Safari'de açın (iOS 16.4 veya üstü)","Otwórz ncyprusconnect.com w Safari (iOS 16.4 lub nowszy)","Откройте ncyprusconnect.com в Safari (iOS 16.4 или новее)"],
 al_i2:["Tap Share, then Add to Home Screen, then Add","Paylaş, sonra Ana Ekrana Ekle, sonra Ekle'ye dokunun","Dotknij Udostępnij, potem Do ekranu początkowego, potem Dodaj","Нажмите «Поделиться», затем «На экран “Домой”», затем «Добавить»"],
 al_i3:["Open the app from your Home Screen, tap the bell, then Finish on this phone and tap Allow","Uygulamayı Ana Ekrandan açın, zile dokunun, sonra Bu telefonda tamamla'ya ve İzin Ver'e dokunun","Otwórz aplikację z ekranu głównego, dotknij dzwonka, potem Dokończ na tym telefonie i Zezwól","Откройте приложение с экрана «Домой», нажмите на колокольчик, затем «Завершить на этом телефоне» и «Разрешить»"],
 al_a1:["Open ncyprusconnect.com in Chrome and sign in","ncyprusconnect.com adresini Chrome'da açıp giriş yapın","Otwórz ncyprusconnect.com w Chrome i zaloguj się","Откройте ncyprusconnect.com в Chrome и войдите"],
 al_a2:["Tap the bell, then Finish on this phone","Zile, sonra Bu telefonda tamamla'ya dokunun","Dotknij dzwonka, potem Dokończ na tym telefonie","Нажмите на колокольчик, затем «Завершить на этом телефоне»"],
 al_a3:["Tap Allow. If you tapped Block by mistake, tap the lock icon by the address, then Permissions, then Notifications, then Allow","İzin Ver'e dokunun. Yanlışlıkla Engelle'ye dokunduysanız adres yanındaki kilide, sonra İzinler, Bildirimler, İzin Ver'e dokunun","Dotknij Zezwól. Jeśli przez pomyłkę wybrano Blokuj, dotknij kłódki przy adresie, potem Uprawnienia, Powiadomienia, Zezwól","Нажмите «Разрешить». Если случайно нажали «Блокировать», нажмите на замок у адреса, затем «Разрешения», «Уведомления», «Разрешить»"],
 al_ios:["iPhone","iPhone","iPhone","iPhone"],al_and:["Android","Android","Android","Android"],
 al_sv:["Saved","Kaydedildi","Zapisano","Сохранено"]
});
const alPush=()=>!S.prof||S.prof.notify_push!==false;
const alMail=()=>!S.prof||S.prof.notify_email!==false;
const alPerm=()=>{try{return pushOk()?Notification.permission:'none'}catch(e){return 'none'}};
const alNeed=()=>alPush()&&pushOk()&&!S.pushOn&&alPerm()!=='denied'&&!(isIos()&&!isStandalone());
function alertsCard(){
 if(!S.uid||!S.prof)return '';
 return `<button class="card row" style="width:100%;border:0;text-align:left" data-act="alerts"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('bell')}</span><div class="grow"><b>${T('al_t')}</b><div class="xs mut">${T('al_d')}</div><div class="xs" style="margin-top:4px;font-weight:700;color:var(--gd)">${ic('phone2','s')} ${alPush()?'On':'Off'} &nbsp; ${ic('msg','s')} ${alMail()?'On':'Off'}</div></div>${ic('right')}</button>`;
}
SH.alerts=s=>{
 const ios=S.appos?S.appos==='ios':isIos();
 const sw=(act,on,t,d)=>`<div class="row" style="gap:12px"><div class="grow"><b>${T(t)}</b><div class="xs mut">${T(d)}</div></div><button class="tg ${on?'on':''}" role="switch" aria-checked="${on}" data-act="${act}" aria-label="${T(t)}"><i></i></button></div>`;
 return `<div class="row"><span class="lf" style="background:var(--gs);color:var(--gd)">${ic('bell','l')}</span><div><h2 class="h2">${T('al_t')}</h2><div class="sm mut">${T('al_d')}</div></div></div>
 <div class="stack" style="margin-top:12px">
 <div class="card stack">${sw('alpush',alPush(),'al_ph','al_phd')}${alNeed()?`<div class="note g"><div class="sm">${T('al_need')}</div></div><button class="btn block" data-act="pushon">${ic('bell','s')}${T('al_fin')}</button>`:''}${alPush()&&S.pushOn?`<div class="sm">${ic('check','s')} ${T('pu_is')}</div>`:''}</div>
 <div class="card stack">${sw('alemail',alMail(),'al_em','al_emd')}</div>
 <div class="card stack"><b>${T('al_how')}</b>
 <div class="seg"><button class="${ios?'on':''}" data-act="alos" data-id="ios">${T('al_ios')}</button><button class="${ios?'':'on'}" data-act="alos" data-id="and">${T('al_and')}</button></div>
 ${(ios?['al_i1','al_i2','al_i3']:['al_a1','al_a2','al_a3']).map((k,i)=>`<div class="step"><span class="num">${i+1}</span><span style="flex:1">${T(k)}</span></div>`).join('')}</div>
 </div>`;
};
ACT.alerts=()=>openSheet({v:'alerts'});
ACT.alos=d=>{S.appos=d.id;try{renderSheet?renderSheet():openSheet({v:'alerts'})}catch(e){openSheet({v:'alerts'})}};
async function alSave(f,v){
 const r=await sb.from('profiles').update({[f]:v}).eq('id',S.uid);
 if(r.error){toast(String(r.error.message).slice(0,100));return false}
 S.prof[f]=v;return true;
}
ACT.alpush=async()=>{
 const v=!alPush();
 if(!(await alSave('notify_push',v)))return;
 if(!v){try{await ACT.pushoff()}catch(e){}}
 else if(alNeed()){ /* needs a tap on Allow: the Finish button shows */ }
 openSheet({v:'alerts'});
};
ACT.alemail=async()=>{if(await alSave('notify_email',!alMail()))openSheet({v:'alerts'})};
/* quietly re-attach this phone when permission was already given */
async function alAuto(){
 try{
  if(!S.uid||!S.prof||!alPush()||!pushOk()||Notification.permission!=='granted')return;
  await refreshPush();if(S.pushOn)return;
  const reg=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
  let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID_PUB)});
  const j=sub.toJSON();
  await sb.from('push_subscriptions').upsert({user_id:S.uid,endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth},{onConflict:'endpoint'});
  S.pushOn=true;
 }catch(e){}
}
setTimeout(function t(){if(S.uid&&S.prof)alAuto();else setTimeout(t,2500)},3000);
/* put the card on the profile page and the bell screen */
(function(){
 const o=V.notifs;V.notifs=function(){const r=o();if(S.uid&&S.prof){r.b=r.b.replace('<div class="stack">','<div class="stack">'+alertsCard()+(alNeed()?`<button class="btn block" data-act="pushon">${ic('bell','s')}${T('al_fin')}</button>`:''))}return r};
})();

pushCard=function(){return ''};
(function(){const o=ACT.pushon;ACT.pushon=async function(){await o.apply(this,arguments);try{if(S.stack&&S.sheet)openSheet({v:'alerts'})}catch(e){}}})();
