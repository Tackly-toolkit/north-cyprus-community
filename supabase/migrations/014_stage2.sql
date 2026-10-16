-- 014: Stage 2 community: looking-for, property type/bathrooms, favourites, recommendations, repeating events, notifications
alter table public.lists drop constraint lists_kind_check;
alter table public.lists add constraint lists_kind_check check (kind in ('condition','currency','handover','bedrooms','furnished','property_type','bathrooms'));
alter table public.listings add column if not exists intent text not null default 'offer' check (intent in ('offer','looking'));
alter table public.listings add column if not exists property_type text;
alter table public.listings add column if not exists bathrooms text;
alter table public.meetups add column if not exists repeat text not null default 'none' check (repeat in ('none','weekly','biweekly','monthly'));

insert into public.lists(kind,value,sort) values
 ('property_type','Not applicable',0),('property_type','Apartment',1),('property_type','Villa',2),('property_type','Bungalow',3),('property_type','Townhouse',4),('property_type','Studio',5),('property_type','Penthouse',6),('property_type','Land',7),('property_type','Commercial',8),
 ('bathrooms','Not applicable',0),('bathrooms','1 bathroom',1),('bathrooms','2 bathrooms',2),('bathrooms','3 bathrooms',3),('bathrooms','4 or more bathrooms',4);

create table if not exists public.favourites (
  member uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('listing','event','biz')),
  ref text not null,
  created_at timestamptz not null default now(),
  primary key (member, kind, ref)
);
alter table public.favourites enable row level security;
create policy fav_own on public.favourites for all using (member = auth.uid()) with check (member = auth.uid());

create table if not exists public.dir_recs (
  directory_id uuid not null references public.directory(id) on delete cascade,
  member uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (directory_id, member)
);
alter table public.dir_recs enable row level security;
create policy rec_read on public.dir_recs for select using (auth.uid() is not null);
create policy rec_ins on public.dir_recs for insert with check (member = auth.uid() and public.can_use());
create policy rec_del on public.dir_recs for delete using (member = auth.uid());
create policy rec_admin on public.dir_recs for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  member uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  actor uuid,
  ref text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_member on public.notifications (member, created_at desc);
alter table public.notifications enable row level security;
create policy nt_read on public.notifications for select using (member = auth.uid());
create policy nt_update on public.notifications for update using (member = auth.uid()) with check (member = auth.uid());
create policy nt_delete on public.notifications for delete using (member = auth.uid());

create or replace function public.notify(p_member uuid, p_kind text, p_actor uuid, p_ref text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_member is null or p_member = p_actor then return; end if;
  insert into public.notifications(member, kind, actor, ref) values (p_member, p_kind, p_actor, p_ref);
end $$;
revoke all on function public.notify(uuid,text,uuid,text) from public, anon, authenticated;

create or replace function public.tg_notify() returns trigger language plpgsql security definer set search_path = public as $$
declare o uuid;
begin
  if tg_table_name = 'friendships' then
    if tg_op = 'INSERT' then perform public.notify(new.addressee, 'friend_req', new.requester, null);
    elsif new.status = 'accepted' and old.status is distinct from 'accepted' then perform public.notify(new.requester, 'friend_ok', new.addressee, null); end if;
  elsif tg_table_name = 'post_comments' then
    select author into o from public.posts where id = new.post_id; perform public.notify(o, 'comment', new.author, new.post_id::text);
  elsif tg_table_name = 'item_comments' then
    if new.kind = 'listing' then select author into o from public.listings where id::text = new.item_id;
    elsif new.kind = 'event' then select author into o from public.meetups where id::text = new.item_id; end if;
    perform public.notify(o, 'comment_' || new.kind, new.author, new.item_id);
  elsif tg_table_name = 'messages' then
    perform public.notify(new.to_id, 'message', new.from_id, null);
  elsif tg_table_name = 'meetup_going' then
    select author into o from public.meetups where id = new.meetup_id; perform public.notify(o, 'going', new.user_id, new.meetup_id::text);
  end if;
  return null;
end $$;
drop trigger if exists tg_n_fr on public.friendships;
create trigger tg_n_fr after insert or update on public.friendships for each row execute function public.tg_notify();
drop trigger if exists tg_n_pc on public.post_comments;
create trigger tg_n_pc after insert on public.post_comments for each row execute function public.tg_notify();
drop trigger if exists tg_n_ic on public.item_comments;
create trigger tg_n_ic after insert on public.item_comments for each row execute function public.tg_notify();
drop trigger if exists tg_n_ms on public.messages;
create trigger tg_n_ms after insert on public.messages for each row execute function public.tg_notify();
drop trigger if exists tg_n_mg on public.meetup_going;
create trigger tg_n_mg after insert on public.meetup_going for each row execute function public.tg_notify();
