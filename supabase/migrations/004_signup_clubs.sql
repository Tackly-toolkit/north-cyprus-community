-- 004: richer sign-up data, fee in TL, clubs

alter table public.app_settings add column if not exists monthly_fee_try numeric;
alter table public.app_settings add column if not exists welcome_note text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare s public.app_settings; inv text; invrow public.invites; fm int; m jsonb;
begin
  select * into s from public.app_settings where id = 1;
  m := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  inv := m->>'invite_code';
  if s.signup_mode = 'invite' then
    select * into invrow from public.invites where code = inv and used_by is null and (email is null or lower(email) = lower(new.email));
    if invrow.code is null then raise exception 'Sign-up is by invitation only'; end if;
    update public.invites set used_by = new.id, used_at = now() where code = invrow.code;
  end if;
  fm := s.free_months;
  insert into public.profiles(id, display_name, account_type, district_id, town_id, area_id, free_until, invited_by)
  values (new.id, left(coalesce(m->>'name',''), 40),
          case when m->>'account_type' = 'business' then 'business' else 'member' end,
          nullif(m->>'district_id',''), nullif(m->>'town_id',''), nullif(m->>'area_id',''),
          now() + make_interval(months => fm), invrow.created_by);
  return new;
end $$;

-- Public config the sign-up screen needs (no secrets): is sign-up open, free months
create or replace function public.public_config() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('signup_mode', signup_mode, 'free_months', free_months, 'grace_days', grace_days,
                           'monthly_fee_try', monthly_fee_try, 'monthly_fee_gbp', monthly_fee_gbp)
  from public.app_settings where id = 1
$$;
grant execute on function public.public_config() to anon, authenticated;

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blurb text,
  icon text not null default 'users',
  hue int not null default 140,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.club_members (
  club_id uuid references public.clubs(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (club_id, user_id)
);
alter table public.posts add column if not exists club_id uuid references public.clubs(id) on delete cascade;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
create policy clubs_read on public.clubs for select using (active);
create policy clubs_admin on public.clubs for all using (public.is_admin()) with check (public.is_admin());
create policy cmem_read on public.club_members for select using (true);
create policy cmem_insert on public.club_members for insert with check (user_id = auth.uid() and public.can_use());
create policy cmem_delete on public.club_members for delete using (user_id = auth.uid());
create policy cmem_admin on public.club_members for all using (public.is_admin()) with check (public.is_admin());

-- Club posts are for members of that club only
drop policy posts_read_public on public.posts;
drop policy posts_read_members on public.posts;
create policy posts_read_public on public.posts for select using (audience = 'public' and club_id is null and not hidden);
create policy posts_read_members on public.posts for select using (public.can_use() and not hidden and (club_id is null or exists (select 1 from public.club_members cm where cm.club_id = posts.club_id and cm.user_id = auth.uid())));

-- Starter clubs (admin can rename, hide or add more)
insert into public.clubs(name, blurb, icon, hue) values
 ('Canasta Crew','Card afternoons for beginners and sharks alike.','star',140),
 ('Pets of North Cyprus','Vets, lost and found, dog beaches and kind advice.','heart',20),
 ('Property and title deeds','Neighbours sharing what they learned buying and selling.','home',200),
 ('Over-60s residency','Questions and answers on the over-60s procedure.','file',60),
 ('Polacy na Cyprze','Polska wspólnota w Północnym Cyprze: porady, spotkania, wsparcie.','users',340),
 ('Русский Кипр','Русскоязычное сообщество Северного Кипра: советы и встречи.','users',280);
