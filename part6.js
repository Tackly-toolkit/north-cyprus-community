/* ================= part 6: marketplace rules, safety, block/mute, two-step login ================= */
N({
 mw_t:["The Marketplace opens for you on {d}","Pazar yeri sizin için {d} tarihinde açılıyor","Rynek otworzy się dla Ciebie {d}","Рынок откроется для вас {d}"],
 mw_d:["To keep the Marketplace for real neighbours and friends, new members can post listings once their account is {n} days old. This stops people from signing up only to fill it with things to sell.","Pazar yerini gerçek komşu ve arkadaşlara ayırmak için yeni üyeler hesapları {n} günlük olduktan sonra ilan verebilir. Böylece yalnızca satış için kayıt olanlar engellenir.","Aby Rynek służył prawdziwym sąsiadom i znajomym, nowi członkowie mogą dodawać ogłoszenia, gdy ich konto ma {n} dni. To chroni przed osobami, które zapisują się tylko po to, by sprzedawać.","Чтобы рынок оставался для настоящих соседей и друзей, новые участники могут публиковать объявления, когда их аккаунту исполнится {n} дн. Так мы защищаем сообщество от массовых продаж."],
 mw_now:["Until then you can still:","Bu arada şunları yapabilirsiniz:","W międzyczasie możesz:","А пока вы можете:"],
 mw_do1:["Browse the Marketplace and message sellers","Pazar yerine göz atın ve satıcılara yazın","Przeglądać Rynek i pisać do sprzedających","Смотреть рынок и писать продавцам"],
 mw_do2:["Post in the feed and join clubs","Akışta paylaşın ve kulüplere katılın","Pisać w aktualnościach i dołączać do klubów","Писать в ленте и вступать в клубы"],
 mw_do3:["Add friends and read the guides","Arkadaş ekleyin ve rehberleri okuyun","Dodawać znajomych i czytać poradniki","Добавлять друзей и читать руководства"],
 mw_rules:["Read the Marketplace rules","Pazar yeri kurallarını okuyun","Przeczytaj zasady Rynku","Прочитать правила рынка"],
 mw_ok:["Got it","Anladım","Rozumiem","Понятно"],
 mc_t:["You have reached the limit for new members","Yeni üyeler için sınıra ulaştınız","Osiągnięto limit dla nowych członków","Вы достигли лимита для новых участников"],
 mc_d:["New members can have up to {n} active listings. Mark one as sold or remove one to add another, or wait until your account is a little older.","Yeni üyelerin en fazla {n} aktif ilanı olabilir. Yenisini eklemek için birini satıldı olarak işaretleyin ya da kaldırın, veya hesabınız biraz eskiyene kadar bekleyin.","Nowi członkowie mogą mieć do {n} aktywnych ogłoszeń. Oznacz jedno jako sprzedane lub usuń, aby dodać kolejne, albo poczekaj, aż konto będzie starsze.","Новые участники могут иметь до {n} активных объявлений. Отметьте одно как проданное или удалите его, чтобы добавить новое, или подождите, пока аккаунт станет старше."],
 cr_held:["Thank you. Your listing is being checked by a person and will appear soon.","Teşekkürler. İlanınız bir kişi tarafından kontrol ediliyor ve yakında yayınlanacak.","Dziękujemy. Ogłoszenie sprawdza człowiek i wkrótce się pojawi.","Спасибо. Объявление проверяет человек, и скоро оно появится."],
 sf_t:["Staying safe","Güvende kalmak","Bezpieczeństwo","Безопасность"],
 sf_short_t:["Stay safe.","Güvende kalın.","Bądź bezpieczny.","Будьте осторожны."],
 sf_short:["See things in person before you pay, never pay in advance, and meet in a public place.","Ödemeden önce ürünü yüz yüze görün, peşin ödemeyin ve herkesin içinde buluşun.","Obejrzyj rzecz osobiście przed zapłatą, nie płać z góry i spotykaj się w publicznym miejscu.","Смотрите вещь лично до оплаты, не платите вперёд и встречайтесь в людном месте."],
 sf_read:["Read the safety guide","Güvenlik rehberini okuyun","Przeczytaj poradnik","Прочитать руководство"],
 sf_intro:["Most deals between neighbours go well. These simple habits keep it that way.","Komşular arasındaki çoğu alışveriş sorunsuz geçer. Bu basit alışkanlıklar böyle kalmasını sağlar.","Większość transakcji między sąsiadami przebiega dobrze. Te proste nawyki to utrzymają.","Большинство сделок между соседями проходят хорошо. Эти простые привычки помогают так и оставаться."],
 sf1_t:["Before you buy","Satın almadan önce","Zanim kupisz","Перед покупкой"],
 sf1:["See the item in person and check it works.|Ask for more photos if you are not sure.|Look at the seller's profile and how long they have been a member.|Compare the price with similar items.","Ürünü yüz yüze görün ve çalıştığını kontrol edin.|Emin değilseniz daha fazla fotoğraf isteyin.|Satıcının profiline ve ne zamandır üye olduğuna bakın.|Fiyatı benzer ürünlerle karşılaştırın.","Obejrzyj rzecz osobiście i sprawdź, czy działa.|Poproś o więcej zdjęć, jeśli masz wątpliwości.|Sprawdź profil sprzedającego i jak długo jest członkiem.|Porównaj cenę z podobnymi ofertami.","Посмотрите вещь лично и проверьте, что она работает.|Попросите больше фото, если сомневаетесь.|Посмотрите профиль продавца и как давно он в сообществе.|Сравните цену с похожими предложениями."],
 sf2_t:["Warning signs","Uyarı işaretleri","Znaki ostrzegawcze","Тревожные признаки"],
 sf2:["Someone asks for a deposit or payment before you have seen the item or property.|They ask for gift cards, crypto or a money transfer.|They rush you or say someone else is about to buy.|They want to move the chat to another app straight away.|The price is far too good to be true.|A link asks you to log in or enter card details.","Ürünü veya mülkü görmeden depozito ya da ödeme isteniyor.|Hediye kartı, kripto ya da havale isteniyor.|Sizi acele ettiriyor veya başkasının almak üzere olduğunu söylüyor.|Sohbeti hemen başka bir uygulamaya taşımak istiyor.|Fiyat gerçek olamayacak kadar iyi.|Bir bağlantı giriş yapmanızı veya kart bilgisi girmenizi istiyor.","Ktoś prosi o zaliczkę lub zapłatę, zanim zobaczysz rzecz lub nieruchomość.|Proszą o karty podarunkowe, kryptowaluty lub przelew.|Popędzają Cię albo mówią, że ktoś inny zaraz kupi.|Chcą od razu przenieść rozmowę do innej aplikacji.|Cena jest zbyt dobra, by była prawdziwa.|Link prosi o zalogowanie lub dane karty.","Просят залог или оплату до того, как вы увидели вещь или недвижимость.|Просят подарочные карты, криптовалюту или перевод денег.|Торопят вас или говорят, что кто-то уже покупает.|Сразу хотят перейти в другой мессенджер.|Цена слишком хороша, чтобы быть правдой.|Ссылка просит войти или ввести данные карты."],
 sf3_t:["Never","Asla","Nigdy","Никогда"],
 sf3:["Never send money to someone you have not met for something you have not seen.|Never share card details, passwords or codes sent to your phone.|Never pay a holding fee, customs fee or release fee to a stranger.|Never click links in messages that ask you to log in or pay.","Tanımadığınız birine, görmediğiniz bir şey için asla para göndermeyin.|Kart bilgilerinizi, şifrelerinizi veya telefonunuza gelen kodları asla paylaşmayın.|Bir yabancıya asla tutma, gümrük veya serbest bırakma ücreti ödemeyin.|Giriş yapmanızı veya ödeme yapmanızı isteyen mesajlardaki bağlantılara asla tıklamayın.","Nigdy nie wysyłaj pieniędzy komuś, kogo nie poznałeś, za coś, czego nie widziałeś.|Nigdy nie podawaj danych karty, haseł ani kodów z telefonu.|Nigdy nie płać obcym opłaty rezerwacyjnej, celnej ani za wydanie.|Nigdy nie klikaj linków w wiadomościach, które każą się zalogować lub zapłacić.","Никогда не отправляйте деньги тому, с кем не встречались, за то, чего не видели.|Никогда не сообщайте данные карты, пароли и коды из СМС.|Никогда не платите незнакомцам сборы за удержание, таможню или выдачу.|Никогда не переходите по ссылкам в сообщениях с просьбой войти или оплатить."],
 sf4_t:["Meeting and property","Buluşma ve mülk","Spotkanie i nieruchomość","Встреча и недвижимость"],
 sf4:["Meet in a busy public place in daylight and bring a friend if you can.|Tell someone where you are going.|For property, view it in person and have a lawyer check the title deed before you pay anything.","Gün ışığında kalabalık, herkese açık bir yerde buluşun, mümkünse bir arkadaşınızı getirin.|Nereye gittiğinizi birine söyleyin.|Mülk için yerinde görün ve herhangi bir ödeme yapmadan önce tapuyu bir avukata kontrol ettirin.","Spotykaj się w ruchliwym, publicznym miejscu za dnia i weź znajomego, jeśli możesz.|Powiedz komuś, dokąd idziesz.|Nieruchomość obejrzyj osobiście i zanim cokolwiek zapłacisz, zleć prawnikowi sprawdzenie aktu własności.","Встречайтесь в людном месте днём и по возможности возьмите друга.|Скажите кому-нибудь, куда идёте.|Недвижимость осмотрите лично и до любой оплаты попросите юриста проверить документы на право собственности."],
 sf5_t:["Report and block","Bildirin ve engelleyin","Zgłaszaj i blokuj","Жалобы и блокировка"],
 sf5:["Tap the flag on any listing, member or message to report it.|A person looks at every report. Listings that look like scams are hidden while we check.|Mute or block a member from their profile.","Herhangi bir ilanda, üyede veya mesajda bayrağa dokunarak bildirin.|Her bildirime bir kişi bakar. Dolandırıcılık gibi görünen ilanlar biz kontrol ederken gizlenir.|Bir üyeyi profilinden sessize alın veya engelleyin.","Dotknij flagi przy ogłoszeniu, członku lub wiadomości, aby zgłosić.|Każde zgłoszenie sprawdza człowiek. Ogłoszenia wyglądające na oszustwo są ukrywane na czas sprawdzania.|Wycisz lub zablokuj członka na jego profilu.","Нажмите флажок у объявления, участника или сообщения, чтобы пожаловаться.|Каждую жалобу смотрит человек. Объявления, похожие на мошенничество, скрываются на время проверки.|Отключите звук или заблокируйте участника в его профиле."],
 sw_money:["Careful: never pay in advance or send gift cards, crypto or a transfer to someone you have not met.","Dikkat: tanımadığınız birine peşin ödeme, hediye kartı, kripto veya havale göndermeyin.","Uwaga: nigdy nie płać z góry ani nie wysyłaj kart podarunkowych, kryptowalut czy przelewu osobie, której nie znasz.","Осторожно: не платите вперёд и не отправляйте подарочные карты, криптовалюту или перевод тому, с кем не встречались."],
 sw_link:["Careful: do not open links that ask you to log in or pay.","Dikkat: giriş yapmanızı veya ödeme yapmanızı isteyen bağlantıları açmayın.","Uwaga: nie otwieraj linków, które każą się zalogować lub zapłacić.","Осторожно: не открывайте ссылки с просьбой войти или оплатить."],
 sw_phone:["Careful: keep the chat here until you have met and seen the item.","Dikkat: buluşup ürünü görene kadar sohbeti burada sürdürün.","Uwaga: prowadź rozmowę tutaj, dopóki nie spotkasz się i nie zobaczysz rzeczy.","Осторожно: общайтесь здесь, пока не встретитесь и не увидите вещь."],
 msg_safe:["Stay safe: never pay in advance, and meet in public.","Güvende kalın: peşin ödeme yapmayın, herkese açık yerde buluşun.","Bądź bezpieczny: nie płać z góry i spotykaj się w publicznym miejscu.","Будьте осторожны: не платите вперёд и встречайтесь в людном месте."],
 msg_blocked:["This member is not taking messages from you.","Bu üye sizden mesaj almıyor.","Ten członek nie przyjmuje od Ciebie wiadomości.","Этот участник не принимает от вас сообщения."],
 blk_mute:["Mute","Sessize al","Wycisz","Скрыть"],blk_unmute:["Unmute","Sesi aç","Wyłącz wyciszenie","Показать снова"],blk_block:["Block","Engelle","Zablokuj","Заблокировать"],blk_unblock:["Unblock","Engeli kaldır","Odblokuj","Разблокировать"],
 blk_note_m:["You have muted this member. Their posts, comments and clips are hidden from you.","Bu üyeyi sessize aldınız. Gönderileri, yorumları ve klipleri sizden gizlendi.","Wyciszyłeś tego członka. Jego wpisy, komentarze i klipy są ukryte.","Вы скрыли этого участника. Его посты, комментарии и клипы не показываются."],
 blk_note_b:["You have blocked this member. They cannot message you, and their content is hidden from you.","Bu üyeyi engellediniz. Size mesaj gönderemez ve içerikleri sizden gizlendi.","Zablokowałeś tego członka. Nie może do Ciebie pisać, a jego treści są ukryte.","Вы заблокировали этого участника. Он не может писать вам, а его контент скрыт."],
 sellerinfo:["Member since {d} · {n} listings","Üyelik: {d} · {n} ilan","Członek od {d} · {n} ogłoszeń","В сообществе с {d} · {n} объявл."],
 newseller:["New member","Yeni üye","Nowy członek","Новый участник"],
 views_n:["Viewed {n} times","{n} kez görüntülendi","Wyświetlono {n} razy","Просмотров: {n}"],
 out_all:["Sign out on all devices","Tüm cihazlarda çıkış yap","Wyloguj na wszystkich urządzeniach","Выйти на всех устройствах"],
 held_t:["Held for review","İncelemede","Wstrzymane do sprawdzenia","Ожидает проверки"],
 mfa_t:["Admin PIN by email","İki adımlı giriş (yöneticiler)","Logowanie dwuetapowe (administratorzy)","Двухэтапный вход (администраторы)"],
 mfa_d:["A 6-digit PIN is emailed to you each time you sign in to the admin area. Admin powers stay locked until you enter it.","Giriş yaparken bir doğrulayıcı uygulamadan 6 haneli kod ekler. Yönetici hesapları için önerilir.","Dodaje 6-cyfrowy kod z aplikacji uwierzytelniającej podczas logowania. Zalecane dla kont administratorów.","Добавляет 6-значный код из приложения-аутентификатора при входе. Рекомендуется для администраторов."]
});

/* ---------- marketplace waiting rule ---------- */
const mkOpenDate=()=>{
 if(S.admin||!S.prof||!S.prof.joined_at)return null;
 const w=(DB.cfg&&DB.cfg.market_wait_days!=null)?Number(DB.cfg.market_wait_days):7;
 const d=new Date(new Date(S.prof.joined_at).getTime()+w*864e5);
 return d>new Date()?d:null;
};
const fmtD=d=>new Date(d).toLocaleDateString(LOC[S.L],{day:'numeric',month:'long'});
SH.mkwait=s=>{
 const d=s.date?new Date(s.date):mkOpenDate()||new Date(),n=(DB.cfg&&DB.cfg.market_wait_days!=null)?DB.cfg.market_wait_days:7;
 return `<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('clock','l')}</div><h2 class="h2">${F('mw_t',{d:fmtD(d)})}</h2></div><p style="margin:10px 0">${F('mw_d',{n})}</p><div class="card stack" style="box-shadow:none;background:var(--bg)"><b>${T('mw_now')}</b><div class="row">${ic('check','s')}<span>${T('mw_do1')}</span></div><div class="row">${ic('check','s')}<span>${T('mw_do2')}</span></div><div class="row">${ic('check','s')}<span>${T('mw_do3')}</span></div></div><div class="stack" style="margin-top:14px"><button class="btn block" data-act="closesheet">${T('mw_ok')}</button><button class="btn line block" data-act="mkrules">${T('mw_rules')}</button></div>`;
};
SH.mkcap=s=>`<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('info','l')}</div><h2 class="h2">${T('mc_t')}</h2></div><p style="margin:10px 0">${F('mc_d',{n:s.n})}</p><div class="stack"><button class="btn block" data-act="closesheet">${T('mw_ok')}</button></div>`;
ACT.closesheet=()=>closeSheet();
ACT.mkrules=()=>{closeSheet();push('policy',{id:'terms'})};
{
 const _create=ACT.create;
 ACT.create=d=>{if(d&&d.type==='listing'&&mkOpenDate()){if(gate())return;return openSheet({v:'mkwait'})}_create(d)};
 const _crtype=ACT.crtype;
 ACT.crtype=d=>{if(d&&d.id==='listing'&&mkOpenDate())return openSheet({v:'mkwait'});_crtype(d)};
}
function crErr(e){
 const m=String(e&&e.message||'');
 if(m.startsWith('MARKET_WAIT|'))return openSheet({v:'mkwait',date:m.split('|')[1]});
 if(m.startsWith('MARKET_CAP|'))return openSheet({v:'mkcap',n:m.split('|')[1]});
 toast(m||'Error');
}

/* ---------- safety guide and short versions ---------- */
const SFI={sf1:'check',sf2:'flag',sf3:'x',sf4:'pin',sf5:'shield'};
V.safety=function(){
 const sec=k=>`<div class="card stack"><div class="row"><span class="lf" style="background:${k==='sf2'||k==='sf3'?'var(--rs);color:var(--r)':'var(--gs);color:var(--gd)'};width:40px;height:40px">${ic(SFI[k])}</span><b class="grow h3" style="margin:0">${T(k+'_t')}</b></div><div class="stack" style="gap:8px">${T(k).split('|').map(x=>`<div class="row" style="align-items:flex-start">${ic(k==='sf2'?'flag':(k==='sf3'?'x':'check'),'s')}<span style="overflow-wrap:anywhere">${esc(x)}</span></div>`).join('')}</div></div>`;
 return {t:T('sf_t'),b:`<div class="stack"><p class="mut">${T('sf_intro')}</p>${['sf1','sf2','sf3','sf4','sf5'].map(sec).join('')}<button class="btn block" data-act="push" data-v="contacts">${ic('phone','s')}${T('m_contacts')}</button></div>`};
};
function safeNote(){return `<div class="note g">${ic('shield')}<div class="sm"><b>${T('sf_short_t')}</b> ${T('sf_short')} <a href="#" data-act="push" data-v="safety">${T('sf_read')}</a></div></div>`}
{
 const _c=SH.create;
 SH.create=s=>{const h=_c(s);return s.type==='listing'?h.replace('</h2></div>','</h2></div>'+safeNote()):h};
}

/* ---------- messages: warnings, report, banner ---------- */
function scamKind(t){
 t=String(t||'');
 if(/(deposit|advance|up ?front|gift ?card|western union|moneygram|crypto|bitcoin|usdt|send (me )?(the )?money|wire transfer|bank transfer|holding fee|customs fee)/i.test(t))return 'sw_money';
 if(/(https?:\/\/|www\.|\b[a-z0-9-]{3,}\.(com|net|org|xyz|top|click|link|info|ru)\b)/i.test(t))return 'sw_link';
 if(/(\+?\d[\d ().-]{7,}\d|whatsapp|telegram|viber|signal)/i.test(t))return 'sw_phone';
 return '';
}
const warnHtml=k=>k?`<div class="note r" style="margin-top:6px">${ic('flag')}<div class="sm">${T(k)}</div></div>`:'';
SH.msg=s=>`<h2 class="h2">${esc(s.to)}</h2><div class="stack" style="margin-top:12px">${s.about?`<div class="xs mut">${esc(s.about)}</div>`:''}<div class="note g">${ic('shield')}<div class="sm">${T('msg_safe')} <a href="#" data-act="push" data-v="safety">${T('sf_read')}</a></div></div><textarea id="mt" maxlength="600" aria-label="${T('send')}">${esc(s.pre||T('msg_ph'))}</textarea><div id="mt-w">${warnHtml(scamKind(s.pre))}</div><button class="btn block" data-act="msgsend">${ic('send','s')}${T('send')}</button></div>`;
document.addEventListener('input',e=>{if(e.target.id==='mt'){const w=document.getElementById('mt-w');if(w)w.innerHTML=warnHtml(scamKind(e.target.value))}});
ACT.msgsend=async()=>{
 const s=S.sheet,b=val('mt');if(!b||!s.uid)return;
 const to=s.uid==='me'?S.uid:s.uid;
 const {error}=await sb.from('messages').insert({from_id:S.uid,to_id:to,body:b,about:s.about||null});
 if(error)return toast(/row-level|policy/i.test(error.message)?T('msg_blocked'):error.message);
 closeSheet();toast(T('msg_sent'));
};
V.thread=function(o){
 const p=P[o.id]||{n:'Member'},ms=(S.msgs||[]).filter(m=>m.from_id===o.id||m.to_id===o.id).slice().reverse();
 setTimeout(markRead,0,o.id);
 return {t:esc(p.n),b:`<div class="stack"><div class="note g">${ic('shield')}<div class="sm">${T('msg_safe')} <a href="#" data-act="push" data-v="safety">${T('sf_read')}</a></div></div>${ms.map(m=>{const mine=m.from_id===S.uid,k=scamKind(m.body);return `<div class="card" style="${mine?'background:var(--gs);margin-left:32px':'margin-right:32px'}"><div class="xs mut">${m.about?esc(m.about)+' · ':''}${ago(minsAgo(m.created_at))}</div><div style="margin-top:4px;overflow-wrap:anywhere;white-space:pre-wrap">${esc(m.body)}</div>${warnHtml(k)}${mine?'':`<button class="actb" style="margin-top:6px" data-act="report" data-kind="message" data-id="${m.id}" title="${T('report')}" aria-label="${T('report')}">${ic('flag','s')} <span class="xs">${T('report')}</span></button>`}</div>`}).join('')}<button class="btn block" data-act="msg" data-to="${esc(p.n)}" data-uid="${o.id}" data-pre="">${ic('send','s')}${T('reply')}</button></div>`};
};
{
 const _inbox=V.inbox;
 V.inbox=function(){const r=_inbox();r.b=r.b.replace('<div class="stack">','<div class="stack"><div class="note g">'+ic('shield')+'<div class="sm">'+T('msg_safe')+' <a href="#" data-act="push" data-v="safety">'+T('sf_read')+'</a></div></div>');return r};
}

/* ---------- block and mute ---------- */
S.blk={};
async function loadBlocks(){
 S.blk={};if(!S.uid)return;
 const {data}=await sb.from('blocks').select('blocked,kind').eq('blocker',S.uid);
 (data||[]).forEach(r=>{S.blk[r.blocked]=r.kind});
}
function applyHidden(){
 const h=k=>S.blk&&S.blk[k];
 S.posts=(S.posts||[]).filter(p=>!h(p.who));
 S.posts.forEach(p=>{if(p.cm)p.cm=p.cm.filter(c=>!h(c[0]))});
 S.listings=(S.listings||[]).filter(l=>!h(l.who));
 S.clips=(S.clips||[]).filter(c=>!h(c.who));
 S.msgs=(S.msgs||[]).filter(m=>S.blk[m.from_id===S.uid?m.to_id:m.from_id]!=='block');
}
{
 const _lc=loadContent;
 loadContent=async function(){await loadBlocks();const r=await _lc.apply(this,arguments);applyHidden();return r};
}
ACT.blkset=async d=>{
 if(gate())return;
 if(d.kind==='none'){const {error}=await sb.from('blocks').delete().eq('blocker',S.uid).eq('blocked',d.id);if(error)return toast(error.message)}
 else{const {error}=await sb.from('blocks').upsert({blocker:S.uid,blocked:d.id,kind:d.kind});if(error)return toast(error.message)}
 await loadContent();render();renderOv(true);
};
{
 const _person=V.person;
 V.person=function(o){
  const r=_person(o);
  if(o.id==='me'||o.id===S.uid||!isM())return r;
  const k=S.blk[o.id],btn=(kind,label)=>`<button class="btn line grow" data-act="blkset" data-id="${o.id}" data-kind="${kind}">${label}</button>`;
  const card=`<div class="card stack" style="box-shadow:none">${k?`<div class="sm mut">${T(k==='block'?'blk_note_b':'blk_note_m')}</div>`:''}<div class="row" style="flex-wrap:wrap">${k==='mute'?btn('none',T('blk_unmute')):btn('mute',T('blk_mute'))}${k==='block'?btn('none',T('blk_unblock')):btn('block',T('blk_block'))}</div></div>`;
  r.b=r.b.replace(/<\/div>$/,card+'</div>');
  return r;
 };
}

/* ---------- seller history and view counts ---------- */
S._vw={};
{
 const _listing=V.listing;
 V.listing=function(o){
  const l=S.listings.find(x=>x.id===o.id),r=_listing(o);
  if(!l)return r;
  if(l.who==='me'){
   r.b=r.b.replace('<div class="card stack">',`<div class="row"><span class="pill">${ic('eye','s')}${F('views_n',{n:l.views||0})}</span>${l.status==='held'?`<span class="pill red">${T('held_t')}</span>`:''}</div><div class="card stack">`);
  }else{
   if(!S._vw[l.id]){S._vw[l.id]=1;sb.rpc('bump_listing_view',{lid:l.id}).then(()=>{},()=>{})}
   const w=P[l.who]||{},j=w.joined?new Date(w.joined):null,n=S.listings.filter(x=>x.who===l.who).length,isNew=j&&(Date.now()-j.getTime())<30*864e5;
   const info=j?`<div class="row" style="flex-wrap:wrap"><span class="xs mut">${F('sellerinfo',{d:j.toLocaleDateString(LOC[S.L],{month:'short',year:'numeric'}),n})}</span>${isNew?`<span class="pill red">${T('newseller')}</span>`:''}</div>`:'';
   r.b=r.b.replace('<button class="listrow" data-act="push" data-v="person"',info+'<button class="listrow" data-act="push" data-v="person"');
  }
  return r;
 };
}

/* ---------- me: sign out everywhere, admin two-step login ---------- */
ACT.signoutall=async()=>{await sb.auth.signOut({scope:'global'});S.stack=[];S.sheet=null;S.tab='feed';await sync()};
async function mfaState(){
 try{const r=await sb.rpc('admin_pin_status');return r.data===true?{ok:true}:null}catch(e){return null}
}
S.mfa=null;
{
 const _me=meV;
 meV=function(){
  let h=_me();
  if(!isM())return h;
  let extra=`<button class="btn line block" data-act="signoutall">${ic('lock','s')}${T('out_all')}</button>`;
  if(S.admin)extra=`<div class="card stack"><div class="row"><span class="lf" style="background:var(--rs);color:var(--r);width:40px;height:40px">${ic('shield')}</span><div class="grow"><b>${T('mfa_t')}</b></div>${S.mfa?`<span class="pill">${ic('check','s')}On</span>`:''}</div><div class="sm mut">${T('mfa_d')}</div>${S.mfa?'':`<button class="btn block" data-act="pinopen">Send me a PIN</button>`}</div>`+extra;
  return h.replace(/<button class="btn line block" data-act="signout">/,extra+'<button class="btn line block" data-act="signout">');
 };
 if(S.admin===undefined)S.admin=false;
}
SH.mfa=s=>`<h2 class="h2">Admin PIN</h2><p class="mut" style="margin:6px 0 12px">We emailed a 6-digit PIN to your login email${s.em?' ('+esc(s.em)+')':''}. Enter it to open the admin area. It works once and lasts 10 minutes.</p><input id="mfa-c" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="123456" style="font-size:22px;letter-spacing:6px;text-align:center">${s.err?`<p class="xs" style="color:var(--r);margin-top:8px">${esc(s.err)}</p>`:''}<button class="btn block" style="margin-top:12px" data-act="mfalogin">Continue</button><button class="btn line block" style="margin-top:8px" data-act="pinresend">Send a new PIN</button>`;
async function pinSend(){
 const r=await sb.rpc('admin_pin_send');return r.data;
}
ACT.pinopen=async()=>{await pinSend();openSheet({v:'mfa',em:(S.prof&&S.prof.email)||''})};
ACT.pinresend=async()=>{const r=await pinSend();toast(r==='sent'?'A new PIN is on its way':r==='wait'?'Please wait 30 seconds before asking again':'Could not send a PIN');};
ACT.mfalogin=async()=>{
 const c=val('mfa-c');if(!c)return;
 const r=await sb.rpc('admin_pin_check',{c});
 if(r.data!==true){S.sheet.err='That PIN did not match or has expired. Tap Send a new PIN.';return renderSheet()}
 closeSheet();S.mfaOk=true;await sync();
};
/* ask for the code when an account with two-step login is only half signed in */
async function mfaGate(){
 try{
  if(!S.admin)return false;
  if(S.sheet&&S.sheet.v==='mfa')return true;
  if(S.mfa)return false;
  await pinSend();openSheet({v:'mfa'});return true;
 }catch(e){}
 return false;
}

/* ---------- messages: show what I send straight away, and pick up replies without reloading ---------- */
async function refreshMsgs(){
 if(!S.uid)return;
 try{
  const {data,error}=await sb.from('messages').select('*').or('to_id.eq.'+S.uid+',from_id.eq.'+S.uid).order('created_at',{ascending:false}).limit(80);
  if(error||!data)return;
  const old=(S.msgs||[]).length,oldIds=(S.msgs||[]).map(m=>m.id).join();
  S.msgs=data.filter(m=>!(S.blk&&S.blk[m.from_id===S.uid?m.to_id:m.from_id]==='block'));
  const need=[...new Set(S.msgs.map(m=>m.from_id===S.uid?m.to_id:m.from_id))].filter(i=>!P[i]);
  if(need.length&&typeof loadPeople==='function')await loadPeople(need);
  S.unread=S.msgs.filter(m=>m.to_id===S.uid&&!m.read).length+(typeof frIn==='function'?frIn().length:0);
  if(S.msgs.map(m=>m.id).join()!==oldIds){renderTop();renderMain();renderOv(true)}
 }catch(e){}
}
{
 const _ms=ACT.msgsend;
 ACT.msgsend=async function(){await _ms.apply(this,arguments);await refreshMsgs()};
 setInterval(()=>{if(S.uid&&S.prof&&!document.hidden)refreshMsgs()},12000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshMsgs()});
}
