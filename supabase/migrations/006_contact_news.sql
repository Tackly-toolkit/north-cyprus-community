-- 006: separate WhatsApp number, community news (updates)
alter table public.app_settings add column if not exists contact_whatsapp text;

drop function if exists public.contact_details();
create or replace function public.contact_details()
returns table(phone text, email text, whatsapp text)
language sql stable security definer set search_path = public as
$$ select contact_phone, contact_email, contact_whatsapp from public.app_settings where id = 1 $$;
grant execute on function public.contact_details() to anon, authenticated;

create table public.updates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  body text not null,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.updates enable row level security;
create policy updates_read on public.updates for select using (published);
create policy updates_admin on public.updates for all using (public.is_admin()) with check (public.is_admin());

update public.app_settings set monthly_fee_try = 250, contact_email = 'Chris@bydesignuk.co.uk',
  contact_phone = null, contact_whatsapp = null where id = 1;
