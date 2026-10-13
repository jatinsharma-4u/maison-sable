# Maison Sable — custom furniture website

React 18 + Vite. Motion: GSAP/ScrollTrigger (scroll-linked), Framer Motion (UI state, page transitions, sliders), Lenis (smooth wheel scrolling), Lottie (order success).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Before launch
- **Form submissions**: copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` (Formspree, Getform, or your own API). Until then, the custom-order and contact forms never claim success. Instead they offer one-tap sending by email or WhatsApp.
- **Business details** (sample): `src/data/site.js` holds contact, address and currency. Products, prices and lead times are in `src/data/products.js`; testimonials and FAQs are in `src/data/catalog.js`. All of these are placeholders.
- **Legal copy** in `src/pages/Legal.jsx` is sample text and needs legal review.
- **SPA hosting**: `public/_redirects` (Netlify) and `vercel.json` (Vercel) route every URL to `index.html`.

## Images
All photos come from Unsplash (Unsplash License). The transparent product cut-outs in `public/img/p/` were made by removing the backgrounds from those photos. Sources are listed at `/credits`.
