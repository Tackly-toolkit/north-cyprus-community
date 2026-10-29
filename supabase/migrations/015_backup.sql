-- 015 Nightly backup to Backblaze: locked secrets table, status row, helper functions (service role only).
create table if not exists public.ops_secrets (name text primary key, value text not null, updated_at timestamptz not null default now());
alter table public.ops_secrets enable row level security;           -- no policies: only the service role can read it
revoke all on public.ops_secrets from anon, authenticated;
create table if not exists public.backup_status (id int primary key, data jsonb, updated_at timestamptz default now());
alter table public.backup_status enable row level security;
revoke all on public.backup_status from anon, authenticated;

create or replace function public.backup_tables() returns setof text language sql security definer set search_path = public as $$
  select table_name::text from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' and table_name not in ('ops_secrets','backup_status') order by 1;
$$;
create or replace function public.backup_dump(t text, off int, lim int) returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  if t not in (select public.backup_tables()) then raise exception 'unknown table'; end if;
  execute format('select coalesce(jsonb_agg(to_jsonb(x)), ''[]''::jsonb) from (select * from public.%I order by ctid offset %s limit %s) x', t, off, lim) into r;
  return r;
end $$;
create or replace function public.backup_storage_objects() returns table(bucket_id text, name text, size bigint) language sql security definer set search_path = public, storage as $$
  select bucket_id::text, name::text, coalesce((metadata->>'size')::bigint, 0) from storage.objects;
$$;
revoke all on function public.backup_tables(), public.backup_dump(text,int,int), public.backup_storage_objects() from public, anon, authenticated;
grant execute on function public.backup_tables(), public.backup_dump(text,int,int), public.backup_storage_objects() to service_role;
grant select, insert, update on public.ops_secrets, public.backup_status to service_role;
