# Katoto Revival Center — Church Website

A modern, mobile-first React Single Page Application (SPA) for **Katoto Revival Center**, with client-side routing, Tailwind CSS, and optional i18n (English/French).

## Tech stack

- **React** (functional components, hooks)
- **React Router DOM** — client-side routing
- **Tailwind CSS** — styling (maroon/gold design system)
- **Framer Motion** — scroll and route animations
- **EmailJS** — contact and prayer request forms (configure with your keys)
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

## EmailJS setup

Contact and Prayer forms use EmailJS. To enable:

1. Create an account at [emailjs.com](https://www.emailjs.com/).
2. Add an email service and two templates (contact + prayer request).
3. In `src/pages/Contact.jsx`, set:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`
4. In `src/pages/Prayer.jsx`, set the same service/key and `EMAILJS_TEMPLATE_PRAYER`.

Until then, the forms will show a fallback message on submit.

## Admin dashboard (Supabase)

Sermons, ministries and service times are managed at `/admin` and stored in [Supabase](https://supabase.com). Until Supabase is configured the site shows the built-in content in `src/data/` and `/admin` shows a setup notice.

1. Create a Supabase project, open **SQL Editor**, and run `supabase/schema.sql`. This creates the tables, the access rules, and the starting ministries and service times.
2. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key (**Project Settings → API Keys**). Add the same two variables in Netlify under **Site configuration → Environment variables**, then redeploy.
3. Add each admin under **Authentication → Users → Add user** (tick *Auto Confirm User*), then give them access in the SQL Editor:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'person@example.com';
   ```
4. Turn off public sign-ups under **Authentication → Sign In / Providers** (*Allow new users to sign up*).

A sermon shows as **live** on the home page on its date (Malawi time) and moves to **past sermons** the next day. Images are either one of the photos in `src/assets/` (stored as `asset:<path>`) or any image link.

## Content and data

- Placeholder content lives in `src/data/` (sermons, events, ministries, team, testimonials, gallery, prayer requests). Sermons, ministries and service times come from Supabase once it is set up (see above); the files are the fallback.
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
