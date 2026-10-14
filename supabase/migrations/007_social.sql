-- 007: likes and comments for marketplace listings, meetups and community news (posts already have their own)
create table public.item_likes (
  kind text not null check (kind in ('listing','event','update')),
  item_id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (kind, item_id, user_id)
);
create table public.item_comments (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('listing','event','update')),
  item_id text not null,
  author uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 400),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.item_comments (kind, item_id, created_at);
alter table public.item_likes enable row level security;
alter table public.item_comments enable row level security;
create policy il_read on public.item_likes for select using (true);
create policy il_insert on public.item_likes for insert with check (user_id = auth.uid() and public.can_use());
create policy il_delete on public.item_likes for delete using (user_id = auth.uid());
create policy ic_read on public.item_comments for select using (not hidden);
create policy ic_insert on public.item_comments for insert with check (author = auth.uid() and public.can_use());
create policy ic_delete on public.item_comments for delete using (author = auth.uid());
create policy ic_admin on public.item_comments for all using (public.is_admin()) with check (public.is_admin());
