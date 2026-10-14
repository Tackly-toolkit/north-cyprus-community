-- 003: community content (posts, comments, likes, marketplace, directory, meetups, reports, messages) + media bucket

-- Is the signed-in person allowed to use the platform right now? (active or inside the 4-day grace window, not suspended/locked). Admins always.
create or replace function public.can_use() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p, lateral public.account_state(p) s
    where p.id = auth.uid() and s.state in ('active','grace')
  )
$$;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1500),
  audience text not null default 'public' check (audience in ('public','members')),
  help boolean not null default false,
  media_url text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.posts (created_at desc);

create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 400),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.post_comments (post_id, created_at);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80),
  description text not null check (char_length(description) between 2 and 400),
  price numeric(12,2) not null default 0 check (price >= 0),
  currency text not null default 'TRY',
  category_id text references public.categories(id),
  condition text,
  handover text,
  district_id text references public.geo(id),
  town_id text references public.geo(id),
  area_id text references public.geo(id),
  photos text[] not null default '{}',
  status text not null default 'active' check (status in ('active','sold','removed')),
  expires_at timestamptz not null default now() + interval '30 days',
  created_at timestamptz not null default now()
);
create index on public.listings (status, expires_at, created_at desc);

create table public.directory (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  category_id text references public.categories(id),
  district_id text references public.geo(id),
  town_id text references public.geo(id),
  area_id text references public.geo(id),
  address text,
  offer text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.meetups (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80),
  starts_at timestamptz not null,
  district_id text references public.geo(id),
  town_id text references public.geo(id),
  area_id text references public.geo(id),
  address text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.meetup_going (
  meetup_id uuid references public.meetups(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (meetup_id, user_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  target_id text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open','done')),
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles(id) on delete cascade,
  to_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 600),
  about text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.messages (to_id, created_at desc);

-- Public-safe view of members (name, photo, type, area only; never email, dates or notes)
create or replace view public.people with (security_invoker = false) as
  select id, display_name, photo_url, account_type, district_id, town_id, area_id, role
  from public.profiles where not suspended;
grant select on public.people to anon, authenticated;

alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.listings enable row level security;
alter table public.directory enable row level security;
alter table public.meetups enable row level security;
alter table public.meetup_going enable row level security;
alter table public.reports enable row level security;
alter table public.messages enable row level security;

-- posts
create policy posts_read_public on public.posts for select using (audience = 'public' and not hidden);
create policy posts_read_members on public.posts for select using (public.can_use() and not hidden);
create policy posts_insert on public.posts for insert with check (author = auth.uid() and public.can_use());
create policy posts_delete_own on public.posts for delete using (author = auth.uid());
create policy posts_admin on public.posts for all using (public.is_admin()) with check (public.is_admin());
-- likes
create policy likes_read on public.post_likes for select using (true);
create policy likes_insert on public.post_likes for insert with check (user_id = auth.uid() and public.can_use());
create policy likes_delete on public.post_likes for delete using (user_id = auth.uid());
-- comments
create policy cm_read on public.post_comments for select using (not hidden);
create policy cm_insert on public.post_comments for insert with check (author = auth.uid() and public.can_use());
create policy cm_delete_own on public.post_comments for delete using (author = auth.uid());
create policy cm_admin on public.post_comments for all using (public.is_admin()) with check (public.is_admin());
-- listings
create policy ls_read on public.listings for select using (status = 'active' and expires_at > now());
create policy ls_read_own on public.listings for select using (author = auth.uid());
create policy ls_insert on public.listings for insert with check (author = auth.uid() and public.can_use());
create policy ls_update_own on public.listings for update using (author = auth.uid()) with check (author = auth.uid());
create policy ls_delete_own on public.listings for delete using (author = auth.uid());
create policy ls_admin on public.listings for all using (public.is_admin()) with check (public.is_admin());
-- directory
create policy dir_read on public.directory for select using (status = 'approved');
create policy dir_read_own on public.directory for select using (owner = auth.uid());
create policy dir_insert on public.directory for insert with check (owner = auth.uid() and public.can_use());
create policy dir_update_own on public.directory for update using (owner = auth.uid() and status <> 'approved') with check (owner = auth.uid() and status = 'pending' and verified = false);
create policy dir_admin on public.directory for all using (public.is_admin()) with check (public.is_admin());
-- meetups
create policy mt_read on public.meetups for select using (not hidden);
create policy mt_insert on public.meetups for insert with check (author = auth.uid() and public.can_use());
create policy mt_delete_own on public.meetups for delete using (author = auth.uid());
create policy mt_admin on public.meetups for all using (public.is_admin()) with check (public.is_admin());
create policy mg_read on public.meetup_going for select using (true);
create policy mg_insert on public.meetup_going for insert with check (user_id = auth.uid() and public.can_use());
create policy mg_delete on public.meetup_going for delete using (user_id = auth.uid());
-- reports
create policy rp_insert on public.reports for insert with check (reporter = auth.uid());
create policy rp_admin on public.reports for all using (public.is_admin()) with check (public.is_admin());
-- messages
create policy msg_read on public.messages for select using (to_id = auth.uid() or from_id = auth.uid());
create policy msg_insert on public.messages for insert with check (from_id = auth.uid() and public.can_use());
create policy msg_mark on public.messages for update using (to_id = auth.uid()) with check (to_id = auth.uid());
create policy msg_admin on public.messages for all using (public.is_admin()) with check (public.is_admin());

-- Media bucket (Supabase Storage for now; move to Backblaze + Cloudflare once the keys and domain exist)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy media_read on storage.objects for select using (bucket_id = 'media');
create policy media_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text and public.can_use());
create policy media_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- Admin helper: one row of headline numbers
create or replace function public.admin_summary() returns json
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return json_build_object(
    'members', (select count(*) from profiles where role='member'),
    'businesses', (select count(*) from profiles where account_type='business'),
    'in_grace', (select count(*) from profiles p, lateral account_state(p) s where s.state='grace'),
    'locked', (select count(*) from profiles p, lateral account_state(p) s where s.state='locked'),
    'open_reports', (select count(*) from reports where status='open'),
    'pending_directory', (select count(*) from directory where status='pending'),
    'open_requests', (select count(*) from other_requests where status='pending')
  );
end $$;
