create table if not exists public.guide_texts (
  guide_key text primary key,
  body text not null check (char_length(body) <= 12000),
  source_name text check (char_length(source_name) <= 160),
  source_url text check (char_length(source_url) <= 300),
  law_ref text check (char_length(law_ref) <= 200),
  checked_on date,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.guide_texts enable row level security;
create policy gt_read on public.guide_texts for select using (published);
create policy gt_admin on public.guide_texts for all using (public.is_admin()) with check (public.is_admin());

alter table public.updates
  add column if not exists category text,
  add column if not exists source_url text check (char_length(source_url) <= 300),
  add column if not exists law_ref text check (char_length(law_ref) <= 200),
  add column if not exists checked_on date,
  add column if not exists guide_key text;

create table if not exists public.official_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  url text not null check (char_length(url) <= 300),
  body text,
  readable text not null default 'yes' check (readable in ('yes','no','unknown')),
  note text,
  last_checked date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.official_sources enable row level security;
create policy os_admin on public.official_sources for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.update_review (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 200),
  note text,
  url text check (char_length(url) <= 300),
  origin text not null default 'tip-off',
  status text not null default 'pending' check (status in ('pending','done','dismissed')),
  created_at timestamptz not null default now()
);
alter table public.update_review enable row level security;
create policy ur_admin on public.update_review for all using (public.is_admin()) with check (public.is_admin());

insert into public.official_sources (name,url,body,readable,note) values
('Foreign Ministry: laws and regulations','https://www.mfa.gov.ct.tr/pages/laws-and-regulations','Ministry of Foreign Affairs','yes','Links only; no residence or property texts listed'),
('Foreign Ministry: visa regulations','https://www.mfa.gov.ct.tr/pages/visa-regulations','Ministry of Foreign Affairs','yes','Visa types, 90 days in 180, entry documents'),
('eVisa portal','https://kktc-evize.gov.ct.tr/en','Ministry of Foreign Affairs','unknown','Application portal'),
('Foreign Ministry: Public Information Office, life for foreigners','https://pio.mfa.gov.ct.tr/en/life-in-the-trnc-for-foreigners/','Public Information Office','yes','Overview only, dated 2024'),
('Ministry of Interior: notices (incl. Immovable Property Purchase Unit)','https://icisleri.gov.ct.tr/','Ministry of Interior','yes','Online property applications since 14 Nov 2022'),
('Immigration Department (Muhaceret Dairesi)','http://muhaceretdairesi.gov.ct.tr/','Immigration Department','no','Residence permit pages redirect in a loop for automated reading; read by a person'),
('Central Legislation Office (mevzuat)','https://mevzuat.gov.ct.tr/','Central Legislation Office','no','Blocks automated reading; Residence Permits and Visas Regulation 19/02/2026 consolidated PDF is here'),
('Official Gazette (Resmi Gazete)','https://basimevi.gov.ct.tr/','Government Printing House','no','Blocks automated reading; review by a person')
on conflict do nothing;
