-- 005: admin tools (member list with emails, delete account, audit log, payments in TL)

alter table public.payments add column if not exists amount_try numeric(10,2);

create or replace function public.mark_paid(p_profile uuid, p_months int default 1, p_amount numeric default null, p_note text default null)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare base timestamptz; res timestamptz;
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  select greatest(coalesce(paid_until, free_until), now()) into base from public.profiles where id = p_profile;
  res := base + make_interval(months => p_months);
  update public.profiles set paid_until = res, manual_lock = false where id = p_profile;
  insert into public.payments(profile_id, months, amount_try, marked_by, note) values (p_profile, p_months, p_amount, auth.uid(), p_note);
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'mark_paid', jsonb_build_object('profile', p_profile, 'months', p_months, 'amount_try', p_amount, 'until', res));
  return res;
end $$;

create or replace function public.admin_members()
returns table(id uuid, email text, display_name text, photo_url text, account_type text, role text,
              district_id text, town_id text, area_id text, joined_at timestamptz, free_until timestamptz,
              paid_until timestamptz, manual_lock boolean, suspended boolean, admin_note text,
              state text, due_on timestamptz, days_left int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return query
    select p.id, u.email::text, p.display_name, p.photo_url, p.account_type, p.role, p.district_id, p.town_id, p.area_id,
           p.joined_at, p.free_until, p.paid_until, p.manual_lock, p.suspended, p.admin_note, s.state, s.due_on, s.days_left
    from public.profiles p join auth.users u on u.id = p.id, lateral public.account_state(p) s
    order by p.created_at desc;
end $$;

create or replace function public.admin_delete_user(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  if p_id = auth.uid() then raise exception 'cannot delete yourself'; end if;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), 'delete_user', jsonb_build_object('profile', p_id));
  delete from auth.users where id = p_id;
end $$;

create or replace function public.admin_log(p_action text, p_detail jsonb default '{}'::jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  insert into public.audit_log(actor, action, detail) values (auth.uid(), p_action, p_detail);
end $$;

-- member counts for clubs without exposing member lists
create or replace function public.club_counts() returns table(club_id uuid, n bigint)
language sql stable security definer set search_path = public as
$$ select club_id, count(*) from public.club_members group by club_id $$;
grant execute on function public.club_counts() to anon, authenticated;
