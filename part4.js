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
 f_pay:["Payment and access","Ödeme ve erişim","Płatność i dostęp","Оплата и доступ"],
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
 j_d:["Free for your first 3 months. Share, ask, meet up and keep in touch with your circle.", "İlk 3 ay ücretsiz. Çevrenizle paylaşın, sorun, buluşun ve iletişimde kalın.", "Pierwsze 3 miesiące za darmo. Dziel się, pytaj, spotykaj się i bądź w kontakcie ze swoim kręgiem.", "Первые 3 месяца бесплатно. Общайтесь, спрашивайте, встречайтесь и оставайтесь на связи со своим кругом."],
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
 welcome_free:["Your first {n} months are free.","İlk {n} ayınız ücretsiz.","Pierwsze {n} miesiące są bezpłatne.","Первые {n} мес. бесплатно."],
 acct_free:["Free until {d}","{d} tarihine kadar ücretsiz","Bezpłatnie do {d}","Бесплатно до {d}"],
 acct_late:["Payment was due {d}","Ödeme günü {d} idi","Płatność była wymagana {d}","Оплата была нужна до {d}"],
 acct_paid:["Paid until {d}","{d} tarihine kadar ödendi","Opłacone do {d}","Оплачено до {d}"],
 acct_due:["Payment due","Ödeme günü geldi","Płatność wymagana","Требуется оплата"],
 pay_t:["Your monthly payment is due","Aylık ödemeniz geldi","Czas na miesięczną opłatę","Пора оплатить месяц"],
 pay_left:["{n} days left to pay","Ödemek için {n} gün kaldı","Zostało {n} dni na opłatę","Осталось {n} дн. на оплату"],
 pay_left1:["Last day to pay","Ödemek için son gün","Ostatni dzień na opłatę","Последний день для оплаты"],
 pay_how:["Pay in cash as arranged, then the team marks your account as paid. If your account locks, it opens again as soon as the payment is recorded.","Ödemeyi anlaştığınız şekilde elden yapın, ekip hesabınızı ödendi olarak işaretler. Hesap kilitlenirse ödeme kaydedilir kaydedilmez yeniden açılır.","Zapłać gotówką, jak ustalono, a zespół oznaczy konto jako opłacone. Jeśli konto się zablokuje, odblokuje się zaraz po zapisaniu płatności.","Оплатите наличными, как договорились, и команда отметит аккаунт оплаченным. Если доступ заблокирован, он откроется сразу после записи платежа."],
 pay_fee:["Monthly fee: {f}","Aylık ücret: {f}","Opłata miesięczna: {f}","Ежемесячный взнос: {f}"],
 lock_t:["Please make payment to continue","Devam etmek için lütfen ödeme yapın","Aby kontynuować, dokonaj płatności","Для продолжения внесите оплату"],
 lock_d:["Your account is paused until your monthly payment is received. Your posts and details are safe. Contact us and we will open it again.","Aylık ödemeniz alınana kadar hesabınız duraklatıldı. Gönderileriniz ve bilgileriniz güvende. Bize ulaşın, yeniden açalım.","Twoje konto jest wstrzymane do czasu otrzymania opłaty miesięcznej. Twoje wpisy i dane są bezpieczne. Skontaktuj się z nami, a je odblokujemy.","Ваш аккаунт приостановлен до получения ежемесячной оплаты. Ваши записи и данные в безопасности. Свяжитесь с нами, и мы его откроем."],
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
const cName=id=>{const c=cById(id);return c?c.name:''};
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
 return `<label class="f" for="${pfx}-c">${T('cr_cat')}</label><select id="${pfx}-c" data-cat="${pfx}"><option value="">${T('choose')}</option>${opts(top,sel.c,c=>c.name,c=>c.id)}<option value="__other">${T('other_tell')}</option></select><input id="${pfx}-co" placeholder="${esc(T('other_ph'))}" maxlength="60" hidden style="margin-top:8px"><div id="${pfx}-sw">${kids.length?subSel(pfx,kids,sel.s):''}</div>`;
}
const subSel=(pfx,kids,v)=>`<label class="f" for="${pfx}-s">${T('cr_sub')}</label><select id="${pfx}-s"><option value="">${T('choose')}</option>${opts(kids,v,c=>c.name,c=>c.id)}</select>`;
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
 return `<label class="f" for="${id}">${label}</label><select id="${id}">${opts(rows,v||rows[0])}</select>`;
}

/* ---------- people cache ---------- */
function mkPerson(r){
 const n=r.display_name||'Member',biz=r.account_type==='business';
 return {n,i:(n[0]||'?').toUpperCase(),h:hueOf(r.id),area:areaLabel(r.district_id,r.town_id,r.area_id),biz:biz?1:0,img:r.photo_url||''};
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
 return {id:r.id,t:r.title,d:r.description,price:Number(r.price),cur:r.currency,cat:r.category_id,catTop:top?top.id:'',catName:sub?(top&&sub.parent_id?top.name+' · '+sub.name:sub.name):'',
  who:whoKey(r.author),area:areaLabel(r.district_id,r.town_id,r.area_id),cond:r.condition,hand:r.handover,per:r.period,beds:r.bedrooms,furn:r.furnished,prop:/^market-(rent|sale)/.test(r.category_id||''),imgs:r.photos||[],img:(r.photos||[])[0]||'',exp:r.expires_at,at:r.created_at,status:r.status,ic:'tag'};
}
function mapDir(r){
 return {id:r.id,n:r.name,cat:r.category_id,catName:cName(r.category_id),area:areaLabel(r.district_id,r.town_id,r.area_id),district:r.district_id,addr:r.address||'',off:r.offer||'',ver:r.verified?1:0,status:r.status,who:whoKey(r.owner),img:r.photo_url||'',k:r.name};
}
function mapMeet(r){
 return {id:r.id,ic:'users',t:r.title,at:r.created_at,starts:r.starts_at,where:[r.address,areaLabel(r.district_id,r.town_id,r.area_id)].filter(Boolean).join(', '),who:whoKey(r.author),n:(r.meetup_going||[]).length,goingMe:(r.meetup_going||[]).some(x=>x.user_id===S.uid),area:areaLabel(r.district_id,r.town_id,r.area_id)};
}
async function loadContent(){
 const now=new Date();
 const q=[
  sb.from('posts').select('id,author,body,audience,help,media_url,created_at,club_id,ref_kind,ref_id,post_likes(user_id),post_comments(id,author,body,created_at)').order('created_at',{ascending:false}).limit(60),
  sb.from('listings').select('*').eq('status','active').gt('expires_at',now.toISOString()).order('created_at',{ascending:false}).limit(120),
  sb.from('directory').select('*').order('name'),
  sb.from('meetups').select('*,meetup_going(user_id)').gte('starts_at',new Date(now-864e5).toISOString()).order('starts_at'),
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
 S.posts=posts.map(mapPost);S.listings=ls.map(mapListing);S.dir=dr.map(mapDir);S.meetups=ms.map(mapMeet);
 S.verified=S.dir.some(b=>b.who==='me'&&b.ver);
 DB.banners=bq.data||[];
 S.unread=S.msgs.filter(m=>m.to_id===S.uid&&!m.read).length+frIn().length;
 S.joined={};DB.clubCount={};
 (cq.data||[]).forEach(x=>{S.joined[x.club_id]=true});
 (nq.data||[]).forEach(x=>{DB.clubCount[x.club_id]=Number(x.n)});
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
 const el=$('#lock'),susp=st==='suspended';
 el.hidden=false;$('#app').hidden=true;$('#ov').hidden=true;$('#sh').hidden=true;
 el.innerHTML=`<div class="wrap" style="max-width:520px;padding-block:40px"><div class="stack"><div style="text-align:center"><div class="mark" style="margin:0 auto 14px;width:64px;height:64px">${ic(susp?'shield':'lock','l')}</div><h1 class="h1">${T(susp?'susp_t':'lock_t')}</h1><p class="mut" style="margin-top:10px">${T(susp?'susp_d':'lock_d')}</p></div>
 <div class="card stack">${contactRows(c)||`<p class="mut">${T('susp_d')}</p>`}</div>
 ${susp?'':`<p class="sm mut" style="text-align:center">${T('pay_how')}</p>`}
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
 const c=DB.cfg||{};if(c.monthly_fee_try)return Number(c.monthly_fee_try).toLocaleString(LOC[S.L])+' TL';
 if(c.monthly_fee_gbp)return '£'+Number(c.monthly_fee_gbp).toFixed(2);return '';
}
function acctCard(){
 if(!S.prof)return '';
 const due=S.acct&&S.acct.due_on,paid=S.prof.paid_until&&new Date(S.prof.paid_until)>new Date(S.prof.free_until);
 const late=S.acct&&S.acct.state==='grace';
 const line=S.admin?'Admin':(due?F(late?'acct_late':(paid?'acct_paid':'acct_free'),{d:ymd(due)}):'');
 const fee=feeText();
 return `<div class="card"><div class="row"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('shield')}</span><div class="grow"><b>${line}</b>${fee&&!S.admin?`<div class="sm mut">${F('pay_fee',{f:fee})}</div>`:''}</div></div></div>`;
}

/* ---------- banners (all off until the admin switches one on) ---------- */
function bannerHtml(zone){
 const today=new Date().toISOString().slice(0,10);
 const list=(DB.banners||[]).filter(b=>b.enabled&&b.zone===zone&&(!b.starts_on||b.starts_on<=today)&&(!b.ends_on||b.ends_on>=today)&&(!b.pages||!b.pages.length||b.pages.includes(S.tab)));
 return list.map(b=>`<div class="card banner">${b.image_url?`<img src="${esc(b.image_url)}" alt="" style="display:block;width:100%;height:auto;max-height:170px;object-fit:cover;border-radius:12px;margin-bottom:8px">`:''}<div class="xs mut" style="text-transform:uppercase;letter-spacing:.06em">${T('sponsor')}</div><b>${esc(b.headline||'')}</b>${b.body?`<div class="sm mut">${esc(b.body)}</div>`:''}${b.link_url?`<a class="btn soft" style="margin-top:8px" href="${esc(b.link_url)}" target="_blank" rel="noopener">${T('open')}</a>`:''}</div>`).join('');
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
SH.sos=()=>`<div class="row"><span class="lf" style="background:var(--rs);color:var(--r)">${ic('buoy','l')}</span><div><h2 class="h2">${T('sos_t')}</h2><div class="sm mut">${T('sos_d')}</div></div></div><div class="stack" style="margin-top:14px">${sosRow(T('sos_pol'),'155')}${sosRow(T('sos_amb'),'112')}${sosRow(T('sos_fire'),'199')}<div class="card stack" style="box-shadow:none;background:var(--bg)"><b>${T('sos_adm')}</b>${contactRows({email:DB.contact.email})}</div></div>`;
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
 set('name','su-n');set('biz','su-b');set('cat','su-bc');set('addr','su-ba');set('email','su-e');set('pw','su-p');set('inv','su-i');
 if($('#sg-d')){const v=geoVals('sg');u.d=v.d;u.t=v.t;u.a=v.a;u.to=v.to;u.ao=v.ao}
 const ag=$('#su-ag');if(ag)u.agree=ag.checked;
}
V.signup=function(){
 const u=S.su,biz=u.type==='biz';
 if(u.step===1)return {t:T('join_free'),b:`<div class="stack"><div class="hero"><h1 class="h1" style="max-width:100%">${T('tagline')}</h1><p class="mut" style="margin-top:8px">${F('welcome_free',{n:DB.cfg.free_months||3})}</p></div><h2 class="h3">${T('su_pick')}</h2>
  <button class="opt ${biz?'':'on'}" data-act="sutype" data-id="ind"><span class="lf">${ic('user')}</span><span style="flex:1"><b>${T('su_ind')}</b><div class="sm mut">${T('su_ind_d')}</div></span></button>
  <button class="opt ${biz?'on':''}" data-act="sutype" data-id="biz"><span class="lf">${ic('bag')}</span><span style="flex:1"><b>${T('su_biz')}</b><div class="sm mut">${T('su_biz_d')}</div></span></button>
  <p class="xs mut">${ic('lock','s')} ${T('su_lock')}</p>
  ${[['sc1t','sc1d','home'],['sc2t','sc2d','bag'],['sc3t','sc3d','vcheck']].map(c=>`<div class="sc"><span class="lf">${ic(c[2])}</span><div><b>${T(c[0])}</b><div class="sm mut">${T(c[1])}</div></div></div>`).join('')}
  <button class="btn block" data-act="sunext">${T('cont')}</button></div>`};
 if(u.step===2)return {t:T('join_free'),b:`<div class="stack"><span class="pill">${ic(biz?'bag':'user','s')}${T(biz?'su_biz':'su_ind')}</span>
  <div class="card"><label class="f" for="su-n">${T('su_name')}</label><input id="su-n" value="${esc(u.name||'')}" maxlength="40" autocomplete="name">
  ${biz?`<label class="f" for="su-b">${T('su_biz_name')}</label><input id="su-b" value="${esc(u.biz||'')}" maxlength="60">${catSel('su-b2','directory',{c:u.cat}).replace(/id="su-b2-c"/,'id="su-bc"').replace(/data-cat="su-b2"/,'data-cat="su-b2"')}<label class="f" for="su-ba">${T('su_addr')}</label><input id="su-ba" value="${esc(u.addr||'')}" maxlength="120">`:''}
  ${geoSel('sg',{d:u.d,t:u.t,a:u.a})}</div>
  <div class="card"><label class="f" for="su-e">${T('su_email')}</label><input id="su-e" type="email" inputmode="email" autocomplete="email" value="${esc(u.email||'')}"><label class="f" for="su-p">${T('pw')}</label><input id="su-p" type="password" autocomplete="new-password" value="${esc(u.pw||'')}">
  ${DB.cfg.signup_mode==='invite'?`<label class="f" for="su-i">${T('su_invite')}</label><input id="su-i" value="${esc(u.inv||'')}" maxlength="40"><p class="xs mut" style="margin-top:6px">${T('su_invite_d')}</p>`:''}</div>
  ${biz?`<button class="opt ${u.dir?'on':''}" data-act="sudir"><span class="lf">${ic(u.dir?'check':'plus')}</span><span style="flex:1"><b>${T('su_dir')}</b><div class="sm mut">${T('su_dir_d')}</div></span></button>`:''}
  <label class="row" style="gap:10px;align-items:flex-start"><input id="su-ag" type="checkbox" style="width:22px;height:22px;margin-top:2px" ${u.agree?'checked':''}><span class="sm">${T('su_agree')} <a href="#" data-act="push" data-v="policy" data-id="terms">${T('f_terms')}</a> · <a href="#" data-act="push" data-v="policy" data-id="privacy">${T('f_priv')}</a> · <a href="#" data-act="push" data-v="policy" data-id="payment">${T('f_pay')}</a></span></label>
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
 const biz=u.type==='biz';
 const ok=u.name&&u.email&&u.pw&&u.pw.length>=8&&u.d&&u.t&&u.agree&&(!biz||(u.biz&&u.cat));
 if(!ok){u.err=T('su_err');renderOv(true);return}
 u.err='';u.busy=true;renderOv(true);
 const meta={name:u.name,account_type:biz?'business':'member',district_id:u.d,town_id:(u.t==='__other'?'':u.t),area_id:(u.a==='__other'?'':u.a),invite_code:u.inv||'',locale:LANGS[S.L]};
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
 const mods=[['guides','book',T('m_guides'),F('cnt_guides',{n:GC.length})],['dirlist','pin',T('m_dir'),F('cnt_dir',{n:S.dir.filter(b=>b.status==='approved').length})],['events','cal',T('m_events'),F('cnt_events',{n:S.meetups.length})],['clubs','users',T('m_clubs'),F('cnt_clubs',{n:DB.clubs.length})],['updates','bell',T('m_updates'),(S.upd||[]).length+''],['checklist','ck',T('m_check'),CK.length+' ✓']];
 return `<div class="stack">${notes()}<div class="hero"><h1 class="h1" style="max-width:85%">${T('tagline')}</h1><p style="margin-top:8px;max-width:85%" class="mut">${T('exp_hero_d')}</p></div>${bannerHtml('explore')}
 <div class="grid2">${mods.map(m=>`<button class="mod" data-act="push" data-v="${m[0]}"><span class="lf">${ic(m[1])}</span><b>${m[2]}</b><small>${m[3]}</small></button>`).join('')}</div>
 ${appCard()}${footerV()}</div>`;
}
function footerV(){
 const c=DB.contact;
 return `<div class="foot"><button class="fx" data-act="footer" aria-expanded="${S.footer}" title="${T('footer')}" aria-label="${T('footer')}">${ic(S.footer?'up':'down')}</button>${S.footer?`<div class="fb card"><div class="row" style="flex-wrap:wrap;gap:16px"><a href="#" data-act="push" data-v="policy" data-id="about">${T('f_about')}</a><a href="#" data-act="push" data-v="policy" data-id="privacy">${T('f_priv')}</a><a href="#" data-act="push" data-v="policy" data-id="terms">${T('f_terms')}</a><a href="#" data-act="push" data-v="policy" data-id="payment">${T('f_pay')}</a><a href="#" data-act="push" data-v="policy" data-id="contact">${T('f_contact')}</a></div></div>`:''}</div>`;
}

/* ---------- Community marketplace ---------- */
const lmoney=l=>l.price?money(l.price,l.cur)+(l.per==='month'?' / '+T('per_month'):''):T('free');
function thumbFor(l){return l.img?`<img class="art" src="${esc(l.img)}" alt="">`:art('tag',hueOf(l.id),0,l.t)}
function marketV(){
 const top=cTop('market'),cur=S.mcat==='all'||!top.some(c=>c.id===S.mcat)?'all':S.mcat;
 const ls=S.listings.filter(l=>cur==='all'||l.catTop===cur);
 return `<div class="stack">${notes()}<div class="row"><h1 class="h1 grow">${T('mk_title')}</h1><button class="btn out" data-act="create" data-type="listing">${ic('plus','s')}${T('sell')}</button></div>
 <div class="chips"><button class="chip ${cur==='all'?'on':''}" data-act="mcat" data-id="all">${T('all')}</button>${top.map(c=>`<button class="chip ${cur===c.id?'on':''}" data-act="mcat" data-id="${c.id}">${esc(c.name)}</button>`).join('')}</div>${bannerHtml('market')}
 ${ls.length?`<div class="grid2">${ls.map(l=>`<button class="tile" data-act="push" data-v="listing" data-id="${l.id}"><span class="pic">${thumbFor(l)}<span class="pr">${lmoney(l)}</span></span><span class="tb"><b>${esc(l.t)}</b><span class="xs mut">${esc(l.area)}</span></span></button>`).join('')}</div>`:`<div class="card" style="text-align:center"><p class="mut">${T('none_listings')}</p></div>`}
 <div class="note g">${ic('info')}<div class="sm">${T('mk_note')}</div></div></div>`;
}
V.listing=function(o){
 const l=S.listings.find(x=>x.id===o.id);if(!l)return {t:T('nav_market'),b:''};
 const w=P[l.who]||{n:'Member',h:150},mine=l.who==='me';
 const gal2=l.imgs.length?`<div class="galw"><div class="gal">${l.imgs.map(u=>`<div class="sl"><img class="art" src="${esc(u)}" alt=""></div>`).join('')}</div>${l.imgs.length>1?`<span class="gc">1/${l.imgs.length}</span>`:''}</div>`:`<div class="galw"><div class="gal"><div class="sl">${art('tag',hueOf(l.id),0,l.t)}</div></div></div>`;
 return {t:T('mk_title'),b:`<div class="stack"><div>${gal2}</div><div><span class="pill">${esc(l.catName)}</span><h1 class="h1" style="margin-top:8px">${esc(l.t)}</h1><div class="h2" style="color:var(--gd);margin-top:4px">${lmoney(l)}</div></div><p>${esc(l.d)}</p>
 ${actBar('listing',l.id,l.t,{})}
 <div class="card stack">${l.beds?`<div class="row"><span class="grow mut">${T('cr_beds')}</span><b>${esc(l.beds)}</b></div>`:''}${l.furn?`<div class="row"><span class="grow mut">${T('cr_furn')}</span><b>${esc(l.furn)}</b></div>`:''}${l.cond?`<div class="row"><span class="grow mut">${T('cr_cond')}</span><b>${esc(l.cond)}</b></div>`:''}${l.hand?`<div class="row"><span class="grow mut">${T('cr_hand')}</span><b>${esc(l.hand)}</b></div>`:''}
 <div class="row">${ic('pin')}<div class="grow"><div class="xs mut">${T('address')}</div><b>${esc(l.area)}</b></div></div><a class="btn soft block" href="${mapsUrl(l.area)}" target="_blank" rel="noopener">${ic('compass','s')}${T('directions')}</a><div class="xs mut">${F('expires_on',{d:ymd(l.exp)})}</div></div>
 <button class="listrow" data-act="push" data-v="person" data-id="${l.who}">${av(l.who,44)}<span class="grow"><span class="xs mut">${T('sold_by')}</span><b>${esc(w.n)}</b></span>${ic('right')}</button>
 ${mine?`<div class="row"><button class="btn soft grow" data-act="sold" data-id="${l.id}">${ic('check','s')}${T('mark_sold')}</button><button class="btn line grow" data-act="dellisting" data-id="${l.id}">${ic('trash','s')}${T('delete')}</button></div>`:`<button class="btn block" data-act="msg" data-to="${esc(w.n)}" data-uid="${l.who}" data-about="${esc(l.t)}">${ic('msg','s')}${T('msg_seller')}</button>
 <div class="row"><button class="btn line grow" data-act="report" data-kind="seller" data-id="${l.who}">${ic('flag','s')}${T('report_seller')}</button><button class="btn line grow" data-act="report" data-kind="listing" data-id="${l.id}">${ic('flag','s')}${T('report_listing')}</button></div>`}
 ${S.admin&&!mine?`<button class="btn line block" data-act="dellisting" data-id="${l.id}">${ic('trash','s')}${T('delete')} (admin)</button>`:''}
 <div class="note g">${ic('info')}<div class="sm">${T('mk_note')}</div></div></div>`};
};
ACT.sold=async d=>{await sb.from('listings').update({status:'sold'}).eq('id',d.id);S.listings=S.listings.filter(l=>l.id!==d.id);popall();render();toast(T('deleted'))};
ACT.dellisting=async d=>{const {error}=await sb.from('listings').delete().eq('id',d.id);if(error)return toast(error.message);S.listings=S.listings.filter(l=>l.id!==d.id);popall();render();toast(T('deleted'))};

/* ---------- directory (list only, no map) ---------- */
V.dirlist=function(){
 const top=cTop('directory'),dc=S.dcat&&top.some(c=>c.id===S.dcat)?S.dcat:'all',dd=S.ddist||'';
 const ls=S.dir.filter(b=>b.status==='approved').filter(b=>dc==='all'||b.cat===dc||(cById(b.cat)&&cById(b.cat).parent_id===dc)).filter(b=>!dd||b.district===dd);
 const mine=S.dir.filter(b=>b.who==='me'&&b.status!=='approved');
 return {t:T('m_dir'),b:`<p class="mut" style="margin-bottom:10px">${T('dir_sub')}</p>${bannerHtml('directory')}
 <div class="chips"><button class="chip ${dc==='all'?'on':''}" data-act="dcat" data-id="all">${T('all')}</button>${top.map(c=>`<button class="chip ${dc===c.id?'on':''}" data-act="dcat" data-id="${c.id}">${esc(c.name)}</button>`).join('')}</div>
 <select id="dd" data-act-change="ddist" style="margin:10px 0" aria-label="${esc(T('su_district'))}"><option value="">${T('filter_area')}</option>${opts(gKids(null,'district'),dd,gOpt,r=>r.id)}</select>
 ${mine.length?`<div class="stack" style="margin-bottom:12px">${mine.map(dcard).join('')}</div>`:''}
 <div class="stack">${ls.length?ls.map(dcard).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('none_dir')}</p></div>`}</div>`};
};
document.addEventListener('change',e=>{if(e.target.id==='dd'){S.ddist=e.target.value;renderOv(true)}});
function dcard(b){return `<button class="listrow" data-act="push" data-v="dir" data-id="${b.id}"><span class="th">${b.img?`<img class="art" src="${esc(b.img)}" alt="">`:art('tools',hueOf(b.id),0,'')}</span><span class="grow"><b>${esc(b.n)}</b><span class="xs mut">${esc(b.catName)} · ${esc(b.area)}</span></span>${b.status!=='approved'?`<span class="pill red">${T('dir_pending')}</span>`:(b.ver?`<span class="pill">${ic('vcheck','s')}</span>`:'')}</button>`}
V.dir=function(o){
 const b=S.dir.find(x=>x.id===o.id);if(!b)return {t:T('m_dir'),b:''};
 const addr=[b.addr,b.area].filter(Boolean).join(', ');
 return {t:esc(b.n),b:`<div class="stack">${b.img?`<div class="galw"><div class="gal"><div class="sl"><img class="art" src="${esc(b.img)}" alt=""></div></div></div>`:''}<div class="card"><div class="row"><span class="lf">${esc(b.n[0])}</span><div class="grow"><h1 class="h2">${esc(b.n)}</h1><div class="sm mut">${esc(b.catName)} · ${esc(b.area)}</div></div></div><div style="margin-top:10px"><span class="pill ${b.ver?'':'red'}">${ic(b.ver?'vcheck':'info','s')}${b.ver?T('verified'):T('unverified')}</span></div></div>
 ${b.off?`<div class="card" style="background:var(--gs)"><div class="xs mut" style="text-transform:uppercase;letter-spacing:.06em">${T('offer_t')}</div><div class="h2" style="margin-top:4px">${esc(b.off)}</div></div>`:''}
 <div class="card stack"><div class="row">${ic('pin')}<div class="grow"><div class="xs mut">${T('address')}</div><b>${esc(addr)}</b></div></div><a class="btn soft block" href="${mapsUrl((b.n+' '+addr).trim())}" target="_blank" rel="noopener">${ic('compass','s')}${T('directions')}</a></div>
 ${b.who!=='me'?`<div class="row"><button class="btn grow" data-act="msg" data-to="${esc(b.n)}" data-uid="${b.who}" data-about="${esc(b.n)}">${ic('msg','s')}${T('msg_biz')}</button></div><button class="btn line block" data-act="report" data-kind="biz" data-id="${b.id}">${ic('flag','s')}${T('report_biz')}</button>`:''}</div>`};
};
ACT.dcat=d=>{S.dcat=d.id;renderOv(true)};

/* ---------- meetups (events) ---------- */
V.events=function(){
 const card=e=>rowt('push','event',e.id,thmRaw('group',hueOf(e.id)),esc(e.t),`${ymd(e.starts)} · ${new Date(e.starts).toLocaleTimeString(LOC[S.L],{hour:'2-digit',minute:'2-digit'})}${e.area?' · '+esc(e.area):''}`,e.goingMe?`<span class="pill">${ic('check','s')}${T('going_on')}</span>`:undefined);
 return {t:T('m_events'),b:`<div class="stack"><button class="btn out block" data-act="create" data-type="meetup">${ic('plus','s')}${T('cr_meetup')}</button>${S.meetups.length?S.meetups.map(card).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('none_ev')}</p></div>`}</div>`};
};
V.event=function(o){
 const e=S.meetups.find(x=>x.id===o.id);if(!e)return {t:T('m_events'),b:''};
 const g=e.goingMe,n=e.n;
 return {t:esc(e.t),b:`<div class="stack"><div><span class="pill">${ic('cal','s')}${T('m_events')}</span><h1 class="h1" style="margin-top:10px">${esc(e.t)}</h1></div>
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
 return {t:esc(p.n),b:`<div class="stack">${ms.map(m=>`<div class="card" style="${m.from_id===S.uid?'background:var(--gs);margin-left:32px':'margin-right:32px'}"><div class="xs mut">${m.about?esc(m.about)+' · ':''}${ago(minsAgo(m.created_at))}</div><div style="margin-top:4px;overflow-wrap:anywhere">${esc(m.body)}</div></div>`).join('')}<button class="btn block" data-act="msg" data-to="${esc(p.n)}" data-uid="${o.id}" data-pre="">${ic('send','s')}${T('reply')}</button></div>`};
};
async function markRead(from){
 const ids=(S.msgs||[]).filter(m=>m.from_id===from&&m.to_id===S.uid&&!m.read).map(m=>m.id);
 if(!ids.length)return;
 await sb.from('messages').update({read:true}).in('id',ids);
 (S.msgs||[]).forEach(m=>{if(ids.includes(m.id))m.read=true});S.unread=(S.msgs||[]).filter(m=>m.to_id===S.uid&&!m.read).length;renderTop();
}
ACT.bell=()=>{if(!isM())return push('notifs');push('inbox')};
V.notifs=function(){return {t:T('notifs'),b:`<div class="stack"><div class="card"><div class="row"><span class="lf" style="background:var(--gs);color:var(--gd);width:46px;height:46px">${ic('bell')}</span><div class="grow"><b>${T('nf_t')}</b></div><button class="tg ${S.notif?'on':''}" role="switch" aria-checked="${S.notif}" data-act="notif" aria-label="${T('notifs')}"><i></i></button></div><p class="sm mut" style="margin-top:10px">${T('nf_d')}</p></div><button class="btn block" data-act="signup">${T('join_free')}</button></div>`}};

/* ---------- community news ---------- */
V.updates=function(){return {t:T('m_updates'),b:`<div class="stack">${(S.upd||[]).length?S.upd.map(u=>rowt('push','update',u.id,u.image_url?`<span class="th"><img class="art" src="${esc(u.image_url)}" alt=""></span>`:thmRaw('group',hueOf(u.id)),esc(u.title),ymd(u.created_at))).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('none_yet')}</p></div>`}</div>`}};
V.update=function(o){const u=(S.upd||[]).find(x=>x.id===o.id);if(!u)return {t:T('m_updates'),b:''};return {t:T('m_updates'),b:`<div class="stack">${u.image_url?`<div class="galw"><div class="gal"><div class="sl"><img class="art" src="${esc(u.image_url)}" alt=""></div></div></div>`:''}<span class="pill">${ic('cal','s')}${ymd(u.created_at)}</span><h1 class="h1">${esc(u.title)}</h1><p style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(u.body)}</p><div class="note g">${ic('info')}<div class="sm">${T('up_from')}</div></div>${actBar('update',u.id,u.title,{})}</div>`}};

/* ---------- reports ---------- */
ACT.repsend=async()=>{
 const s=S.sheet;if(!s.r)return;
 await sb.from('reports').insert({reporter:S.uid,kind:s.kind,target_id:String(s.id),reason:s.r});
 s.done=true;renderSheet();
};

/* ---------- search over live data ---------- */
function index(){
 const j=a=>Array.isArray(a)?a.join(' '):String(a),r=[];
 GC.forEach(g=>g.it.forEach((it,i)=>r.push({l:A(it),s:A(g.n),ic:g.ic,v:'guide',id:g.id+':'+i,h:j(it)})));
 S.dir.filter(b=>b.status==='approved').forEach(b=>r.push({l:b.n,s:b.catName+' · '+b.area,ic:'pin',v:'dir',id:b.id,h:b.n+' '+b.area+' '+b.catName}));
 S.meetups.forEach(e=>r.push({l:e.t,s:T('m_events'),ic:'cal',v:'event',id:e.id,h:e.t+' '+e.where}));
 DB.clubs.forEach(c=>r.push({l:c.name,s:T('m_clubs'),ic:c.icon||'users',v:'club',id:c.id,h:c.name+' '+(c.blurb||'')}));
 S.listings.forEach(l=>r.push({l:l.t,s:T('mk_title'),ic:'tag',v:'listing',id:l.id,h:l.t+' '+l.area+' '+l.catName+' '+l.d}));
 return r;
}

/* ---------- Me ---------- */
function meV(){
 let h=`<div class="stack">`;
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
 if(!s.type)return `<h2 class="h2" style="margin-bottom:12px">${T('cr_choose')}</h2><div class="grid2">${[['post','msg','cr_post'],['listing','bag','cr_listing'],['meetup','cal','cr_meetup'],['help','buoy','cr_help']].map(t=>`<button class="mod" style="min-height:96px" data-act="crtype" data-id="${t[0]}"><span class="lf" style="${t[0]==='help'?'background:var(--rs);color:var(--r)':''}">${ic(t[1])}</span><b style="font-size:15px">${T(t[2])}</b></button>`).join('')}</div>`;
 const t=s.type,au=S.cr.aud,pf=S.prof||{};
 const today=new Date().toISOString().slice(0,10);
 const f=({post:`<textarea id="c-x" maxlength="1500" placeholder="${T('cr_text')}" aria-label="${T('cr_text')}"></textarea>${MF2(1)}`,
  help:`<textarea id="c-x" maxlength="1500" placeholder="${T('cr_text')}" aria-label="${T('cr_text')}"></textarea>${MF2(1)}<p class="xs mut" style="margin-top:6px">${T('cr_help_note')}</p>`,
  listing:`${MF2(4)}<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t" maxlength="80"><label class="f" for="c-d">${T('cr_desc')}</label><textarea id="c-d" maxlength="400" style="min-height:80px"></textarea>
   <div class="grid2" style="gap:10px"><div><label class="f" for="c-p">${T('cr_price')}</label><input id="c-p" type="number" inputmode="decimal" min="0"></div><div>${listSel('c-cur',T('cr_cur'),'currency',(DB.lists.currency||[]).find(x=>/TL|TRY/.test(x)))}</div></div>
   ${catSel('c-m','market',{})}<div id="std-x">${listSel('c-cond',T('cr_cond'),'condition')}${listSel('c-hand',T('cr_hand'),'handover')}</div><div id="prop-x" hidden>${listSel('c-beds',T('cr_beds'),'bedrooms')}${listSel('c-furn',T('cr_furn'),'furnished')}<p class="xs mut" id="rent-n" style="margin-top:6px">${T('cr_rent_n')}</p></div><div class="card" style="margin-top:12px"><b>${T('cr_addr')}</b>${geoSel('lg',{d:pf.district_id,t:pf.town_id,a:pf.area_id})}</div>`,
  meetup:`<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t" maxlength="80"><div class="grid2" style="gap:10px"><div><label class="f" for="c-dt">${T('cr_when_d')}</label><input id="c-dt" type="date" min="${today}"></div><div><label class="f" for="c-tm">${T('cr_when_t')}</label><select id="c-tm">${Array.from({length:36},(_,i)=>{const m=6*60+i*30,hh=String(Math.floor(m/60)).padStart(2,'0'),mm=String(m%60).padStart(2,'0');return `<option value="${hh}:${mm}" ${hh+':'+mm==='10:00'?'selected':''}>${hh}:${mm}</option>`}).join('')}</select></div></div><div class="card" style="margin-top:12px"><b>${T('cr_where')}</b>${geoSel('lg',{d:pf.district_id,t:pf.town_id,a:pf.area_id})}<label class="f" for="c-ad">${T('address')}</label><input id="c-ad" maxlength="120"></div>`})[t];
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
   const {error}=await sb.from('listings').insert({author:S.uid,title:ti,description:de,price:+val('c-p')||0,currency:val('c-cur')||'TRY',category_id:catId,...(/^market-(rent|sale)$/.test(cat)?{condition:null,handover:null,bedrooms:/^Not applicable/.test(val('c-beds'))?null:val('c-beds'),furnished:/^Not applicable/.test(val('c-furn'))?null:val('c-furn'),period:cat==='market-rent'?'month':null}:{condition:val('c-cond'),handover:val('c-hand')}),district_id:g.d,town_id:g.t==='__other'?null:(g.t||null),area_id:g.a==='__other'?null:(g.a||null),photos:urls});if(error)throw error;
   if(cat==='__other')await otherReq('market_category',val('c-m-co'));
   if(g.t==='__other')await otherReq('town',g.to);if(g.a==='__other')await otherReq('area',g.ao);
   S.tab='market';
  }else if(t==='meetup'){
   const ti=val('c-t'),dt=val('c-dt'),tm=val('c-tm'),g=geoVals('lg');
   if(!ti||!dt||!g.d){toast(T('cr_need'));throw 0}
   const {error}=await sb.from('meetups').insert({author:S.uid,title:ti,starts_at:new Date(dt+'T'+tm+':00').toISOString(),district_id:g.d,town_id:g.t==='__other'?null:(g.t||null),area_id:g.a==='__other'?null:(g.a||null),address:val('c-ad')||null});if(error)throw error;
   if(g.t==='__other')await otherReq('town',g.to);if(g.a==='__other')await otherReq('area',g.ao);
   S.tab='explore';
  }
  const keepClub=s.club;closeSheet();S.stack=keepClub?S.stack:[];await loadContent();render();window.scrollTo(0,0);toast(T('cr_done'));
 }catch(e){if(e)toast(e.message||'Error')}
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

/* ---------- policies ---------- */
function policyText(id){
 const c=DB.contact,fee=feeText()||'(to be confirmed)',fm=DB.cfg.free_months||3,gd=DB.cfg.grace_days||4;
 const contact=['the chat bubble in the app',c.email].filter(Boolean).join(' or email ');
 const X={
 about:[['Welcome',`${SITE_NAME} is a friendly, small community for friends and neighbours connected to North Cyprus, wherever in the world they are. Think of it as a small private group: ask questions, share tips, meet people, buy, sell or rent from each other, and find local businesses.`],['Good to know',`It is run by two private individuals, not a company, agent, bank or government body. It is a small circle for people from any country who are part of the North Cyprus community. The administrators decide who joins and may close an account that does not fit.`]],
 terms:[['House rules',`Be kind and honest. No hate, harassment, scams, adult content or anything illegal. Do not share other people's private details. You are responsible for what you post, and the administrators can edit, hide or remove anything and close any account. Use the flag button to report anything that worries you.`],['Feed and friends',`The feed shows only what members post on their own profile, as a photo and a few words. You choose who sees each post: everyone, members, or friends only. Friends are by request and acceptance. There is no following.`],['Marketplace',`Sell or give away small items, and list property to rent or for sale. Prices are in TL or GBP. No cars and no services. Listings last 30 days and use photos. Deals are agreed directly between members, in person, in cash or however you agree. The platform never takes payment or guarantees any sale, so check everything before you pay.`],['Guides and advice',`Guides and posts come from the community. They are not legal, tax, medical or financial advice. Check with official sources and professionals.`],['Businesses',`Directory listings and banners are agreed with the administrators, paid monthly, shown as unverified until confirmed, and may be removed at any time.`]],
 payment:[['Free to start',`Your first ${fm} months are free, counted from the day you sign up.`],['Monthly fee',`After that the fee is ${fee} a month, paid in cash to the community contact. There is no payment page and we never ask for card details. An administrator records your payment and your next due date moves on.`],['If you are late',`After the due date you have ${gd} days to pay, with a reminder and a daily countdown. If the ${gd} days pass, your account pauses on a "please make payment to continue" page with our contact details. Your information stays safe and your account reopens once payment is recorded.`],['Invitation only',`Sign-up is open for now. The administrators may make it invitation only at any time. Existing members are not affected.`],['Tax',`Payments are cash in hand. Everyone is responsible for their own tax position.`]],
 privacy:[['What we keep',`Your name, email, area, account type, and the posts, photos, listings, friends and messages you create, plus the dates for your free period and payments. Passwords are stored scrambled.`],['Who sees what',`Public posts can be seen by guests who are not signed in. Members-only posts, friends-only posts, messages and the marketplace are for signed-in members. Your email is never shown to other members. Administrators can see account details to run the community.`],['Where it lives',`In a secure cloud database in the European Union (Frankfurt). We send sign-in and account emails through an email service. We never sell your data and use no third-party tracking.`],['Your choices',`Edit your name, area and photo any time. To have your account and content deleted, contact ${contact}.`],['Note',`This is a plain-language summary and should be reviewed by a qualified adviser before launch.`]],
 contact:[['Contact',`Message us through ${contact}.`],['In an emergency',`Call the emergency numbers in the SOS button. This community cannot send help.`]]
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
  <button class="actb" data-act="report" data-kind="${k}" data-id="${id}" title="${T('report')}">${ic('flag')}<span>${T('report')}</span></button>
 </div>${S.cmt[key]?cmtBlock(key,k,id):''}`;
}
function cmtBlock(key,k,id){
 const cm=(DB.ic||{})[key]||[];
 return `<div class="cmts">${cm.map(c=>{const w=whoKey(c.author);return `<div class="cm">${av(w,30)}<div class="bub"><b>${esc((P[w]||{n:'Member'}).n)}</b> ${esc(c.body)}</div></div>`}).join('')}<div class="cform"><input id="ici-${k}-${id}" placeholder="${T('add_comment')}" maxlength="400"><button class="btn" data-act="icmtsend" data-k="${k}" data-id="${id}" aria-label="${T('send')}" title="${T('send')}">${ic('send','s')}</button></div></div>`;
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
function feedV(){
 let h='<div class="stack">'+notes();
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
