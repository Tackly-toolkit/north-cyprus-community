alter table public.app_settings add column if not exists gbp_try_rate numeric check (gbp_try_rate is null or gbp_try_rate > 0);
alter table public.app_settings add column if not exists rate_updated_at timestamptz;
create or replace function public.public_config() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('signup_mode', signup_mode, 'free_months', free_months, 'grace_days', grace_days,
                           'monthly_fee_try', monthly_fee_try, 'monthly_fee_gbp', monthly_fee_gbp, 'billing_on', billing_on,
                           'gbp_try_rate', gbp_try_rate, 'rate_updated_at', rate_updated_at)
  from public.app_settings where id = 1
$$;
