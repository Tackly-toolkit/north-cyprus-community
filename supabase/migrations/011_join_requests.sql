-- 011: "Apply to join" requests (used when sign-up is invite only)
create table public.join_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  email text not null check (char_length(email) between 5 and 120 and email like '%@%.%'),
  country text check (char_length(country) <= 60),
  how_heard text check (char_length(how_heard) <= 120),
  message text check (char_length(message) <= 600),
  status text not null default 'new' check (status in ('new','invited','declined')),
  invite_code text,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);
create unique index join_requests_open_email on public.join_requests (lower(email)) where status = 'new';
alter table public.join_requests enable row level security;
create policy jr_insert on public.join_requests for insert to anon, authenticated with check (status = 'new' and invite_code is null and handled_at is null);
create policy jr_admin on public.join_requests for all using (public.is_admin()) with check (public.is_admin());
