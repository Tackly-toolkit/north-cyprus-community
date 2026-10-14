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
const DB={geo:[],cats:[],lists:{condition:[],currency:[],handover:[]},cfg:{signup_mode:'open',free_months:3,grace_days:4},contact:{phone:'',email:''},clubs:[],banners:[]};

/* demo people are not part of the real platform */
Object.keys(P).forEach(k=>{if(k!=='me')delete P[k]});

/* ---------- translations for new text: [en, tr, pl, ru] ---------- */
function N(o){Object.keys(o).forEach(k=>{D[k]=o[k]})}
N({
 aud_members:["Members","Üyeler","Członkowie","Участники"],
 nav_market:["Marketplace","Pazar","Targ","Барахолка"],
 mk_title:["Community marketplace","Topluluk pazarı","Targ społeczności","Рынок сообщества"],
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
 sos_adm:["Community contact","Topluluk iletişim","Kontakt do społeczności","Контакт сообщества"],
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
 j_d:["Free for your first 3 months. Share, ask, buy and sell with people who live here or are visiting.","İlk 3 ay ücretsiz. Burada yaşayan veya ziyaret eden insanlarla paylaşın, sorun, alın ve satın.","Pierwsze 3 miesiące za darmo. Dziel się, pytaj, kupuj i sprzedawaj z ludźmi, którzy tu mieszkają lub odwiedzają.","Первые 3 месяца бесплатно. Общайтесь, спрашивайте, покупайте и продавайте с теми, кто живёт здесь или в гостях."],
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
const money=(n,cur)=>{const sym={'GBP £':'£','EUR €':'€','USD $':'$','TRY ₺':'₺','TRY':'₺','GBP':'£','EUR':'€','USD':'$'}[cur||'TRY']||'';return sym+Number(n).toLocaleString(LOC[S.L])};
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
 DB.lists={condition:[],currency:[],handover:[]};
 (l.data||[]).forEach(r=>{(DB.lists[r.kind]=DB.lists[r.kind]||[]).push(r.value)});
 if(cfg.data)DB.cfg=cfg.data;
 const row=Array.isArray(ct.data)?ct.data[0]:ct.data;
 if(row)DB.contact={phone:row.phone||'',email:row.email||''};
 DB.clubs=cl.data||[];
}
function mapPost(r){
 const likes=(r.post_likes||[]);const mine=likes.some(x=>x.user_id===S.uid);
 if(mine)S.liked['p'+r.id]=true;else delete S.liked['p'+r.id];
 return {id:r.id,who:whoKey(r.author),m:minsAgo(r.created_at),aud:r.audience,txt:r.body,likes:likes.length-(mine?1:0),
  cm:(r.post_comments||[]).sort((a,b)=>a.created_at<b.created_at?-1:1).map(c=>[whoKey(c.author),c.body]),help:r.help,
  up:r.media_url?{img:r.media_url}:null,club:r.club_id,raw:r};
}
function mapListing(r){
 const sub=cById(r.category_id),top=sub&&sub.parent_id?cById(sub.parent_id):sub;
 return {id:r.id,t:r.title,d:r.description,price:Number(r.price),cur:r.currency,cat:r.category_id,catTop:top?top.id:'',catName:sub?(top&&sub.parent_id?top.name+' · '+sub.name:sub.name):'',
  who:whoKey(r.author),area:areaLabel(r.district_id,r.town_id,r.area_id),cond:r.condition,hand:r.handover,imgs:r.photos||[],img:(r.photos||[])[0]||'',exp:r.expires_at,status:r.status,ic:'tag'};
}
function mapDir(r){
 return {id:r.id,n:r.name,cat:r.category_id,catName:cName(r.category_id),area:areaLabel(r.district_id,r.town_id,r.area_id),district:r.district_id,addr:r.address||'',off:r.offer||'',ver:r.verified?1:0,status:r.status,who:whoKey(r.owner),img:r.photo_url||'',k:r.name};
}
function mapMeet(r){
 return {id:r.id,ic:'users',t:r.title,starts:r.starts_at,where:[r.address,areaLabel(r.district_id,r.town_id,r.area_id)].filter(Boolean).join(', '),who:whoKey(r.author),n:(r.meetup_going||[]).length,goingMe:(r.meetup_going||[]).some(x=>x.user_id===S.uid),area:areaLabel(r.district_id,r.town_id,r.area_id)};
}
async function loadContent(){
 const now=new Date();
 const q=[
  sb.from('posts').select('id,author,body,audience,help,media_url,created_at,club_id,post_likes(user_id),post_comments(id,author,body,created_at)').order('created_at',{ascending:false}).limit(60),
  sb.from('listings').select('*').eq('status','active').gt('expires_at',now.toISOString()).order('created_at',{ascending:false}).limit(120),
  sb.from('directory').select('*').order('name'),
  sb.from('meetups').select('*,meetup_going(user_id)').gte('starts_at',new Date(now-864e5).toISOString()).order('starts_at'),
  sb.from('banners').select('*'),
  S.uid?sb.from('club_members').select('club_id').eq('user_id',S.uid):Promise.resolve({data:[]}),
  sb.rpc('club_counts')
 ];
 if(S.uid)q.push(sb.from('messages').select('*').or('to_id.eq.'+S.uid+',from_id.eq.'+S.uid).order('created_at',{ascending:false}).limit(80));
 const [pq,lq,dq,mq,bq,cq,nq,iq]=await Promise.all(q);
 const posts=pq.data||[],ls=lq.data||[],dr=dq.data||[],ms=mq.data||[];
 S.msgs=iq?iq.data||[]:[];
 await loadPeople([].concat(posts.map(p=>p.author),posts.flatMap(p=>(p.post_comments||[]).map(c=>c.author)),ls.map(l=>l.author),dr.map(d=>d.owner),ms.map(m=>m.author),S.msgs.flatMap(m=>[m.from_id,m.to_id])));
 S.posts=posts.map(mapPost);S.listings=ls.map(mapListing);S.dir=dr.map(mapDir);S.meetups=ms.map(mapMeet);
 S.verified=S.dir.some(b=>b.who==='me'&&b.ver);
 DB.banners=bq.data||[];
 S.unread=S.msgs.filter(m=>m.to_id===S.uid&&!m.read).length;
 S.joined={};DB.clubCount={};
 (cq.data||[]).forEach(x=>{S.joined[x.club_id]=true});
 (nq.data||[]).forEach(x=>{DB.clubCount[x.club_id]=Number(x.n)});
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
 setMe();
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
 let c={phone:DB.contact.phone,email:DB.contact.email};
 const ct=await sb.rpc('contact_details');const row=Array.isArray(ct.data)?ct.data[0]:ct.data;if(row)c={phone:row.phone||'',email:row.email||''};
 DB.contact=c;
 const el=$('#lock'),susp=st==='suspended';
 el.hidden=false;$('#app').hidden=true;$('#ov').hidden=true;$('#sh').hidden=true;
 el.innerHTML=`<div class="wrap" style="max-width:520px;padding-block:40px"><div class="stack"><div style="text-align:center"><div class="mark" style="margin:0 auto 14px;width:64px;height:64px">${ic(susp?'shield':'lock','l')}</div><h1 class="h1">${T(susp?'susp_t':'lock_t')}</h1><p class="mut" style="margin-top:10px">${T(susp?'susp_d':'lock_d')}</p></div>
 <div class="card stack">${c.phone?`<div class="row">${ic('phone2')}<div class="grow"><div class="xs mut">${T('phone')}</div><b style="font-size:20px">${esc(c.phone)}</b></div><button class="btn soft" data-act="copy" data-t="${esc(c.phone)}">${ic('copy','s')}${T('copy')}</button></div>`:''}
 ${c.email?`<div class="row">${ic('msg')}<div class="grow" style="min-width:0"><div class="xs mut">${T('email')}</div><b style="overflow-wrap:anywhere">${esc(c.email)}</b></div><button class="btn soft" data-act="copy" data-t="${esc(c.email)}">${ic('copy','s')}${T('copy')}</button></div>`:''}
 ${!c.phone&&!c.email?`<p class="mut">${T('susp_d')}</p>`:''}</div>
 ${susp?'':`<p class="sm mut" style="text-align:center">${T('pay_how')}</p>`}
 <button class="btn line block" data-act="signout">${T('sign_out')}</button></div></div>`;
}
function hideLock(){const el=$('#lock');if(el){el.hidden=true;el.innerHTML=''}$('#app').hidden=false}
function payNote(){
 if(!S.acct||S.acct.state!=='grace')return '';
 const n=S.acct.days_left;
 return `<div class="note sticky" style="border-color:var(--r)">${ic('info')}<div style="flex:1"><b>${T('pay_t')}</b><div class="sm" style="margin-top:2px">${n<=1?T('pay_left1'):F('pay_left',{n})}</div>${contactLine()}</div></div>`;
}
function contactLine(){
 const c=DB.contact,bits=[];
 if(c.phone)bits.push(esc(c.phone));if(c.email)bits.push(esc(c.email));
 return bits.length?`<div class="xs mut" style="margin-top:4px;overflow-wrap:anywhere">${bits.join(' · ')}</div>`:'';
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
 return list.map(b=>`<div class="card banner">${b.image_url?`<img class="art" src="${esc(b.image_url)}" alt="" style="border-radius:12px;margin-bottom:8px">`:''}<div class="xs mut" style="text-transform:uppercase;letter-spacing:.06em">${T('sponsor')}</div><b>${esc(b.headline||'')}</b>${b.body?`<div class="sm mut">${esc(b.body)}</div>`:''}${b.link_url?`<a class="btn soft" style="margin-top:8px" href="${esc(b.link_url)}" target="_blank" rel="noopener">${T('open')}</a>`:''}</div>`).join('');
}
N({me_vis_d:["Join to get your own profile, post, message and sell.","Profil, paylaşım, mesaj ve satış için katılın.","Dołącz, aby mieć profil, pisać, wysyłać wiadomości i sprzedawać.","Присоединяйтесь, чтобы создать профиль, писать, переписываться и продавать."]});
N({
 soon_t:["Something new is coming to North Cyprus","Kuzey Kıbrıs'a yeni bir şey geliyor","Do Cypru Północnego idzie coś nowego","В Северный Кипр приходит что-то новое"],
 soon_d:["Welcome. You are among the very first to see this. We are building a friendly home for everyone who visits or lives in North Cyprus: ask questions, meet neighbours, buy and sell small things and find trusted local help. Nothing quite like it exists here yet, and we are shaping it with the people who will use it.","Hoş geldiniz. Bunu görenlerin ilkleri arasındasınız. Kuzey Kıbrıs'ı ziyaret eden ya da burada yaşayan herkes için sıcak bir yuva kuruyoruz: soru sorun, komşularla tanışın, küçük eşyalar alıp satın ve güvenilir yerel yardım bulun. Burada henüz buna benzer bir şey yok ve onu kullanacak insanlarla birlikte şekillendiriyoruz.","Witamy. Jesteś wśród pierwszych osób, które to widzą. Tworzymy przyjazny dom dla wszystkich, którzy odwiedzają Cypr Północny lub tu mieszkają: zadawaj pytania, poznawaj sąsiadów, kupuj i sprzedawaj drobiazgi i znajdź zaufaną pomoc. Czegoś takiego tu jeszcze nie ma, a kształtujemy to razem z ludźmi, którzy będą z tego korzystać.","Добро пожаловать. Вы среди первых, кто это видит. Мы создаём дружелюбный дом для всех, кто бывает или живёт на Северном Кипре: задавайте вопросы, знакомьтесь с соседями, покупайте и продавайте мелочи и находите надёжную местную помощь. Ничего подобного здесь ещё нет, и мы формируем это вместе с теми, кто будет им пользоваться."],
 soon_b:["Have a look around","Göz atın","Rozejrzyj się","Осмотритесь"]
});
N({sponsor:["Sponsored","Sponsorlu","Sponsorowane","Реклама"],open:["Open","Aç","Otwórz","Открыть"]});

/* ---------- brand / links ---------- */
ACT.share=function(){copy(location.origin+'/')};
ACT.invite=function(){copy(location.origin+'/')};

/* ---------- auth screens ---------- */
SH.join=()=>`<h2 class="h2">${T('j_t')}</h2><p class="mut" style="margin:6px 0 14px">${T('j_d')}</p><div class="stack"><button class="btn block" data-act="signup">${T('j_create')}</button><button class="btn soft block" data-act="signinsheet">${T('sign_in')}</button><button class="btn line block" data-act="sclose">${T('close')}</button></div>`;
SH.signin=s=>`<h2 class="h2">${T('sign_in')}</h2><div class="stack" style="margin-top:12px"><div><label class="f" for="si-e">${T('email')}</label><input id="si-e" type="email" autocomplete="email" inputmode="email" value="${esc(s.email||'')}"><label class="f" for="si-p">${T('pw_only')}</label><input id="si-p" type="password" autocomplete="current-password"></div>${s.err?`<div class="note">${ic('info')}<div class="sm">${esc(s.err)}</div></div>`:''}${s.msg?`<div class="note g">${ic('info')}<div class="sm">${esc(s.msg)}</div></div>`:''}<button class="btn block" data-act="dosignin">${T('sign_in')}</button><button class="btn soft block" data-act="forgot">${T('forgot')}</button><button class="btn line block" data-act="signup">${T('j_create')}</button></div>`;
SH.newpw=s=>`<h2 class="h2">${T('newpw_t')}</h2><div class="stack" style="margin-top:12px"><input id="np" type="password" autocomplete="new-password" placeholder="${esc(T('pw'))}" aria-label="${esc(T('pw'))}"><button class="btn block" data-act="donewpw">${T('save')}</button></div>`;
SH.soon=()=>`<div style="text-align:center"><div class="mark" style="margin:0 auto 12px;width:64px;height:64px">${ic('island','l')}</div><h2 class="h2">${T('soon_t')}</h2><p class="mut" style="margin:10px 0 16px">${T('soon_d')}</p><button class="btn block" data-act="sclose">${T('soon_b')}</button></div>`;
SH.due=()=>{const n=S.acct?S.acct.days_left:0;return `<div style="text-align:center"><div class="mark" style="margin:0 auto 10px;width:56px;height:56px">${ic('info','l')}</div><h2 class="h2">${T('pay_t')}</h2><div class="bignum" style="margin:10px 0">${n}</div><p style="font-weight:600">${n<=1?T('pay_left1'):F('pay_left',{n})}</p><p class="sm mut" style="margin:10px 0">${T('pay_how')}</p>${feeText()?`<p class="sm"><b>${F('pay_fee',{f:feeText()})}</b></p>`:''}${contactLine()}<button class="btn block" style="margin-top:14px" data-act="sclose">${T('gotit')}</button></div>`};
SH.sos=()=>`<div class="row"><span class="lf" style="background:var(--rs);color:var(--r)">${ic('buoy','l')}</span><div><h2 class="h2">${T('sos_t')}</h2><div class="sm mut">${T('sos_d')}</div></div></div><div class="stack" style="margin-top:14px">${sosRow(T('sos_pol'),'155')}${sosRow(T('sos_amb'),'112')}${sosRow(T('sos_fire'),'199')}${DB.contact.phone?sosRow(T('sos_adm'),esc(DB.contact.phone)):''}</div>`;
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

/* ---------- feed ---------- */
function feedV(){
 let h='<div class="stack">'+notes();
 const ppl=Object.keys(P).filter(k=>k!=='me'&&!P[k].org).slice(0,5);
 if(ppl.length)h+=`<section><h2 class="h3">${T('friends')}</h2><div class="leaves">`+ppl.map(k=>`<button class="leaf" data-act="push" data-v="person" data-id="${k}"><span class="lf" style="--h:${P[k].h}">${esc(P[k].i)}</span><span class="n">${esc(P[k].n.split(' ')[0])}</span></button>`).join('')+`<button class="leaf inv" data-act="invite"><span class="lf">${ic('plus')}</span><span class="n">${T('invite')}</span></button></div></section>`;
 if(isM())h+=`<button class="card row" style="width:100%;border:0;text-align:left" data-act="create" data-type="post">${av('me',40)}<span class="grow mut">${T('compose_ph')}</span>${ic('image','s')}</button>`;
 h+=bannerHtml('feed');
 const list=S.posts.filter(p=>!p.club).slice().sort((a,b)=>a.m-b.m);
 if(!list.length)h+=`<div class="card" style="text-align:center"><p class="mut">${T('none_posts')}</p></div>`;
 const lim=S.role==='visitor'?3:list.length;
 list.slice(0,lim).forEach(p=>h+=post(p));
 if(S.role==='visitor'){
  h+=`<div class="card" style="text-align:center"><h3 class="h2">${T('gate_t')}</h3><p class="mut" style="margin:6px 0 12px">${T('gate_d')}</p><button class="btn block" data-act="signup">${T('join_free')}</button></div>`;
 }else if(list.length){
  h+=`<div class="card" style="text-align:center"><div class="mark" style="margin:0 auto 8px;width:44px;height:44px">${ic('check','l')}</div><div class="mut">${T('caught')}</div><button class="btn soft" style="margin-top:12px" data-act="refresh">${ic('refresh','s')}${T('refresh')}</button></div>`;
 }
 return h+'</div>';
}
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
 const mods=[['guides','book',T('m_guides'),F('cnt_guides',{n:GC.length})],['dirlist','pin',T('m_dir'),F('cnt_dir',{n:S.dir.filter(b=>b.status==='approved').length})],['events','cal',T('m_events'),F('cnt_events',{n:S.meetups.length})],['clubs','users',T('m_clubs'),F('cnt_clubs',{n:DB.clubs.length})],['checklist','ck',T('m_check'),CK.length+' ✓']];
 return `<div class="stack">${notes()}<div class="hero"><h1 class="h1" style="max-width:85%">${T('tagline')}</h1><p style="margin-top:8px;max-width:85%" class="mut">${T('exp_hero_d')}</p></div>${bannerHtml('explore')}
 <div class="grid2">${mods.map(m=>`<button class="mod" data-act="push" data-v="${m[0]}"><span class="lf">${ic(m[1])}</span><b>${m[2]}</b><small>${m[3]}</small></button>`).join('')}</div>
 ${appCard()}${footerV()}</div>`;
}
function footerV(){
 const c=DB.contact;
 return `<div class="foot"><button class="fx" data-act="footer" aria-expanded="${S.footer}" title="${T('footer')}" aria-label="${T('footer')}">${ic(S.footer?'up':'down')}</button>${S.footer?`<div class="fb card"><div class="row" style="flex-wrap:wrap;gap:16px"><a href="#" data-act="push" data-v="policy" data-id="about">${T('f_about')}</a><a href="#" data-act="push" data-v="policy" data-id="privacy">${T('f_priv')}</a><a href="#" data-act="push" data-v="policy" data-id="terms">${T('f_terms')}</a><a href="#" data-act="push" data-v="policy" data-id="payment">${T('f_pay')}</a><a href="#" data-act="push" data-v="policy" data-id="contact">${T('f_contact')}</a></div></div>`:''}</div>`;
}

/* ---------- Community marketplace ---------- */
function thumbFor(l){return l.img?`<img class="art" src="${esc(l.img)}" alt="">`:art('tag',hueOf(l.id),0,l.t)}
function marketV(){
 const top=cTop('market'),cur=S.mcat==='all'||!top.some(c=>c.id===S.mcat)?'all':S.mcat;
 const ls=S.listings.filter(l=>cur==='all'||l.catTop===cur);
 return `<div class="stack">${notes()}<div class="row"><h1 class="h1 grow">${T('mk_title')}</h1><button class="btn out" data-act="create" data-type="listing">${ic('plus','s')}${T('sell')}</button></div>
 <div class="chips"><button class="chip ${cur==='all'?'on':''}" data-act="mcat" data-id="all">${T('all')}</button>${top.map(c=>`<button class="chip ${cur===c.id?'on':''}" data-act="mcat" data-id="${c.id}">${esc(c.name)}</button>`).join('')}</div>${bannerHtml('market')}
 ${ls.length?`<div class="grid2">${ls.map(l=>`<button class="tile" data-act="push" data-v="listing" data-id="${l.id}"><span class="pic">${thumbFor(l)}<span class="pr">${l.price?money(l.price,l.cur):T('free')}</span></span><span class="tb"><b>${esc(l.t)}</b><span class="xs mut">${esc(l.area)}</span></span></button>`).join('')}</div>`:`<div class="card" style="text-align:center"><p class="mut">${T('none_listings')}</p></div>`}
 <div class="note g">${ic('info')}<div class="sm">${T('mk_note')}</div></div></div>`;
}
V.listing=function(o){
 const l=S.listings.find(x=>x.id===o.id);if(!l)return {t:T('nav_market'),b:''};
 const w=P[l.who]||{n:'Member',h:150},mine=l.who==='me';
 const gal2=l.imgs.length?`<div class="galw"><div class="gal">${l.imgs.map(u=>`<div class="sl"><img class="art" src="${esc(u)}" alt=""></div>`).join('')}</div>${l.imgs.length>1?`<span class="gc">1/${l.imgs.length}</span>`:''}</div>`:`<div class="galw"><div class="gal"><div class="sl">${art('tag',hueOf(l.id),0,l.t)}</div></div></div>`;
 return {t:T('mk_title'),b:`<div class="stack"><div>${gal2}</div><div><span class="pill">${esc(l.catName)}</span><h1 class="h1" style="margin-top:8px">${esc(l.t)}</h1><div class="h2" style="color:var(--gd);margin-top:4px">${l.price?money(l.price,l.cur):T('free')}</div></div><p>${esc(l.d)}</p>
 <div class="card stack">${l.cond?`<div class="row"><span class="grow mut">${T('cr_cond')}</span><b>${esc(l.cond)}</b></div>`:''}${l.hand?`<div class="row"><span class="grow mut">${T('cr_hand')}</span><b>${esc(l.hand)}</b></div>`:''}
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
 <div class="row"><button class="btn soft grow" data-act="share">${ic('share','s')}${T('ev_invite')}</button><button class="btn line" data-act="report" data-kind="event" data-id="${e.id}" title="${T('report')}" aria-label="${T('report')}">${ic('flag','s')}</button>${e.who==='me'||S.admin?`<button class="btn line" data-act="delmeet" data-id="${e.id}" aria-label="${T('delete')}">${ic('trash','s')}</button>`:''}</div></div>`};
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
 return {t:esc(p.n),b:`<div class="stack"><div class="card" style="text-align:center">${av(o.id,84)}<h1 class="h2" style="margin-top:10px">${esc(p.n)}</h1><div class="mut sm">${esc(p.area||'')}</div>${o.id!=='me'?`<button class="btn" style="margin-top:12px" data-act="msg" data-to="${esc(p.n)}" data-uid="${o.id}" data-pre="${esc(T('hello_msg'))}">${ic('msg','s')}${T('hello')}</button><button class="btn line" style="margin-top:8px" data-act="report" data-kind="seller" data-id="${o.id}">${ic('flag','s')}${T('report_seller')}</button>`:''}</div>
 ${ls.length?`<h2 class="h3">${T('mk_title')}</h2><div class="grid2">${ls.map(l=>`<button class="tile" data-act="push" data-v="listing" data-id="${l.id}"><span class="pic">${thumbFor(l)}<span class="pr">${l.price?money(l.price,l.cur):T('free')}</span></span><span class="tb"><b>${esc(l.t)}</b></span></button>`).join('')}</div>`:''}${ps.map(post).join('')}</div>`};
};
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
 return {t:T('inbox'),b:`<div class="stack">${keys.length?keys.map(k=>{const last=th[k][0],p=P[k]||{n:'Member'};return `<button class="listrow" data-act="push" data-v="thread" data-id="${k}">${av(k,44)}<span class="grow"><b>${esc(p.n)}</b><span class="xs mut" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(last.body)}</span></span>${th[k].some(m=>m.to_id===S.uid&&!m.read)?'<span class="pill red">•</span>':ic('right')}</button>`}).join(''):`<div class="card" style="text-align:center"><p class="mut">${T('inbox_none')}</p></div>`}</div>`};
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
   <div class="grid2" style="gap:10px"><div><label class="f" for="c-p">${T('cr_price')}</label><input id="c-p" type="number" inputmode="decimal" min="0"></div><div>${listSel('c-cur',T('cr_cur'),'currency',(DB.lists.currency||[]).find(x=>/TRY/.test(x)))}</div></div>
   ${catSel('c-m','market',{})}${listSel('c-cond',T('cr_cond'),'condition')}${listSel('c-hand',T('cr_hand'),'handover')}<div class="card" style="margin-top:12px"><b>${T('cr_addr')}</b>${geoSel('lg',{d:pf.district_id,t:pf.town_id,a:pf.area_id})}</div>`,
  meetup:`<label class="f" for="c-t">${T('cr_title')}</label><input id="c-t" maxlength="80"><div class="grid2" style="gap:10px"><div><label class="f" for="c-dt">${T('cr_when_d')}</label><input id="c-dt" type="date" min="${today}"></div><div><label class="f" for="c-tm">${T('cr_when_t')}</label><select id="c-tm">${Array.from({length:36},(_,i)=>{const m=6*60+i*30,hh=String(Math.floor(m/60)).padStart(2,'0'),mm=String(m%60).padStart(2,'0');return `<option value="${hh}:${mm}" ${hh+':'+mm==='10:00'?'selected':''}>${hh}:${mm}</option>`}).join('')}</select></div></div><div class="card" style="margin-top:12px"><b>${T('cr_where')}</b>${geoSel('lg',{d:pf.district_id,t:pf.town_id,a:pf.area_id})}<label class="f" for="c-ad">${T('address')}</label><input id="c-ad" maxlength="120"></div>`})[t];
 const showAud=(t==='post'||t==='help')&&!s.club;
 return `<div class="row" style="margin-bottom:8px"><button class="ib" data-act="crback" aria-label="${T('back')}">${ic('left')}</button><h2 class="h2">${T(({post:'cr_post',listing:'cr_listing',meetup:'cr_meetup',help:'cr_help'})[t])}</h2></div>${f}${showAud?`<label class="f">${T('audience')}</label><div class="seg" id="aud">${['public','members'].map(a=>`<button class="${au===a?'on':''}" data-act="aud" data-id="${a}">${ic(audI[a],'s')}${T(audK[a])}</button>`).join('')}</div>`:''}<button class="btn block" style="margin-top:16px" data-act="crpub">${T('cr_pub')}</button>`;
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
   const {error}=await sb.from('listings').insert({author:S.uid,title:ti,description:de,price:+val('c-p')||0,currency:val('c-cur')||'TRY',category_id:catId,condition:val('c-cond'),handover:val('c-hand'),district_id:g.d,town_id:g.t==='__other'?null:(g.t||null),area_id:g.a==='__other'?null:(g.a||null),photos:urls});if(error)throw error;
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

/* ---------- policies ---------- */
function policyText(id){
 const c=DB.contact,fee=feeText()||'(to be confirmed)',fm=DB.cfg.free_months||3,gd=DB.cfg.grace_days||4;
 const contact=[c.phone,c.email].filter(Boolean).join(' · ')||'the contact details shown in the app';
 const X={
 about:[['Who we are',`${SITE_NAME} is a private community platform for visitors to North Cyprus and for foreign residents who live here. It is a place to ask questions, share tips, meet people, buy and sell small things, and find local businesses.`],['What we are not',`We are not an estate agent, a bank, a shop or a government body. The platform stands on its own. It is run by two private individuals and does not trade under any company name.`],['Who it is for',`The community is intended for visitors and foreign residents. It is not intended for Cypriot nationals or permanent residents. Anyone can sign up, and the administrators decide who is eligible and may close an account that does not fit.`]],
 terms:[['Using the community',`Be kind and honest. No hate, harassment, scams, adverts for services we do not list, adult content or anything illegal. Do not post other people's private details. You are responsible for what you post.`],['Community marketplace',`The marketplace is for small, everyday items. No cars, no property and no services. Listings last 30 days and use photos only. Deals are made directly between members, in person and in cash or however you agree. The platform never takes payment, holds money or guarantees any sale. Check items before you pay.`],['Advice and guides',`Guides and posts are shared by the community. They are not legal, tax, medical or financial advice. Always check with official sources and qualified professionals before you act.`],['Moderation',`The administrators have full control of the platform and may edit, hide or remove any content, change or close any account, and change these terms at any time. Report anything that worries you with the flag button.`],['Businesses',`Business directory listings and banners are agreed with the administrators, are paid monthly, and may be removed at any time. A business shows as unverified until the administrators confirm it.`]],
 payment:[['Free period',`Every member gets ${fm} months free, counted from the day that member signs up.`],['Monthly fee',`After the free period there is a monthly fee of ${fee}. It is paid in cash, outside the platform, to the community contact. The platform has no payment page and never asks for card details.`],['How payment is recorded',`When you pay, an administrator records it on your account and your next due date moves forward.`],['Reminder and ${gd} days'.replace('${gd}',gd),`If your due date passes, you have ${gd} days to pay. During those days you will see a reminder with a daily countdown.`],['If payment is not made',`If the ${gd} days end without payment, your account is paused and shows a "please make payment to continue" page with the contact phone and email. Your details stay safe. As soon as payment is recorded your account opens again.`],['Invitation only',`Sign-up is open to everyone for now. The administrators may switch sign-up to invitation only at any time. Existing members are not affected.`],['Tax',`Payments are cash in hand between members and the community contact. Each person is responsible for their own tax position.`]],
 privacy:[['What we store',`Your name, email address, area, the account type you chose, the posts, listings, photos and messages you create, and the dates that track your free period and payments. Passwords are stored only in scrambled form.`],['Why',`To run your account, show your content to other members, keep the community safe, and track the monthly payment.`],['Who can see what',`Public posts can be seen by visitors. Members-only posts, messages and the marketplace are for signed-in members. Your email is never shown to other members. Administrators can see account details so they can run the platform.`],['Where it lives',`Data is held with a cloud database provider in the European Union (Frankfurt) and photos are served through a content delivery network. We use an email service to send sign-in and account emails. We do not sell your data or show third-party tracking.`],['Your choices',`You can change your name, area and photo at any time. To have your account and content deleted, contact us at ${contact} and an administrator will remove it.`],['Cookies',`Only the small storage the app needs to keep you signed in and remember your language and theme.`],['Note',`This is a plain-language summary. It should be reviewed by a qualified adviser before launch.`]],
 contact:[['Contact',`Phone and email: ${contact}.`],['In an emergency',`Call the emergency numbers in the SOS button. This community cannot send help.`]]
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

/* ---------- boot ---------- */
(async function boot(){
 try{
  await Promise.all([loadStatic(),sb.auth.getSession()]);
  await sync({quiet:true});
  try{if(!localStorage.getItem('nc_soon')&&!S.uid&&!S.sheet){localStorage.setItem('nc_soon','1');openSheet({v:'soon'})}}catch(e){}
  const iv=new URLSearchParams(location.search).get('invite');
  if(iv&&!S.uid){S.su={step:1,type:'ind',dir:true,inv:iv};push('signup')}
 }catch(e){sbErr(e);render()}
})();
