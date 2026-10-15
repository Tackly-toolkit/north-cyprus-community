-- 010: chat bubble (member <-> admin) and phone numbers removed from settings
update public.app_settings set contact_phone = null, contact_whatsapp = null where id = 1;

create table public.support_messages (
  id uuid primary key default gen_random_uuid(),
  member uuid not null references public.profiles(id) on delete cascade,
  from_admin boolean not null default false,
  body text not null check (char_length(body) between 1 and 1000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.support_messages (member, created_at);
alter table public.support_messages enable row level security;

create policy sm_read on public.support_messages for select using (member = auth.uid() or public.is_admin());
create policy sm_insert on public.support_messages for insert with check (
  (member = auth.uid() and not from_admin) or (public.is_admin() and from_admin));
create policy sm_update on public.support_messages for update using (member = auth.uid() or public.is_admin())
  with check (member = auth.uid() or public.is_admin());
create policy sm_delete on public.support_messages for delete using (public.is_admin());

create or replace function public.admin_support_threads()
returns table(member uuid, display_name text, email text, last_body text, last_at timestamptz, last_from_admin boolean, unread bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return query
  select m.member, p.display_name, u.email::text,
    (array_agg(m.body order by m.created_at desc))[1],
    max(m.created_at),
    (array_agg(m.from_admin order by m.created_at desc))[1],
    count(*) filter (where not m.from_admin and not m.read)
  from public.support_messages m
  join public.profiles p on p.id = m.member
  left join auth.users u on u.id = m.member
  group by m.member, p.display_name, u.email
  order by max(m.created_at) desc;
end $$;
revoke all on function public.admin_support_threads() from public, anon;
grant execute on function public.admin_support_threads() to authenticated;
