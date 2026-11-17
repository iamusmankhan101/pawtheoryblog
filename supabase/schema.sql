-- Run this whole file on a NEW project. Existing project: run only the MIGRATION block at the bottom.
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  category text not null,
  author text,
  read_time text,
  cover_url text,
  body text,
  featured boolean default false,
  status text not null default 'published' check (status in ('draft','published')),
  created_at timestamptz default now()
);
alter table posts add column if not exists status text not null default 'published' check (status in ('draft','published'));

alter table posts enable row level security;
drop policy if exists "public read" on posts;
create policy "public read" on posts for select using (status = 'published' or auth.role() = 'authenticated');
drop policy if exists "auth insert" on posts;
create policy "auth insert" on posts for insert to authenticated with check (true);
drop policy if exists "auth update" on posts;
create policy "auth update" on posts for update to authenticated using (true) with check (true);
drop policy if exists "auth delete" on posts;
create policy "auth delete" on posts for delete to authenticated using (true);

insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;
drop policy if exists "covers public read" on storage.objects;
create policy "covers public read" on storage.objects for select using (bucket_id = 'covers');
drop policy if exists "covers auth insert" on storage.objects;
create policy "covers auth insert" on storage.objects for insert to authenticated with check (bucket_id = 'covers');
drop policy if exists "covers auth update" on storage.objects;
create policy "covers auth update" on storage.objects for update to authenticated using (bucket_id = 'covers');
drop policy if exists "covers auth delete" on storage.objects;
create policy "covers auth delete" on storage.objects for delete to authenticated using (bucket_id = 'covers');

-- ============================================================
-- MIGRATION for EXISTING projects: categories, authors, subscribers, messages.
-- Paste ONLY this block (between the lines) in the SQL editor. Safe to re-run.
-- ============================================================
create table if not exists categories (
  slug text primary key,
  name text not null,
  description text,
  sort int not null default 0,
  created_at timestamptz default now()
);
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  role text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

alter table categories enable row level security;
alter table authors enable row level security;
alter table subscribers enable row level security;
alter table messages enable row level security;

drop policy if exists "public read" on categories;
create policy "public read" on categories for select using (true);
drop policy if exists "auth all" on categories;
create policy "auth all" on categories for all to authenticated using (true) with check (true);

drop policy if exists "public read" on authors;
create policy "public read" on authors for select using (true);
drop policy if exists "auth all" on authors;
create policy "auth all" on authors for all to authenticated using (true) with check (true);

-- anon may only insert; only authenticated can read/update/delete
drop policy if exists "anon insert" on subscribers;
create policy "anon insert" on subscribers for insert to anon, authenticated with check (true);
drop policy if exists "auth all" on subscribers;
create policy "auth all" on subscribers for all to authenticated using (true) with check (true);

drop policy if exists "anon insert" on messages;
create policy "anon insert" on messages for insert to anon, authenticated with check (true);
drop policy if exists "auth all" on messages;
create policy "auth all" on messages for all to authenticated using (true) with check (true);

insert into categories (slug, name, description, sort) values
  ('dogs', 'Dogs', 'Care, breeds and everyday life with your canine companion.', 10),
  ('cats', 'Cats', 'Understanding and caring for independent, curious cats.', 20),
  ('small-pets', 'Small Pets', 'Rabbits, guinea pigs, hamsters and other little friends.', 30),
  ('birds', 'Birds', 'Parrots, finches and everything feathered.', 40),
  ('fish-aquatics', 'Fish & Aquatics', 'Tank setup, water quality and healthy fish.', 50),
  ('reptiles', 'Reptiles', 'Habitat, heat and handling for scaly pets.', 60),
  ('pet-health', 'Pet Health', 'Vet-approved advice on prevention and treatment.', 70),
  ('nutrition', 'Nutrition', 'Feeding guides for every species and life stage.', 80),
  ('training-behavior', 'Training & Behavior', 'Positive methods for a happier, well-mannered pet.', 90),
  ('adoption', 'Adoption', 'Finding, welcoming and settling in a new family member.', 100)
on conflict (slug) do nothing;

insert into authors (name, role, bio) values
  ('Dr. Maya Collins', 'Veterinarian', 'Small-animal vet with 12 years of clinical experience.'),
  ('Tom Ellery', 'Certified Dog Trainer', 'Reward-based trainer helping families since 2012.'),
  ('Dr. Priya Nair', 'Exotics Veterinarian', 'Specialist in birds, reptiles and small mammals.')
on conflict (name) do nothing;
-- ============================================================
-- END MIGRATION
-- ============================================================

-- ============================================================
-- MIGRATION: per-page SEO overrides (admin > SEO). Safe to re-run.
-- ============================================================
create table if not exists page_seo (
  path text primary key,              -- e.g. '/', '/about', '/category/dogs', '/article/my-slug'
  title text,
  description text,
  canonical text,
  og_image text,
  noindex boolean not null default false,
  updated_at timestamptz default now()
);
alter table page_seo enable row level security;
drop policy if exists "public read" on page_seo;
create policy "public read" on page_seo for select using (true);
drop policy if exists "auth all" on page_seo;
create policy "auth all" on page_seo for all to authenticated using (true) with check (true);
-- ============================================================
-- END page_seo MIGRATION
-- ============================================================
