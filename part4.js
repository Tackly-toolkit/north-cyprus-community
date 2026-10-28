/* =====================================================================
   part4.js  –  live app layer (Supabase). Runs after the demo screens.
   Keeps the demo look; swaps demo data for real data and adds the
   decisions agreed with Chris (dropdown areas, Community marketplace,
   no maps, no payments, 3 free months, payment countdown, lock page).
   ===================================================================== */
const SB_URL='https://tszeooiaylkguqzxysbh.supabase.co';
const SB_KEY='__ANON_KEY__';
const SITE_NAME='North Cyprus Community';
const SITE_SHORT='North Cyprus';
const sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const DB={geo:[],cats:[],lists:{condition:[],currency:[],handover:[],bedrooms:[],furnished:[]},cfg:{signup_mode:'open',free_months:3,grace_days:4},contact:{email:''},clubs:[],banners:[]};

/* demo people are not part of the real platform */
Object.keys(P).forEach(k=>{if(k!=='me')delete P[k]});

/* ---------- translations for new text: [en, tr, pl, ru] ---------- */
function N(o){Object.keys(o).forEach(k=>{D[k]=o[k]})}
N({su_h:["Welcome. We're so glad you're here.","Hoş geldiniz. Aramızda olmanıza çok sevindik.","Witaj. Cieszymy się, że jesteś z nami.","Добро пожаловать. Мы рады вам."],su_d:["A warm, friendly space for expats, tourists, their friends and family, and anyone dreaming of North Cyprus.","Expat'lar, turistler, yakınları ve Kuzey Kıbrıs hayali kuranlar için sıcak ve samimi bir buluşma noktası.","Ciepła, przyjazna przestrzeń dla expatów, turystów, ich rodzin i przyjaciół oraz wszystkich, którzy marzą o Cyprze Północnym.","Тёплое, дружелюбное место для экспатов, туристов, их друзей и семей и всех, кто мечтает о Северном Кипре."],su_w:["We say hello to every new member personally, so your account may take a short while to open. We will email you as soon as you are in.","Her yeni üyeyi tek tek karşılıyoruz, bu yüzden hesabınızın açılması kısa bir süre alabilir. Hazır olunca size e-posta göndereceğiz.","Witamy każdego nowego członka osobiście, więc otwarcie konta może chwilę potrwać. Wyślemy Ci e-mail, gdy będzie gotowe.","Мы лично приветствуем каждого нового участника, поэтому открытие аккаунта может занять немного времени. Мы напишем вам, как только всё будет готово."]});
N({tx_btn:["Translate","Çevir","Przetłumacz","Перевести"],tx_orig:["Show original","Orijinali göster","Pokaż oryginał","Показать оригинал"],tx_err:["Could not translate. Try again.","Çevrilemedi. Tekrar deneyin.","Nie udało się przetłumaczyć. Spróbuj ponownie.","Не удалось перевести. Попробуйте ещё раз."]});
/* no built-in sample content: only real member and admin content is ever shown */
[EV,CLUBS,UPD,EQ,CLIPS,POSTS,LISTINGS,DIR].forEach(a=>{a.length=0});
Object.assign(S,{posts:[],listings:[],clips:[],dir:[],meetups:[],streak:0,unread:0});

N({
 aud_members:["Members","Üyeler","Członkowie","Участники"],
 nav_market:["Marketplace","Pazar","Targ","Барахолка"],
 mk_title:["Community marketplace","Topluluk pazarı","Targ społeczności","Рынок сообщества"],
 per_month:["month","ay","miesiąc","месяц"],cr_beds:["Bedrooms","Yatak odası","Sypialnie","Спальни"],cr_furn:["Furnishing","Eşya durumu","Umeblowanie","Мебель"],cr_rent_n:["Enter the monthly rent in the price box.","Aylık kirayı fiyat kutusuna yazın.","Wpisz miesięczny czynsz w polu ceny.","Укажите месячную аренду в поле цены."],
 mk_note:["Deals are between members. Meet in a public place, check items before you pay, and pay in person. We never handle money.","Anlaşmalar üyeler arasındadır. Herkese açık bir yerde buluşun, ödemeden önce ürünü kontrol edin ve elden ödeyin. Biz hiçbir zaman para almayız.","Transakcje odbywają się między członkami. Spotkajcie się w publicznym miejscu, sprawdźcie rzecz przed zapłatą i płaćcie osobiście. Nigdy nie obsługujemy pieniędzy.","Сделки совершаются между участниками. Встречайтесь в людном месте, проверяйте вещь до оплаты и платите на месте. Мы никогда не принимаем деньги."],
 dir_sub:["Local businesses, listed by area.","Yerel işletmeler, bölgeye göre.","Lokalne firmy według okolicy.","Местные компании по районам."],
 g_demo:["Starter guide, written by the community. Always check official sources before you act.","Topluluk tarafından yazılmış başlangıç rehberi. İşlem yapmadan önce resmi kaynakları kontrol edin.","Poradnik startowy napisany przez społeczność. Zawsze sprawdzaj oficjalne źródła.","Стартовый гид, написанный сообществом. Всегда проверяйте официальные источники."],
 g_upd:["Community guide","Topluluk rehberi","Poradnik społeczności","Гид сообщества"],
 up_from:["From the community team","Topluluk ekibinden","Od zespołu społeczności","От команды сообщества"],
 rep_thanks:["Thank you. The moderators will take a look.","Teşekkürler. Moderatörler inceleyecek.","Dziękujemy. Moderatorzy to sprawdzą.","Спасибо. Модераторы посмотрят."],
 msg_sent:["Message sent","Mesaj gönderildi","Wiadomość wysłana","Сообщение отправлено"],
 sc1d:["A calm feed in time order, from people in your community.","Topluluğunuzdaki kişilerden zaman sırasına göre sakin bir akış.","Spokojny kanał w kolejności czasu, od ludzi z Twojej społeczności.","Спокойная лента по времени от людей вашего сообщества."],
 verify_d:["Your business shows as unverified until the team confirms it.","İşletmeniz ekip onaylayana kadar doğrulanmamış görünür.","Twoja firma jest niezweryfikowana, dopóki zespół jej nie potwierdzi.","Ваша компания считается непроверенной, пока команда не подтвердит её."],
 f_about:["About us","Hakkımızda","O nas","О нас"],
 f_priv:["Privacy","Gizlilik","Prywatność","Конфиденциальность"],
 f_terms:["Terms","Koşullar","Regulamin","Условия"],
 f_pay:["Free to join","Katılım ücretsiz","Bezpłatne dołączenie","Вступление бесплатное"],
 f_contact:["Contact","İletişim","Kontakt","Контакты"],
 sos_pol:["Police","Polis","Policja","Полиция"],sos_amb:["Ambulance","Ambulans","Pogotowie","Скорая"],
 sup_t:["Chat with us","Bizimle yazışın","Napisz do nas","Напишите нам"],sup_d:["Message the administrators. We reply here and you get an alert.","Yöneticilere yazın. Yanıtımız burada görünür.","Napisz do administratorów. Odpowiemy tutaj.","Напишите администраторам. Мы ответим здесь."],sup_ph:["Type your message","Mesajınızı yazın","Wpisz wiadomość","Введите сообщение"],sup_empty:["No messages yet. Say hello and ask us anything.","Henüz mesaj yok. Merhaba deyin, bize her şeyi sorabilirsiniz.","Brak wiadomości. Napisz do nas.","Сообщений пока нет. Напишите нам."],sup_team:["Admin","Yönetici","Admin","Админ"],sup_you:["You","Siz","Ty","Вы"],sos_adm:["Community contact","Topluluk iletişim","Kontakt do społeczności","Контакт сообщества"],
 sign_in:["Sign in","Giriş yap","Zaloguj się","Войти"],sign_out:["Sign out","Çıkış yap","Wyloguj się","Выйти"],
 email:["Email","E-posta","E-mail","Эл. почта"],pw:["Password (8+ characters)","Şifre (en az 8 karakter)","Hasło (min. 8 znaków)","Пароль (от 8 символов)"],
 pw_only:["Password","Şifre","Hasło","Пароль"],
 forgot:["Forgot password?","Şifremi unuttum","Nie pamiętasz hasła?","Забыли пароль?"],
 forgot_sent:["If that email has an account, a reset link is on its way.","Bu e-postaya ait bir hesap varsa sıfırlama bağlantısı gönderildi.","Jeśli to konto istnieje, wysłaliśmy link do zmiany hasła.","Если аккаунт существует, ссылка для сброса отправлена."],
 newpw_t:["Choose a new password","Yeni şifre seçin","Wybierz nowe hasło","Выберите новый пароль"],
 save:["Save","Kaydet","Zapisz","Сохранить"],pw_saved:["Password changed","Şifre değiştirildi","Hasło zmienione","Пароль изменён"],
 bad_login:["Wrong email or password.","E-posta veya şifre hatalı.","Błędny e-mail lub hasło.","Неверная почта или пароль."],
 not_verified:["Please open the link we emailed you to verify your address, then sign in.","Lütfen e-postadaki bağlantıyla adresinizi doğrulayın, sonra giriş yapın.","Otwórz link z e-maila, aby zweryfikować adres, a potem zaloguj się.","Откройте ссылку из письма, чтобы подтвердить адрес, затем войдите."],
 j_t:["Join the community","Topluluğa katıl","Dołącz do społeczności","Присоединяйтесь"],
 j_d:["Free to join and enjoy. Share, ask, meet up and keep in touch with your circle.", "Katılmak ve keyfini çıkarmak ücretsiz. Çevrenizle paylaşın, sorun, buluşun ve iletişimde kalın.", "Dołączenie jest bezpłatne. Dziel się, pytaj, spotykaj się i bądź w kontakcie ze swoim kręgiem.", "Вступление бесплатное. Общайтесь, спрашивайте, встречайтесь и оставайтесь на связи со своим кругом."],
 j_create:["Create an account","Hesap oluştur","Utwórz konto","Создать аккаунт"],
 su_email:["Email","E-posta","E-mail","Эл. почта"],su_invite:["Invite code","Davet kodu","Kod zaproszenia","Код приглашения"],
 su_invite_d:["Sign-up is by invitation at the moment. Enter the code you were given.","Şu anda kayıt yalnızca davetle. Size verilen kodu girin.","Rejestracja jest teraz na zaproszenie. Wpisz otrzymany kod.","Сейчас регистрация по приглашению. Введите полученный код."],
 su_district:["District","İlçe","Dystrykt","Округ"],su_town:["Town or village","Kasaba veya köy","Miasto lub wieś","Город или село"],su_areap:["Area","Bölge","Okolica","Район"],
 su_agree:["I have read the policies and agree to them.","Politikaları okudum ve kabul ediyorum.","Przeczytałem(-am) zasady i je akceptuję.","Я прочитал(а) правила и согласен(на)."],
 su_err:["Please fill in the missing fields and tick the box.","Lütfen eksik alanları doldurun ve kutuyu işaretleyin.","Uzupełnij brakujące pola i zaznacz pole.","Заполните недостающие поля и поставьте галочку."],
 su_invite_err:["Sign-up is by invitation only, or the code is not valid.","Kayıt yalnızca davetle ya da kod geçersiz.","Rejestracja tylko na zaproszenie lub kod jest nieprawidłowy.","Регистрация только по приглашению или код недействителен."],
 su_addr:["Business address","İşletme adresi","Adres firmy","Адрес компании"],
 choose:["Choose…","Seçin…","Wybierz…","Выберите…"],other_tell:["Other, please tell us","Diğer, lütfen bildirin","Inne, napisz nam","Другое, напишите нам"],other_ph:["Tell us what to add","Neyi eklememiz gerektiğini yazın","Napisz, co dodać","Напишите, что добавить"],
 other_thanks:["Thanks. The team will review it.","Teşekkürler. Ekip inceleyecek.","Dziękujemy. Zespół to sprawdzi.","Спасибо. Команда рассмотрит."],
 ce_t:["Check your email","E-postanızı kontrol edin","Sprawdź e-mail","Проверьте почту"],
 ce_d:["We sent a link to {e}. Open it to verify your address, then come back and sign in.","{e} adresine bir bağlantı gönderdik. Adresinizi doğrulamak için açın, sonra giriş yapın.","Wysłaliśmy link na {e}. Otwórz go, aby zweryfikować adres, potem zaloguj się.","Мы отправили ссылку на {e}. Откройте её, чтобы подтвердить адрес, затем войдите."],
 ce_spam:["Nothing there? Look in your junk folder.","Yok mu? Gereksiz klasörüne bakın.","Nie ma? Zajrzyj do spamu.","Нет письма? Проверьте спам."],
 welcome_free:["Free to join and enjoy.","Katılmak ve keyfini çıkarmak ücretsiz.","Dołączenie jest bezpłatne.","Вступление бесплатное."],acct_open:["Free member","Ücretsiz üye","Członek bezpłatny","Бесплатный участник"],
 acct_free:["Free until {d}","{d} tarihine kadar ücretsiz","Bezpłatnie do {d}","Бесплатно до {d}"],
 acct_late:["Payment was due {d}","Ödeme günü {d} idi","Płatność była wymagana {d}","Оплата была нужна до {d}"],
 acct_paid:["Paid until {d}","{d} tarihine kadar ödendi","Opłacone do {d}","Оплачено до {d}"],
 acct_due:["Payment due","Ödeme günü geldi","Płatność wymagana","Требуется оплата"],
 pay_t:["Your monthly payment is due","Aylık ödemeniz geldi","Czas na miesięczną opłatę","Пора оплатить месяц"],
 pay_left:["{n} days left to pay","Ödemek için {n} gün kaldı","Zostało {n} dni na opłatę","Осталось {n} дн. на оплату"],
 pay_left1:["Last day to pay","Ödemek için son gün","Ostatni dzień na opłatę","Последний день для оплаты"],
 pay_how:["Pay in cash as arranged, then the team marks your account as paid. If your account locks, it opens again as soon as the payment is recorded.","Ödemeyi anlaştığınız şekilde elden yapın, ekip hesabınızı ödendi olarak işaretler. Hesap kilitlenirse ödeme kaydedilir kaydedilmez yeniden açılır.","Zapłać gotówką, jak ustalono, a zespół oznaczy konto jako opłacone. Jeśli konto się zablokuje, odblokuje się zaraz po zapisaniu płatności.","Оплатите наличными, как договорились, и команда отметит аккаунт оплаченным. Если доступ заблокирован, он откроется сразу после записи платежа."],
 pay_fee:["Monthly fee: {f}","Aylık ücret: {f}","Opłata miesięczna: {f}","Ежемесячный взнос: {f}"],
 pend_t:["Thank you for joining","Katıldığınız için teşekkürler","Dziękujemy za dołączenie","Спасибо, что присоединились"],
 pend_d:["Your account is waiting for approval by the administrators. We approve new members within one working day and will email you as soon as you are in. You can message us through the chat bubble or by email.","Hesabınız yöneticilerin onayını bekliyor. Yeni üyeleri bir iş günü içinde onaylıyoruz ve onaylanır onaylanmaz e-posta göndereceğiz. Sohbet balonundan veya e-posta ile bize yazabilirsiniz.","Twoje konto czeka na zatwierdzenie przez administratorów. Zatwierdzamy nowych członków w ciągu jednego dnia roboczego i wyślemy e-mail. Możesz napisać do nas przez dymek czatu lub e-mailem.","Ваш аккаунт ожидает одобрения администраторов. Мы одобряем новых участников в течение одного рабочего дня и пришлём письмо. Вы можете написать нам через чат или по почте."],
 lock_t:["Your account is paused","Hesabınız duraklatıldı","Twoje konto jest wstrzymane","Ваш аккаунт приостановлен"],
 lock_d:["Your posts and details are safe. Message us through the chat bubble or by email and we will help.","Gönderileriniz ve bilgileriniz güvende. Sohbet balonundan veya e-posta ile bize yazın, yardımcı olalım.","Twoje wpisy i dane są bezpieczne. Napisz do nas przez dymek czatu lub e-mailem, pomożemy.","Ваши записи и данные в безопасности. Напишите нам через чат или по почте, и мы поможем."],
 susp_t:["Your account is suspended","Hesabınız askıya alındı","Twoje konto jest zawieszone","Ваш аккаунт заблокирован"],
 susp_d:["Please contact us if you think this is a mistake.","Bunun bir hata olduğunu düşünüyorsanız lütfen bize ulaşın.","Jeśli to pomyłka, skontaktuj się z nami.","Если это ошибка, свяжитесь с нами."],
 phone:["Phone","Telefon","Telefon","Телефон"],
 sell:["Sell something","Bir şey sat","Sprzedaj","Продать"],
 cr_desc:["Short description","Kısa açıklama","Krótki opis","Краткое описание"],
 cr_cat:["Category","Kategori","Kategoria","Категория"],cr_sub:["Type","Tür","Rodzaj","Вид"],
 cr_cond:["Condition","Durum","Stan","Состояние"],cr_cur:["Currency","Para birimi","Waluta","Валюта"],cr_hand:["Collection or delivery","Teslim şekli","Odbiór lub dostawa","Получение или доставка"],
 cr_photos:["Photos (up to 4)","Fotoğraflar (en fazla 4)","Zdjęcia (do 4)","Фото (до 4)"],
 cr_addr:["Where is it?","Nerede?","Gdzie to jest?","Где это?"],
 cr_need:["Please fill in the title, description, category and area.","Başlık, açıklama, kategori ve bölgeyi doldurun.","Uzupełnij tytuł, opis, kategorię i okolicę.","Заполните название, описание, категорию и район."],
 cr_when_d:["Date","Tarih","Data","Дата"],cr_when_t:["Time","Saat","Godzina","Время"],
 cr_posted:["Posted","Yayınlandı","Opublikowano","Опубликовано"],
 expires_on:["Listed until {d}","{d} tarihine kadar ilanda","Ogłoszenie do {d}","Объявление до {d}"],
 directions:["Get directions","Yol tarifi al","Wyznacz trasę","Построить маршрут"],
 address:["Address","Adres","Adres","Адрес"],
 mark_sold:["Mark as sold","Satıldı olarak işaretle","Oznacz jako sprzedane","Отметить проданным"],
 delete:["Delete","Sil","Usuń","Удалить"],deleted:["Deleted","Silindi","Usunięto","Удалено"],
 none_listings:["Nothing listed yet. Be the first.","Henüz ilan yok. İlk siz olun.","Jeszcze nic nie ma. Bądź pierwszy.","Пока пусто. Будьте первым."],
 none_posts:["No posts yet. Say hello.","Henüz gönderi yok. Merhaba deyin.","Brak wpisów. Przywitaj się.","Пока нет записей. Поздоровайтесь."],
 none_dir:["No businesses listed here yet.","Burada henüz işletme yok.","Nie ma tu jeszcze firm.","Здесь пока нет компаний."],
 none_ev:["No meetups planned yet.","Henüz buluşma yok.","Brak zaplanowanych spotkań.","Встреч пока нет."],
 dir_pending:["Waiting for approval","Onay bekliyor","Czeka na akceptację","Ожидает одобрения"],
 filter_area:["All districts","Tüm ilçeler","Wszystkie dystrykty","Все округа"],
 inbox:["Messages","Mesajlar","Wiadomości","Сообщения"],inbox_none:["No messages yet.","Henüz mesaj yok.","Brak wiadomości.","Сообщений пока нет."],
 reply:["Reply","Yanıtla","Odpowiedz","Ответить"],
 admin_t:["Admin","Yönetim","Administracja","Админ"],
 ev_meetups:["Meetups","Buluşmalar","Spotkania","Встречи"],
 g_saved:["Saved","Kaydedildi","Zapisano","Сохранено"],
 cl_empty:["No posts in this club yet.","Bu kulüpte henüz gönderi yok.","Brak wpisów w tym klubie.","В этом клубе пока нет записей."],
 cl_join_first:["Join the club to see and write posts.","Gönderileri görmek ve yazmak için kulübe katılın.","Dołącz do klubu, aby czytać i pisać.","Вступите в клуб, чтобы читать и писать."],
 cl_write:["Write in this club","Bu kulüpte yaz","Napisz w tym klubie","Написать в клубе"],
 install_t:["Add to your home screen","Ana ekrana ekle","Dodaj do ekranu głównego","Добавить на главный экран"]
});

/* ---------- small helpers ---------- */
const sbErr=(e)=>{try{console.warn(e)}catch(_){}};
const gById=id=>DB.geo.find(g=>g.id===id);
const gName=id=>{const g=gById(id);return g?g.names[0]:''};
const gOpt=g=>g.names.length>1?g.names[0]+' ('+g.names.slice(1).join(' / ')+')':g.names[0];
const gKids=(p,l)=>DB.geo.filter(g=>g.active!==false&&g.level===l&&(p===null||g.parent_id===p)).sort((a,b)=>(a.sort||0)-(b.sort||0)||a.names[0].localeCompare(b.names[0]));
const areaLabel=(d,t,a)=>[a,t,d].filter(Boolean).map(gName).filter(Boolean).filter((x,i,arr)=>arr.indexOf(x)===i).join(', ');
const cById=id=>DB.cats.find(c=>c.id===id);
const cName=id=>cLbl(cById(id));
const cTop=kind=>DB.cats.filter(c=>c.kind===kind&&!c.parent_id&&c.active!==false).sort((a,b)=>(a.sort||0)-(b.sort||0));
const cKids=pid=>DB.cats.filter(c=>c.parent_id===pid&&c.active!==false).sort((a,b)=>(a.sort||0)-(b.sort||0));
const money=(n,cur)=>{const sym={'GBP £':'£','EUR €':'€','USD $':'$','TRY ₺':'₺','TL ₺':'₺','TL':'₺','TRY':'₺','GBP':'£','EUR':'€','USD':'$'}[cur||'TRY']||'';return sym+Number(n).toLocaleString(LOC[S.L])};
const ymd=d=>new Date(d).toLocaleDateString(LOC[S.L],{day:'numeric',month:'short',year:'numeric'});
const minsAgo=iso=>Math.max(1,Math.round((Date.now()-new Date(iso).getTime())/60000));
const mapsUrl=(txt)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(txt+', North Cyprus');
const opts=(rows,sel,labelFn,valFn)=>rows.map(r=>{const v=valFn?valFn(r):r;return `<option value="${esc(v)}" ${String(v)===String(sel)?'selected':''}>${esc(labelFn?labelFn(r):r)}</option>`}).join('');

/* dropdown block: district > town > area, each with "Other, please tell us" */
function geoSel(pfx,sel){
 sel=sel||{};
 const d=sel.d||'',t=sel.t||'',a=sel.a||'';
 const dd=gKids(null,'district'),tt=d?gKids(d,'town'):[],aa=t?gKids(t,'area'):[];
 const blk=(id,lab,rows,v,other)=>`<label class="f" for="${pfx}-${id}">${lab}</label><select id="${pfx}-${id}" data-geo="${id}" data-pfx="${pfx}"><option value="">${T('choose')}</option>${opts(rows,v,gOpt,r=>r.id)}${other?`<option value="__other" ${v==='__other'?'selected':''}>${T('other_tell')}</option>`:''}</select><input id="${pfx}-${id}o" placeholder="${esc(T('other_ph'))}" maxlength="60" hidden style="margin-top:8px">`;
 return blk('d',T('su_district'),dd,d,0)+blk('t',T('su_town'),tt,t,1)+blk('a',T('su_areap'),aa,a,1);
}
function geoVals(pfx){
 const v=id=>{const e=$('#'+pfx+'-'+id);return e?e.value:''};
 const o=id=>{const e=$('#'+pfx+'-'+id+'o');return e&&!e.hidden?e.value.trim():''};
 return {d:v('d'),t:v('t'),a:v('a'),to:o('t'),ao:o('a')};
}
document.addEventListener('change',e=>{
 const el=e.target;if(!el.dataset||!el.dataset.geo)return;
 const pfx=el.dataset.pfx,lv=el.dataset.geo,o=$('#'+el.id+'o');
 if(o)o.hidden=el.value!=='__other';
 const fill=(id,rows,other)=>{const s=$('#'+pfx+'-'+id);if(!s)return;s.innerHTML=`<option value="">${T('choose')}</option>${opts(rows,'',gOpt,r=>r.id)}${other?`<option value="__other">${T('other_tell')}</option>`:''}`;const oo=$('#'+pfx+'-'+id+'o');if(oo){oo.hidden=true;oo.value=''}};
 if(lv==='d'){fill('t',el.value?gKids(el.value,'town'):[],1);fill('a',[],1)}
 if(lv==='t'){fill('a',el.value&&el.value!=='__other'?gKids(el.value,'area'):[],1)}
});
/* category > type dropdowns */
function catSel(pfx,kind,sel){
 sel=sel||{};
 const top=cTop(kind),kids=sel.c?cKids(sel.c):[];
 return `<label class="f" for="${pfx}-c">${T('cr_cat')}</label><select id="${pfx}-c" data-cat="${pfx}"><option value="">${T('choose')}</option>${opts(top,sel.c,cLbl,c=>c.id)}<option value="__other">${T('other_tell')}</option></select><input id="${pfx}-co" placeholder="${esc(T('other_ph'))}" maxlength="60" hidden style="margin-top:8px"><div id="${pfx}-sw">${kids.length?subSel(pfx,kids,sel.s):''}</div>`;
}
const subSel=(pfx,kids,v)=>`<label class="f" for="${pfx}-s">${T('cr_sub')}</label><select id="${pfx}-s"><option value="">${T('choose')}</option>${opts(kids,v,cLbl,c=>c.id)}</select>`;
document.addEventListener('change',e=>{
 const el=e.target;if(!el.dataset||!el.dataset.cat)return;
 const pfx=el.dataset.cat,o=$('#'+pfx+'-co'),w=$('#'+pfx+'-sw');
 if(pfx==='c-m'){const pr=/^market-(rent|sale)$/.test(el.value),px=$('#prop-x'),sx=$('#std-x'),rn=$('#rent-n');if(px){px.hidden=!pr;sx.hidden=pr;rn.hidden=el.value!=='market-rent'}}
 if(o)o.hidden=el.value!=='__other';
 if(w){const k=el.value&&el.value!=='__other'?cKids(el.value):[];w.innerHTML=k.length?subSel(pfx,k,''):''}
});
async function otherReq(list,text){
 if(!text||!S.uid)return;
 try{await sb.from('other_requests').insert({list,text,requested_by:S.uid})}catch(e){sbErr(e)}
}
function listSel(id,label,kind,v){
 const rows=(DB.lists[kind]||[]);
 return `<label class="f" for="${id}">${label}</label><select id="${id}">${opts(rows,v||rows[0],xl)}</select>`;
}

/* ---------- people cache ---------- */
function mkPerson(r){
 const n=r.display_name||'Member',biz=r.account_type==='business';
 return {n,i:(n[0]||'?').toUpperCase(),h:hueOf(r.id),area:areaLabel(r.district_id,r.town_id,r.area_id),biz:biz?1:0,img:r.photo_url||'',joined:r.joined_at||''};
}
function whoKey(id){return id===S.uid?'me':id}
async function loadPeople(ids){
 ids=[...new Set(ids.filter(Boolean))].filter(i=>i!==S.uid&&!P[i]);
 if(!ids.length)return;
 const {data}=await sb.from('people').select('*').in('id',ids);
 (data||[]).forEach(r=>{P[r.id]=mkPerson(r)});
 ids.forEach(i=>{if(!P[i])P[i]={n:'Member',i:'?',h:150,area:''}});
}
function setMe(){
 if(!S.prof){Object.assign(P.me||(P.me={}),{n:'You',i:'Y',h:150,area:'',img:'',biz:0});return}
 const m=mkPerson(S.prof);m.h=hueOf(S.prof.id);P.me=m;
}

/* ---------- loading data ---------- */
async function loadStatic(){
 const [g,c,l,cfg,ct,cl]=await Promise.all([
  sb.from('geo').select('*').eq('active',true),
  sb.from('categories').select('*').eq('active',true),
  sb.from('lists').select('*').eq('active',true).order('sort'),
  sb.rpc('public_config'),
  sb.rpc('contact_details'),
  sb.from('clubs').select('*').eq('active',true).order('created_at')
 ]);
 DB.geo=g.data||[];DB.cats=c.data||[];
 DB.lists={condition:[],currency:[],handover:[],bedrooms:[],furnished:[]};
 (l.data||[]).forEach(r=>{(DB.lists[r.kind]=DB.lists[r.kind]||[]).push(r.value)});
 if(cfg.data)DB.cfg=cfg.data;
 const row=Array.isArray(ct.data)?ct.data[0]:ct.data;
 if(row)DB.contact={email:row.email||''};
 DB.clubs=cl.data||[];
}
function mapPost(r){
 const likes=(r.post_likes||[]);const mine=likes.some(x=>x.user_id===S.uid);
 if(mine)S.liked['p'+r.id]=true;else delete S.liked['p'+r.id];
 return {id:r.id,who:whoKey(r.author),m:minsAgo(r.created_at),aud:r.audience,txt:r.body,likes:likes.length-(mine?1:0),
  cm:(r.post_comments||[]).sort((a,b)=>a.created_at<b.created_at?-1:1).map(c=>[whoKey(c.author),c.body]),help:r.help,
  up:r.media_url?{img:r.media_url}:null,club:r.club_id,ref:r.ref_kind?{k:r.ref_kind,id:r.ref_id}:null,raw:r};
}
function mapListing(r){
 const sub=cById(r.category_id),top=sub&&sub.parent_id?cById(sub.parent_id):sub;
 return {id:r.id,views:r.views||0,status:r.status,t:r.title,d:r.description,price:Number(r.price),cur:r.currency,cat:r.category_id,catTop:top?top.id:'',get catName(){return sub?(top&&sub.parent_id?cLbl(top)+' · '+cLbl(sub):cLbl(sub)):''},
  who:whoKey(r.author),area:areaLabel(r.district_id,r.town_id,r.area_id),cond:r.condition,hand:r.handover,per:r.period,beds:r.bedrooms,furn:r.furnished,intent:r.intent||'offer',ptype:r.property_type,baths:r.bathrooms,prop:/^market-(rent|sale)/.test(r.category_id||''),imgs:r.photos||[],img:(r.photos||[])[0]||'',exp:r.expires_at,at:r.created_at,status:r.status,ic:'tag'};
}
function mapDir(r){
 return {id:r.id,n:r.name,cat:r.category_id,get catName(){return cName(r.category_id)},area:areaLabel(r.district_id,r.town_id,r.area_id),district:r.district_id,addr:r.address||'',off:r.offer||'',ver:r.verified?1:0,status:r.status,who:whoKey(r.owner),img:r.photo_url||'',k:r.name,phone:r.phone||'',wa:r.whatsapp||'',web:r.website||'',hours:r.opening_hours||'',feat:!!r.featured,town:r.town_id};
}
function nextOcc(iso,rp){
 if(!rp||rp==='none')return iso;
 const d=new Date(iso),lim=Date.now()-3*36e5;let n=0;
 while(d.getTime()<lim&&n<400){if(rp==='weekly')d.setDate(d.getDate()+7);else if(rp==='biweekly')d.setDate(d.getDate()+14);else d.setMonth(d.getMonth()+1);n++}
 return d.toISOString();
}
function mapMeet(r){
 return {id:r.id,ic:'users',t:r.title,at:r.created_at,starts:nextOcc(r.starts_at,r.repeat),rep:r.repeat||'none',where:[r.address,areaLabel(r.district_id,r.town_id,r.area_id)].filter(Boolean).join(', '),who:whoKey(r.author),n:(r.meetup_going||[]).length,goingMe:(r.meetup_going||[]).some(x=>x.user_id===S.uid),area:areaLabel(r.district_id,r.town_id,r.area_id)};
}
async function loadContent(){
 const now=new Date();
 const q=[
  sb.from('posts').select('id,author,body,audience,help,media_url,created_at,club_id,ref_kind,ref_id,post_likes(user_id),post_comments(id,author,body,created_at)').order('created_at',{ascending:false}).limit(60),
  sb.from('listings').select('*').eq('status','active').gt('expires_at',now.toISOString()).order('created_at',{ascending:false}).limit(120),
  sb.from('directory').select('*').order('name'),
  sb.from('meetups').select('*,meetup_going(user_id)').or('starts_at.gte.'+new Date(now-864e5).toISOString()+',repeat.neq.none').order('starts_at'),
  sb.from('banners').select('*'),
  S.uid?sb.from('club_members').select('club_id').eq('user_id',S.uid):Promise.resolve({data:[]}),
  sb.rpc('club_counts'),
  sb.from('updates').select('*').order('created_at',{ascending:false}).limit(40),
  sb.from('item_likes').select('kind,item_id,user_id'),
  sb.from('item_comments').select('*').order('created_at').limit(500),
  S.uid?sb.from('friendships').select('*'):Promise.resolve({data:[]})
 ];
 if(S.uid)q.push(sb.from('messages').select('*').or('to_id.eq.'+S.uid+',from_id.eq.'+S.uid).order('created_at',{ascending:false}).limit(80));
 const [pq,lq,dq,mq,bq,cq,nq,uq,lkq,ccq,frq,iq]=await Promise.all(q);
 S.frs=frq.data||[];S.upd=uq.data||[];
 DB.il={};DB.ic={};
 (lkq.data||[]).forEach(x=>{const k=x.kind+':'+x.item_id,o=DB.il[k]||(DB.il[k]={n:0,mine:false});o.n++;if(x.user_id===S.uid)o.mine=true});
 (ccq.data||[]).forEach(x=>{(DB.ic[x.kind+':'+x.item_id]=DB.ic[x.kind+':'+x.item_id]||[]).push(x)});
 const posts=pq.data||[],ls=lq.data||[],dr=dq.data||[],ms=mq.data||[];
 S.msgs=iq?iq.data||[]:[];
 await loadPeople([].concat(posts.map(p=>p.author),posts.flatMap(p=>(p.post_comments||[]).map(c=>c.author)),ls.map(l=>l.author),dr.map(d=>d.owner),ms.map(m=>m.author),(ccq.data||[]).map(c=>c.author),S.frs.flatMap(f=>[f.requester,f.addressee]),S.msgs.flatMap(m=>[m.from_id,m.to_id])));
 S.posts=posts.map(mapPost);S.listings=ls.map(mapListing);S.dir=dr.map(mapDir);S.meetups=ms.map(mapMeet).sort((a,b)=>a.starts<b.starts?-1:1);
 S.verified=S.dir.some(b=>b.who==='me'&&b.ver);
 DB.banners=bq.data||[];
 S.unread=S.msgs.filter(m=>m.to_id===S.uid&&!m.read).length+frIn().length;
 S.joined={};DB.clubCount={};
 (cq.data||[]).forEach(x=>{S.joined[x.club_id]=true});
 (nq.data||[]).forEach(x=>{DB.clubCount[x.club_id]=Number(x.n)});
 await loadInfo();
 await loadGuides();
 await loadExtras();
 refreshPush();
 S.cl=1;
}

/* ---------- session / account state ---------- */
async function sync(opts){
 opts=opts||{};
 const {data:{session}}=await sb.auth.getSession();
 S.uid=session?session.user.id:null;S.user=session?session.user:null;S.prof=null;S.acct=null;
 if(S.uid){
  const p=await sb.from('profiles').select('*').eq('id',S.uid).maybeSingle();S.prof=p.data;
  const a=await sb.rpc('my_account_state');S.acct=Array.isArray(a.data)?a.data[0]:a.data;
 }
 S.role=!S.prof?'visitor':(S.prof.account_type==='business'?'business':'individual');
 S.admin=!!(S.prof&&S.prof.role==='admin');
 if(S.uid){S.mfa=S.admin?await mfaState():null;if(await mfaGate()){setMe();render();return}}

 setMe();S.sup=[];S.supUnread=0;updateBubble();supLoad();
 const st=S.acct?S.acct.state:'active';
 if(S.prof&&(st==='locked'||st==='suspended')){await showLock(st);return}
 hideLock();
 await loadContent();
 await postLogin();
 render();
 if(S.prof&&st==='grace'&&!opts.quiet){const k='dueseen:'+new Date().toDateString();let seen=false;try{seen=sessionStorage.getItem(k)}catch(e){}if(!seen){try{sessionStorage.setItem(k,'1')}catch(e){}openSheet({v:'due'})}}
}
async function postLogin(){
 const u=S.user;if(!u||!S.prof)return;
 const m=u.user_metadata||{};
 if(m.want_dir&&S.role==='business'){
  const ex=await sb.from('directory').select('id').eq('owner',S.uid).limit(1);
  if(!(ex.data||[]).length){
   await sb.from('directory').insert({owner:S.uid,name:m.biz_name||S.prof.display_name,category_id:m.biz_cat||null,district_id:S.prof.district_id,town_id:S.prof.town_id,area_id:S.prof.area_id,address:m.biz_addr||null});
  }
  await sb.auth.updateUser({data:{want_dir:false}});
  const dq=await sb.from('directory').select('*').order('name');S.dir=(dq.data||[]).map(mapDir);
 }
}
async function showLock(st){
 let c=DB.contact;
 const ct=await sb.rpc('contact_details');const row=Array.isArray(ct.data)?ct.data[0]:ct.data;if(row)c={email:row.email||''};
 DB.contact=c;
 const el=$('#lock'),susp=st==='suspended',pend=!susp&&!!(S.prof&&S.prof.pending);
 el.hidden=false;$('#app').hidden=true;$('#ov').hidden=true;$('#sh').hidden=true;
 el.innerHTML=`<div class="wrap" style="max-width:520px;padding-block:40px"><div class="stack"><div style="text-align:center"><div class="mark" style="margin:0 auto 14px;width:64px;height:64px">${ic(susp?'shield':'lock','l')}</div><h1 class="h1">${T(susp?'susp_t':pend?'pend_t':'lock_t')}</h1><p class="mut" style="margin-top:10px">${T(susp?'susp_d':pend?'pend_d':'lock_d')}</p></div>
 <div class="card stack">${contactRows(c)||`<p class="mut">${T('susp_d')}</p>`}</div>
 ${susp||pend?'':`<p class="sm mut" style="text-align:center">${T('pay_how')}</p>`}
 <button class="btn line block" data-act="signout">${T('sign_out')}</button></div></div>`;
}
function hideLock(){const el=$('#lock');if(el){el.hidden=true;el.innerHTML=''}$('#app').hidden=false}
function payNote(){
 if(!S.acct||S.acct.state!=='grace')return '';
 const n=S.acct.days_left;
 return `<div class="note sticky" style="border-color:var(--r)">${ic('info')}<div style="flex:1"><b>${T('pay_t')}</b><div class="sm" style="margin-top:2px">${n<=1?T('pay_left1'):F('pay_left',{n})}</div>${contactLine()}</div></div>`;
}
function contactRows(c){
 const r=[];
 r.push(`<div class="row">${ic('msg')}<div class="grow"><b>${T('sup_t')}</b><div class="xs mut">${T('sup_d')}</div></div><button class="btn soft" data-act="supportopen">${ic('msg','s')}${T('chat')}</button></div>`);
 if(c.email)r.push(`<div class="row">${ic('msg')}<div class="grow" style="min-width:0"><div class="xs mut">${T('email')}</div><b style="overflow-wrap:anywhere">${esc(c.email)}</b></div><a class="btn soft" href="mailto:${esc(c.email)}">${ic('send','s')}${T('email')}</a></div>`);
 return r.join('');
}
function contactLine(){
 const c=DB.contact;
 return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;justify-content:center"><button class="btn soft" data-act="supportopen">${ic('msg','s')}${T('sup_t')}</button></div>${c.email?`<div class="xs mut" style="margin-top:6px;overflow-wrap:anywhere">${esc(c.email)}</div>`:''}`;
}
function feeText(){
 const c=DB.cfg||{};if(!c.billing_on)return '';if(c.monthly_fee_try)return Number(c.monthly_fee_try).toLocaleString(LOC[S.L])+' TL';
 if(c.monthly_fee_gbp)return '£'+Number(c.monthly_fee_gbp).toFixed(2);return '';
}
function acctCard(){
 if(!S.prof)return '';
 const due=S.acct&&S.acct.due_on,paid=S.prof.paid_until&&new Date(S.prof.paid_until)>new Date(S.prof.free_until);
 const late=S.acct&&S.acct.state==='grace';
 const line=S.admin?'Admin':(!(DB.cfg&&DB.cfg.billing_on)?T('acct_open'):due?F(late?'acct_late':(paid?'acct_paid':'acct_free'),{d:ymd(due)}):'');
 const fee=feeText();
 return `<div class="card"><div class="row"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('shield')}</span><div class="grow"><b>${line}</b>${fee&&!S.admin?`<div class="sm mut">${F('pay_fee',{f:fee})}</div>`:''}</div></div></div>`;
}

/* ---------- banners (all off until the admin switches one on) ---------- */
function bannerCard(b){
 const tag=`<span class="bn-tag">${T('sponsor')}</span>`;
 const inner=`${b.image_url?`<img class="bn-i" src="${esc(b.image_url)}" alt="" loading="lazy">`:`<span class="bn-i bn-ph">${ic('zap','l')}</span>`}<span class="bn-t">${tag}<b>${esc(b.headline||'')}</b>${b.body?`<span class="bn-b">${esc(b.body)}</span>`:''}</span>${b.link_url?`<span class="bn-go">${ic('right')}</span>`:''}`;
 return b.link_url?`<a class="bn" href="${esc(b.link_url)}" target="_blank" rel="noopener sponsored">${inner}</a>`:`<div class="bn">${inner}</div>`;
}
function bannerHtml(zone){
 const today=new Date().toISOString().slice(0,10);
 const list=(DB.banners||[]).filter(b=>b.enabled&&(b.zone===zone||b.zone==='top')&&(!b.starts_on||b.starts_on<=today)&&(!b.ends_on||b.ends_on>=today));
 return list.slice(0,2).map(bannerCard).join('');
}
N({me_vis_d:["Join to get your own profile, post, message and sell.","Profil, paylaşım, mesaj ve satış için katılın.","Dołącz, aby mieć profil, pisać, wysyłać wiadomości i sprzedawać.","Присоединяйтесь, чтобы создать профиль, писать, переписываться и продавать."]});
N({
 soon_t:["Something new is coming to North Cyprus","Kuzey Kıbrıs'a yeni bir şey geliyor","Do Cypru Północnego idzie coś nowego","В Северный Кипр приходит что-то новое"],
 soon_d:["Welcome. You are among the very first to see this. We are building a friendly home for a small circle of friends and neighbours connected to North Cyprus: ask questions, meet up, share tips, buy and sell small things and keep in touch from wherever you are. We are shaping it with the people who will use it.", "Hoş geldiniz. Bunu görenlerin ilkleri arasındasınız. Kuzey Kıbrıs ile bağlantılı küçük bir arkadaş ve komşu çevresi için sıcak bir yuva kuruyoruz: soru sorun, buluşun, ipuçları paylaşın, küçük eşyalar alıp satın ve nerede olursanız olun iletişimde kalın. Bunu kullanacak insanlarla birlikte şekillendiriyoruz.", "Witamy. Jesteś wśród pierwszych, którzy to widzą. Budujemy przyjazne miejsce dla małego kręgu znajomych i sąsiadów związanych z Cyprem Północnym: zadawaj pytania, spotykaj się, dziel się wskazówkami, kupuj i sprzedawaj drobiazgi i bądź w kontakcie, gdziekolwiek jesteś. Kształtujemy to razem z ludźmi, którzy z tego korzystają.", "Добро пожаловать. Вы среди первых, кто это видит. Мы создаём тёплый дом для небольшого круга друзей и соседей, связанных с Северным Кипром: задавайте вопросы, встречайтесь, делитесь советами, покупайте и продавайте мелочи и оставайтесь на связи, где бы вы ни были. Мы формируем его вместе с теми, кто им пользуется."],
 soon_b:["Have a look around","Göz atın","Rozejrzyj się","Осмотритесь"]
});
N({cr_price:["Price (0 = free)","Fiyat (0 = ücretsiz)","Cena (0 = za darmo)","Цена (0 = бесплатно)"]});
N({call:["Call","Ara","Zadzwoń","Позвонить"],chat:["Chat","Yaz","Napisz","Написать"]});
N({sponsor:["Sponsored","Sponsorlu","Sponsorowane","Реклама"],open:["Open","Aç","Otwórz","Открыть"]});

/* ---------- brand / links ---------- */
ACT.invite=function(){copy(location.origin+'/')};

/* ---------- auth screens ---------- */
SH.join=()=>`<h2 class="h2">${T('j_t')}</h2><p class="mut" style="margin:6px 0 14px">${T('j_d')}</p><div class="stack"><button class="btn block" data-act="signup">${T('j_create')}</button><button class="btn soft block" data-act="signinsheet">${T('sign_in')}</button><button class="btn line block" data-act="sclose">${T('close')}</button></div>`;
SH.signin=s=>`<h2 class="h2">${T('sign_in')}</h2><div class="stack" style="margin-top:12px"><div><label class="f" for="si-e">${T('email')}</label><input id="si-e" type="email" autocomplete="email" inputmode="email" value="${esc(s.email||'')}"><label class="f" for="si-p">${T('pw_only')}</label><input id="si-p" type="password" autocomplete="current-password"></div>${s.err?`<div class="note">${ic('info')}<div class="sm">${esc(s.err)}</div></div>`:''}${s.msg?`<div class="note g">${ic('info')}<div class="sm">${esc(s.msg)}</div></div>`:''}<button class="btn block" data-act="dosignin">${T('sign_in')}</button><button class="btn soft block" data-act="forgot">${T('forgot')}</button><button class="btn line block" data-act="signup">${T('j_create')}</button></div>`;
SH.newpw=s=>`<h2 class="h2">${T('newpw_t')}</h2><div class="stack" style="margin-top:12px"><input id="np" type="password" autocomplete="new-password" placeholder="${esc(T('pw'))}" aria-label="${esc(T('pw'))}"><button class="btn block" data-act="donewpw">${T('save')}</button></div>`;
SH.soon=()=>`<div style="text-align:center"><div class="mark" style="margin:0 auto 12px;width:64px;height:64px">${ic('island','l')}</div><h2 class="h2">${T('soon_t')}</h2><p class="mut" style="margin:10px 0 16px">${T('soon_d')}</p><button class="btn block" data-act="sclose">${T('soon_b')}</button></div>`;
SH.due=()=>{const n=S.acct?S.acct.days_left:0;return `<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('info','l')}</div><h2 class="h2">${T('pay_t')}</h2><div class="bignum" style="margin:10px 0">${n}</div><p style="font-weight:600">${n<=1?T('pay_left1'):F('pay_left',{n})}</p><p class="sm mut" style="margin:10px 0">${T('pay_how')}</p>${feeText()?`<p class="sm"><b>${F('pay_fee',{f:feeText()})}</b></p>`:''}${contactLine()}<button class="btn block" style="margin-top:14px" data-act="sclose">${T('gotit')}</button></div>`};
SH.sos=()=>{
 if(!DB.info&&!DB._ifl){DB._ifl=1;loadInfo().then(()=>{DB._ifl=0;if(S.sheet&&S.sheet.v==='sos')renderSheet()}).catch(()=>{DB._ifl=0})}
 const rowOf=i=>`<div class="row" style="flex-wrap:wrap"><span class="grow sm" style="overflow-wrap:anywhere;min-width:0">${esc(i.title)}${i.hours?`<span class="xs mut" style="display:block">${esc(i.hours)}</span>`:''}</span>${i.phone&&digits(i.phone)?`<a class="btn soft" href="${telHref(i.phone)}">${ic('phone','s')}${esc(i.phone)}</a>`:''}${!i.phone&&i.website?`<a class="btn soft" href="${esc(/^https?:\/\//i.test(i.website)?i.website:'https://'+i.website)}" target="_blank" rel="noopener nofollow">${ic('globe','s')}${T('biz_web')}</a>`:''}</div>`;
 const grp=(c,fold)=>{const it=infoOf('contact').filter(i=>i.category===c);if(!it.length)return '';const head=`<b>${T('ic_'+c)}</b>`;
  return fold?`<details class="card" style="box-shadow:none;background:var(--bg)"><summary style="cursor:pointer">${head} <span class="xs mut">(${it.length})</span></summary><div class="stack" style="margin-top:8px">${it.map(rowOf).join('')}</div></details>`:`<div class="card stack" style="box-shadow:none;background:var(--bg)">${head}${it.map(rowOf).join('')}</div>`};
 return `<div class="row"><span class="lf" style="background:var(--rs);color:var(--r)">${ic('buoy','l')}</span><div><h2 class="h2">${T('sos_t')}</h2><div class="sm mut">${T('sos_d')}</div></div></div><div class="stack" style="margin-top:14px">${sosRow(T('sos_pol'),'155')}${sosRow(T('sos_amb'),'112')}${sosRow(T('sos_fire'),'199')}${grp('emergency_other')}${grp('hospital')}${grp('pharmacy_duty')}${grp('fire_rescue')}${grp('police',1)}${grp('embassy',1)}<button class="btn line block" data-act="push" data-v="contacts">${T('sos_more')}</button><div class="card stack" style="box-shadow:none;background:var(--bg)"><b>${T('sos_adm')}</b>${contactRows({email:DB.contact.email})}</div></div>`};
ACT.signinsheet=()=>openSheet({v:'signin'});
ACT.dosignin=async()=>{
 const e=val('si-e'),p=($('#si-p')||{}).value||'';
 if(!e||!p)return;
 const {error}=await sb.auth.signInWithPassword({email:e,password:p});
 if(error){const m=/confirm/i.test(error.message)?T('not_verified'):T('bad_login');openSheet({v:'signin',email:e,err:m});return}
 closeSheet();await sync();if(!S.acct||S.acct.state==='active')toast(T('welcome'));
};
ACT.forgot=async()=>{
 const e=val('si-e');if(!e){toast(T('email'));return}
 await sb.auth.resetPasswordForEmail(e,{redirectTo:location.origin+'/'});
 openSheet({v:'signin',email:e,msg:T('forgot_sent')});
};
ACT.donewpw=async()=>{
 const p=($('#np')||{}).value||'';if(p.length<8)return toast(T('pw'));
 const {error}=await sb.auth.updateUser({password:p});if(error)return toast(error.message);
 closeSheet();toast(T('pw_saved'));
};
ACT.signout=async()=>{await sb.auth.signOut();S.stack=[];S.sheet=null;S.tab='feed';await sync()};
ACT.demo=ACT.signinsheet;
ACT.reset=ACT.signout;
sb.auth.onAuthStateChange((ev)=>{
 if(ev==='PASSWORD_RECOVERY')setTimeout(()=>openSheet({v:'newpw'}),0);
 else if(ev==='SIGNED_IN'||ev==='SIGNED_OUT')setTimeout(()=>sync({quiet:ev==='SIGNED_IN'&&!!S.uid}),0);
});

/* ---------- sign-up ---------- */
function grabSu(){
 const u=S.su,g=id=>{const e=$('#'+id);return e?e.value.trim():undefined},set=(k,id)=>{const v=g(id);if(v!==undefined)u[k]=v};
 set('name','su-n');set('biz','su-b');set('cat','su-bc');set('addr','su-ba');set('email','su-e');set('pw','su-p');set('inv','su-i');set('k','su-k');
 if($('#sg-d')){const v=geoVals('sg');u.d=v.d;u.t=v.t;u.a=v.a;u.to=v.to;u.ao=v.ao}
 const ag=$('#su-ag');if(ag)u.agree=ag.checked;
}
V.signup=function(){
 const u=S.su,biz=u.type==='biz';
 if(u.step===1)return {t:T('join_free'),b:`<div class="stack"><div style="position:relative;background:linear-gradient(180deg,rgba(14,48,40,.25),rgba(14,48,40,.82)),url(/welcome/w1.jpg) center/cover;color:#fff;padding:92px 20px 20px;border-radius:22px;overflow:hidden"><h1 class="h1" style="max-width:100%;color:#fff">${T('su_h')}</h1><p style="margin-top:8px;color:#f1f8f6;font-size:16px;line-height:1.45">${T('su_d')}</p><p style="margin-top:8px;color:#d9ecec;font-size:14px">${F('welcome_free',{n:DB.cfg.free_months||3})}</p></div><div class="note g" style="margin-top:2px">${ic('check')}<div class="sm">${T('su_w')}</div></div><h2 class="h3">${T('su_pick')}</h2>
  <button class="opt ${biz?'':'on'}" data-act="sutype" data-id="ind"><span class="lf">${ic('user')}</span><span style="flex:1"><b>${T('su_ind')}</b><div class="sm mut">${T('su_ind_d')}</div></span></button>
  <button class="opt ${biz?'on':''}" data-act="sutype" data-id="biz"><span class="lf">${ic('bag')}</span><span style="flex:1"><b>${T('su_biz')}</b><div class="sm mut">${T('su_biz_d')}</div></span></button>
  <p class="xs mut">${ic('lock','s')} ${T('su_lock')}</p>
  ${[['sc1t','sc1d','home'],['sc2t','sc2d','bag'],['sc3t','sc3d','vcheck']].map(c=>`<div class="sc"><span class="lf">${ic(c[2])}</span><div><b>${T(c[0])}</b><div class="sm mut">${T(c[1])}</div></div></div>`).join('')}
  <button class="btn block" data-act="sunext">${T('cont')}</button></div>`};
 if(u.step===2)return {t:T('join_free'),b:`<div class="stack"><span class="pill">${ic(biz?'bag':'user','s')}${T(biz?'su_biz':'su_ind')}</span>
  <div class="card"><input id="su-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0"><label class="f" for="su-n">${T('su_name')}</label><input id="su-n" value="${esc(u.name||'')}" maxlength="40" autocomplete="name">
  ${biz?`<label class="f" for="su-b">${T('su_biz_name')}</label><input id="su-b" value="${esc(u.biz||'')}" maxlength="60">${catSel('su-b2','directory',{c:u.cat}).replace(/id="su-b2-c"/,'id="su-bc"').replace(/data-cat="su-b2"/,'data-cat="su-b2"')}<label class="f" for="su-ba">${T('su_addr')}</label><input id="su-ba" value="${esc(u.addr||'')}" maxlength="120">`:''}
  ${geoSel('sg',{d:u.d,t:u.t,a:u.a})}<label class="f" for="su-k">${T('ap_conn')}</label><select id="su-k"><option value="">${T('ap_pick')}</option>${['tourist','expat','family','other'].map(k=>`<option value="${k}"${u.k===k?' selected':''}>${T('ap_k_'+k)}</option>`).join('')}</select></div>
  <div class="card"><label class="f" for="su-e">${T('su_email')}</label><input id="su-e" type="email" inputmode="email" autocomplete="email" value="${esc(u.email||'')}"><label class="f" for="su-p">${T('pw')}</label><input id="su-p" type="password" autocomplete="new-password" value="${esc(u.pw||'')}">
  ${DB.cfg.signup_mode==='invite'?`<label class="f" for="su-i">${T('su_invite')}</label><input id="su-i" value="${esc(u.inv||'')}" maxlength="40"><p class="xs mut" style="margin-top:6px">${T('su_invite_d')}</p><button class="btn line block" style="margin-top:10px" data-act="applyopen">${T('ap_btn')}</button>`:''}</div>
  ${biz?`<button class="opt ${u.dir?'on':''}" data-act="sudir"><span class="lf">${ic(u.dir?'check':'plus')}</span><span style="flex:1"><b>${T('su_dir')}</b><div class="sm mut">${T('su_dir_d')}</div></span></button>`:''}
  <label class="row" style="gap:10px;align-items:flex-start"><input id="su-ag" type="checkbox" style="width:22px;height:22px;margin-top:2px" ${u.agree?'checked':''}><span class="sm">${T('su_agree')} <a href="#" data-act="push" data-v="policy" data-id="terms">${T('f_terms')}</a>${isStandalone()?'':`<a href="#" data-act="push" data-v="app">${T('get_app')}</a>`} · <a href="#" data-act="push" data-v="policy" data-id="privacy">${T('f_priv')}</a> · <a href="#" data-act="push" data-v="policy" data-id="payment">${T('f_pay')}</a></span></label>
  ${u.err?`<div class="note">${ic('info')}<div class="sm">${esc(u.err)}</div></div>`:''}
  <button class="btn block" data-act="sunext" ${u.busy?'disabled':''}>${T('finish')}</button></div>`};
 return {t:T('ce_t'),b:`<div class="stack"><div class="hero" style="text-align:center"><div class="mark" style="margin:0 auto 12px;width:56px;height:56px">${ic('msg','l')}</div><h1 class="h1" style="max-width:100%">${T('ce_t')}</h1><p class="mut" style="margin-top:8px">${F('ce_d',{e:esc(u.email)})}</p><p class="sm mut" style="margin-top:8px">${T('ce_spam')}</p></div><p class="sm mut" style="text-align:center">${F('welcome_free',{n:DB.cfg.free_months||3})}</p><button class="btn block" data-act="signinfromsu">${T('sign_in')}</button></div>`};
};
ACT.signinfromsu=()=>{const e=S.su&&S.su.email;S.stack=[];renderOv();openSheet({v:'signin',email:e||''})};
ACT.sunext=async function(){
 const u=S.su;
 if(u.step===1){u.step=2;renderOv(false);$('#ov').scrollTop=0;return}
 if(u.step!==2)return;
 grabSu();
 if(($('#su-hp')||{}).value){u.busy=false;renderOv(true);return}
 const biz=u.type==='biz';
 const ok=u.name&&u.email&&u.pw&&u.pw.length>=8&&u.d&&u.t&&u.k&&u.agree&&(!biz||(u.biz&&u.cat));
 if(!ok){u.err=T('su_err');renderOv(true);return}
 u.err='';u.busy=true;renderOv(true);
 const meta={name:u.name,account_type:biz?'business':'member',district_id:u.d,town_id:(u.t==='__other'?'':u.t),area_id:(u.a==='__other'?'':u.a),invite_code:u.inv||'',locale:LANGS[S.L],connection:u.k||''};
 if(biz){meta.biz_name=u.biz;meta.biz_cat=(u.cat&&u.cat!=='__other')?u.cat:'';meta.biz_addr=u.addr||'';meta.want_dir=!!u.dir}
 const {data,error}=await sb.auth.signUp({email:u.email,password:u.pw,options:{data:meta,emailRedirectTo:location.origin+'/'}});
 u.busy=false;
 if(error){u.err=DB.cfg.signup_mode==='invite'?T('su_invite_err'):error.message;renderOv(true);return}
 u.pending=[];
 if(u.t==='__other'&&u.to)u.pending.push(['town',u.to]);if(u.a==='__other'&&u.ao)u.pending.push(['area',u.ao]);
 if(data.session){await Promise.all(u.pending.map(p=>otherReq(p[0],p[1])));S.su=null;S.stack=[];await sync();toast(T('welcome'));return}
 u.step=3;u.pw='';renderOv(false);$('#ov').scrollTop=0;
};
ACT.sudone=()=>popall();

/* ---------- navigation chrome ---------- */

function checkin(){return ''}   // streak check-in belongs to the demo only
ACT.refresh=async()=>{await loadContent();render();toast(T('refreshed'))};
ACT.checkin=()=>{};
/* posts: delete own, real comments */
ACT.delpost=async d=>{const {error}=await sb.from('posts').delete().eq('id',d.id);if(error)return toast(error.message);S.posts=S.posts.filter(p=>p.id!==d.id);render();toast(T('deleted'))};
ACT.like=async d=>{
 if(gate())return;
 const k='p'+d.id,was=!!S.liked[k];S.liked[k]=!was;renderMain();renderOv(true);
 const r=was?await sb.from('post_likes').delete().eq('post_id',d.id).eq('user_id',S.uid):await sb.from('post_likes').insert({post_id:d.id,user_id:S.uid});
 if(r.error){S.liked[k]=was;renderMain();renderOv(true);toast(r.error.message)}
};
ACT.cmtsend=async d=>{
 if(gate())return;const v=val('ci-'+d.id);if(!v)return;
 const {error}=await sb.from('post_comments').insert({post_id:d.id,author:S.uid,body:v});if(error)return toast(error.message);
 S.posts.find(p=>p.id===d.id).cm.push(['me',v]);renderMain();renderOv(true);
};

/* ---------- explore (no TFR-specific modules) ---------- */
function exploreV(){
 const mods=(gtN()?[['guides','book',T('m_guides'),F('cnt_guides',{n:gtN()})]]:[]).concat([['dirlist','pin',T('m_dir'),F('cnt_dir',{n:S.dir.filter(b=>b.status==='approved').length})],['events','cal',T('m_events'),F('cnt_events',{n:S.meetups.length})],['clubs','users',T('m_clubs'),F('cnt_clubs',{n:DB.clubs.length})],['updates','bell',T('m_updates'),(S.upd||[]).length+''],['checklist','ck',T('m_check'),CK.length+' ✓'],['convert','card',T('m_convert'),'£ ⇄ ₺'],['northmap','map',T('m_map'),'']].concat(infoOf('place').length?[['places','pin',T('m_places'),infoOf('place').length+'']]:[],infoOf('contact').length?[['contacts','phone',T('m_contacts'),infoOf('contact').length+'']]:[]));
 return `<div class="stack">${notes()}<div class="hero"><h1 class="h1" style="max-width:85%">${T('tagline')}</h1><p style="margin-top:8px;max-width:85%" class="mut">${T('exp_hero_d')}</p></div>${bannerHtml('explore')}${featuredSpot()}
 <div class="grid2">${mods.map(m=>`<button class="mod" data-act="push" data-v="${m[0]}"><span class="lf">${ic(m[1])}</span><b>${m[2]}</b><small>${m[3]}</small></button>`).join('')}</div>
 ${appCard()}${footerV()}</div>`;
}
N({discounts:["Discounts","İndirimler","Zniżki","Скидки"],featured:["Featured","Öne çıkan","Wyróżnione","Рекомендуем"],all_towns:["All towns","Tüm kasabalar","Wszystkie miasta","Все города"],
 m_convert:["Pound to lira","Sterlin–Lira","Funt na liry","Фунт в лиры"],cv_gbp:["Pounds (£)","Sterlin (£)","Funty (£)","Фунты (£)"],cv_try:["Lira (₺)","Lira (₺)","Liry (₺)","Лиры (₺)"],
 cv_rate:["Rate used: £1 = ₺{r}. Updated {d} from the European Central Bank rate. Banks and exchange offices give their own rate, so check before you change money.","Kullanılan kur: £1 = ₺{r}. {d} tarihinde Avrupa Merkez Bankası kurundan güncellendi. Banka ve döviz büroları kendi kurunu uygular, bozdurmadan önce kontrol edin.","Kurs: £1 = ₺{r}. Zaktualizowany {d} według kursu Europejskiego Banku Centralnego. Banki i kantory mają własne kursy, sprawdź przed wymianą.","Курс: £1 = ₺{r}. Обновлён {d} по курсу Европейского центрального банка. У банков и обменников свой курс, проверьте перед обменом."],
 cv_none:["The rate has not been set yet. Check back soon.","Kur henüz belirlenmedi. Yakında tekrar bakın.","Kurs nie został jeszcze ustawiony.","Курс ещё не задан."],
 biz_hours:["Opening times","Çalışma saatleri","Godziny otwarcia","Часы работы"],biz_web:["Website","Web sitesi","Strona","Сайт"],biz_call:["Call","Ara","Zadzwoń","Позвонить"],biz_edit:["Edit business details","İşletme bilgilerini düzenle","Edytuj dane firmy","Изменить данные"],
 biz_phone:["Phone (with country code)","Telefon (ülke koduyla)","Telefon (z numerem kierunkowym)","Телефон (с кодом страны)"],biz_wa:["WhatsApp (with country code)","WhatsApp (ülke koduyla)","WhatsApp (z numerem kierunkowym)","WhatsApp (с кодом страны)"],
 biz_hours_ph:["e.g. Mon–Sat 09:00–18:00, Sun closed","örn. Pzt–Cmt 09:00–18:00, Pazar kapalı","np. pon–sob 9:00–18:00, niedz. zamknięte","напр. пн–сб 9:00–18:00, вс выходной"],biz_saved:["Saved","Kaydedildi","Zapisano","Сохранено"]});
const digits=x=>String(x||'').replace(/[^\d]/g,'');
const telHref=x=>{const d=digits(String(x||'').split('/')[0]);return d?(d.length<=4?'tel:'+d:'tel:+'+d):''};
function bizContact(b){
 const rows=[];
 if(b.hours)rows.push(`<div class="row">${ic('clock')}<div class="grow"><div class="xs mut">${T('biz_hours')}</div><b style="overflow-wrap:anywhere;white-space:pre-wrap">${esc(b.hours)}</b></div></div>`);
 if(b.web){const u=/^https?:\/\//i.test(b.web)?b.web:'https://'+b.web;rows.push(`<div class="row">${ic('globe')}<div class="grow" style="min-width:0"><div class="xs mut">${T('biz_web')}</div><b style="overflow-wrap:anywhere">${esc(b.web)}</b></div><a class="btn soft" href="${esc(u)}" target="_blank" rel="noopener nofollow">${T('open')}</a></div>`)}
 const btns=[];
 if(b.phone&&digits(b.phone))btns.push(`<a class="btn grow" href="tel:+${digits(b.phone)}">${ic('phone','s')}${T('biz_call')}</a>`);
 if(b.wa&&digits(b.wa))btns.push(`<a class="btn soft grow" href="https://wa.me/${digits(b.wa)}" target="_blank" rel="noopener">${ic('wa','s')}${T('whatsapp')}</a>`);
 if(btns.length)rows.push(`<div class="row">${btns.join('')}</div>`);
 if(b.who==='me')rows.push(`<button class="btn line block" data-act="bizedit" data-id="${b.id}">${ic('tool','s')}${T('biz_edit')}</button>`);
 return rows.length?`<div class="card stack">${rows.join('')}</div>`:'';
}
SH.bizedit=s=>{const b=S.dir.find(x=>x.id===s.id)||{};return `<h2 class="h2">${T('biz_edit')}</h2><div class="stack" style="margin-top:12px"><div><label class="f" for="be-p">${T('biz_phone')}</label><input id="be-p" type="tel" inputmode="tel" maxlength="30" value="${esc(b.phone||'')}"><label class="f" for="be-w">${T('biz_wa')}</label><input id="be-w" type="tel" inputmode="tel" maxlength="30" value="${esc(b.wa||'')}"><label class="f" for="be-u">${T('biz_web')}</label><input id="be-u" maxlength="200" value="${esc(b.web||'')}" placeholder="https://"><label class="f" for="be-h">${T('biz_hours')}</label><textarea id="be-h" maxlength="300" placeholder="${esc(T('biz_hours_ph'))}">${esc(b.hours||'')}</textarea><label class="f" for="be-a">${T('address')}</label><input id="be-a" maxlength="120" value="${esc(b.addr||'')}"></div><button class="btn block" data-act="bizeditsave" data-id="${s.id}">${T('save')}</button></div>`};
ACT.bizedit=d=>openSheet({v:'bizedit',id:d.id});
ACT.bizeditsave=async d=>{
 const {error}=await sb.rpc('update_my_business',{p_id:d.id,p_phone:val('be-p'),p_whatsapp:val('be-w'),p_website:val('be-u'),p_hours:val('be-h'),p_address:val('be-a')});
 if(error)return toast(error.message);
 closeSheet();await loadContent();renderOv(true);toast(T('biz_saved'));
};
function featuredSpot(){
 const f=S.dir.filter(b=>b.status==='approved'&&b.feat);if(!f.length)return '';
 const b=f[Math.floor(Date.now()/864e5)%f.length];
 return `<button class="bn" style="width:100%;text-align:left" data-act="push" data-v="dir" data-id="${b.id}">${b.img?`<img class="bn-i" src="${esc(b.img)}" alt="">`:`<span class="bn-i bn-ph">${ic('star','l')}</span>`}<span class="bn-t"><span class="bn-tag">${T('featured')}</span><b>${esc(b.n)}</b><span class="bn-b">${esc(b.off||b.catName)}</span></span>${ic('right')}</button>`;
}
V.convert=function(){
 const c=DB.cfg||{},r=Number(c.gbp_try_rate)||0;
 if(!r)return {t:T('m_convert'),b:`<div class="card" style="text-align:center"><p class="mut">${T('cv_none')}</p></div>`};
 const rs=r.toLocaleString(LOC[S.L],{maximumFractionDigits:4});
 return {t:T('m_convert'),b:`<div class="stack"><div class="card stack"><div><label class="f" for="cv-g">${T('cv_gbp')}</label><input id="cv-g" type="number" inputmode="decimal" min="0" value="1"></div><div><label class="f" for="cv-t">${T('cv_try')}</label><input id="cv-t" type="number" inputmode="decimal" min="0" value="${(Math.round(r*100)/100)}"></div></div><div class="note g">${ic('info')}<div class="sm">${F('cv_rate',{r:rs,d:c.rate_updated_at?ymd(c.rate_updated_at):'–'})}</div></div></div>`};
};
document.addEventListener('input',e=>{
 const r=Number((DB.cfg||{}).gbp_try_rate)||0;if(!r)return;
 if(e.target.id==='cv-g'){const t=$('#cv-t');if(t)t.value=e.target.value===''?'':Math.round(parseFloat(e.target.value)*r*100)/100}
 if(e.target.id==='cv-t'){const g=$('#cv-g');if(g)g.value=e.target.value===''?'':Math.round(parseFloat(e.target.value)/r*100)/100}
});
N({m_places:["Places to visit","Gezilecek yerler","Miejsca do zwiedzania","Что посмотреть"],m_contacts:["Useful contacts","Faydalı numaralar","Przydatne kontakty","Полезные контакты"],m_map:["Map of the north","Kuzey haritası","Mapa północy","Карта севера"],
 ic_police:["Police stations","Polis karakolları","Posterunki policji","Отделения полиции"],ic_fire_rescue:["Fire service","İtfaiye","Straż pożarna","Пожарная служба"],ic_emergency_other:["Other emergency numbers","Diğer acil numaralar","Inne numery alarmowe","Другие экстренные номера"],
 sos_more:["All emergency and useful contacts","Tüm acil ve faydalı iletişim bilgileri","Wszystkie numery alarmowe i kontakty","Все экстренные и полезные контакты"],
 ic_hospital:["Hospitals","Hastaneler","Szpitale","Больницы"],ic_embassy:["Embassies","Büyükelçilikler","Ambasady","Посольства"],ic_pharmacy_duty:["Pharmacies on duty","Nöbetçi eczaneler","Apteki dyżurne","Дежурные аптеки"],ic_muktar:["Muktars","Muhtarlar","Muhtarzy","Мухтары"],ic_municipality:["Municipalities","Belediyeler","Urzędy miejskie","Муниципалитеты"],ic_government:["Government departments","Devlet daireleri","Urzędy państwowe","Госучреждения"],ic_transport:["Airports, ports and borders","Havalimanı, liman ve sınır kapıları","Lotniska, porty i przejścia","Аэропорты, порты и КПП"],ic_power:["Power cuts","Elektrik kesintileri","Przerwy w dostawie prądu","Отключения электричества"],
 ic_museum:["Museums","Müzeler","Muzea","Музеи"],ic_historic:["Historic places","Tarihi yerler","Miejsca historyczne","Исторические места"],ic_beach:["Beaches","Plajlar","Plaże","Пляжи"],ic_nature:["Nature and walks","Doğa ve yürüyüş","Natura i spacery","Природа и прогулки"],ic_other:["Other","Diğer","Inne","Другое"],
 ii_empty:["Nothing here yet. We only add details we have checked.","Henüz bir şey yok. Yalnızca kontrol ettiğimiz bilgileri ekliyoruz.","Na razie nic. Dodajemy tylko sprawdzone informacje.","Пока пусто. Мы добавляем только проверенные сведения."],
 ii_checked:["Checked {d}","Kontrol: {d}","Sprawdzono: {d}","Проверено: {d}"],ii_source:["Source","Kaynak","Źródło","Источник"],ii_fee:["Entry","Giriş","Wstęp","Вход"],ii_maps:["Open in Google Maps","Google Haritalar'da aç","Otwórz w Mapach Google","Открыть в Google Картах"],
 map_note:["A simple picture of the north, not to scale. Tap a district to open it in Google Maps.","Kuzeyin basit bir resmi, ölçekli değildir. Google Haritalar'da açmak için bir ilçeye dokunun.","Prosty rysunek północy, nie w skali. Dotknij dystryktu, aby otworzyć w Mapach Google.","Схематичная карта севера, не в масштабе. Нажмите на округ, чтобы открыть его в Google Картах."]});
N({gal_note:["","","",""],checkin_d:["","","",""],mcard_t:["Member card","Üye kartı","Karta członka","Карта члена"],eq_sub:["","","",""],mem_join:["Join","Katıl","Dołącz","Присоединиться"],mem_np:["","","",""],mem_ok:["","","",""],mem_note:["","","",""],mem_p3:["","","",""],sos_wel:["","","",""],sos_wel_n:["","","",""],sos_buddy:["","","",""],sos_buddy_ok:["","","",""],j_demo:["","","",""],n4:["","","",""],f_demo:["","","",""],reset:["Sign out","Çıkış yap","Wyloguj","Выйти"]});
const INFO_P=['museum','historic','beach','nature','other'],INFO_C=['hospital','pharmacy_duty','police','fire_rescue','emergency_other','embassy','muktar','municipality','government','transport','power'];
DB.info=[];
const infoOf=k=>(DB.info||[]).filter(i=>i.kind===k);
async function loadInfo(){const r=await sb.from('info_items').select('*').eq('active',true).order('sort').order('title');DB.info=r.data||[]}
function infoCard(i){
 const rows=[];
 if(i.body)rows.push(`<div style="overflow-wrap:anywhere;white-space:pre-wrap">${U(i.body)}</div>`);
 if(i.hours)rows.push(`<div class="row">${ic('clock','s')}<span class="grow sm">${esc(i.hours)}</span></div>`);
 if(i.fee)rows.push(`<div class="row"><span class="sm mut">${T('ii_fee')}</span><b class="grow sm">${esc(i.fee)}</b></div>`);
 const b=[];
 if(i.phone&&digits(i.phone))b.push(`<a class="btn soft grow" href="${telHref(i.phone)}">${ic('phone','s')}${esc(i.phone)}</a>`);
 if(i.map_query)b.push(`<a class="btn line grow" href="${mapsUrl(i.map_query)}" target="_blank" rel="noopener">${ic('compass','s')}${T('ii_maps')}</a>`);
 if(i.website){const u=/^https?:\/\//i.test(i.website)?i.website:'https://'+i.website;b.push(`<a class="btn line grow" href="${esc(u)}" target="_blank" rel="noopener nofollow">${ic('globe','s')}${T('biz_web')}</a>`)}
 if(b.length)rows.push(`<div class="row" style="flex-wrap:wrap">${b.join('')}</div>`);
 const src=[i.checked_on?F('ii_checked',{d:ymd(i.checked_on)}):'',i.source_url?`<a href="${esc(i.source_url)}" target="_blank" rel="noopener nofollow">${T('ii_source')}</a>`:''].filter(Boolean).join(' · ');
 return `<div class="card stack"><b style="overflow-wrap:anywhere">${U(i.title)}</b>${rows.join('')}${src?`<div class="xs mut">${src}</div>`:''}</div>`;
}
const ICAT_IC={hospital:'heart',pharmacy_duty:'plus',police:'shield',fire_rescue:'zap',emergency_other:'buoy',embassy:'flag',muktar:'user',municipality:'home',government:'file',transport:'truck',power:'zap',museum:'book',historic:'star',beach:'sun',nature:'island',other:'pin'};
function infoView(kind,cats,title){
 const all=infoOf(kind),cur=S['icat_'+kind]||'all',have=cats.filter(c=>all.some(i=>i.category===c));
 if(!all.length)return {t:title,b:`<div class="stack"><div class="card" style="text-align:center"><p class="mut">${T('ii_empty')}</p></div></div>`};
 if(cur==='all'||!have.includes(cur))return {t:title,b:`<div class="stack"><div class="grid2">${have.map(c=>`<button class="mod" style="min-height:96px" data-act="icat" data-k="${kind}" data-id="${c}"><span class="lf">${ic(ICAT_IC[c]||'pin')}</span><b>${T('ic_'+c)}</b><small>${all.filter(i=>i.category===c).length}</small></button>`).join('')}</div></div>`};
 return {t:title,b:`<div class="stack"><button class="btn soft" style="align-self:flex-start" data-act="icat" data-k="${kind}" data-id="all">${ic('left','s')}${T('ic_back')}</button><h2 class="h3">${T('ic_'+cur)}</h2>${all.filter(i=>i.category===cur).map(infoCard).join('')}</div>`};
}
N({ic_back:["All categories","Tüm kategoriler","Wszystkie kategorie","Все категории"]});
ACT.icat=d=>{S['icat_'+d.k]=d.id;renderOv(true)};
V.places=()=>infoView('place',INFO_P,T('m_places'));
V.contacts=()=>infoView('contact',INFO_C,T('m_contacts'));
V.northmap=function(){
 const R={
  girne:{p:'488,272 545,298 610,300 700,303 790,318 925,300 930,312 862,350 785,383 612,380 600,376 565,362 500,365',l:[690,345],c:1},
  guzelyurt:{p:'500,365 565,362 600,376 612,380 610,430 595,440 565,432 525,452 492,425',l:[545,404],c:2},
  lefke:{p:'365,420 430,445 437,490 455,480 495,478 525,452 492,425 500,415 440,412',l:[455,448],c:3},
  lefkosa:{p:'612,380 785,383 862,350 868,450 925,490 925,522 870,520 840,495 815,500 800,545 790,460 775,420 745,420 700,432 655,412 610,430',l:[708,420],c:4},
  gazimagusa:{p:'862,350 930,312 925,300 1000,265 1020,266 995,325 1015,345 1027,388 1075,376 1070,405 1070,437 1128,500 1070,498 1050,500 1030,518 940,525 925,490 868,450',l:[985,435],c:5},
  iskele:{p:'1020,266 1100,245 1200,205 1290,165 1335,120 1390,98 1430,85 1478,68 1470,100 1420,125 1370,155 1300,225 1220,270 1165,310 1170,325 1100,340 1075,376 1027,388 1015,345 995,325',l:[1160,300],c:6}};
 const ds=gKids(null,'district');
 const fills=['','#8fcaa9','#b5dcc0','#d6ecd6','#f3bda9','#f6d792','#9ccbe2'];
 const land='105,480 150,520 240,745 365,790 500,835 555,840 545,785 600,745 700,745 800,700 900,660 920,580 1050,585 1100,560 1180,572 1130,500 925,525 812,545 790,470 740,420 650,413 600,440 525,452 440,490 365,420 270,430 240,460 130,480';
 const svg=`<svg viewBox="280 50 1230 530" role="img" aria-label="${esc(T('m_map'))}" style="width:100%;height:auto;display:block;border-radius:16px"><rect x="270" y="40" width="1250" height="550" fill="color-mix(in srgb,var(--g) 14%,var(--card))"/><polygon points="${land}" fill="var(--bg)" stroke="var(--mut)" stroke-width="3" stroke-linejoin="round" opacity=".8"/>${ds.map(d=>{const r=R[d.id];return r?`<a href="${esc(mapsUrl(d.names[0]+' district'))}" target="_blank" rel="noopener" aria-label="${esc(d.names[0])}"><polygon points="${r.p}" fill="${fills[r.c]}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><text x="${r.l[0]}" y="${r.l[1]}" text-anchor="middle" font-size="34" font-weight="700" fill="#1d3b31" style="paint-order:stroke;stroke:#fff;stroke-width:7px">${esc(d.names[0])}</text></a>`:''}).join('')}</svg>`;
 return {t:T('m_map'),b:`<div class="stack"><div class="card" style="padding:8px">${svg}</div><p class="sm mut">${T('map_note')}</p>${ds.map(d=>`<a class="listrow" href="${mapsUrl(d.names[0]+' district')}" target="_blank" rel="noopener"><span class="lf">${ic('pin')}</span><span class="grow"><b>${esc(gOpt(d))}</b></span>${ic('compass')}</a>`).join('')}</div>`};
};
function footerV(){
 const c=DB.contact;
 return `<div class="foot"><button class="fx" data-act="footer" aria-expanded="${S.footer}" title="${T('footer')}" aria-label="${T('footer')}">${ic(S.footer?'up':'down')}</button>${S.footer?`<div class="fb card"><div class="row" style="flex-wrap:wrap;gap:16px"><a href="#" data-act="push" data-v="policy" data-id="about">${T('f_about')}</a><a href="#" data-act="push" data-v="policy" data-id="privacy">${T('f_priv')}</a><a href="#" data-act="push" data-v="policy" data-id="terms">${T('f_terms')}</a><a href="#" data-act="push" data-v="policy" data-id="payment">${T('f_pay')}</a><a href="#" data-act="push" data-v="policy" data-id="contact">${T('f_contact')}</a></div></div>`:''}</div>`;
}

/* ---------- Community marketplace ---------- */
const lmoney=l=>l.price?money(l.price,l.cur)+(l.per==='month'?' / '+T('per_month'):''):(l.intent==='looking'?T('any_budget'):T('free'));
function thumbFor(l){return l.img?`<img class="art" src="${esc(l.img)}" alt="">`:art('tag',hueOf(l.id),0,l.t)}
const catTile=(act,id,name,n,icn,extra)=>`<button class="mod" style="min-height:96px" data-act="${act}" data-id="${id}" ${extra||''}><span class="lf">${ic(icn)}</span><b>${esc(name)}</b><small>${n}</small></button>`;
N({see_all:["See everything","Hepsini gör","Zobacz wszystko","Показать всё"]});
const _push=ACT.push;ACT.push=d=>{if(d.v==='dirlist'){S.dshow=false;S.dcat='all';S.doff=false;S.ddist='';S.dtown=''}_push(d)};
const _tab=ACT.tab;ACT.tab=d=>{if(d.id==='market'){S.mshow=false;S.mcat='all';S.mlook=false}_tab(d)};
ACT.mcat=d=>{S.mcat=d.id;S.mshow=true;renderMain();window.scrollTo(0,0)};
ACT.mlook=()=>{S.mlook=true;S.mshow=true;renderMain();window.scrollTo(0,0)};
ACT.mback=()=>{S.mshow=false;S.mcat='all';S.mlook=false;renderMain();window.scrollTo(0,0)};
function marketV(){
 const top=cTop('market'),cur=S.mcat==='all'||!top.some(c=>c.id===S.mcat)?'all':S.mcat;
 const head=`<div class="row"><h1 class="h1 grow">${T('mk_title')}</h1><button class="btn out" data-act="create" data-type="listing">${ic('plus','s')}${T('sell')}</button></div>`;
 const note=`${safeNote()}`;
 if(!S.mshow){
  const cnt=id=>S.listings.filter(l=>l.catTop===id).length;
  return `<div class="stack">${notes()}${head}${bannerHtml('market')}<div class="grid2">${catTile('mcat','all',T('see_all'),S.listings.length,'list')}${catTile('mlook','x',T('looking_for'),S.listings.filter(l=>l.intent==='looking').length,'search')}${top.map(c=>catTile('mcat',c.id,cLbl(c),cnt(c.id),'tag')).join('')}</div>${note}</div>`;
 }
 const ls=S.listings.filter(l=>(cur==='all'||l.catTop===cur)&&(!S.mlook||l.intent==='looking'));
 const ttl=S.mlook?T('looking_for'):(cur==='all'?T('see_all'):esc(cLbl(cById(cur))));
 return `<div class="stack">${notes()}${head}<button class="btn soft" style="align-self:flex-start" data-act="mback">${ic('left','s')}${T('ic_back')}</button><h2 class="h3">${ttl}</h2>${bannerHtml('market')}
 ${ls.length?`<div class="grid2">${ls.map(l=>`<button class="tile" data-act="push" data-v="listing" data-id="${l.id}"><span class="pic">${thumbFor(l)}<span class="pr">${lmoney(l)}</span></span><span class="tb">${l.intent==='looking'?`<span class="pill" style="align-self:flex-start">${T('looking_for')}</span>`:''}<b>${esc(l.t)}</b><span class="xs mut">${esc(l.area)}</span></span></button>`).join('')}</div>`:`<div class="card" style="text-align:center"><p class="mut">${T('none_listings')}</p></div>`}
 ${note}</div>`;
}
V.listing=function(o){
 const l=S.listings.find(x=>x.id===o.id);if(!l)return {t:T('nav_market'),b:''};
 const w=P[l.who]||{n:'Member',h:150},mine=l.who==='me';
 const gal2=l.imgs.length?`<div class="galw"><div class="gal">${l.imgs.map(u=>`<div class="sl"><img class="art" src="${esc(u)}" alt=""></div>`).join('')}</div>${l.imgs.length>1?`<span class="gc">1/${l.imgs.length}</span>`:''}</div>`:`<div class="galw"><div class="gal"><div class="sl">${art('tag',hueOf(l.id),0,l.t)}</div></div></div>`;
 return {t:T('mk_title'),b:`<div class="stack"><div>${gal2}</div><div><span class="pill">${esc(l.catName)}</span>${l.intent==='looking'?` <span class="pill">${T('looking_for')}</span>`:''}<h1 class="h1" style="margin-top:8px">${U(l.t)}</h1><div class="h2" style="color:var(--gd);margin-top:4px">${lmoney(l)}</div></div><p>${U(l.d)}</p>
 ${actBar('listing',l.id,l.t,{})}
 <div class="card stack">${l.ptype?`<div class="row"><span class="grow mut">${T('cr_ptype')}</span><b>${esc(xl(l.ptype))}</b></div>`:''}${l.baths?`<div class="row"><span class="grow mut">${T('cr_baths')}</span><b>${esc(xl(l.baths))}</b></div>`:''}${l.beds?`<div class="row"><span class="grow mut">${T('cr_beds')}</span><b>${esc(xl(l.beds))}</b></div>`:''}${l.furn?`<div class="row"><span class="grow mut">${T('cr_furn')}</span><b>${esc(xl(l.furn))}</b></div>`:''}${l.cond?`<div class="row"><span class="grow mut">${T('cr_cond')}</span><b>${esc(xl(l.cond))}</b></div>`:''}${l.hand?`<div class="row"><span class="grow mut">${T('cr_hand')}</span><b>${esc(xl(l.hand))}</b></div>`:''}
 <div class="row">${ic('pin')}<div class="grow"><div class="xs mut">${T('address')}</div><b>${esc(l.area)}</b></div></div><a class="btn soft block" href="${mapsUrl(l.area)}" target="_blank" rel="noopener">${ic('compass','s')}${T('directions')}</a><div class="xs mut">${F('expires_on',{d:ymd(l.exp)})}</div></div>
 <button class="listrow" data-act="push" data-v="person" data-id="${l.who}">${av(l.who,44)}<span class="grow"><span class="xs mut">${T('sold_by')}</span><b>${esc(w.n)}</b></span>${ic('right')}</button>
 ${mine?`<div class="row"><button class="btn soft grow" data-act="sold" data-id="${l.id}">${ic('check','s')}${T('mark_sold')}</button><button class="btn line grow" data-act="dellisting" data-id="${l.id}">${ic('trash','s')}${T('delete')}</button></div>`:`<button class="btn block" data-act="msg" data-to="${esc(w.n)}" data-uid="${l.who}" data-about="${esc(l.t)}">${ic('msg','s')}${T('msg_seller')}</button>
 <div class="row"><button class="btn line grow" data-act="report" data-kind="seller" data-id="${l.who}">${ic('flag','s')}${T('report_seller')}</button><button class="btn line grow" data-act="report" data-kind="listing" data-id="${l.id}">${ic('flag','s')}${T('report_listing')}</button></div>`}
 ${S.admin&&!mine?`<button class="btn line block" data-act="dellisting" data-id="${l.id}">${ic('trash','s')}${T('delete')} (admin)</button>`:''}
 ${safeNote()}</div>`};
};
ACT.sold=async d=>{await sb.from('listings').update({status:'sold'}).eq('id',d.id);S.listings=S.listings.filter(l=>l.id!==d.id);popall();render();toast(T('deleted'))};
ACT.dellisting=async d=>{const {error}=await sb.from('listings').delete().eq('id',d.id);if(error)return toast(error.message);S.listings=S.listings.filter(l=>l.id!==d.id);popall();render();toast(T('deleted'))};

/* ---------- directory (list only, no map) ---------- */
V.dirlist=function(){
 const top=cTop('directory'),dc=S.dcat&&top.some(c=>c.id===S.dcat)?S.dcat:'all',dd=S.ddist||'';
 const dtn=S.dtown||'';
 const ls=S.dir.filter(b=>b.status==='approved').filter(b=>dc==='all'||b.cat===dc||(cById(b.cat)&&cById(b.cat).parent_id===dc)).filter(b=>!dd||b.district===dd).filter(b=>!dtn||b.town===dtn).filter(b=>!S.doff||b.off).sort((a,b)=>(b.feat?1:0)-(a.feat?1:0));
 const mine=S.dir.filter(b=>b.who==='me'&&b.status!=='approved');
 return {t:T('m_dir'),b:`<p class="mut" style="margin-bottom:10px">${T('dir_sub')}</p>${bannerHtml('directory')}
 ${S.dshow?`<button class="btn soft" style="align-self:flex-start;margin-bottom:10px" data-act="dback">${ic('left','s')}${T('ic_back')}</button>`:`<div class="grid2">${catTile('dcat','all',T('see_all'),S.dir.filter(b=>b.status==='approved').length,'list')}${catTile('doff','x',T('discounts'),S.dir.filter(b=>b.status==='approved'&&b.off).length,'gift')}${top.map(c=>catTile('dcat',c.id,cLbl(c),S.dir.filter(b=>b.status==='approved'&&(b.cat===c.id||(cById(b.cat)&&cById(b.cat).parent_id===c.id))).length,'bag')).join('')}</div>`}
 ${S.dshow?`<select id="dd" data-act-change="ddist" style="margin:10px 0" aria-label="${esc(T('su_district'))}"><option value="">${T('filter_area')}</option>${opts(gKids(null,'district'),dd,gOpt,r=>r.id)}</select>${dd?`<select id="dt" style="margin-bottom:10px" aria-label="${esc(T('su_town'))}"><option value="">${T('all_towns')}</option>${opts(gKids(dd,'town'),dtn,gOpt,r=>r.id)}</select>`:''}`:''}
 ${mine.length?`<div class="stack" style="margin-bottom:12px">${mine.map(dcard).join('')}</div>`:''}
 ${S.dshow?`<div class="stack">${ls.length?ls.map(dcard).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('none_dir')}</p></div>`}</div>`:''}`};
};
document.addEventListener('change',e=>{if(e.target.id==='dd'){S.ddist=e.target.value;S.dtown='';renderOv(true)}if(e.target.id==='dt'){S.dtown=e.target.value;renderOv(true)}});
ACT.doff=()=>{S.doff=true;S.dshow=true;renderOv(true)};
function dcard(b){return `<button class="listrow" data-act="push" data-v="dir" data-id="${b.id}"><span class="th">${b.img?`<img class="art" src="${esc(b.img)}" alt="">`:art('tools',hueOf(b.id),0,'')}</span><span class="grow"><b>${esc(b.n)}</b><span class="xs mut">${esc(b.catName)} · ${esc(b.area)}</span></span>${b.feat?`<span class="pill">${ic('star','s')}${T('featured')}</span>`:''}${b.status!=='approved'?`<span class="pill red">${T('dir_pending')}</span>`:((recN(b.id)?`<span class="pill">${ic('heart','s')}${recN(b.id)}</span>`:'')+(b.ver?`<span class="pill">${ic('vcheck','s')}</span>`:''))}</button>`}
V.dir=function(o){
 const b=S.dir.find(x=>x.id===o.id);if(!b)return {t:T('m_dir'),b:''};
 const addr=[b.addr,b.area].filter(Boolean).join(', ');
 return {t:esc(b.n),b:`<div class="stack">${b.img?`<div class="galw"><div class="gal"><div class="sl"><img class="art" src="${esc(b.img)}" alt=""></div></div></div>`:''}<div class="card"><div class="row"><span class="lf">${esc(b.n[0])}</span><div class="grow"><h1 class="h2">${esc(b.n)}</h1><div class="sm mut">${esc(b.catName)} · ${esc(b.area)}</div></div></div><div style="margin-top:10px"><span class="pill ${b.ver?'':'red'}">${ic(b.ver?'vcheck':'info','s')}${b.ver?T('verified'):T('unverified')}</span></div></div>
 ${b.off?`<div class="card" style="background:var(--gs)"><div class="xs mut" style="text-transform:uppercase;letter-spacing:.06em">${T('offer_t')}</div><div class="h2" style="margin-top:4px">${U(b.off)}</div></div>`:''}
 <div class="card stack"><div class="row">${ic('pin')}<div class="grow"><div class="xs mut">${T('address')}</div><b>${esc(addr)}</b></div></div><a class="btn soft block" href="${mapsUrl((b.n+' '+addr).trim())}" target="_blank" rel="noopener">${ic('compass','s')}${T('directions')}</a></div>
 ${bizContact(b)}
 ${recBlock(b)}
 ${b.who!=='me'?`<div class="row"><button class="btn grow" data-act="msg" data-to="${esc(b.n)}" data-uid="${b.who}" data-about="${esc(b.n)}">${ic('msg','s')}${T('msg_biz')}</button></div><button class="btn line block" data-act="report" data-kind="biz" data-id="${b.id}">${ic('flag','s')}${T('report_biz')}</button>`:''}</div>`};
};
ACT.dcat=d=>{S.dcat=d.id;S.dshow=true;renderOv(true)};
ACT.dback=()=>{S.dshow=false;S.dcat='all';S.doff=false;S.ddist='';S.dtown='';renderOv(true)};

/* ---------- meetups (events) ---------- */
V.events=function(){
 const card=e=>rowt('push','event',e.id,thmRaw('group',hueOf(e.id)),esc(e.t),`${ymd(e.starts)} · ${new Date(e.starts).toLocaleTimeString(LOC[S.L],{hour:'2-digit',minute:'2-digit'})}${e.area?' · '+esc(e.area):''}`,e.goingMe?`<span class="pill">${ic('check','s')}${T('going_on')}</span>`:undefined);
 return {t:T('m_events'),b:`<div class="stack">${bannerHtml('events')}<button class="btn out block" data-act="create" data-type="meetup">${ic('plus','s')}${T('cr_meetup')}</button>${S.meetups.length?S.meetups.map(card).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('none_ev')}</p></div>`}</div>`};
};
V.event=function(o){
 const e=S.meetups.find(x=>x.id===o.id);if(!e)return {t:T('m_events'),b:''};
 const g=e.goingMe,n=e.n;
 return {t:esc(e.t),b:`<div class="stack"><div><span class="pill">${ic('cal','s')}${T('m_events')}</span>${e.rep&&e.rep!=='none'?` <span class="pill">${T('rp_'+e.rep)}</span>`:''}<h1 class="h1" style="margin-top:10px">${U(e.t)}</h1></div>
 <div class="card stack"><div class="row">${ic('cal')}<div class="grow"><div class="xs mut">${T('ev_when')}</div><b>${fdate(e.starts.slice(0,10),1)} · ${new Date(e.starts).toLocaleTimeString(LOC[S.L],{hour:'2-digit',minute:'2-digit'})}</b></div></div><div class="row">${ic('pin')}<div class="grow"><div class="xs mut">${T('ev_where')}</div><b>${esc(e.where||T('ev_venue'))}</b></div></div><a class="btn soft block" href="${mapsUrl(e.where)}" target="_blank" rel="noopener">${ic('compass','s')}${T('directions')}</a><div class="row">${ic('users')}<div class="grow"><b>${F('ev_who',{n})}</b></div></div></div>
 <button class="btn block ${g?'soft':''}" data-act="going" data-id="${e.id}">${ic(g?'check':'plus','s')}${g?T('going_on'):T('going')}</button>
 ${actBar('event',e.id,e.t,{mine:e.who==='me'||S.admin})}</div>`};
};
ACT.going=async d=>{
 if(gate())return;const e=S.meetups.find(x=>x.id===d.id);if(!e)return;
 const was=e.goingMe;e.goingMe=!was;e.n+=was?-1:1;renderOv(true);
 const r=was?await sb.from('meetup_going').delete().eq('meetup_id',d.id).eq('user_id',S.uid):await sb.from('meetup_going').insert({meetup_id:d.id,user_id:S.uid});
 if(r.error){e.goingMe=was;e.n+=was?1:-1;renderOv(true);toast(r.error.message)}
};
ACT.delmeet=async d=>{const {error}=await sb.from('meetups').delete().eq('id',d.id);if(error)return toast(error.message);S.meetups=S.meetups.filter(x=>x.id!==d.id);pop();toast(T('deleted'))};

/* ---------- clubs ---------- */
V.clubs=function(){return {t:T('m_clubs'),b:`<div class="stack">${DB.clubs.map(c=>rowt('push','club',c.id,thmRaw('group',c.hue),esc(c.name),F('members_n',{n:DB.clubCount&&DB.clubCount[c.id]||0}),S.joined[c.id]?`<span class="pill">${ic('check','s')}</span>`:undefined)).join('')}</div>`}};
V.club=function(o){
 const c=DB.clubs.find(x=>x.id===o.id);if(!c)return {t:T('m_clubs'),b:''};
 const j=!!S.joined[c.id],ps=S.posts.filter(p=>p.club===c.id).sort((a,b)=>a.m-b.m),n=(DB.clubCount&&DB.clubCount[c.id]||0);
 return {t:esc(c.name),b:`<div class="stack"><div class="hero"><h1 class="h1" style="max-width:100%">${esc(c.name)}</h1><p class="mut" style="margin-top:6px">${esc(c.blurb||'')}</p><p class="sm mut" style="margin-top:6px">${F('members_n',{n})}</p></div>
 <button class="btn block ${j?'soft':''}" data-act="joinclub" data-id="${c.id}">${ic(j?'check':'plus','s')}${j?T('joined'):T('join_club')}</button>
 <h2 class="h3">${T('club_posts')}</h2>${j?`<button class="btn out block" data-act="create" data-type="post" data-club="${c.id}">${ic('plus','s')}${T('cl_write')}</button>${ps.length?ps.map(post).join(''):`<p class="mut">${T('cl_empty')}</p>`}`:`<p class="mut">${T('cl_join_first')}</p>`}</div>`};
};
ACT.joinclub=async d=>{
 if(gate())return;const was=!!S.joined[d.id];S.joined[d.id]=!was;DB.clubCount[d.id]=(DB.clubCount[d.id]||0)+(was?-1:1);renderOv(true);
 const r=was?await sb.from('club_members').delete().eq('club_id',d.id).eq('user_id',S.uid):await sb.from('club_members').insert({club_id:d.id,user_id:S.uid});
 if(r.error){S.joined[d.id]=was;renderOv(true);toast(r.error.message);return}
 await loadContent();renderOv(true);
};

/* ---------- people, messages ---------- */
V.person=function(o){
 const p=P[o.id]||{n:'Member',i:'?',h:150};const ps=S.posts.filter(x=>x.who===o.id&&!x.club),ls=S.listings.filter(x=>x.who===o.id);
 const st=frState(o.id);
 const fb={none:`<button class="btn" data-act="frreq" data-id="${o.id}">${ic('plus','s')}${T('fr_add')}</button>`,sent:`<button class="btn soft" data-act="frdel" data-id="${o.id}">${ic('check','s')}${T('fr_sent')} · ${T('fr_cancel')}</button>`,incoming:`<div class="row" style="justify-content:center"><button class="btn" data-act="fracc" data-id="${o.id}">${ic('check','s')}${T('fr_accept')}</button><button class="btn line" data-act="frdel" data-id="${o.id}">${T('fr_decline')}</button></div>`,friends:`<span class="pill">${ic('check','s')}${T('fr_friends')}</span>`,me:''}[st];
 return {t:esc(p.n),b:`<div class="stack"><div class="card" style="text-align:center">${av(o.id,84)}<h1 class="h2" style="margin-top:10px">${esc(p.n)}</h1><div class="mut sm">${esc(p.area||'')}</div>${st==='me'?`<p class="sm mut" style="margin-top:8px">${T('profile_note')}</p>`:`<div class="stack" style="margin-top:12px;justify-items:center">${isM()?fb:`<button class="btn" data-act="signup">${T('join_free')}</button>`}<div class="row" style="flex-wrap:wrap;justify-content:center"><button class="btn soft" data-act="msg" data-to="${esc(p.n)}" data-uid="${o.id}" data-pre="${esc(T('hello_msg'))}">${ic('msg','s')}${T('hello')}</button>${st==='friends'?`<button class="btn line" data-act="frdel" data-id="${o.id}">${T('fr_remove')}</button>`:''}<button class="btn line" data-act="report" data-kind="seller" data-id="${o.id}" aria-label="${T('report_seller')}">${ic('flag','s')}</button></div></div>`}</div>
 ${ls.length?`<h2 class="h3">${T('mk_title')}</h2><div class="grid2">${ls.map(l=>`<button class="tile" data-act="push" data-v="listing" data-id="${l.id}"><span class="pic">${thumbFor(l)}<span class="pr">${lmoney(l)}</span></span><span class="tb"><b>${esc(l.t)}</b></span></button>`).join('')}</div>`:''}${ps.map(post).join('')}</div>`};
};
N({profile_note:["This is your profile. What you share here also appears on the home feed.","Burası profilin. Burada paylaştıkların ana akışta da görünür.","To Twój profil. To, co tu udostępniasz, pojawia się też w aktualnościach.","Это ваш профиль. Всё, чем вы делитесь здесь, появляется и в общей ленте."]});
ACT.frreq=async d=>{if(gate())return;const {error}=await sb.from('friendships').insert({requester:S.uid,addressee:d.id,status:'pending'});if(error)return toast(error.message);await reloadFriends();renderOv(true);renderMain()};
ACT.fracc=async d=>{const f=(S.frs||[]).find(x=>x.requester===d.id&&x.addressee===S.uid);if(!f)return;const {error}=await sb.from('friendships').update({status:'accepted',responded_at:new Date().toISOString()}).eq('id',f.id);if(error)return toast(error.message);await reloadFriends();renderOv(true);renderMain()};
ACT.frdel=async d=>{const f=(S.frs||[]).find(x=>x.requester===d.id||x.addressee===d.id);if(!f)return;const {error}=await sb.from('friendships').delete().eq('id',f.id);if(error)return toast(error.message);await reloadFriends();renderOv(true);renderMain()};
V.friends=function(){
 const inc=frIn(),out=frOut(),fr=frAcc();
 const prow=(id,right)=>`<div class="card row">${av(id,44)}<button class="grow" style="border:0;background:none;text-align:left;min-width:0" data-act="push" data-v="person" data-id="${id}"><b>${esc((P[id]||{n:'Member'}).n)}</b><div class="xs mut">${esc((P[id]||{}).area||'')}</div></button>${right||''}</div>`;
 return {t:T('fr_title'),b:`<div class="stack">
 <div class="card stack"><b>${T('fr_find')}</b><input id="fq" type="search" placeholder="${esc(T('fr_find_ph'))}" autocomplete="off"><div id="fres" class="stack"></div></div>
 <h2 class="h3">${T('fr_reqs')}${inc.length?` · ${inc.length}`:''}</h2>${inc.length?inc.map(f=>prow(f.requester,`<button class="btn" data-act="fracc" data-id="${f.requester}">${T('fr_accept')}</button><button class="btn line" data-act="frdel" data-id="${f.requester}" aria-label="${T('fr_decline')}">${ic('x','s')}</button>`)).join(''):`<p class="mut sm">${T('fr_noreq')}</p>`}
 <h2 class="h3">${T('fr_yours')}${fr.length?` · ${fr.length}`:''}</h2>${fr.length?fr.map(f=>prow(frOther(f))).join(''):`<p class="mut sm">${T('fr_none')}</p>`}
 ${out.length?`<h2 class="h3">${T('fr_pending')}</h2>${out.map(f=>prow(f.addressee,`<button class="btn line" data-act="frdel" data-id="${f.addressee}">${T('fr_cancel')}</button>`)).join('')}`:''}</div>`};
};
let fqT=null;
document.addEventListener('input',e=>{
 if(e.target.id!=='fq')return;
 clearTimeout(fqT);const q=e.target.value.trim();
 fqT=setTimeout(async()=>{
  const el=$('#fres');if(!el)return;
  if(q.length<2){el.innerHTML='';return}
  const {data}=await sb.from('people').select('*').ilike('display_name','%'+q.replace(/[%_]/g,'')+'%').neq('id',S.uid).limit(20);
  (data||[]).forEach(r=>{P[r.id]=mkPerson(r)});
  el.innerHTML=(data||[]).length?data.map(r=>{const st=frState(r.id);return `<div class="row">${av(r.id,40)}<button class="grow" style="border:0;background:none;text-align:left;min-width:0" data-act="push" data-v="person" data-id="${r.id}"><b>${esc(P[r.id].n)}</b><div class="xs mut">${esc(P[r.id].area||'')}</div></button>${st==='none'?`<button class="btn soft" data-act="frreq" data-id="${r.id}">${T('fr_add')}</button>`:`<span class="pill">${T(st==='friends'?'fr_friends':st==='sent'?'fr_sent':'fr_reqs')}</span>`}</div>`}).join(''):`<p class="mut sm">${T('fr_noresult')}</p>`;
 },250);
});
SH.msg=s=>`<h2 class="h2">${esc(s.to)}</h2><div class="stack" style="margin-top:12px">${s.about?`<div class="xs mut">${esc(s.about)}</div>`:''}<textarea id="mt" maxlength="600" aria-label="${T('send')}">${esc(s.pre||T('msg_ph'))}</textarea><button class="btn block" data-act="msgsend">${ic('send','s')}${T('send')}</button></div>`;
ACT.msg=d=>{if(gate())return;openSheet({v:'msg',to:d.to,uid:d.uid,pre:d.pre,about:d.about})};
ACT.msgsend=async()=>{
 const s=S.sheet,b=val('mt');if(!b||!s.uid)return;
 const to=s.uid==='me'?S.uid:s.uid;
 const {error}=await sb.from('messages').insert({from_id:S.uid,to_id:to,body:b,about:s.about||null});
 if(error)return toast(error.message);
 closeSheet();toast(T('msg_sent'));
};
V.inbox=function(){
 const th={};(S.msgs||[]).forEach(m=>{const o=m.from_id===S.uid?m.to_id:m.from_id;(th[o]=th[o]||[]).push(m)});
 const keys=Object.keys(th);
 return {t:T('inbox'),b:`<div class="stack">${frIn().length?`<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="friends"><span class="lf" style="background:var(--rs);color:var(--r);width:46px;height:46px">${ic('users')}</span><div class="grow"><b>${T('fr_reqs')}</b></div><span class="pill red">${frIn().length}</span></button>`:''}${keys.length?keys.map(k=>{const last=th[k][0],p=P[k]||{n:'Member'};return `<button class="listrow" data-act="push" data-v="thread" data-id="${k}">${av(k,44)}<span class="grow"><b>${esc(p.n)}</b><span class="xs mut" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(last.body)}</span></span>${th[k].some(m=>m.to_id===S.uid&&!m.read)?'<span class="pill red">•</span>':ic('right')}</button>`}).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('inbox_none')}</p></div>`}</div>`};
};
V.thread=function(o){
 const p=P[o.id]||{n:'Member'},ms=(S.msgs||[]).filter(m=>m.from_id===o.id||m.to_id===o.id).slice().reverse();
 setTimeout(markRead,0,o.id);
 return {t:esc(p.n),b:`<div class="stack">${ms.map(m=>`<div class="card" style="${m.from_id===S.uid?'background:var(--gs);margin-left:32px':'margin-right:32px'}"><div class="xs mut">${m.about?esc(m.about)+' · ':''}${ago(minsAgo(m.created_at))}</div><div style="margin-top:4px;overflow-wrap:anywhere">${U(m.body)}</div></div>`).join('')}<button class="btn block" data-act="msg" data-to="${esc(p.n)}" data-uid="${o.id}" data-pre="">${ic('send','s')}${T('reply')}</button></div>`};
};
async function markRead(from){
 const ids=(S.msgs||[]).filter(m=>m.from_id===from&&m.to_id===S.uid&&!m.read).map(m=>m.id);
 if(!ids.length)return;
 await sb.from('messages').update({read:true}).in('id',ids);
 (S.msgs||[]).forEach(m=>{if(ids.includes(m.id))m.read=true});S.unread=(S.msgs||[]).filter(m=>m.to_id===S.uid&&!m.read).length;renderTop();
}
ACT.bell=async()=>{if(!isM())return push('notifs');await loadNotifs();push('notifs');markNotifsRead()};
V.notifs=function(){if(isM())return notifsMember();return {t:T('notifs'),b:`<div class="stack"><div class="card"><div class="row"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('bell')}</span><div class="grow"><b>${T('nf_t')}</b></div><button class="tg ${S.notif?'on':''}" role="switch" aria-checked="${S.notif}" data-act="notif" aria-label="${T('notifs')}"><i></i></button></div><p class="sm mut" style="margin-top:10px">${T('nf_d')}</p></div><button class="btn block" data-act="signup">${T('join_free')}</button></div>`}};


/* ---------- stage 2: favourites, recommendations, notifications ---------- */
N({looking_for:["Looking for","Arıyor","Szukam","Ищу"],offering:["Offering","Sunuyor","Oferuję","Предлагаю"],cr_intent:["I am…","Ben…","Ja…","Я…"],any_budget:["Any budget","Bütçe esnek","Dowolny budżet","Любой бюджет"],
 cr_ptype:["Property type","Mülk türü","Typ nieruchomości","Тип недвижимости"],cr_baths:["Bathrooms","Banyo","Łazienki","Ванные"],
 fav_add:["Save","Kaydet","Zapisz","Сохранить"],fav_on:["Saved","Kaydedildi","Zapisano","Сохранено"],fav_t:["Your favourites","Favorileriniz","Twoje ulubione","Ваше избранное"],
 recommend:["Recommend","Tavsiye et","Poleć","Рекомендую"],recommended:["Recommended","Tavsiye edildi","Polecone","Рекомендовано"],rec_n:["Recommended by {n}","Tavsiye eden: {n}","Polecają: {n}","Рекомендуют: {n}"],
 cr_repeat:["Repeats","Tekrar","Powtarza się","Повтор"],rp_none:["Does not repeat","Tekrarlamaz","Nie powtarza się","Не повторяется"],rp_weekly:["Every week","Her hafta","Co tydzień","Каждую неделю"],rp_biweekly:["Every 2 weeks","2 haftada bir","Co 2 tygodnie","Раз в 2 недели"],rp_monthly:["Every month","Her ay","Co miesiąc","Каждый месяц"],
 nf_none:["Nothing new yet. When someone writes to you, comments or sends a friend request, it shows here.","Henüz yeni bir şey yok. Biri size yazdığında, yorum yaptığında veya arkadaşlık isteği gönderdiğinde burada görünür.","Na razie nic nowego. Gdy ktoś napisze, skomentuje lub wyśle zaproszenie, zobaczysz to tutaj.","Пока ничего нового. Сообщения, комментарии и заявки в друзья появятся здесь."],
 nf_friend_req:["{n} sent you a friend request","{n} size arkadaşlık isteği gönderdi","{n} wysyła Ci zaproszenie do znajomych","{n} отправляет вам заявку в друзья"],
 nf_friend_ok:["{n} accepted your friend request","{n} arkadaşlık isteğinizi kabul etti","{n} przyjmuje Twoje zaproszenie","{n} принимает вашу заявку в друзья"],
 nf_comment:["{n} commented on your post","{n} gönderinize yorum yaptı","{n} komentuje Twój wpis","{n} комментирует ваш пост"],
 nf_comment_listing:["{n} commented on your listing","{n} ilanınıza yorum yaptı","{n} komentuje Twoje ogłoszenie","{n} комментирует ваше объявление"],
 nf_comment_event:["{n} commented on your event","{n} etkinliğinize yorum yaptı","{n} komentuje Twoje wydarzenie","{n} комментирует ваше событие"],
 nf_message:["{n} sent you a message","{n} size mesaj gönderdi","{n} wysyła Ci wiadomość","{n} пишет вам"],
 nf_going:["{n} is going to your event","{n} etkinliğinize katılıyor","{n} idzie na Twoje wydarzenie","{n} идёт на ваше событие"]});
S.favs=new Set();S.notifs=[];S.nunread=0;DB.recs={};
const favOn=(k,id)=>S.favs.has(k+':'+id);
const recN=id=>(DB.recs[id]||{n:0}).n;
async function loadExtras(){
 if(!S.uid){S.favs=new Set();DB.recs={};S.notifs=[];S.nunread=0;return}
 const [f,r]=await Promise.all([sb.from('favourites').select('kind,ref'),sb.from('dir_recs').select('directory_id,member')]);
 S.favs=new Set((f.data||[]).map(x=>x.kind+':'+x.ref));
 DB.recs={};(r.data||[]).forEach(x=>{const o=DB.recs[x.directory_id]||(DB.recs[x.directory_id]={n:0,mine:false});o.n++;if(x.member===S.uid)o.mine=true});
 await loadNotifs();
}
async function loadNotifs(){
 if(!S.uid)return;
 const r=await sb.from('notifications').select('*').order('created_at',{ascending:false}).limit(50);
 S.notifs=r.data||[];S.nunread=S.notifs.filter(n=>!n.read).length;
 await loadPeople(S.notifs.map(n=>n.actor).filter(Boolean));renderTop();
}
async function markNotifsRead(){
 if(!S.uid||!S.nunread)return;
 S.nunread=0;S.notifs.forEach(n=>n.read=true);renderTop();
 await sb.from('notifications').update({read:true}).eq('member',S.uid).eq('read',false);
}
setInterval(()=>{if(S.uid&&S.prof&&!document.hidden)loadNotifs()},30000);
function notifsMember(){
 const go=n=>({friend_req:['friends'],friend_ok:['friends'],message:['inbox'],comment:['feed'],comment_listing:['listing',n.ref],comment_event:['event',n.ref],going:['event',n.ref]})[n.kind]||['inbox'];
 const ic2={friend_req:'users',friend_ok:'users',message:'msg',comment:'msg',comment_listing:'msg',comment_event:'msg',going:'cal'};
 return {t:T('notifs'),b:`<div class="stack">${S.notifs.length?S.notifs.map(n=>{const w=whoKey(n.actor),nm=(P[w]||{n:'Someone'}).n;return `<button class="listrow" data-act="nfgo" data-id="${n.id}"><span class="lf" style="background:var(--gs);color:var(--gd)">${ic(ic2[n.kind]||'bell')}</span><span class="grow"><b style="font-weight:${n.read?500:700}">${esc(F('nf_'+n.kind,{n:nm}))}</b><span class="xs mut">${ymd(n.created_at)} · ${new Date(n.created_at).toLocaleTimeString(LOC[S.L],{hour:'2-digit',minute:'2-digit'})}</span></span>${ic('right')}</button>`}).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('nf_none')}</p></div>`}</div>`};
}
ACT.nfgo=d=>{
 const n=S.notifs.find(x=>x.id===d.id);if(!n)return;
 const m={friend_req:['friends'],friend_ok:['friends'],message:['inbox'],comment:['feed'],comment_listing:['listing',n.ref],comment_event:['event',n.ref],going:['event',n.ref]}[n.kind]||['inbox'];
 if(m[0]==='feed'){S.stack=[];S.tab='feed';render();return}
 push(m[0],m[1]?{id:m[1]}:{});
};
ACT.fav=async d=>{
 if(gate())return;const key=d.k+':'+d.id,was=S.favs.has(key);
 if(was)S.favs.delete(key);else S.favs.add(key);renderMain();renderOv(true);
 const r=was?await sb.from('favourites').delete().eq('member',S.uid).eq('kind',d.k).eq('ref',d.id):await sb.from('favourites').insert({member:S.uid,kind:d.k,ref:d.id});
 if(r.error){if(was)S.favs.add(key);else S.favs.delete(key);renderMain();renderOv(true);toast(r.error.message)}
};
function recBlock(b){
 if(b.status!=='approved'||b.who==='me')return recN(b.id)?`<div class="sm mut">${F('rec_n',{n:recN(b.id)})}</div>`:'';
 const o=DB.recs[b.id]||{n:0,mine:false};
 return `<div class="row"><button class="btn ${o.mine?'soft':'line'} grow" data-act="rec" data-id="${b.id}">${ic('heart','s')}${o.mine?T('recommended'):T('recommend')}</button>${S.uid?`<button class="btn line" data-act="fav" data-k="biz" data-id="${b.id}" aria-label="${T('fav_add')}">${ic('star','s')}${favOn('biz',b.id)?T('fav_on'):T('fav_add')}</button>`:''}</div>${o.n?`<div class="sm mut">${F('rec_n',{n:o.n})}</div>`:''}`;
}
ACT.rec=async d=>{
 if(gate())return;const o=DB.recs[d.id]||(DB.recs[d.id]={n:0,mine:false}),was=o.mine;
 o.mine=!was;o.n+=was?-1:1;renderOv(true);
 const r=was?await sb.from('dir_recs').delete().eq('directory_id',d.id).eq('member',S.uid):await sb.from('dir_recs').insert({directory_id:d.id,member:S.uid});
 if(r.error){o.mine=was;o.n+=was?1:-1;renderOv(true);toast(r.error.message)}
};
function favCard(){
 const it=[];
 S.favs.forEach(k=>{const [kind,...r]=k.split(':'),ref=r.join(':');
  if(kind==='listing'){const l=S.listings.find(x=>x.id===ref);if(l)it.push(['listing',l.id,l.t,l.area,'tag'])}
  else if(kind==='event'){const e=S.meetups.find(x=>x.id===ref);if(e)it.push(['event',e.id,e.t,ymd(e.starts),'cal'])}
  else if(kind==='biz'){const b=S.dir.find(x=>x.id===ref);if(b)it.push(['dir',b.id,b.n,b.catName,'pin'])}});
 return `<div class="card"><b>${T('fav_t')}</b><div class="stack" style="margin-top:10px">${it.length?it.map(x=>`<button class="listrow" data-act="push" data-v="${x[0]}" data-id="${x[1]}"><span class="lf">${ic(x[4])}</span><span class="grow"><b>${esc(x[2])}</b><span class="xs mut">${esc(x[3]||'')}</span></span>${ic('right')}</button>`).join(''):`<span class="mut sm">${T('none_yet')}</span>`}</div></div>`;
}

/* ---------- community news ---------- */

/* ---------- reports ---------- */
ACT.repsend=async()=>{
 const s=S.sheet;if(!s.r)return;
 await sb.from('reports').insert({reporter:S.uid,kind:s.kind,target_id:String(s.id),reason:s.r});
 s.done=true;renderSheet();
};

/* ---------- search over live data ---------- */
function index(){
 const j=a=>Array.isArray(a)?a.join(' '):String(a),r=[];
 GC.forEach(g=>g.it.forEach((it,i)=>{if(gtOf(g.id+':'+i))r.push({l:A(it),s:A(g.n),ic:g.ic,v:'guide',id:g.id+':'+i,h:j(it)})}));
 S.dir.filter(b=>b.status==='approved').forEach(b=>r.push({l:b.n,s:b.catName+' · '+b.area,ic:'pin',v:'dir',id:b.id,h:b.n+' '+b.area+' '+b.catName}));
 S.meetups.forEach(e=>r.push({l:e.t,s:T('m_events'),ic:'cal',v:'event',id:e.id,h:e.t+' '+e.where}));
 DB.clubs.forEach(c=>r.push({l:c.name,s:T('m_clubs'),ic:c.icon||'users',v:'club',id:c.id,h:c.name+' '+(c.blurb||'')}));
 S.listings.forEach(l=>r.push({l:l.t,s:T('mk_title'),ic:'tag',v:'listing',id:l.id,h:l.t+' '+l.area+' '+l.catName+' '+l.d}));
 return r;
}

/* ---------- Me ---------- */
function meV(){
 let h=`<div class="stack">${bannerHtml('me')}`;
 if(!isM()){
  h+=`<div class="card" style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('user','l')}</div><h2 class="h2">${T('me_vis_t')}</h2><p class="mut" style="margin:6px 0 14px">${T('me_vis_d')}</p><div class="stack"><button class="btn block" data-act="signup">${T('join_free')}</button><button class="btn soft block" data-act="signinsheet">${T('sign_in')}</button></div></div>`;
 }else{
  const biz=S.role==='business';
  h+=notes();
  h+=`<div class="card"><div class="row">${av('me',64)}<div class="grow"><h2 class="h2">${esc(P.me.n)}</h2><div class="mut sm">${esc(P.me.area||'')}</div><label class="btn soft" for="c-pf" style="margin-top:8px;display:inline-flex">${ic('image','s')}${T('chg_photo')}</label><input id="c-pf" type="file" accept="image/*" class="pfx"><div style="margin-top:6px"><span class="pill">${ic('lock','s')}${T('me_acct')}: ${T(biz?'su_biz':'su_ind')}</span></div></div></div></div>`;
  h+=acctCard();
  h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="person" data-id="me">${av('me',46)}<div class="grow"><b>${T('my_profile')}</b></div>${ic('right')}</button><button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="friends"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('users')}</span><div class="grow"><b>${T('fr_title')}</b><div class="sm mut">${frAcc().length}</div></div>${frIn().length?`<span class="pill red">${frIn().length}</span>`:ic('right')}</button>`;
  h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="inbox"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('msg')}</span><div class="grow"><b>${T('inbox')}</b></div>${S.unread?`<span class="pill red">${S.unread}</span>`:ic('right')}</button>`;
  if(S.admin)h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="admin"><span class="lf" style="background:var(--rs);color:var(--r);width:46px;height:46px">${ic('shield')}</span><div class="grow"><b>${T('admin_t')}</b></div>${ic('right')}</button>`;
  h+=favCard();
  const sv=Object.keys(S.saved).filter(k=>S.saved[k]);
  h+=`<div class="card"><b>${T('saved_items')}</b><div class="stack" style="margin-top:10px">${sv.length?sv.map(k=>{const [c,i]=k.split(':');const g=GC.find(x=>x.id===c);return g?row('push','guide',k,g.ic,A(g.it[+i]),A(g.n)):''}).join(''):`<span class="mut sm">${T('none_yet')}</span>`}</div></div>`;
 }
 h+=`<div class="card"><b>${T('theme')}</b>${themeSeg()}<b style="display:block;margin-top:16px">${T('lang')}</b><div class="seg" style="margin-top:10px">${NATIVE.map((n,i)=>`<button class="${S.L===i?'on':''}" data-act="setlang" data-id="${i}">${n}</button>`).join('')}</div></div>`;
 h+=appCard();
 if(isM())h+=`<button class="btn line block" data-act="signout">${T('sign_out')}</button>`;
 return h+footerV()+'</div>';
}
/* profile photo -> storage */
async function uploadDataUrl(dataUrl,folder){
 const blob=await (await fetch(dataUrl)).blob();
 const path=S.uid+'/'+(folder||'x')+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)+'.jpg';
 const {error}=await sb.storage.from('media').upload(path,blob,{contentType:'image/jpeg'});
 if(error)throw error;
 return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}
async function savePhoto(dataUrl){
 try{const url=await uploadDataUrl(dataUrl,'avatar');await sb.from('profiles').update({photo_url:url}).eq('id',S.uid);S.prof.photo_url=url;setMe();render();toast(T('welcome'))}catch(e){toast(e.message||'Upload failed')}
}

/* ---------- create sheets ---------- */
const MF2=n=>`<label class="f" for="c-m2">${T('cr_photos')}</label><input id="c-m2" type="file" accept="image/*" ${n>1?'multiple':''}><div id="c-pv" style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"></div>`;
function readImg(f){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1024/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};im.onerror=()=>res(null);im.src=r.result};r.onerror=()=>res(null);r.readAsDataURL(f)})}
document.addEventListener('change',async e=>{
 if(e.target.id!=='c-m2'||!S.cr)return;
 const t=S.sheet&&S.sheet.type,max=t==='listing'?4:1,files=[...e.target.files].slice(0,max),out=[];
 for(const f of files){const d=await readImg(f);if(d)out.push(d)}
 S.cr.imgs=out;S.cr.img=out[0]||'';
 const pv=$('#c-pv');if(pv)pv.innerHTML=out.map(u=>`<img src="${u}" alt="" style="width:76px;height:76px;object-fit:cover;border-radius:12px">`).join('');
});
SH.create=function(s){
 if(!s.type)return `<h2 class="h2" style="margin-bottom:12px">${T('cr_choose')}</h2><div class="grid2">${[['post','msg','cr_post'],['listing','bag','cr_listing'],['meetup','cal','cr_meetup'],['help','buoy','cr_help']].map(t=>`<button class="mod" style="min-height:96px" data-act="crtype" data-id="${t[0]}"><span class="lf" style="${t[0]==='help'?'background:var(--gs);color:var(--gd)':''}">${ic(t[1])}</span><b style="font-size:15px">${T(t[2])}</b></button>`).join('')}</div>`;
 const t=s.type,au=S.cr.aud,pf=S.prof||{};
 const today=new Date().toISOString().slice(0,10);
 const f=({post:`<textarea id="c-x" maxlength="1500" placeholder="${T('cr_text')}" aria-label="${T('cr_text')}"></textarea>${MF2(1)}`,
  help:`<textarea id="c-x" maxlength="1500" placeholder="${T('cr_text')}" aria-label="${T('cr_text')}"></textarea>${MF2(1)}<p class="xs mut" style="margin-top:6px">${T('cr_help_note')}</p>`,
  listing:`${MF2(4)}<label class="f" for="c-int">${T('cr_intent')}</label><select id="c-int"><option value="offer">${T('offering')}</option><option value="looking">${T('looking_for')}</option></select><label class="f" for="c-t">${T('cr_title')}</label><input id="c-t" maxlength="80"><label class="f" for="c-d">${T('cr_desc')}</label><textarea id="c-d" maxlength="400" style="min-height:80px"></textarea>
   <div class="grid2" style="gap:10px"><div><label class="f" for="c-p">${T('cr_price')}</label><input id="c-p" type="number" inputmode="decimal" min="0"></div><div>${listSel('c-cur',T('cr_cur'),'currency',(DB.lists.currency||[]).find(x=>/TL|TRY/.test(x)))}</div></div>
   ${catSel('c-m','market',{})}<div id="std-x">${listSel('c-cond',T('cr_cond'),'condition')}${listSel('c-hand',T('cr_hand'),'handover')}</div><div id="prop-x" hidden>${listSel('c-pt',T('cr_ptype'),'property_type')}${listSel('c-bath',T('cr_baths'),'bathrooms')}${listSel('c-beds',T('cr_beds'),'bedrooms')}${listSel('c-furn',T('cr_furn'),'furnished')}<p class="xs mut" id="rent-n" style="margin-top:6px">${T('cr_rent_n')}</p></div><div class="card" style="margin-top:12px"><b>${T('cr_addr')}</b>${geoSel('lg',{d:pf.district_id,t:pf.town_id,a:pf.area_id})}</div>`,
  meetup:`<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t" maxlength="80"><div class="grid2" style="gap:10px"><div><label class="f" for="c-dt">${T('cr_when_d')}</label><input id="c-dt" type="date" min="${today}"></div><div><label class="f" for="c-tm">${T('cr_when_t')}</label><select id="c-tm">${Array.from({length:36},(_,i)=>{const m=6*60+i*30,hh=String(Math.floor(m/60)).padStart(2,'0'),mm=String(m%60).padStart(2,'0');return `<option value="${hh}:${mm}" ${hh+':'+mm==='10:00'?'selected':''}>${hh}:${mm}</option>`}).join('')}</select></div></div><label class="f" for="c-rp">${T('cr_repeat')}</label><select id="c-rp">${['none','weekly','biweekly','monthly'].map(r=>`<option value="${r}">${T('rp_'+r)}</option>`).join('')}</select><div class="card" style="margin-top:12px"><b>${T('cr_where')}</b>${geoSel('lg',{d:pf.district_id,t:pf.town_id,a:pf.area_id})}<label class="f" for="c-ad">${T('address')}</label><input id="c-ad" maxlength="120"></div>`})[t];
 const showAud=(t==='post'||t==='help')&&!s.club;
 return `<div class="row" style="margin-bottom:8px"><button class="ib" data-act="crback" aria-label="${T('back')}">${ic('left')}</button><h2 class="h2">${T(({post:'cr_post',listing:'cr_listing',meetup:'cr_meetup',help:'cr_help'})[t])}</h2></div>${f}${showAud?`<label class="f">${T('audience')}</label><div class="seg" id="aud">${['public','members','friends'].map(a=>`<button class="${au===a?'on':''}" data-act="aud" data-id="${a}">${ic(audI[a],'s')}${T(audK[a])}</button>`).join('')}</div>`:''}<button class="btn block" style="margin-top:16px" data-act="crpub">${T('cr_pub')}</button>`;
};
ACT.create=d=>{if(gate())return;S.cr={aud:'public',imgs:[],club:d.club||null};openSheet({v:'create',type:d.type||null,club:d.club||null})};
ACT.crtype=d=>{S.sheet.type=d.id;S.cr.imgs=[];S.cr.img='';renderSheet()};
ACT.crpub=async function(){
 const s=S.sheet,t=s.type;if(S.cr.busy)return;
 const btn=document.querySelector('[data-act="crpub"]');
 S.cr.busy=true;if(btn)btn.disabled=true;
 try{
  const urls=[];for(const d of (S.cr.imgs||[]))urls.push(await uploadDataUrl(d,t));
  if(t==='post'||t==='help'){
   const x=val('c-x');if(!x){toast(T('cr_text'));throw 0}
   const club=s.club||null;
   const {error}=await sb.from('posts').insert({author:S.uid,body:x,audience:club?'members':S.cr.aud,help:t==='help',media_url:urls[0]||null,club_id:club});if(error)throw error;
   if(!club)S.tab='feed';
  }else if(t==='listing'){
   const ti=val('c-t'),de=val('c-d'),g=geoVals('lg'),cat=$('#c-m-c').value,sub=($('#c-m-s')||{}).value||'';
   if(!ti||!de||!cat||!g.d){toast(T('cr_need'));throw 0}
   const catId=cat==='__other'?null:(sub||cat);
   const {data:ins,error}=await sb.from('listings').insert({author:S.uid,intent:val('c-int')||'offer',title:ti,description:de,price:+val('c-p')||0,currency:val('c-cur')||'TRY',category_id:catId,...(/^market-(rent|sale)$/.test(cat)?{condition:null,handover:null,property_type:/^Not applicable/.test(val('c-pt'))?null:(val('c-pt')||null),bathrooms:/^Not applicable/.test(val('c-bath'))?null:(val('c-bath')||null),bedrooms:/^Not applicable/.test(val('c-beds'))?null:val('c-beds'),furnished:/^Not applicable/.test(val('c-furn'))?null:val('c-furn'),period:cat==='market-rent'?'month':null}:{condition:val('c-cond'),handover:val('c-hand')}),district_id:g.d,town_id:g.t==='__other'?null:(g.t||null),area_id:g.a==='__other'?null:(g.a||null),photos:urls}).select('status').single();if(error)throw error;
   S.cr.held=ins&&ins.status==='held';
   if(cat==='__other')await otherReq('market_category',val('c-m-co'));
   if(g.t==='__other')await otherReq('town',g.to);if(g.a==='__other')await otherReq('area',g.ao);
   S.tab='market';
  }else if(t==='meetup'){
   const ti=val('c-t'),dt=val('c-dt'),tm=val('c-tm'),g=geoVals('lg');
   if(!ti||!dt||!g.d){toast(T('cr_need'));throw 0}
   const {error}=await sb.from('meetups').insert({author:S.uid,repeat:val('c-rp')||'none',title:ti,starts_at:new Date(dt+'T'+tm+':00').toISOString(),district_id:g.d,town_id:g.t==='__other'?null:(g.t||null),area_id:g.a==='__other'?null:(g.a||null),address:val('c-ad')||null});if(error)throw error;
   if(g.t==='__other')await otherReq('town',g.to);if(g.a==='__other')await otherReq('area',g.ao);
   S.tab='explore';
  }
  const keepClub=s.club;closeSheet();S.stack=keepClub?S.stack:[];await loadContent();render();window.scrollTo(0,0);toast(S.cr.held?T('cr_held'):T('cr_done'));S.cr.held=false;
 }catch(e){if(e)crErr(e)}
 S.cr.busy=false;if(btn)btn.disabled=false;
};

/* ---------- chat bubble (member to admin) ---------- */
S.sup=[];S.supUnread=0;
const supHtml=()=>{const m=S.sup||[];return m.length?m.map(x=>`<div class="card" style="${x.from_admin?'margin-right:32px':'background:var(--gs);margin-left:32px'}"><div class="xs mut">${x.from_admin?T('sup_team'):T('sup_you')} · ${ago(minsAgo(x.created_at))}</div><div style="margin-top:4px;overflow-wrap:anywhere;white-space:pre-wrap">${esc(x.body)}</div></div>`).join(''):`<p class="mut sm" style="text-align:center">${T('sup_empty')}</p>`};
function updateBubble(){
 const b=$('#chatb');if(!b)return;
 const show=!!S.uid&&!!S.prof&&(!S.admin||S.supUnread>0);
 b.hidden=!show;const d=b.querySelector('.dot');d.hidden=!S.supUnread;d.textContent=S.supUnread;
}
async function supRead(){
 const ids=(S.sup||[]).filter(x=>x.from_admin&&!x.read).map(x=>x.id);if(!ids.length)return;
 await sb.from('support_messages').update({read:true}).in('id',ids);
 S.sup.forEach(x=>{if(ids.includes(x.id))x.read=true});S.supUnread=0;updateBubble();
}
async function supLoad(){
 if(!S.uid||!S.prof)return;
 if(S.admin){const r=await sb.rpc('admin_support_threads');S.supUnread=(r.data||[]).reduce((a,x)=>a+Number(x.unread),0);updateBubble();return}
 const r=await sb.from('support_messages').select('*').eq('member',S.uid).order('created_at');if(r.error)return;
 S.sup=r.data||[];S.supUnread=S.sup.filter(x=>x.from_admin&&!x.read).length;
 if(S.sheet&&S.sheet.v==='support'){const l=$('#sup-l');if(l){l.innerHTML=supHtml();l.scrollTop=l.scrollHeight}await supRead()}
 updateBubble();
}
SH.support=()=>`<div class="row"><span class="lf" style="background:var(--gs);color:var(--gd)">${ic('msg','l')}</span><div><h2 class="h2">${T('sup_t')}</h2><div class="sm mut">${T('sup_d')}</div></div></div><div id="sup-l" class="stack" style="margin:12px 0;max-height:44vh;overflow-y:auto">${supHtml()}</div><textarea id="sup-t" maxlength="1000" placeholder="${esc(T('sup_ph'))}" aria-label="${esc(T('sup_ph'))}"></textarea><button class="btn block" style="margin-top:8px" data-act="supsend">${ic('send','s')}${T('send')}</button>`;
ACT.supportopen=async()=>{
 if(S.admin){return ACT.adminsupport()}
 openSheet({v:'support'});await supLoad();await supRead();const l=$('#sup-l');if(l)l.scrollTop=l.scrollHeight;
};
ACT.supsend=async()=>{
 const b=val('sup-t');if(!b)return;
 const {error}=await sb.from('support_messages').insert({member:S.uid,from_admin:false,body:b});
 if(error)return toast(error.message);
 const t=$('#sup-t');if(t)t.value='';await supLoad();const l=$('#sup-l');if(l)l.scrollTop=l.scrollHeight;toast(T('msg_sent'));
};
setInterval(()=>{if(S.uid&&S.prof&&!document.hidden)supLoad()},15000);

/* ---------- apply to join (when sign-up is invitation only) ---------- */
N({ap_btn:["No invite code? Apply to join","Davet kodunuz yok mu? Katılmak için başvurun","Brak kodu? Złóż wniosek o dołączenie","Нет кода? Подайте заявку"],
 ap_t:["Apply to join","Katılmak için başvur","Poproś o dołączenie","Заявка на вступление"],
 ap_d:["Tell us a little about yourself. We will reply by email with an invitation and how to get started.","Kendinizden kısaca bahsedin. Davet ve başlangıç bilgisiyle e-posta ile döneceğiz.","Napisz kilka słów o sobie. Odpiszemy e-mailem z zaproszeniem.","Расскажите немного о себе. Мы ответим по почте с приглашением."],
 ap_name:["Your name","Adınız","Imię","Ваше имя"],ap_country:["Country you are from","Geldiğiniz ülke","Kraj","Страна"],
 ap_how:["How did you hear about us?","Bizi nereden duydunuz?","Skąd o nas wiesz?","Как вы о нас узнали?"],
 ap_conn:["How are you connected to North Cyprus?","Kuzey Kıbrıs ile bağınız nedir?","Jaki masz związek z Cyprem Północnym?","Какая у вас связь с Северным Кипром?"],
 ap_pick:["Please choose one","Lütfen birini seçin","Wybierz jedną opcję","Выберите вариант"],
 ap_k_tourist:["Tourist or planning a trip","Turist veya gezi planlıyorum","Turysta lub planuję wyjazd","Турист или планирую поездку"],
 ap_k_expat:["Expat","Gurbetçi / yurt dışında yaşıyorum","Ekspat","Эмигрант"],
 ap_k_family:["Family or friend of someone connected to North Cyprus","Kuzey Kıbrıs bağlantılı birinin ailesi veya arkadaşı","Rodzina lub przyjaciel osoby związanej z Cyprem Północnym","Семья или друг человека, связанного с Северным Кипром"],
 ap_k_resident:["Resident of North Cyprus","Kuzey Kıbrıs sakini","Mieszkaniec Cypru Północnego","Житель Северного Кипра"],
 ap_k_other:["Other (tell us in the box below)","Diğer (aşağıdaki kutuya yazın)","Inne (napisz poniżej)","Другое (напишите ниже)"],
 ap_conn_err:["Please tell us how you are connected to North Cyprus.","Lütfen Kuzey Kıbrıs ile bağınızı belirtin.","Powiedz nam, jaki masz związek z Cyprem Północnym.","Укажите, какая у вас связь с Северным Кипром."],
 ap_msg:["Anything you would like to add (optional)","Eklemek istedikleriniz (isteğe bağlı)","Coś jeszcze (opcjonalnie)","Что-то добавить (необязательно)"],
 ap_send:["Send application","Başvuruyu gönder","Wyślij","Отправить"],
 ap_ok:["Thank you. We have your application and will be in touch by email.","Teşekkürler. Başvurunuz alındı, e-posta ile dönüş yapacağız.","Dziękujemy. Odezwiemy się e-mailem.","Спасибо! Мы свяжемся с вами по почте."],
 ap_err:["Please add your name and a valid email.","Lütfen adınızı ve geçerli bir e-posta girin.","Podaj imię i poprawny e-mail.","Укажите имя и корректный e-mail."],
 ap_dup:["We already have an application from this email. We will be in touch.","Bu e-posta ile zaten başvuru var. Dönüş yapacağız.","Mamy już zgłoszenie z tego adresu.","Заявка с этого адреса уже есть."]});
SH.apply=s=>`<h2 class="h2">${T('ap_t')}</h2><p class="sm mut" style="margin-top:6px">${T('ap_d')}</p><div class="stack" style="margin-top:12px"><div><label class="f" for="ap-n">${T('ap_name')}</label><input id="ap-n" maxlength="60" autocomplete="name"><label class="f" for="ap-e">${T('su_email')}</label><input id="ap-e" type="email" inputmode="email" autocomplete="email" maxlength="120"><label class="f" for="ap-c">${T('ap_country')}</label><input id="ap-c" maxlength="60"><label class="f" for="ap-k">${T('ap_conn')}</label><select id="ap-k"><option value="">${T('ap_pick')}</option>${['tourist','expat','family','other'].map(k=>`<option value="${k}"${s.k===k?' selected':''}>${T('ap_k_'+k)}</option>`).join('')}</select><label class="f" for="ap-h">${T('ap_how')}</label><input id="ap-h" maxlength="120"><label class="f" for="ap-m">${T('ap_msg')}</label><textarea id="ap-m" maxlength="600"></textarea></div>${s.err?`<div class="note">${ic('info')}<div class="sm">${esc(s.err)}</div></div>`:''}<button class="btn block" data-act="applysend">${T('ap_send')}</button></div>`;
ACT.applyopen=()=>{if(S.su)grabSu();openSheet({v:'apply'})};
ACT.applysend=async()=>{
 const n=val('ap-n'),e=val('ap-e');
 if(n.length<2||!/^\S+@\S+\.\S+$/.test(e)){openSheet({v:'apply',err:T('ap_err')});return}
 const k=val('ap-k');
 if(!k){openSheet({v:'apply',err:T('ap_conn_err')});return}
 const row={name:n,email:e,connection:k,country:val('ap-c')||null,how_heard:val('ap-h')||null,message:val('ap-m')||null};
 const {error}=await sb.from('join_requests').insert(row);
 if(error&&error.code!=='23505')return toast(error.message);
 closeSheet();toast(error?T('ap_dup'):T('ap_ok'));
};

/* ---------- policies ---------- */
function policyText(id){
 const c=DB.contact;
 const contact=['the chat bubble in the app',c.email].filter(Boolean).join(' or email ');
 const X={
 about:[['Welcome',`${SITE_NAME} is a friendly, small community for friends and neighbours connected to North Cyprus, wherever in the world they are. Think of it as a small private group: ask questions, share tips, meet people, buy, sell or rent from each other, and find local businesses.`],['Good to know',`It is run by two private individuals, not a company, agent, bank or government body. It is a small circle for people from any country who are part of the North Cyprus community. The administrators decide who joins and may close an account that does not fit.`]],
 terms:[['House rules',`Be kind and honest. No hate, harassment, scams, adult content or anything illegal. Do not share other people's private details. You are responsible for what you post, and the administrators can edit, hide or remove anything and close any account. Use the flag button to report anything that worries you.`],['Feed and friends',`The feed shows only what members post on their own profile, as a photo and a few words. You choose who sees each post: everyone, members, or friends only. Friends are by request and acceptance. There is no following.`],['Marketplace',`Sell or give away small items, and list property to rent or for sale. Prices are in TL or GBP. No cars and no services. Listings last 30 days and use photos. Deals are agreed directly between members, in person, in cash or however you agree. The platform never takes payment or guarantees any sale, so check everything before you pay.`],['Marketplace safety rules',`To keep the marketplace for real members, a new member can start posting listings after their account is 7 days old, and may have only a small number of active listings during their first weeks. Listings that look like scams are held for a person to check before they appear, and a listing reported by two different members is held in the same way. You can report, mute or block any member. Never pay anyone in advance for something you have not seen.`],['Guides and advice',`Guides and posts come from the community. They are not legal, tax, medical or financial advice. Check with official sources and professionals.`],['Businesses',`Directory listings are agreed with the administrators, shown as unverified until confirmed, and may be removed at any time.`]],
 payment:[['Free to join and enjoy',`Joining ${SITE_NAME} is free, and there is nothing to pay at the moment. Everything in the app is free to use.`],['Why a fee may come later',`The aim is to bring every tourist, would-be tourist and expat together in one friendly place. Running it has real costs. To keep it going, we may introduce a small monthly member fee in future. If we do, we will tell every member clearly and well in advance, explain the amount and how to pay, and you will be free to stay or to leave. Nothing changes until then.`],['Invitation only',`Sign-up is open for now. The administrators may make it invitation only at any time. Existing members are not affected.`],['No card details',`We never ask for card details in the app.`]],
 privacy:[['What we keep',`Your name, email, area, account type, and the posts, photos, listings, friends and messages you create, plus the date you joined. Passwords are stored scrambled.`],['Who sees what',`Public posts can be seen by guests who are not signed in. Members-only posts, friends-only posts, messages and the marketplace are for signed-in members. Your email is never shown to other members. Administrators can see account details to run the community.`],['Where it lives',`In a secure cloud database in the European Union (Frankfurt). We send sign-in and account emails through an email service. We never sell your data and use no third-party tracking.`],['Your choices',`Edit your name, area and photo any time. To have your account and content deleted, contact ${contact}.`],['Note',`This is a plain-language summary and should be reviewed by a qualified adviser before launch.`]],
 contact:[['Contact',`Message us through ${contact}.`],['How fast we reply',`We aim to reply within one working day.`],['Our web address',`ncyprusconnect.com`],['In an emergency',`Call the emergency numbers in the SOS button. This community cannot send help.`]]
 };
 return X[id]||[];
}
V.policy=function(o){
 const titles={about:'f_about',terms:'f_terms',payment:'f_pay',privacy:'f_priv',contact:'f_contact'};
 return {t:T(titles[o.id]||'f_about'),b:`<div class="stack">${policyText(o.id).map(s=>`<div class="card"><b>${esc(s[0])}</b><p style="margin-top:6px;overflow-wrap:anywhere">${esc(s[1])}</p></div>`).join('')}<div class="row" style="flex-wrap:wrap;gap:8px">${['about','terms','payment','privacy','contact'].filter(x=>x!==o.id).map(x=>`<button class="chip" data-act="policy" data-id="${x}">${T(titles[x])}</button>`).join('')}</div></div>`};
};
ACT.policy=d=>{S.stack[S.stack.length-1]={v:'policy',id:d.id};renderOv(false)};

/* ---------- guides & updates: attribution and untouched content ---------- */
const GM_SAFE=id=>MV[id]?MV[id]:['tag',hueOf(id)];

/* ---------- stage 4: written guides and the updates feed ---------- */
N({
 gt_src:["Official source","Resmi kaynak","Źródło urzędowe","Официальный источник"],
 gt_chk:["Last checked {d}","Son kontrol: {d}","Ostatnio sprawdzono: {d}","Проверено: {d}"],
 gt_law:["Legal basis","Yasal dayanak","Podstawa prawna","Правовая основа"],
 gt_note:["Written from official pages. Rules change, so always confirm on the official page before you act. This is not legal advice.","Resmi sayfalardan yazılmıştır. Kurallar değişir; işlem yapmadan önce resmi sayfadan doğrulayın. Hukuki tavsiye değildir.","Opracowano na podstawie stron urzędowych. Przepisy się zmieniają, więc przed działaniem sprawdź stronę urzędową. To nie jest porada prawna.","Составлено по официальным страницам. Правила меняются, поэтому перед действиями проверьте официальную страницу. Это не юридическая консультация."],
 gt_en:["Written in English. Translations will follow.","İngilizce yazılmıştır. Çeviriler yakında.","Napisano po angielsku. Tłumaczenia wkrótce.","Написано на английском. Переводы будут позже."],
 gt_ask:["Ask the team","Ekibe sorun","Zapytaj zespół","Спросить команду"],
 up_guide:["Read the guide","Rehberi okuyun","Przeczytaj poradnik","Открыть гид"],
 up_cat_all:["All","Tümü","Wszystkie","Все"],
 uc_residency:["Residency","Oturum","Pobyt","Резидентство"],uc_property:["Property","Mülk","Nieruchomości","Недвижимость"],uc_visas:["Visas","Vizeler","Wizy","Визы"],uc_driving:["Driving and vehicles","Sürücülük ve araçlar","Prowadzenie i pojazdy","Вождение и транспорт"],uc_health:["Health","Sağlık","Zdrowie","Здоровье"],uc_tax:["Tax and money","Vergi ve para","Podatki i pieniądze","Налоги и деньги"],uc_other:["Other","Diğer","Inne","Другое"],uc_community:["Community","Topluluk","Społeczność","Сообщество"],
 up_from_off:["From the community team, based on official sources","Resmi kaynaklara dayanan topluluk ekibinden","Od zespołu społeczności, na podstawie źródeł urzędowych","От команды сообщества, на основе официальных источников"]
});
const UCATS=['residency','property','visas','driving','health','tax','other'];
async function loadGuides(){const r=await sb.from('guide_texts').select('*').eq('published',true);DB.gt={};(r.data||[]).forEach(x=>{DB.gt[x.guide_key]=x})}
const gtOf=k=>(DB.gt||{})[k];
const gtN=()=>Object.keys(DB.gt||{}).length;
const gcVis=()=>GC.map(g=>({g,ix:g.it.map((_,i)=>i).filter(i=>gtOf(g.id+':'+i))})).filter(x=>x.ix.length);
function gtBody(t){
 return String(t||'').split(/\n\s*\n/).map(b=>{const ls=b.split('\n').map(s=>s.trim()).filter(Boolean);if(!ls.length)return '';
  const head=ls.length>1&&ls[0].length<=70&&!/[.:;!?]$/.test(ls[0]);
  return (head?`<h2 class="h3" style="margin-top:6px">${U(ls[0])}</h2>`:'')+`<p style="overflow-wrap:anywhere;white-space:pre-wrap">${U((head?ls.slice(1):ls).join('\n'))}</p>`}).join('');
}
const srcLine=(o)=>[o.checked_on?F('gt_chk',{d:ymd(o.checked_on)}):'',o.source_url?`<a href="${esc(o.source_url)}" target="_blank" rel="noopener nofollow">${T('gt_src')}${o.source_name?': '+esc(o.source_name):''}</a>`:''].filter(Boolean).join(' · ');
V.guides=function(){const v=gcVis();return {t:T('m_guides'),b:`<p class="mut" style="margin-bottom:12px">${T('guides_sub')}</p><div class="grid2">${v.map(({g,ix})=>`<button class="mod" data-act="push" data-v="gcat" data-id="${g.id}"><span class="mp">${thmArt(g.id)}</span><b>${A(g.n)}</b><small>${F('gcount',{n:ix.length})}</small></button>`).join('')}</div>`}};
V.gcat=function(o){const g=GC.find(x=>x.id===o.id),m=GM[g.id],ix=g.it.map((_,i)=>i).filter(i=>gtOf(g.id+':'+i));return {t:A(g.n),b:`<div class="stack">${gal(m,MV[m][0],MV[m][1],'')}<p class="mut">${F('gcount',{n:ix.length})}</p>${ix.map(i=>rowt('push','guide',g.id+':'+i,thmRaw(MV[m][0],(MV[m][1]+i*25)%360),A(g.it[i]),'',S.saved[g.id+':'+i]?ic('star','s'):undefined)).join('')}</div>`}};
V.guide=function(o){
 const [c,i]=o.id.split(':');const g=GC.find(x=>x.id===c),t=gtOf(o.id);if(!g||!t)return {t:T('m_guides'),b:`<div class="card" style="text-align:center"><p class="mut">${T('none_yet')}</p></div>`};
 const name=A(g.it[+i]),sv=!!S.saved[o.id];
 return {t:A(g.n),b:`<div class="stack"><div><span class="pill">${ic(g.ic,'s')}${A(g.n)}</span><h1 class="h1" style="margin-top:10px">${name}</h1><p class="xs mut" style="margin-top:6px">${srcLine(t)}</p></div>
 <div class="card stack">${gtBody(t.body)}</div>
 ${t.law_ref?`<div class="card"><b>${T('gt_law')}</b><p class="sm mut" style="margin-top:4px;overflow-wrap:anywhere">${esc(t.law_ref)}</p></div>`:''}
 <div class="row"><button class="btn grow" data-act="push" data-v="policy" data-id="contact">${ic('msg','s')}${T('gt_ask')}</button><button class="btn soft" data-act="save" data-id="${o.id}">${ic('star','s')}${sv?T('g_saved'):T('g_save')}</button></div>
 <div class="note g">${ic('info')}<div class="sm">${T('gt_note')}${S.L!=='en'?' '+T('gt_en'):''}</div></div>
 ${g.it.some((_,j)=>j!==+i&&gtOf(c+':'+j))?`<div><h2 class="h3" style="margin-bottom:10px">${T('related')}</h2><div class="stack">${g.it.map((it,j)=>j===+i||!gtOf(c+':'+j)?'':row('push','guide',c+':'+j,g.ic,A(it))).join('')}</div></div>`:''}</div>`}};
const catPill=u=>u.category&&T('uc_'+u.category)?`<span class="pill">${T('uc_'+u.category)}</span>`:'';
V.updates=function(){
 const all=S.upd||[],f=S.ucat||'all',list=f==='all'?all:all.filter(u=>(u.category||'other')===f),used=UCATS.filter(c=>all.some(u=>u.category===c));
 return {t:T('m_updates'),b:`<div class="stack">${used.length?`<div class="row" style="flex-wrap:wrap;gap:8px"><button class="chip ${f==='all'?'on':''}" data-act="ucat" data-id="all">${T('up_cat_all')}</button>${used.map(c=>`<button class="chip ${f===c?'on':''}" data-act="ucat" data-id="${c}">${T('uc_'+c)}</button>`).join('')}</div>`:''}
 ${list.length?list.map(u=>rowt('push','update',u.id,u.image_url?`<span class="th"><img class="art" src="${esc(u.image_url)}" alt=""></span>`:thmRaw('group',hueOf(u.id)),esc(u.title),(u.category?T('uc_'+u.category)+' · ':'')+ymd(u.created_at))).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('none_yet')}</p></div>`}</div>`}};
ACT.ucat=d=>{S.ucat=d.id;renderOv(true)};
V.update=function(o){const u=(S.upd||[]).find(x=>x.id===o.id);if(!u)return {t:T('m_updates'),b:''};
 const off=u.source_url||u.law_ref;
 return {t:T('m_updates'),b:`<div class="stack">${u.image_url?`<div class="galw"><div class="gal"><div class="sl"><img class="art" src="${esc(u.image_url)}" alt=""></div></div></div>`:''}<div class="row" style="flex-wrap:wrap;gap:8px">${catPill(u)}<span class="pill">${ic('cal','s')}${ymd(u.created_at)}</span></div><h1 class="h1">${U(u.title)}</h1><p style="white-space:pre-wrap;overflow-wrap:anywhere">${U(u.body)}</p>
 ${off?`<div class="card stack">${u.law_ref?`<b>${T('gt_law')}</b><div class="sm" style="overflow-wrap:anywhere">${esc(u.law_ref)}</div>`:''}<div class="xs mut">${srcLine(u)}</div></div>`:''}
 ${u.guide_key&&gtOf(u.guide_key)?`<button class="btn soft block" data-act="push" data-v="guide" data-id="${esc(u.guide_key)}">${ic('book','s')}${T('up_guide')}</button>`:''}
 <div class="note g">${ic('info')}<div class="sm">${off?T('up_from_off'):T('up_from')}</div></div>${actBar('update',u.id,u.title,{})}</div>`}};


/* ---------- phone alerts (web push) ---------- */
N({
 pu_t:["Phone alerts","Telefon bildirimleri","Powiadomienia na telefonie","Уведомления на телефоне"],
 pu_d:["Get a short alert on this phone for replies, messages and friend requests. You can turn it off any time.","Yanıtlar, mesajlar ve arkadaşlık istekleri için bu telefonda kısa bildirim alın. İstediğiniz zaman kapatabilirsiniz.","Otrzymuj krótkie powiadomienia na tym telefonie o odpowiedziach, wiadomościach i zaproszeniach. Możesz je wyłączyć w każdej chwili.","Получайте короткие уведомления на этом телефоне об ответах, сообщениях и заявках в друзья. Их можно отключить в любой момент."],
 pu_on:["Turn on alerts","Bildirimleri aç","Włącz powiadomienia","Включить уведомления"],
 pu_off:["Turn off alerts","Bildirimleri kapat","Wyłącz powiadomienia","Выключить уведомления"],
 pu_is:["Alerts are on for this phone.","Bu telefonda bildirimler açık.","Powiadomienia na tym telefonie są włączone.","Уведомления на этом телефоне включены."],
 pu_ios:["On iPhone, first add this app to your Home Screen (Share, then Add to Home Screen), then open it from there and turn alerts on.","iPhone'da önce bu uygulamayı Ana Ekrana ekleyin (Paylaş, sonra Ana Ekrana Ekle), oradan açın ve bildirimleri açın.","Na iPhonie najpierw dodaj tę aplikację do ekranu głównego (Udostępnij, potem Dodaj do ekranu początkowego), otwórz ją stamtąd i włącz powiadomienia.","На iPhone сначала добавьте приложение на экран «Домой» (Поделиться, затем «На экран Домой»), откройте его оттуда и включите уведомления."],
 pu_no:["This browser cannot show phone alerts.","Bu tarayıcı telefon bildirimlerini gösteremiyor.","Ta przeglądarka nie obsługuje powiadomień.","Этот браузер не поддерживает уведомления."],
 pu_blocked:["Alerts are blocked for this site. Allow notifications in your browser settings, then try again.","Bu site için bildirimler engellendi. Tarayıcı ayarlarından bildirimlere izin verin ve tekrar deneyin.","Powiadomienia są zablokowane dla tej strony. Zezwól na nie w ustawieniach przeglądarki i spróbuj ponownie.","Уведомления для сайта заблокированы. Разрешите их в настройках браузера и повторите."]
});
const VAPID_PUB='BFuPJZW3P_9VnehJ5ryKIevdm6B_eWB_mLCSnbyMJbgAsOwJLTGGTrF7iKLNUXCi5s0c1cgLRaRNArvFrN6UN6k';
const pushOk=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const isIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone=()=>(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;

/* ---------- install on phone (PWA) ---------- */
window.NC_IP=null;
try{S.appos=isIos()?'ios':'and'}catch(x){}
try{if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}catch(x){}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.NC_IP=e;try{renderTop();if(S.stack&&S.stack.length&&S.stack[S.stack.length-1].v==='app')renderOv(true)}catch(x){}});
window.addEventListener('appinstalled',()=>{window.NC_IP=null;try{renderTop();toast(T('inst_ok'))}catch(x){}});
N({get_app:["Install on phone","Telefona yükle","Zainstaluj na telefonie","Установить на телефон"],
app_d:["Add North Cyprus Community to your home screen. It opens full screen like an app and can send you alerts.","North Cyprus Community'yi ana ekranınıza ekleyin. Uygulama gibi tam ekran açılır ve size bildirim gönderebilir.","Dodaj North Cyprus Community do ekranu głównego. Otwiera się na pełnym ekranie jak aplikacja i może wysyłać powiadomienia.","Добавьте North Cyprus Community на главный экран. Откроется на весь экран, как приложение, и сможет присылать уведомления."],
inst_now:["Install now","Şimdi yükle","Zainstaluj teraz","Установить сейчас"],
inst_ok:["Installed. Look for it on your home screen.","Yüklendi. Ana ekranınızda arayın.","Zainstalowano. Szukaj na ekranie głównym.","Установлено. Ищите на главном экране."],
inst_have:["You are already using the installed app.","Yüklü uygulamayı zaten kullanıyorsunuz.","Korzystasz już z zainstalowanej aplikacji.","Вы уже используете установленное приложение."],
inst_steps:["Or follow these steps","Veya şu adımları izleyin","Lub wykonaj te kroki","Или выполните эти шаги"],
inst_ios_note:["On iPhone and iPad this only works in Safari. Alerts on iPhone work once the app is on your home screen.","iPhone ve iPad'de bu yalnızca Safari'de çalışır. iPhone'da bildirimler uygulama ana ekrandayken çalışır.","Na iPhonie i iPadzie działa to tylko w Safari. Powiadomienia na iPhonie działają po dodaniu aplikacji do ekranu głównego.","На iPhone и iPad это работает только в Safari. Уведомления на iPhone работают, когда приложение добавлено на главный экран."],
inst_desk:["On a computer with Chrome or Edge, look for the install icon at the right end of the address bar.","Chrome veya Edge ile bilgisayarda adres çubuğunun sağındaki yükle simgesine bakın.","Na komputerze z Chrome lub Edge poszukaj ikony instalacji po prawej stronie paska adresu.","На компьютере с Chrome или Edge ищите значок установки справа в адресной строке."],
ai2:["Tap the Share button (the square with an arrow, at the bottom of Safari)","Paylaş düğmesine dokunun (Safari'nin altındaki oklu kare)","Dotknij przycisku Udostępnij (kwadrat ze strzałką u dołu Safari)","Нажмите «Поделиться» (квадрат со стрелкой внизу Safari)"],
ai3:["Scroll down and choose “Add to Home Screen”, then tap Add","Aşağı kaydırıp “Ana Ekrana Ekle”yi seçin, sonra Ekle'ye dokunun","Przewiń w dół, wybierz „Do ekranu początkowego” i dotknij Dodaj","Прокрутите вниз, выберите «На экран “Домой”» и нажмите «Добавить»"],
aa2:["Tap the ⋮ menu at the top right","Sağ üstteki ⋮ menüsüne dokunun","Dotknij menu ⋮ w prawym górnym rogu","Нажмите меню ⋮ в правом верхнем углу"],
aa3:["Choose “Install app” (or “Add to Home screen”), then tap Install","“Uygulamayı yükle” (veya “Ana ekrana ekle”) seçin, sonra Yükle'ye dokunun","Wybierz „Zainstaluj aplikację” (lub „Dodaj do ekranu głównego”) i dotknij Zainstaluj","Выберите «Установить приложение» (или «Добавить на главный экран») и нажмите «Установить»"]});
function appCard(){if(isStandalone())return '';return `<button class="card row" style="width:100%;border:0;text-align:left" data-act="push" data-v="app"><span class="lf" style="width:46px;height:46px;background:var(--gs);color:var(--gd)">${ic('phone2')}</span><div class="grow"><b>${T('get_app')}</b><div class="sm mut">${T('app_d')}</div></div>${ic('right')}</button>`}
V.app=function(){
 const ios=S.appos?S.appos==='ios':isIos();
 const native=window.NC_IP&&!isStandalone();
 return {t:T('get_app'),b:`<div class="stack"><div class="hero"><img src="/icon.svg" width="64" height="64" alt="" style="border-radius:16px;display:block"><h1 class="h1" style="margin-top:12px;max-width:100%">${T('get_app')}</h1><p class="mut" style="margin-top:6px">${T('app_d')}</p></div>
 ${isStandalone()?`<div class="card sm">${T('inst_have')}</div>`:`${native?`<button class="btn block" data-act="installnow">${T('inst_now')}</button><div class="sm mut" style="text-align:center">${T('inst_steps')}</div>`:''}
 <div class="seg"><button class="${ios?'on':''}" data-act="appos" data-id="ios">${T('app_ios')}</button><button class="${ios?'':'on'}" data-act="appos" data-id="and">${T('app_and')}</button></div>
 ${(ios?['ai1','ai2','ai3']:['aa1','aa2','aa3']).map((k,i)=>`<div class="step"><span class="num">${i+1}</span><span style="flex:1">${T(k)}</span></div>`).join('')}
 <div class="sm mut">${ios?T('inst_ios_note'):T('inst_desk')}</div>`}
 <button class="btn line block" data-act="pop">${T('gotit')}</button></div>`}};
ACT.installnow=async()=>{const e=window.NC_IP;if(!e)return;try{e.prompt();const r=await e.userChoice;window.NC_IP=null;if(r&&r.outcome==='accepted')toast(T('inst_ok'));renderOv(true);renderTop()}catch(x){}};
const b64u=s=>{const p='='.repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,'+').replace(/_/g,'/'),r=atob(b);return Uint8Array.from([...r].map(c=>c.charCodeAt(0)))};
async function refreshPush(){try{if(!pushOk()){S.pushOn=false;return}const r=await navigator.serviceWorker.getRegistration('/');const s=r&&await r.pushManager.getSubscription();S.pushOn=!!s}catch(e){S.pushOn=false}}
function pushCard(){
 if(!S.uid)return '';
 let inner;
 if(!pushOk()||(isIos()&&!isStandalone()))inner=`<div class="sm mut">${isIos()&&!isStandalone()?T('pu_ios'):T('pu_no')}</div>`;
 else if(S.pushOn)inner=`<div class="sm">${ic('check','s')} ${T('pu_is')}</div><button class="btn line" data-act="pushoff">${T('pu_off')}</button>`;
 else inner=`<div class="sm mut">${T('pu_d')}</div><button class="btn" data-act="pushon">${ic('bell','s')}${T('pu_on')}</button>`;
 return `<div class="card stack"><b>${T('pu_t')}</b>${inner}</div>`;
}
ACT.pushon=async()=>{
 if(gate())return;
 try{
  const perm=await Notification.requestPermission();
  if(perm!=='granted'){toast(T('pu_blocked'));return}
  const reg=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
  let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID_PUB)});
  const j=sub.toJSON();
  const {error}=await sb.from('push_subscriptions').upsert({user_id:S.uid,endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth},{onConflict:'endpoint'});
  if(error)throw error;
  S.pushOn=true;renderOv(true);toast(T('pu_is'));
 }catch(e){toast(String(e.message||e).slice(0,120))}
};
ACT.pushoff=async()=>{
 try{
  const reg=await navigator.serviceWorker.getRegistration('/');const sub=reg&&await reg.pushManager.getSubscription();
  if(sub){await sb.from('push_subscriptions').delete().eq('endpoint',sub.endpoint);await sub.unsubscribe()}
  S.pushOn=false;renderOv(true);
 }catch(e){toast(String(e.message||e).slice(0,120))}
};
(function(){const o=V.notifs;V.notifs=function(){const r=o();r.b=r.b.replace('<div class="stack">','<div class="stack">'+pushCard());return r}})();

/* ---------- social feed: posts, marketplace, meetups and news in one stream ---------- */
N({
 ff_posts:["Posts","Gönderiler","Wpisy","Записи"],ff_meet:["Meetups","Buluşmalar","Spotkania","Встречи"],ff_news:["News","Haberler","Aktualności","Новости"],
 view_item:["View","Görüntüle","Zobacz","Открыть"],
 link_copied:["Link copied","Bağlantı kopyalandı","Link skopiowany","Ссылка скопирована"]
});
function itemUrl(k,id){return location.origin+'/?i='+k+':'+id}
const ilk=key=>(DB.il||{})[key]||{n:0,mine:false};
function shareItem(k,id,text){
 const url=itemUrl(k,id);
 if(navigator.share){navigator.share({title:SITE_NAME,text:text||SITE_NAME,url}).catch(()=>{});return}
 try{navigator.clipboard.writeText(url).then(()=>toast(T('link_copied')),()=>toast(url))}catch(e){toast(url)}
}
ACT.share=d=>{
 if(d&&d.k==='event'&&isM()){openSheet({v:'sharesel',k:d.k,id:d.id,t:d.t});return}
 if(d&&d.k)shareItem(d.k,d.id,d.t);else copy(location.origin+'/');
};
SH.sharesel=s=>`<h2 class="h2">${T('share')}</h2><div class="stack" style="margin-top:12px"><label class="f" for="sf-t">${T('share_say')}</label><textarea id="sf-t" maxlength="500" style="min-height:70px"></textarea><button class="btn block" data-act="sharefeed" data-k="${s.k}" data-id="${s.id}" data-t="${esc(s.t||'')}">${ic('users','s')}${T('share_feed')}</button><div class="seg" id="sf-aud">${['public','members','friends'].map(a=>`<button class="${(S.sfa||'public')===a?'on':''}" data-act="sfaud" data-id="${a}">${ic(audI[a],'s')}${T(audK[a])}</button>`).join('')}</div><button class="btn soft block" data-act="sharelink" data-k="${s.k}" data-id="${s.id}" data-t="${esc(s.t||'')}">${ic('share','s')}${T('share_link')}</button></div>`;
ACT.sfaud=d=>{S.sfa=d.id;document.querySelectorAll('#sf-aud button').forEach(b=>b.classList.toggle('on',b.dataset.id===d.id))};
ACT.sharelink=d=>{closeSheet();shareItem(d.k,d.id,d.t)};
ACT.sharefeed=async d=>{
 if(gate())return;const say=val('sf-t')||d.t||'';
 const {error}=await sb.from('posts').insert({author:S.uid,body:say.slice(0,1500)||'Shared',audience:S.sfa||'public',ref_kind:d.k,ref_id:d.id});
 if(error)return toast(error.message);
 closeSheet();S.ff='all';S.tab='feed';S.stack=[];await loadContent();render();window.scrollTo(0,0);toast(T('shared_ok'));
};
const waLink=(k,id,text)=>'https://wa.me/?text='+encodeURIComponent((text||'').slice(0,120)+' — '+SITE_NAME+' '+itemUrl(k,id));
function actBar(k,id,text,o){
 o=o||{};const key=k+':'+id,lk=ilk(key),cm=(DB.ic||{})[key]||[],del={listing:'dellisting',event:'delmeet'}[k];
 return `<div class="acts">
  <button class="actb ${lk.mine?'on':''}" data-act="ilike" data-k="${k}" data-id="${id}" title="${T('like')}">${ic('heart')}<span>${lk.n}</span></button>
  <button class="actb" data-act="icmt" data-k="${k}" data-id="${id}" title="${T('comment')}">${ic('msg')}<span>${cm.length||T('comment')}</span></button>
  <button class="actb" data-act="share" data-k="${k}" data-id="${id}" data-t="${esc((text||'').slice(0,100))}" title="${T('share')}">${ic('share')}<span>${T('share')}</span></button>
  <a class="actb" href="${waLink(k,id,text)}" target="_blank" rel="noopener" title="${T('whatsapp')}">${ic('wa')}<span>${T('whatsapp')}</span></a>
  ${o.mine&&del?`<button class="actb" data-act="${del}" data-id="${id}" title="${T('delete')}" aria-label="${T('delete')}">${ic('trash')}</button>`:''}
  ${(k==='listing'||k==='event')&&S.uid?`<button class="actb ${favOn(k,id)?'on':''}" data-act="fav" data-k="${k}" data-id="${id}" title="${T('fav_add')}">${ic('star')}<span>${favOn(k,id)?T('fav_on'):T('fav_add')}</span></button>`:''}
  <button class="actb" data-act="report" data-kind="${k}" data-id="${id}" title="${T('report')}">${ic('flag')}<span>${T('report')}</span></button>
 </div>${S.cmt[key]?cmtBlock(key,k,id):''}`;
}
function cmtBlock(key,k,id){
 const cm=(DB.ic||{})[key]||[];
 return `<div class="cmts">${cm.map(c=>{const w=whoKey(c.author);return `<div class="cm">${av(w,30)}<div class="bub"><b>${esc((P[w]||{n:'Member'}).n)}</b> ${U(c.body)}</div></div>`}).join('')}<div class="cform"><input id="ici-${k}-${id}" placeholder="${T('add_comment')}" maxlength="400"><button class="btn" data-act="icmtsend" data-k="${k}" data-id="${id}" aria-label="${T('send')}" title="${T('send')}">${ic('send','s')}</button></div></div>`;
}
ACT.ilike=async d=>{
 if(gate())return;const key=d.k+':'+d.id,o=DB.il[key]||(DB.il[key]={n:0,mine:false}),was=o.mine;
 o.mine=!was;o.n+=was?-1:1;renderMain();renderOv(true);
 const r=was?await sb.from('item_likes').delete().eq('kind',d.k).eq('item_id',d.id).eq('user_id',S.uid):await sb.from('item_likes').insert({kind:d.k,item_id:d.id,user_id:S.uid});
 if(r.error){o.mine=was;o.n+=was?1:-1;renderMain();renderOv(true);toast(r.error.message)}
};
ACT.icmt=d=>{const key=d.k+':'+d.id;S.cmt[key]=!S.cmt[key];renderMain();renderOv(true)};
ACT.icmtsend=async d=>{
 if(gate())return;const v=val('ici-'+d.k+'-'+d.id);if(!v)return;
 const {data,error}=await sb.from('item_comments').insert({kind:d.k,item_id:d.id,author:S.uid,body:v}).select().single();
 if(error)return toast(error.message);
 const key=d.k+':'+d.id;(DB.ic[key]=DB.ic[key]||[]).push(data);renderMain();renderOv(true);
};

/* friends */
const frIn=()=>(S.frs||[]).filter(f=>f.status==='pending'&&f.addressee===S.uid);
const frOut=()=>(S.frs||[]).filter(f=>f.status==='pending'&&f.requester===S.uid);
const frAcc=()=>(S.frs||[]).filter(f=>f.status==='accepted');
const frOther=f=>f.requester===S.uid?f.addressee:f.requester;
const friendIds=()=>new Set(frAcc().map(frOther));
function frState(id){
 if(id==='me'||id===S.uid)return 'me';
 const f=(S.frs||[]).find(x=>x.requester===id||x.addressee===id);
 if(!f)return 'none';
 if(f.status==='accepted')return 'friends';
 return f.requester===S.uid?'sent':'incoming';
}
async function reloadFriends(){
 if(!S.uid)return;
 const r=await sb.from('friendships').select('*');S.frs=r.data||[];
 await loadPeople(S.frs.flatMap(f=>[f.requester,f.addressee]));
 const um=(S.msgs||[]).filter(m=>m.to_id===S.uid&&!m.read).length;S.unread=um+frIn().length;
 renderTop();
}
N({
 aud_friends:["Friends","Arkadaşlar","Znajomi","Друзья"],
 fr_title:["Friends","Arkadaşlar","Znajomi","Друзья"],fr_add:["Add friend","Arkadaş ekle","Dodaj do znajomych","Добавить в друзья"],
 fr_sent:["Request sent","İstek gönderildi","Zaproszenie wysłane","Запрос отправлен"],fr_accept:["Accept","Kabul et","Akceptuj","Принять"],
 fr_decline:["Decline","Reddet","Odrzuć","Отклонить"],fr_cancel:["Cancel request","İsteği iptal et","Anuluj zaproszenie","Отменить запрос"],
 fr_friends:["Friends","Arkadaşsınız","Znajomi","Друзья"],fr_remove:["Remove friend","Arkadaşlıktan çıkar","Usuń ze znajomych","Удалить из друзей"],
 fr_reqs:["Friend requests","Arkadaşlık istekleri","Zaproszenia do znajomych","Запросы в друзья"],fr_yours:["Your friends","Arkadaşların","Twoi znajomi","Ваши друзья"],
 fr_pending:["Requests you sent","Gönderdiğin istekler","Wysłane zaproszenia","Отправленные запросы"],fr_find:["Find people","Kişi bul","Znajdź ludzi","Найти людей"],
 fr_find_ph:["Search by name","İsimle ara","Szukaj po imieniu","Поиск по имени"],fr_none:["No friends yet. Find your neighbours and say hello.","Henüz arkadaş yok. Komşularını bul ve merhaba de.","Brak znajomych. Znajdź sąsiadów i się przywitaj.","Друзей пока нет. Найдите соседей и поздоровайтесь."],
 fr_noreq:["No new requests.","Yeni istek yok.","Brak nowych zaproszeń.","Новых запросов нет."],fr_noresult:["Nobody found.","Kimse bulunamadı.","Nikogo nie znaleziono.","Никого не найдено."],
 my_profile:["My profile and posts","Profilim ve gönderilerim","Mój profil i wpisy","Мой профиль и записи"],
 ff_all:["Everyone","Herkes","Wszyscy","Все"],ff_friends:["Friends","Arkadaşlar","Znajomi","Друзья"],
 share_feed:["Share to my profile and feed","Profilimde ve akışta paylaş","Udostępnij na profilu i w aktualnościach","Поделиться в профиле и ленте"],
 share_link:["Send the link","Bağlantıyı gönder","Wyślij link","Отправить ссылку"],share_say:["Add a few words (optional)","Birkaç söz ekle (isteğe bağlı)","Dodaj kilka słów (opcjonalnie)","Добавьте пару слов (по желанию)"],
 shared_ok:["Shared to your feed","Akışında paylaşıldı","Udostępniono","Опубликовано в вашей ленте"],
 gone:["No longer available","Artık mevcut değil","Już niedostępne","Больше недоступно"],
 feed_empty_f:["Nothing from your friends yet. Add friends and their posts will show here.","Arkadaşlarından henüz paylaşım yok. Arkadaş ekle, gönderileri burada görünsün.","Brak wpisów od znajomych. Dodaj znajomych, a ich wpisy pojawią się tutaj.","Пока ничего от друзей. Добавьте друзей, и их записи появятся здесь."]
});
audI.friends='users';audK.friends='aud_friends';

/* a listing or meetup that someone shared to their profile */
function refCard(r){
 if(r.k==='listing'){const l=S.listings.find(x=>x.id===r.id);
  if(!l)return `<div class="note" style="margin-top:12px"><div class="sm mut">${T('gone')}</div></div>`;
  return `<button class="listrow" style="margin-top:12px" data-act="push" data-v="listing" data-id="${l.id}"><span class="th">${thumbFor(l)}</span><span class="grow"><span class="xs mut">${T('mk_title')}</span><b>${esc(l.t)}</b><span class="xs mut">${l.price?lmoney(l):T("free")} · ${esc(l.area)}</span></span>${ic('right')}</button>`}
 const e=S.meetups.find(x=>x.id===r.id);
 if(!e)return `<div class="note" style="margin-top:12px"><div class="sm mut">${T('gone')}</div></div>`;
 return `<button class="listrow" style="margin-top:12px" data-act="push" data-v="event" data-id="${e.id}"><span class="th">${thmRaw('group',hueOf(e.id))}</span><span class="grow"><span class="xs mut">${T('m_events')}</span><b>${esc(e.t)}</b><span class="xs mut">${ymd(e.starts)}${e.area?' · '+esc(e.area):''}</span></span>${ic('right')}</button>`;
}
function feedItems(){
 const f=S.ff==='friends'?'friends':'all',fr=friendIds();
 return S.posts.filter(p=>!p.club).filter(p=>f==='all'||p.who==='me'||fr.has(p.who)).slice().sort((a,b)=>a.m-b.m);
}
N({wl_hi:["Welcome","Hoş geldiniz","Witamy","Добро пожаловать"],wl_sub:["Your circle of friends and neighbours in North Cyprus.","Kuzey Kıbrıs'taki arkadaşlarınız ve komşularınızın çevresi.","Twój krąg przyjaciół i sąsiadów na Cyprze Północnym.","Ваш круг друзей и соседей на Северном Кипре."],wl_credit:["Photos from Pexels","Fotoğraflar: Pexels","Zdjęcia: Pexels","Фото: Pexels"]});
function welcomeHero(){
 if(DB.cfg&&DB.cfg.welcome_hero===false)return '';
 const n=(P.me&&P.me.n&&P.me.n!=='You')?String(P.me.n).trim().split(/\s+/)[0]:'';
 return `<section class="wl" aria-label="${esc(T('wl_hi'))}">${[1,2,3,4].map(i=>`<img src="/welcome/w${i}.jpg" alt="" class="wl-i" style="animation-delay:${(i-1)*6}s" ${i>1?'loading="lazy"':''}>`).join('')}<div class="wl-s"></div><div class="wl-t"><h1 class="wl-h">${esc(T('wl_hi'))}${n?', '+esc(n):''}</h1><p>${T('wl_sub')}</p></div><span class="wl-c">${T('wl_credit')}</span></section>`;
}
function feedV(){
 let h='<div class="stack">'+notes()+welcomeHero();
 if(isM()){
  const fr=[...friendIds()].filter(k=>P[k]).slice(0,6);
  h+=`<section><h2 class="h3">${T('fr_title')}</h2><div class="leaves">`+fr.map(k=>`<button class="leaf" data-act="push" data-v="person" data-id="${k}"><span class="lf" style="--h:${P[k].h}">${P[k].img?`<img src="${esc(P[k].img)}" alt="">`:esc(P[k].i)}</span><span class="n">${esc(P[k].n.split(' ')[0])}</span></button>`).join('')+`<button class="leaf inv" data-act="push" data-v="friends"><span class="lf">${ic('plus')}</span><span class="n">${T('fr_find')}</span></button></div></section>`;
  h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="create" data-type="post">${av('me',40)}<span class="grow mut">${T('compose_ph')}</span>${ic('image','s')}</button>`;
 }
 h+=bannerHtml('feed');
 const f=S.ff==='friends'?'friends':'all';
 if(isM())h+=`<div class="chips">${[['all',T('ff_all')],['friends',T('ff_friends')]].map(c=>`<button class="chip ${f===c[0]?'on':''}" data-act="ff" data-id="${c[0]}">${c[1]}</button>`).join('')}</div>`;
 const list=feedItems();
 if(!list.length)h+=`<div class="card" style="text-align:center"><p class="mut">${T(f==='friends'?'feed_empty_f':'none_posts')}</p></div>`;
 const lim=S.role==='visitor'?3:list.length;
 list.slice(0,lim).forEach(p=>{h+=post(p)});
 if(S.role==='visitor'&&list.length>lim)h+=`<div class="card" style="text-align:center"><h3 class="h2">${T('gate_t')}</h3><p class="mut" style="margin:6px 0 12px">${T('gate_d')}</p><button class="btn block" data-act="signup">${T('join_free')}</button></div>`;
 else if(S.role!=='visitor'&&list.length)h+=`<div class="card" style="text-align:center"><div class="mark" style="margin:0 auto 8px;width:44px;height:44px">${ic('check','l')}</div><div class="mut">${T('caught')}</div><button class="btn soft" style="margin-top:12px" data-act="refresh">${ic('refresh','s')}${T('refresh')}</button></div>`;
 return h+'</div>';
}
ACT.ff=d=>{S.ff=d.id;renderMain()};
V.postd=function(o){const p=S.posts.find(x=>x.id===o.id);if(!p)return {t:T('cr_post'),b:`<p class="mut">${T('none_posts')}</p>`};S.cmt['p'+p.id]=true;return {t:T('cr_post'),b:`<div class="stack">${post(p)}</div>`}};
function openDeepLink(){
 const q=new URLSearchParams(location.search).get('i');if(!q)return;
 const [k,id]=q.split(':');
 try{history.replaceState(null,'',location.pathname)}catch(e){}
 const v={post:'postd',listing:'listing',event:'event',update:'update'}[k];
 if(v&&id)push(v,{id});
}

/* ---------- boot ---------- */
(async function boot(){
 try{
  await Promise.all([loadStatic(),sb.auth.getSession()]);
  await sync({quiet:true});
  try{if(!localStorage.getItem('nc_soon')&&!S.uid&&!S.sheet){localStorage.setItem('nc_soon','1');openSheet({v:'soon'})}}catch(e){}
  openDeepLink();
  const iv=new URLSearchParams(location.search).get('invite');
  if(iv&&!S.uid){S.su={step:1,type:'ind',dir:true,inv:iv};push('signup')}
 }catch(e){sbErr(e);render()}
})();

['member','equip','equipitem','watch','clip','checkin','buddy','joinmem','reset'].forEach(k=>{delete V[k]});
