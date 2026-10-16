-- 015: directory details (phone, whatsapp, website, hours, featured), extra categories, owner edit rpc
alter table public.directory add column if not exists phone text check (char_length(phone) <= 30);
alter table public.directory add column if not exists whatsapp text check (char_length(whatsapp) <= 30);
alter table public.directory add column if not exists website text check (char_length(website) <= 200);
alter table public.directory add column if not exists opening_hours text check (char_length(opening_hours) <= 300);
alter table public.directory add column if not exists featured boolean not null default false;
insert into public.categories(id,parent_id,kind,name,sort,active) values
 ('directory-trades-pest-control','directory-trades','directory','Pest control',7,true),
 ('directory-trades-property-management','directory-trades','directory','Property management',8,true),
 ('directory-legal-currency-exchange','directory-legal','directory','Currency exchange',5,true),
 ('directory-education-internet-providers','directory-education','directory','Internet and phone providers',4,true),
 ('directory-education-weddings-events','directory-education','directory','Weddings and events',5,true)
on conflict (id) do nothing;
create or replace function public.update_my_business(p_id uuid, p_phone text, p_whatsapp text, p_website text, p_hours text, p_address text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.directory set phone = nullif(trim(p_phone),''), whatsapp = nullif(trim(p_whatsapp),''), website = nullif(trim(p_website),''),
    opening_hours = nullif(trim(p_hours),''), address = nullif(trim(p_address),'')
  where id = p_id and owner = auth.uid();
end $$;
grant execute on function public.update_my_business(uuid,text,text,text,text,text) to authenticated;
