-- Katoto Revival Center — database for the admin dashboard.
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Anyone can read sermons, ministries and service times; only users listed in
-- public.admins can add, edit or delete them. To make someone an admin, create
-- their user under Authentication → Users, then run:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'person@example.com';

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Lets the dashboard check whether the signed-in user is an admin
create policy "Users can see their own admin row"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

-- A sermon shows as live on its date (Malawi time) and moves to past sermons the day after
create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null,
  series text not null,
  date date not null default (now() at time zone 'Africa/Blantyre')::date,
  link text not null,          -- YouTube or Facebook video / live stream URL
  thumbnail text,              -- "asset:<path in src/assets>" or an image URL
  description text,
  created_at timestamptz not null default now()
);

create table public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  leader text,
  schedule text,
  icon text,                   -- key from ministryIcons in src/data/ministries.js
  image text,                  -- "asset:<path in src/assets>" or an image URL
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.service_times (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  day text not null,
  time text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.sermons enable row level security;
alter table public.ministries enable row level security;
alter table public.service_times enable row level security;

create policy "Anyone can read sermons" on public.sermons for select using (true);
create policy "Admins manage sermons" on public.sermons for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read ministries" on public.ministries for select using (true);
create policy "Admins manage ministries" on public.ministries for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read service times" on public.service_times for select using (true);
create policy "Admins manage service times" on public.service_times for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.sermons, public.ministries, public.service_times to anon, authenticated;
grant insert, update, delete on public.sermons, public.ministries, public.service_times to authenticated;
grant select on public.admins to authenticated;

-- ---------------------------------------------------------------------------
-- Starting content (what the site showed before the dashboard existed)
-- ---------------------------------------------------------------------------

insert into public.ministries (name, description, leader, schedule, icon, image, sort_order) values
  ('Youth Ministry', 'We disciple young people (13–25) through worship, Bible study, and fellowship so they grow as leaders and followers of Christ.', 'Bro. David Kimani', 'Fridays, 6:00 PM', 'youth', 'asset:youth-ministry/556648250_1134197515428730_3899871776711072794_n.jpg', 0),
  ('Women''s Fellowship', 'A safe space for women to pray, study the Word, and support one another in faith and life.', 'Sis. Grace Wanjiru', 'First Saturday of each month, 8:00 AM', 'women', 'asset:womens-ministry/509719573_1058574962990986_7921665953125148302_n.jpg', 1),
  ('Men''s Fellowship', 'Men gathering to grow in godliness, accountability, and service to family and church.', 'Elder James Otieno', 'Second Saturday of each month, 7:00 AM', 'men', 'asset:mens-ministry/555683360_1134197908762024_2321877765068401350_n.jpg', 2),
  ('Children''s Ministry', 'Age-appropriate teaching, worship, and activities so children discover Jesus in a fun, safe environment.', 'Sis. Mary Njeri', 'Sundays during main service', 'children', 'asset:children-ministry/682593563_1297017799146700_6106475829369747874_n.jpg', 3),
  ('Prayer Ministry', 'Intercession for the church, community, and nations. We meet to pray and also support prayer requests.', 'Elder Grace Wanjiru', 'Wednesdays, 5:30 PM & Sundays before service', 'prayer', 'asset:miscellenious/556652987_1134227028759112_8645909850777201291_n.jpg', 4),
  ('Outreach & Community', 'Taking the love of Christ beyond our walls through evangelism, visits, and community projects.', 'Bro. Peter Mburu', 'As scheduled (monthly outreaches)', 'outreach', 'asset:miscellenious/557823259_1134197408762074_6849635619622513725_n.jpg', 5),
  ('Worship Team', 'Leading the congregation in praise and worship through music and song.', 'Sis. Ruth Akinyi', 'Rehearsals: Saturdays 2:00 PM; Service: Sundays', 'worship', 'asset:praise-team/800797079_2653013788501839_935930877774437652_n.jpeg', 6);

insert into public.service_times (name, day, time, sort_order) values
  ('Sunday Worship', 'Sunday', '9:00 AM', 0),
  ('Midweek Prayer', 'Wednesday', '5:30 PM', 1),
  ('Youth Night', 'Friday', '6:00 PM', 2),
  ('Women''s Fellowship', 'First Saturday', '8:00 AM', 3),
  ('Men''s Fellowship', 'Second Saturday', '7:00 AM', 4);
