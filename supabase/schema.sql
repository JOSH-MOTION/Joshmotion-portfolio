-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.

create table if not exists categories (
  key text primary key,
  label text not null,
  sort_order int not null default 0
);

-- image_path stores the full Cloudinary secure_url (not a Supabase Storage
-- object path); image_public_id is Cloudinary's asset id, needed to delete
-- the image from Cloudinary when the row is deleted.
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null references categories(key) on delete restrict,
  location text not null default '',
  year text not null default '',
  image_path text not null,
  image_public_id text,
  width int not null default 1200,
  height int not null default 1500,
  span text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists rate_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price_amount numeric not null default 0,
  price_currency text not null default 'GHS',
  price_note text not null default '',
  image_path text not null,
  image_public_id text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table photos add column if not exists image_public_id text;
alter table rate_cards add column if not exists image_public_id text;

-- A single marker row means "the one admin account has been created" — it's
-- what lets /admin/setup-account refuse to create a second account once
-- you've made yours, without needing a service-role key to check auth.users.
create table if not exists admin_setup (
  key text primary key,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table photos enable row level security;
alter table rate_cards enable row level security;
alter table admin_setup enable row level security;

drop policy if exists "anyone can check admin_setup" on admin_setup;
create policy "anyone can check admin_setup"
  on admin_setup for select
  using (true);

drop policy if exists "anyone can insert admin_setup once" on admin_setup;
create policy "anyone can insert admin_setup once"
  on admin_setup for insert
  with check (true);

drop policy if exists "categories are publicly readable" on categories;
create policy "categories are publicly readable"
  on categories for select
  using (true);

drop policy if exists "photos are publicly readable" on photos;
create policy "photos are publicly readable"
  on photos for select
  using (true);

drop policy if exists "rate cards are publicly readable" on rate_cards;
create policy "rate cards are publicly readable"
  on rate_cards for select
  using (true);

drop policy if exists "authenticated users manage categories" on categories;
create policy "authenticated users manage categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated users manage photos" on photos;
create policy "authenticated users manage photos"
  on photos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated users manage rate cards" on rate_cards;
create policy "authenticated users manage rate cards"
  on rate_cards for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed the starting categories the site uses.
insert into categories (key, label, sort_order) values
  ('portrait', 'Portrait', 1),
  ('street', 'Street', 2),
  ('editorial', 'Editorial', 3),
  ('film', 'Film', 4),
  ('baby-family', 'Baby & Family', 5),
  ('wedding', 'Weddings', 6),
  ('corporate', 'Corporate', 7)
on conflict (key) do nothing;

-- Storage: create a public bucket named "photos". No longer used for new
-- uploads (images now go to Cloudinary — see src/lib/cloudinary.ts) but
-- left in place harmlessly in case anything still references it.

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "photos bucket is publicly readable" on storage.objects;
create policy "photos bucket is publicly readable"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "authenticated users upload to photos bucket" on storage.objects;
create policy "authenticated users upload to photos bucket"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

drop policy if exists "authenticated users update photos bucket" on storage.objects;
create policy "authenticated users update photos bucket"
  on storage.objects for update
  using (bucket_id = 'photos' and auth.role() = 'authenticated');

drop policy if exists "authenticated users delete from photos bucket" on storage.objects;
create policy "authenticated users delete from photos bucket"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');
