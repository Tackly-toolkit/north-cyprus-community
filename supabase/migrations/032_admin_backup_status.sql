-- Lets admins read the last backup result for the admin home.
create or replace function public.admin_backup_status() returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  select data into r from public.backup_status where id = 1;
  return coalesce(r, '{}'::jsonb);
end $$;
revoke all on function public.admin_backup_status() from public, anon;
grant execute on function public.admin_backup_status() to authenticated;
