create or replace function public.public_config() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('signup_mode', signup_mode, 'free_months', free_months, 'grace_days', grace_days,
                           'monthly_fee_try', monthly_fee_try, 'monthly_fee_gbp', monthly_fee_gbp, 'billing_on', billing_on)
  from public.app_settings where id = 1
$$;
