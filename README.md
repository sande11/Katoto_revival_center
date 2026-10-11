# Katoto Revival Center — Church Website

A modern, mobile-first React Single Page Application (SPA) for **Katoto Revival Center**, with client-side routing, Tailwind CSS, and optional i18n (English/French).

## Tech stack

- **React** (functional components, hooks)
- **React Router DOM** — client-side routing
- **Tailwind CSS** — styling (maroon/gold design system)
- **Framer Motion** — scroll and route animations
- **Supabase** — managed site content, private contact messages, and prayer requests
- **react-helmet-async** — per-page titles (SEO)
- **react-i18next** — language toggle (EN/FR)

## Quick start

```bash
npm install --legacy-peer-deps   # if needed for React 19 peer deps
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Admin dashboard (Supabase)

The pages at `/admin` manage sermons, ministries, service times, About, Events, Give, Contact, and Prayer. They are stored in [Supabase](https://supabase.com). Until Supabase is configured the site shows the built-in content in `src/data/` and `/admin` shows a setup notice.

1. Create a Supabase project, then apply the SQL files in `supabase/migrations/` in timestamp order (or use `supabase db push`). This creates the tables, access rules, starting content, and secure submission functions.
2. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key (**Project Settings → API Keys**). Add the same two variables in Netlify under **Site configuration → Environment variables**, then redeploy.
3. Add each admin under **Authentication → Users → Add user** (tick *Auto Confirm User*), then give them access in the SQL Editor:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'person@example.com';
   ```
4. Turn off public sign-ups under **Authentication → Sign In / Providers** (*Allow new users to sign up*).

Contact messages and prayer requests are submitted through database functions with server-side validation and a honeypot check. They cannot be read by the public API. A prayer request only appears on the public prayer wall after an admin explicitly publishes it.

A sermon shows as **live** on the home page on its date (Malawi time) and moves to **past sermons** the next day. Images are either one of the photos in `src/assets/` (stored as `asset:<path>`) or any image link.

## Content and data

- Placeholder content lives in `src/data/` (sermons, events, ministries, team, testimonials, gallery, prayer requests). Admin-managed content comes from Supabase once it is set up; the files are the fallback.
- Images use Unsplash URLs (church/worship themed). Swap for your own assets in `src/assets/` or update URLs in the data files.
- Google Maps embed uses a placeholder; replace the `src` in Contact and Visit pages with your church’s embed URL.

## Project structure

```
src/
├── components/   # Navbar, Footer, SectionHeader, Cards, Modal, CTABanner, ScrollToTop, BackToTop
├── pages/        # Home, About, Sermons, Events, Ministries, Give, Contact, Visit, Prayer, Gallery
├── data/         # Dummy data for sermons, events, ministries, team, testimonials, beliefs, gallery, prayer
├── utils/        # i18n config
├── assets/
├── hooks/
├── App.jsx
├── main.jsx
└── index.css
```

## Giving / payments

The Give page includes a placeholder form. To accept real donations, integrate a payment provider (e.g. Flutterwave) in the form submit handler in `src/pages/Give.jsx`.
