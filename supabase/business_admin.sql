-- ============================================================
-- DAVKAYS SOFTwares BUSINESS ADMIN DATABASE
-- Run this entire file in Supabase SQL Editor.
-- ============================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null default '',
  role text not null default '',
  message text not null,
  image_url text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  project_type text not null default '',
  message text not null default '',
  status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1,
  business_name text not null default 'DavKays Softwares',
  tagline text not null default '',
  email text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  linkedin text not null default '',
  hero_title text not null default '',
  hero_description text not null default '',
  about_text text not null default '',
  skills text[] not null default '{}',
  logo_url text not null default '',
  current_cv_url text not null default '',
  current_cv_name text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null default '',
  entity_id text not null default '',
  details text not null default '',
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null
);

alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_logs enable row level security;

-- SERVICES

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services
for select
to anon, authenticated
using (active = true or exists (
  select 1 from public.admin_users
  where id = auth.uid()
));

drop policy if exists "Admins can insert services" on public.services;
create policy "Admins can insert services"
on public.services
for insert
to authenticated
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can update services" on public.services;
create policy "Admins can update services"
on public.services
for update
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
))
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can delete services" on public.services;
create policy "Admins can delete services"
on public.services
for delete
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
));

-- TESTIMONIALS

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
on public.testimonials
for select
to anon, authenticated
using (published = true or exists (
  select 1 from public.admin_users
  where id = auth.uid()
));

drop policy if exists "Admins can insert testimonials" on public.testimonials;
create policy "Admins can insert testimonials"
on public.testimonials
for insert
to authenticated
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can update testimonials" on public.testimonials;
create policy "Admins can update testimonials"
on public.testimonials
for update
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
))
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can delete testimonials" on public.testimonials;
create policy "Admins can delete testimonials"
on public.testimonials
for delete
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
));

-- LEADS

drop policy if exists "Anyone can submit leads" on public.leads;
create policy "Anyone can submit leads"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads
for select
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads
for update
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
))
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
on public.leads
for delete
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
));

-- SETTINGS

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert settings" on public.site_settings;
create policy "Admins can insert settings"
on public.site_settings
for insert
to authenticated
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can update settings" on public.site_settings;
create policy "Admins can update settings"
on public.site_settings
for update
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
))
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

-- ACTIVITY LOG

drop policy if exists "Admins can read activity" on public.activity_logs;
create policy "Admins can read activity"
on public.activity_logs
for select
to authenticated
using (exists (
  select 1 from public.admin_users where id = auth.uid()
));

drop policy if exists "Admins can insert activity" on public.activity_logs;
create policy "Admins can insert activity"
on public.activity_logs
for insert
to authenticated
with check (exists (
  select 1 from public.admin_users where id = auth.uid()
));

-- DEFAULT SETTINGS

insert into public.site_settings (id, business_name)
values (1, 'DavKays Softwares')
on conflict (id) do nothing;

-- DEFAULT SERVICES

insert into public.services (title, description, sort_order)
select *
from (
  values
    (
      'Custom Software Development',
      'Business-focused software systems designed around specific workflows, operations and organizational needs.',
      1
    ),
    (
      'School Management Systems',
      'Digital solutions for managing students, teachers, classes, attendance, marks, fees and school operations.',
      2
    ),
    (
      'Web Application Development',
      'Responsive and modern web applications built with practical technologies and clean user experiences.',
      3
    ),
    (
      'Business Management Systems',
      'Simple, centralized systems that help organizations organize information and manage everyday operations.',
      4
    ),
    (
      'Dashboards & Data-driven Applications',
      'Interactive interfaces that turn organizational data into useful information for monitoring and decision-making.',
      5
    ),
    (
      'Programming & Computer Science Tutoring',
      'One-on-one or small-group tutoring in programming, computer science concepts, databases and software development.',
      6
    ),
    (
      'System Upgrades & Maintenance',
      'Continuous improvements, feature additions, bug fixes and maintenance for existing software systems.',
      7
    )
) as defaults(title, description, sort_order)
where not exists (
  select 1 from public.services
);

-- STORAGE

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets"
on storage.objects
for select
to public
using (bucket_id = 'portfolio-assets');

drop policy if exists "Admins can upload portfolio assets" on storage.objects;
create policy "Admins can upload portfolio assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and exists (
    select 1 from public.admin_users where id = auth.uid()
  )
);

drop policy if exists "Admins can update portfolio assets" on storage.objects;
create policy "Admins can update portfolio assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and exists (
    select 1 from public.admin_users where id = auth.uid()
  )
);

drop policy if exists "Admins can delete portfolio assets" on storage.objects;
create policy "Admins can delete portfolio assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and exists (
    select 1 from public.admin_users where id = auth.uid()
  )
);
