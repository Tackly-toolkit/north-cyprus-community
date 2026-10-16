create table if not exists public.info_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('place','contact')),
  category text not null,
  title text not null check (char_length(title) between 2 and 120),
  body text check (char_length(body) <= 1200),
  hours text check (char_length(hours) <= 300),
  fee text check (char_length(fee) <= 200),
  phone text check (char_length(phone) <= 60),
  website text check (char_length(website) <= 200),
  map_query text check (char_length(map_query) <= 200),
  district_id text,
  sort int not null default 0,
  active boolean not null default true,
  source_url text check (char_length(source_url) <= 300),
  checked_on date,
  created_at timestamptz not null default now()
);
alter table public.info_items enable row level security;
create policy info_read on public.info_items for select using (active);
create policy info_admin on public.info_items for all using (public.is_admin()) with check (public.is_admin());
