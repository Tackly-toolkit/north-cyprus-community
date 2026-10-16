-- 012: charging switched off. Membership is free; admin can switch charging on later.
alter table public.app_settings add column if not exists billing_on boolean not null default false;
create or replace function public.account_state(p profiles)
 returns table(state text, due_on timestamptz, days_left int)
 language plpgsql stable security definer set search_path to 'public' as $f$
declare g int; d timestamptz; b boolean;
begin
  select grace_days, billing_on into g, b from public.app_settings where id = 1;
  d := coalesce(p.paid_until, p.free_until);
  if p.suspended then return query select 'suspended', d, 0; return; end if;
  if p.role = 'admin' then return query select 'active', d, 0; return; end if;
  if p.manual_lock then return query select 'locked', d, 0; return; end if;
  if not coalesce(b,false) then return query select 'active', null::timestamptz, null::int; return; end if;
  if now() <= d then return query select 'active', d, null::int;
  elsif now() <= d + make_interval(days => g) then
    return query select 'grace', d, greatest(0, ceil(extract(epoch from (d + make_interval(days => g) - now())) / 86400)::int);
  else return query select 'locked', d, 0; end if;
end $f$;
