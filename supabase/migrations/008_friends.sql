-- 008: friends (requests, accepted friends), friends-only posts, posts that share a listing or meetup

alter table public.posts add column if not exists ref_kind text check (ref_kind in ('listing','event'));
alter table public.posts add column if not exists ref_id text;
alter table public.posts drop constraint if exists posts_audience_check;
alter table public.posts add constraint posts_audience_check check (audience in ('public','members','friends'));

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references public.profiles(id) on delete cascade,
  addressee uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester <> addressee)
);
create unique index friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));
create index on public.friendships (addressee, status);
alter table public.friendships enable row level security;

create or replace function public.are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.friendships f where f.status = 'accepted'
    and ((f.requester = a and f.addressee = b) or (f.requester = b and f.addressee = a)))
$$;

create policy fr_read on public.friendships for select using (requester = auth.uid() or addressee = auth.uid() or public.is_admin());
create policy fr_insert on public.friendships for insert with check (requester = auth.uid() and status = 'pending' and public.can_use());
create policy fr_accept on public.friendships for update using (addressee = auth.uid()) with check (addressee = auth.uid() and status = 'accepted');
create policy fr_delete on public.friendships for delete using (requester = auth.uid() or addressee = auth.uid() or public.is_admin());

-- friends-only posts are visible to the author and their friends
drop policy if exists posts_read_members on public.posts;
create policy posts_read_members on public.posts for select using (
  public.can_use() and not hidden
  and (club_id is null or exists (select 1 from public.club_members cm where cm.club_id = posts.club_id and cm.user_id = auth.uid()))
  and (audience <> 'friends' or author = auth.uid() or public.are_friends(auth.uid(), author))
);
