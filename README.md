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

## Content and data

- Placeholder content lives in `src/data/` (sermons, events, ministries, team, testimonials, gallery, prayer requests). Replace with real data or connect to a CMS/API.
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
