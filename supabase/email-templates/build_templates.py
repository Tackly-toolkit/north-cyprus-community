# Generates the branded email templates (Supabase auth variables like {{ .ConfirmationURL }} stay as-is).
import html
LOGO='https://tszeooiaylkguqzxysbh.supabase.co/storage/v1/object/public/email-assets/icon-192.png'
def wrap(title_en,title_tr,body_en,body_tr,btn_en=None,btn_tr=None,url='{{ .ConfirmationURL }}',code=False,foot_en='If you did not ask for this email you can safely ignore it.',foot_tr='Bu e-postayı siz istemediyseniz görmezden gelebilirsiniz.'):
    btn=''
    if btn_en:
        btn=f'''<tr><td align="center" style="padding:8px 0 4px"><a href="{url}" style="display:inline-block;background:#1f5d4a;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 30px;border-radius:999px">{btn_en}</a></td></tr>
<tr><td align="center" style="font-size:13px;color:#6b7f76;padding:6px 0 0">{btn_tr}</td></tr>'''
    codeblock=''
    if code:
        codeblock='<tr><td align="center" style="padding:10px 0"><div style="display:inline-block;background:#eef5f0;border-radius:14px;padding:14px 28px;font-size:30px;letter-spacing:8px;font-weight:700;color:#1f5d4a">{{ .Token }}</div></td></tr>'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>{title_en}</title></head>
<body style="margin:0;padding:0;background:#d9ecec;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d2f28">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#d9ecec"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="background:#2b9ba3;border-radius:22px 22px 0 0;line-height:0;font-size:0"><img src="https://tszeooiaylkguqzxysbh.supabase.co/storage/v1/object/public/email-assets/email-hero.png" width="520" alt="North Cyprus Community. Friends and neighbours, wherever you are" style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:22px 22px 0 0"></td></tr>
<tr><td style="background:#ffffff;padding:30px 28px 26px;border-radius:0;box-shadow:0 10px 30px rgba(31,93,74,.12)">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="font-size:22px;font-weight:800;color:#1d2f28;padding-bottom:10px">{title_en}</td></tr>
<tr><td style="font-size:16px;line-height:1.6;color:#33463e;padding-bottom:16px">{body_en}</td></tr>
{codeblock}{btn}
<tr><td style="padding-top:22px"><div style="border-top:1px solid #e3ece7"></div></td></tr>
<tr><td style="font-size:17px;font-weight:700;color:#1d2f28;padding-top:18px">{title_tr}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#4a5e55;padding-top:6px">{body_tr}</td></tr>
</table></td></tr>
<tr><td style="background:linear-gradient(180deg,#fdf3df,#f4e6c6);background-color:#fbefd5;padding:20px 28px 22px;border-radius:0 0 22px 22px;text-align:center"><div style="font-size:16px;font-weight:700;color:#7a4f1d;line-height:1.45">A friendly community bringing residents, tourists and expats together.</div><div style="font-size:13.5px;color:#8a6a3d;line-height:1.5;margin-top:4px">Sakinleri, turistleri ve gurbetçileri bir araya getiren samimi bir topluluk.</div><div style="margin-top:12px"><a href="{{{{ .SiteURL }}}}" style="display:inline-block;font-size:14px;font-weight:700;color:#1f5d4a;text-decoration:none;border:2px solid #1f5d4a;border-radius:999px;padding:8px 20px">Visit ncyprusconnect.com</a></div></td></tr>
<tr><td align="center" style="padding:18px 10px 4px;font-size:12.5px;line-height:1.6;color:#6b7f76">{foot_en}<br>{foot_tr}<br><span style="color:#8a9c93">Free to join · A private circle · Made with care</span></td></tr>
</table></td></tr></table></body></html>'''
T={
'confirm_signup':wrap('Welcome. Please confirm your email','Hoş geldiniz. Lütfen e-postanızı onaylayın','One tap and your account is ready. You will then be able to see the community, meet your neighbours and use the guides and contacts.','Tek dokunuşla hesabınız hazır. Ardından topluluğu görebilir, komşularınızla tanışabilir, rehberleri ve iletişim bilgilerini kullanabilirsiniz.','Confirm my email','E-postamı onayla'),
'recovery':wrap('Reset your password','Şifrenizi sıfırlayın','We received a request to reset the password for your account. Tap the button to choose a new one. The link works once and expires soon.','Hesabınızın şifresini sıfırlama isteği aldık. Yeni bir şifre seçmek için düğmeye dokunun. Bağlantı tek kullanımlıktır ve kısa süre sonra geçerliliğini yitirir.','Choose a new password','Yeni şifre seç'),
'magic_link':wrap('Your sign-in link','Giriş bağlantınız','Tap the button to sign in. The link works once and expires soon, so please use it now.','Giriş yapmak için düğmeye dokunun. Bağlantı tek kullanımlıktır ve kısa sürede sona erer, lütfen hemen kullanın.','Sign in','Giriş yap'),
'invite':wrap('You have been invited','Davet edildiniz','Someone in the community invited you to join. It is free, and it only takes a minute to set up your profile.','Topluluktan biri sizi katılmaya davet etti. Ücretsizdir ve profilinizi oluşturmak yalnızca bir dakika sürer.','Accept the invitation','Daveti kabul et'),
'email_change':wrap('Confirm your new email','Yeni e-postanızı onaylayın','Please confirm that you want to use this address for your account.','Hesabınız için bu adresi kullanmak istediğinizi lütfen onaylayın.','Confirm new email','Yeni e-postayı onayla'),
'reauthentication':wrap('Your security code','Güvenlik kodunuz','Enter this code to confirm it is really you.','Gerçekten siz olduğunuzu doğrulamak için bu kodu girin.',code=True,foot_en='Never share this code with anyone.',foot_tr='Bu kodu hiç kimseyle paylaşmayın.'),
}
SUBJ={'confirm_signup':'Welcome to North Cyprus Community. Please confirm your email','recovery':'Reset your North Cyprus Community password','magic_link':'Your North Cyprus Community sign-in link','invite':'You are invited to North Cyprus Community','email_change':'Confirm your new email address','reauthentication':'Your security code'}
for k,v in T.items(): open(k+'.html','w',encoding='utf8').write(v)
# app emails (sent by the platform itself; {{name}} etc. are filled by the sender)
APP={
'welcome':wrap('Welcome, {{name}}','Hoş geldiniz, {{name}}','Your account is ready. Add a photo and your area, say hello in the feed and have a look at the guides and the emergency contacts, which are always one tap away.','Hesabınız hazır. Bir fotoğraf ve bölgenizi ekleyin, akışta merhaba deyin; rehberlere ve her an bir dokunuş uzaklıktaki acil durum iletişim bilgilerine göz atın.','Open the community','Topluluğu aç',url='{{ .SiteURL }}',foot_en='You are receiving this because you joined North Cyprus Community.',foot_tr='Bu e-postayı North Cyprus Community\'ye katıldığınız için alıyorsunuz.'),
'reply':wrap('You have a new message','Yeni bir mesajınız var','The team has replied to you. Open the app to read it and answer.','Ekip size yanıt verdi. Okumak ve yanıtlamak için uygulamayı açın.','Read the message','Mesajı oku',url='{{ .SiteURL }}',foot_en='You can turn alerts off in your account settings.',foot_tr='Bildirimleri hesap ayarlarınızdan kapatabilirsiniz.'),
'admin_notice':wrap('New activity for the admins','Yöneticiler için yeni hareket','{{summary}}','{{summary}}','Open the admin portal','Yönetim portalını aç',url='{{ .SiteURL }}',foot_en='Sent to the admin address of North Cyprus Community.',foot_tr='North Cyprus Community yönetici adresine gönderildi.'),
}
import os
os.makedirs('app',exist_ok=True)
for k,v in APP.items(): open('app/'+k+'.html','w',encoding='utf8').write(v)
import json; json.dump(SUBJ,open('subjects.json','w'),indent=1)
