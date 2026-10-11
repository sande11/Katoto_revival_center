-- Additional public-page content and private visitor submissions.
-- Run after the initial schema migration.

create table public.about_content (
  id boolean primary key default true check (id),
  story_title text not null default 'Our Story',
  story_first_paragraph text not null default '',
  story_second_paragraph text not null default '',
  vision text not null default '',
  mission text not null default '',
  affiliation text not null default '',
  updated_at timestamptz not null default now()
);

create table public.beliefs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  bio text not null,
  image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time text not null,
  location text not null,
  description text not null,
  image text,
  rsvp_link text,
  is_past boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.giving_methods (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('bank', 'mobile')),
  provider text not null,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.contact_settings (
  id boolean primary key default true check (id),
  address text not null default '',
  email text not null default '',
  phone text not null default '',
  phone_display text not null default '',
  whatsapp_url text,
  facebook_url text,
  youtube_url text,
  map_embed_url text,
  directions_url text,
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  request text not null,
  share_public boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.about_content enable row level security;
alter table public.beliefs enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.giving_methods enable row level security;
alter table public.contact_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.prayer_requests enable row level security;

create policy "Anyone can read about content" on public.about_content for select using (true);
create policy "Admins manage about content" on public.about_content for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Anyone can read beliefs" on public.beliefs for select using (true);
create policy "Admins manage beliefs" on public.beliefs for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Anyone can read team members" on public.team_members for select using (true);
create policy "Admins manage team members" on public.team_members for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Anyone can read events" on public.events for select using (true);
create policy "Admins manage events" on public.events for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Anyone can read giving methods" on public.giving_methods for select using (true);
create policy "Admins manage giving methods" on public.giving_methods for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Anyone can read contact settings" on public.contact_settings for select using (true);
create policy "Admins manage contact settings" on public.contact_settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage contact messages" on public.contact_messages for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage prayer requests" on public.prayer_requests for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Visitors may only create submissions through these functions. The validation and
-- lack of table grants keep private message data out of the public API.
create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_website text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare result_id uuid;
begin
  if coalesce(btrim(p_website), '') <> '' then raise exception 'Invalid submission'; end if;
  if char_length(btrim(coalesce(p_name, ''))) not between 2 and 120 then raise exception 'Please provide a valid name'; end if;
  if char_length(btrim(coalesce(p_email, ''))) not between 5 and 254 or btrim(p_email) !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Please provide a valid email address'; end if;
  if char_length(btrim(coalesce(p_phone, ''))) > 40 then raise exception 'Phone number is too long'; end if;
  if char_length(btrim(coalesce(p_message, ''))) not between 2 and 5000 then raise exception 'Message must be between 2 and 5000 characters'; end if;
  insert into public.contact_messages (name, email, phone, message)
  values (btrim(p_name), lower(btrim(p_email)), nullif(btrim(p_phone), ''), btrim(p_message))
  returning id into result_id;
  return result_id;
end;
$$;

create or replace function public.submit_prayer_request(
  p_name text,
  p_email text,
  p_request text,
  p_share_public boolean,
  p_website text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare result_id uuid;
begin
  if coalesce(btrim(p_website), '') <> '' then raise exception 'Invalid submission'; end if;
  if char_length(btrim(coalesce(p_name, ''))) > 120 then raise exception 'Name is too long'; end if;
  if btrim(coalesce(p_email, '')) <> '' and (char_length(btrim(p_email)) > 254 or btrim(p_email) !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') then raise exception 'Please provide a valid email address'; end if;
  if char_length(btrim(coalesce(p_request, ''))) not between 2 and 5000 then raise exception 'Prayer request must be between 2 and 5000 characters'; end if;
  insert into public.prayer_requests (name, email, request, share_public)
  values (nullif(btrim(p_name), ''), nullif(lower(btrim(p_email)), ''), btrim(p_request), coalesce(p_share_public, false))
  returning id into result_id;
  return result_id;
end;
$$;

-- This view intentionally excludes email and all unapproved requests.
create view public.public_prayer_requests as
  select id, request, name, (name is null) as anonymous, created_at as date
  from public.prayer_requests
  where share_public and approved_at is not null;

grant select on public.about_content, public.beliefs, public.team_members, public.events, public.giving_methods, public.contact_settings to anon, authenticated;
grant insert, update, delete on public.about_content, public.beliefs, public.team_members, public.events, public.giving_methods, public.contact_settings, public.contact_messages, public.prayer_requests to authenticated;
grant select on public.contact_messages, public.prayer_requests to authenticated;
grant select on public.public_prayer_requests to anon, authenticated;
grant execute on function public.submit_contact_message(text, text, text, text, text) to anon, authenticated;
grant execute on function public.submit_prayer_request(text, text, text, boolean, text) to anon, authenticated;

insert into public.about_content (id, story_first_paragraph, story_second_paragraph, vision, mission, affiliation) values
  (true, 'Katoto Revival Center was founded in the heart of Katoto with a simple but burning vision: to see the power of revival touch lives and transform the community. What started as a small gathering of believers has grown into a family of faith where the Word is preached, the Holy Spirit is welcomed, and every person is valued.', 'Our journey has been marked by prayer, perseverance, and the faithfulness of God. We believe that revival is not a one-time event but a lifestyle—of hunger for God, love for one another, and obedience to the Great Commission.', 'To be a church where the fire of revival never goes out—where lives are saved, healed, and discipled, and where the presence of God is the center of everything we do.', 'To know Christ and make Him known through worship, the Word, discipleship, and love in action—in our families, community, and nation.', 'Katoto Revival Center is part of the broader Pentecostal/Revival movement. We partner with like-minded churches and organizations for missions, training, and fellowship, while remaining autonomous in local leadership and ministry.');

insert into public.beliefs (title, content, sort_order) values
  ('The Bible', 'We believe the Bible is the inspired, inerrant Word of God and the final authority for faith and practice.', 0),
  ('God', 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.', 1),
  ('Jesus Christ', 'We believe in the deity of Christ, His virgin birth, sinless life, atoning death, bodily resurrection, and return.', 2),
  ('Salvation', 'We believe salvation is by grace through faith in Jesus Christ alone, not by works.', 3),
  ('The Holy Spirit', 'We believe the Holy Spirit indwells every believer and empowers us for life and service, with spiritual gifts for the church.', 4),
  ('The Church', 'We believe the Church is the body of Christ, called to worship, discipleship, fellowship, and mission.', 5);

insert into public.team_members (name, title, bio, image, sort_order) values
  ('Bishop Ndewere', 'Senior Pastor', 'Bishop Ndewere leads Katoto Revival Center with a burning passion for revival, discipleship, and seeing lives transformed by the power of the Holy Spirit.', 'asset:bishop-ndewere.jpg', 0),
  ('Elder Grace Wanjiru', 'Associate Pastor & Prayer Ministry', 'Elder Grace leads our prayer ministry and women''s fellowship. She is passionate about intercession and mentoring women in faith.', null, 1),
  ('Elder James Otieno', 'Elder & Men''s Ministry', 'Elder James oversees men''s fellowship and church administration. He has a burden for raising godly men and fathers.', null, 2),
  ('Sis. Mary Njeri', 'Children''s Ministry Director', 'Sis. Mary leads our children''s ministry with creativity and love, ensuring every child feels welcomed and taught the Word.', null, 3);

insert into public.events (title, date, time, location, description, image, rsvp_link, is_past) values
  ('Sunday Worship Service', '2025-02-23', '9:00 AM', 'Main Sanctuary', 'Join us for praise, worship, and the Word. All are welcome.', 'asset:miscellenious/556652987_1134227028759112_8645909850777201291_n.jpg', '/visit', false),
  ('Youth Night — Ignite', '2025-02-28', '6:00 PM', 'Youth Hall', 'An evening of worship, fellowship, and teaching for ages 13–25.', 'asset:youth-ministry/754715092_1374930421269614_2495762859748928217_n.jpeg', '/contact', false),
  ('Christmas Carol Night', '2024-12-21', '6:00 PM', 'Main Sanctuary', 'A celebration of worship and Christmas carols.', 'asset:praise-team/800797079_2653013788501839_935930877774437652_n.jpeg', null, true),
  ('Harvest Thanksgiving', '2024-11-30', '10:00 AM', 'Main Sanctuary', 'A joyful day of thanksgiving and fellowship.', 'asset:miscellenious/558085996_1134197485428733_8531590517096688607_n.jpg', null, true);

insert into public.giving_methods (kind, provider, label, value, sort_order) values
  ('bank', 'Bank Name', 'Katoto Revival Center', '0000000000', 0),
  ('mobile', 'TNM Mpamba', 'Phone number', '+265 000 000 000', 1),
  ('mobile', 'Airtel Money', 'Phone number', '+265 000 000 000', 2);

insert into public.contact_settings (id, address, email, phone, phone_display, whatsapp_url, facebook_url, youtube_url, map_embed_url, directions_url) values
  (true, 'Katoto, Mzuzu, Malawi', 'info@katotorevivalcenter.org', '+265998107748', '+265 998 107 748', 'https://wa.me/265998107748', 'https://www.facebook.com/katotorevivalcenter', 'https://www.youtube.com', 'https://maps.google.com/maps?q=G2V5%2B6FH+Mzuzu&output=embed&z=17', 'https://www.google.com/maps/dir/?api=1&destination=G2V5%2B6FH%20Mzuzu');
