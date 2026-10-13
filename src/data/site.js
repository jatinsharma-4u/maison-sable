// Brand + business configuration.
// Everything marked SAMPLE is placeholder content — replace with verified details before launch.
export const site = {
  name: 'Maison Sable',
  tagline: 'Custom furniture, made to measure',
  currency: 'INR',
  locale: 'en-IN',
  // SAMPLE contact details
  email: 'studio@maisonsable.in',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  address: ['Workshop & Studio', '14 Kiln Lane, Sector 7', 'Gurugram, Haryana 122001'],
  hours: 'Mon – Sat · 10:00 – 19:00',
  social: { instagram: '#', pinterest: '#', linkedin: '#' },
  announcements: [
    'Every piece is built to order in our own workshop',
    'Free design consultation & on-site measurement in NCR',
    'Indicative prices shown — your final quote follows within 48 hours',
  ],
};

export const formatPrice = (n) =>
  new Intl.NumberFormat(site.locale, { style: 'currency', currency: site.currency, maximumFractionDigits: 0 }).format(n);
