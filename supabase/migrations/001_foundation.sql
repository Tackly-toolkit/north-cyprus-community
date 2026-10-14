-- North Cyprus community: foundation (members, subscriptions, admin, areas, categories, banners)
create extension if not exists pgcrypto;

create table public.app_settings (
  id int primary key default 1 check (id = 1),
  signup_mode text not null default 'open' check (signup_mode in ('open','invite')),
  free_months int not null default 3,
  grace_days int not null default 4,
  monthly_fee_gbp numeric(8,2),
  contact_phone text,
  contact_email text,
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id) values (1);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  photo_url text,
  account_type text not null default 'member' check (account_type in ('member','business')),
  district_id text, town_id text, area_id text,
  role text not null default 'member' check (role in ('member','admin')),
  joined_at timestamptz not null default now(),
  free_until timestamptz not null,
  paid_until timestamptz,
  manual_lock boolean not null default false,
  suspended boolean not null default false,
  admin_note text,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.invites (
  code text primary key default encode(gen_random_bytes(6),'hex'),
  email text,
  created_by uuid references auth.users(id),
  used_by uuid references auth.users(id),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payments (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  months int not null default 1 check (months > 0),
  amount_gbp numeric(8,2),
  paid_on date not null default current_date,
  marked_by uuid references auth.users(id),
  note text,
  created_at timestamptz not null default now()
);

create table public.geo (
  id text primary key,
  level text not null check (level in ('district','town','area')),
  parent_id text references public.geo(id),
  names text[] not null,
  sort int not null default 0,
  active boolean not null default true
);
create index geo_parent on public.geo(parent_id);

create table public.categories (
  id text primary key,
  kind text not null check (kind in ('market','directory')),
  parent_id text references public.categories(id),
  name text not null,
  sort int not null default 0,
  active boolean not null default true
);

create table public.lists (
  kind text not null check (kind in ('condition','currency','handover')),
  value text not null,
  sort int not null default 0,
  active boolean not null default true,
  primary key (kind, value)
);

create table public.other_requests (
  id bigserial primary key,
  list text not null,
  text text not null,
  requested_by uuid references auth.users(id),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table public.banners (
  id bigserial primary key,
  zone text not null,
  headline text,
  body text,
  image_url text,
  link_url text,
  trade text,
  district_id text, town_id text,
  pages text[] not null default '{}',
  starts_on date, ends_on date,
  enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigserial primary key,
  actor uuid,
  action text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- helpers
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and not suspended) $$;

-- state: active | grace | locked | suspended, with days left
create or replace function public.account_state(p public.profiles)
returns table(state text, due_on timestamptz, days_left int)
language plpgsql stable security definer set search_path = public as $$
declare g int; d timestamptz;
begin
  select grace_days into g from public.app_settings where id = 1;
  d := coalesce(p.paid_until, p.free_until);
  if p.suspended then return query select 'suspended', d, 0; return; end if;
  if p.role = 'admin' then return query select 'active', d, 0; return; end if;
  if p.manual_lock then return query select 'locked', d, 0; return; end if;
  if now() <= d then return query select 'active', d, null::int;
  elsif now() <= d + make_interval(days => g) then
    return query select 'grace', d, greatest(0, ceil(extract(epoch from (d + make_interval(days => g) - now())) / 86400)::int);
  else return query select 'locked', d, 0; end if;
end $$;

create or replace function public.my_account_state()
returns table(state text, due_on timestamptz, days_left int)
language sql stable security definer set search_path = public as
$$ select s.* from public.profiles p, lateral public.account_state(p) s where p.id = auth.uid() $$;

-- the lock page needs these without being signed in as an active member
create or replace function public.contact_details()
returns table(phone text, email text)
language sql stable security definer set search_path = public as
$$ select contact_phone, contact_email from public.app_settings where id = 1 $$;

create or replace function public.mark_paid(p_profile uuid, p_months int default 1, p_amount numeric default null, p_note text default null)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare base timestamptz; res timestamptz;
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  select greatest(coalesce(paid_until, free_until), now()) into base from public.profiles where id = p_profile;
  res := base + make_interval(months => p_months);
  update public.profiles set paid_until = res, manual_lock = false where id = p_profile;
  insert into public.payments(profile_id, months, amount_gbp, marked_by, note) values (p_profile, p_months, p_amount, auth.uid(), p_note);
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'mark_paid', jsonb_build_object('profile', p_profile, 'months', p_months, 'until', res));
  return res;
end $$;

-- sign-up: invite check + profile creation
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare s public.app_settings; inv text; invrow public.invites; fm int;
begin
  select * into s from public.app_settings where id = 1;
  inv := new.raw_user_meta_data->>'invite_code';
  if s.signup_mode = 'invite' then
    select * into invrow from public.invites where code = inv and used_by is null and (email is null or lower(email) = lower(new.email));
    if invrow.code is null then raise exception 'Sign-up is by invitation only'; end if;
    update public.invites set used_by = new.id, used_at = now() where code = invrow.code;
  end if;
  fm := s.free_months;
  insert into public.profiles(id, display_name, account_type, free_until, invited_by)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), case when new.raw_user_meta_data->>'account_type' = 'business' then 'business' else 'member' end, now() + make_interval(months => fm), invrow.created_by);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- row level security
alter table public.app_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.invites enable row level security;
alter table public.payments enable row level security;
alter table public.geo enable row level security;
alter table public.categories enable row level security;
alter table public.lists enable row level security;
alter table public.other_requests enable row level security;
alter table public.banners enable row level security;
alter table public.audit_log enable row level security;

create policy settings_admin on public.app_settings for all using (public.is_admin()) with check (public.is_admin());
create policy profiles_self_read on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_admin_all on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy invites_admin on public.invites for all using (public.is_admin()) with check (public.is_admin());
create policy payments_admin on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy payments_self_read on public.payments for select using (profile_id = auth.uid());
create policy geo_read on public.geo for select using (true);
create policy geo_admin on public.geo for all using (public.is_admin()) with check (public.is_admin());
create policy cat_read on public.categories for select using (true);
create policy cat_admin on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy lists_read on public.lists for select using (true);
create policy lists_admin on public.lists for all using (public.is_admin()) with check (public.is_admin());
create policy other_insert on public.other_requests for insert with check (requested_by = auth.uid());
create policy other_self_read on public.other_requests for select using (requested_by = auth.uid() or public.is_admin());
create policy other_admin on public.other_requests for all using (public.is_admin()) with check (public.is_admin());
-- banners: members see only ones switched on and in date
create policy banners_read on public.banners for select using (enabled and (starts_on is null or starts_on <= current_date) and (ends_on is null or ends_on >= current_date));
create policy banners_admin on public.banners for all using (public.is_admin()) with check (public.is_admin());
create policy audit_admin on public.audit_log for select using (public.is_admin());

-- members may edit only their own profile details, not status, role or dates
create or replace function public.guard_profile_update() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() or auth.uid() is null then return new; end if;
  new.role := old.role; new.free_until := old.free_until; new.paid_until := old.paid_until;
  new.manual_lock := old.manual_lock; new.suspended := old.suspended; new.admin_note := old.admin_note;
  new.joined_at := old.joined_at; new.invited_by := old.invited_by; new.account_type := old.account_type;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles for each row execute function public.guard_profile_update();
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

revoke execute on function public.mark_paid(uuid,int,numeric,text) from anon, public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.contact_details() to anon, authenticated;
grant execute on function public.my_account_state() to authenticated;
grant execute on function public.mark_paid(uuid,int,numeric,text) to authenticated;
