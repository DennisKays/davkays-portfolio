-- DAVKAYS PORTFOLIO ADMIN DATABASE
-- Run this entire script in:
-- Supabase Dashboard -> SQL Editor -> New query

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  category text not null,
  status text not null default 'Planned',
  title text not null,
  description text not null default '',
  technologies text[] not null default '{}',
  link text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null,
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.site_assets enable row level security;

drop policy if exists "Admins can read their own admin record"
on public.admin_users;

create policy "Admins can read their own admin record"
on public.admin_users
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Public can read projects"
on public.projects;

create policy "Public can read projects"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert projects"
on public.projects;

create policy "Admins can insert projects"
on public.projects
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Admins can update projects"
on public.projects;

create policy "Admins can update projects"
on public.projects
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Admins can delete projects"
on public.projects;

create policy "Admins can delete projects"
on public.projects
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Public can read site assets"
on public.site_assets;

create policy "Public can read site assets"
on public.site_assets
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site assets"
on public.site_assets;

create policy "Admins can insert site assets"
on public.site_assets
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Admins can update site assets"
on public.site_assets;

create policy "Admins can update site assets"
on public.site_assets
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Admins can delete site assets"
on public.site_assets;

create policy "Admins can delete site assets"
on public.site_assets
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio assets"
on storage.objects;

create policy "Public can view portfolio assets"
on storage.objects
for select
to public
using (bucket_id = 'portfolio-assets');

drop policy if exists "Admins can upload portfolio assets"
on storage.objects;

create policy "Admins can upload portfolio assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Admins can update portfolio assets"
on storage.objects;

create policy "Admins can update portfolio assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);

drop policy if exists "Admins can delete portfolio assets"
on storage.objects;

create policy "Admins can delete portfolio assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  )
);
