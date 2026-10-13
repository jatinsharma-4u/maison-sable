import { products } from './products';

export const categories = [
  { slug: 'sofas', name: 'Sofas', short: 'Sofas', thumb: '/img/p/halden.webp', hero: '/img/r/living-taupe.webp',
    intro: 'Deep, generous sofas — sized and upholstered for your room.' },
  { slug: 'armchairs', name: 'Armchairs & Lounge', short: 'Armchairs', thumb: '/img/p/nube.webp', hero: '/img/r/living-boho.webp',
    intro: 'The favourite seat in the house, made for you.' },
  { slug: 'dining', name: 'Dining', short: 'Dining', thumb: '/img/p/tova.webp', hero: '/img/r/dining-shelves.webp',
    intro: 'Solid-wood tables and chairs for long, unhurried dinners.' },
  { slug: 'tables', name: 'Coffee & Side Tables', short: 'Tables', thumb: '/img/p/lark.webp', hero: '/img/r/hero-living.webp',
    intro: 'The small pieces that hold a room together.' },
  { slug: 'bedroom', name: 'Beds & Bedroom', short: 'Bedroom', thumb: '/img/p/haru.webp', hero: '/img/r/bed-soft.webp',
    intro: 'Calm, solid beds — made to any mattress size.' },
  { slug: 'storage', name: 'Storage & Wardrobes', short: 'Storage', thumb: '/img/p/teak-sideboard.webp', hero: '/img/r/wardrobe-oak.webp',
    intro: 'Storage planned around exactly what you own.' },
  { slug: 'office', name: 'Home Office', short: 'Office', thumb: '/img/p/arc-desk.webp', hero: '/img/r/office-slat.webp',
    intro: 'Desks and chairs that make work feel lighter.' },
  { slug: 'lighting', name: 'Lighting', short: 'Lighting', thumb: '/img/p/lumen.webp', hero: '/img/r/dining-window.webp',
    intro: 'Turned wood and spun metal, in warm light.' },
  { slug: 'outdoor', name: 'Outdoor', short: 'Outdoor', thumb: '/img/p/cane-arm.webp', hero: '/img/r/outdoor-terrace.webp',
    intro: 'Teak and rattan for terraces and gardens.' },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug);

// Room collections. Hotspots are percentages over the hero image.
export const collections = [
  {
    slug: 'living-room', name: 'The Living Room', kicker: 'Collection 01',
    hero: 'hero-living', gallery: ['living-cream', 'living-round', 'living-boho', 'living-olive'],
    summary: 'Low, generous seating, sculpted tables and soft natural textures.',
    story: [
      'A living room should slow you down. We start with the sofa — the piece you will use most — and build outward: a table you can put your feet on, a chair angled toward the light, a sideboard to hide the clutter.',
      'Our palette here is sand, ivory and warm oak, with one deeper note of walnut or cognac leather to anchor it.',
    ],
    hotspots: [{ x: 47, y: 74, slug: 'dune-coffee-table' }, { x: 30, y: 60, slug: 'halden-sofa' }],
    products: ['halden-sofa', 'lune-curved-sofa', 'nube-boucle-armchair', 'dune-coffee-table', 'sol-side-table', 'teak-sideboard', 'orbit-lounge-chair', 'lumen-table-lamp'],
  },
  {
    slug: 'bedroom', name: 'The Bedroom', kicker: 'Collection 02',
    hero: 'bed-soft', gallery: ['bed-rattan', 'bed-walnut', 'bed-bench', 'bed-oak'],
    summary: 'Quiet, layered and soft — beds, benches and storage made to rest.',
    story: [
      'In the bedroom we design for the hour before sleep: a headboard you can lean into, a bench for tomorrow’s clothes, a lamp with a warm, low glow.',
      'Every bed is made to your mattress size, and storage can be built into the platform.',
    ],
    hotspots: [{ x: 50, y: 62, slug: 'nara-bed' }],
    products: ['nara-bed', 'kai-platform-bed', 'odin-oak-bed', 'haru-bench', 'lark-side-table', 'lumen-table-lamp', 'arden-wardrobe', 'margot-tufted-chair'],
  },
  {
    slug: 'dining-room', name: 'The Dining Room', kicker: 'Collection 03',
    hero: 'dining-long', gallery: ['dining-shelves', 'dining-pendant', 'table-life', 'dining-wicker'],
    summary: 'Solid tables and comfortable chairs for long, unhurried dinners.',
    story: [
      'The dining table is where a home gathers. We size it to your family and the way you entertain — a round table for four that talks, or a long board for twelve.',
      'Chairs are mixed or matched; we often pair an upholstered head chair with lighter side chairs.',
    ],
    hotspots: [{ x: 50, y: 70, slug: 'sila-dining-table' }, { x: 50, y: 18, slug: 'dome-pendant' }],
    products: ['sila-dining-table', 'veda-dining-table', 'tova-dining-chair', 'ella-dining-chair', 'kumo-chair', 'rondo-chair', 'dome-pendant', 'teak-sideboard'],
  },
  {
    slug: 'home-office', name: 'The Home Office', kicker: 'Collection 04',
    hero: 'office-slat', gallery: ['office-standing', 'desk-walnut', 'office-green'],
    summary: 'Desks, chairs and storage that make work feel lighter.',
    story: [
      'A good desk disappears while you work. We plan cable routes, drawer depths and the height of the surface around the work you actually do.',
    ],
    hotspots: [{ x: 50, y: 66, slug: 'trestle-desk' }],
    products: ['arc-desk', 'trestle-desk', 'pivot-swivel-chair', 'tova-dining-chair', 'cone-pendant', 'noir-sideboard'],
  },
  {
    slug: 'japandi', name: 'Quiet Minimal', kicker: 'Collection 05',
    hero: 'living-low', gallery: ['japandi-shelves', 'living-grey', 'bed-walnut'],
    summary: 'Japanese restraint meets Scandinavian warmth — fewer, better pieces.',
    story: [
      'Low lines, honest joinery and pale timber. This collection is about space as much as furniture: each piece is given room to breathe.',
    ],
    hotspots: [{ x: 40, y: 60, slug: 'haru-bench' }],
    products: ['fjord-sofa', 'ribbon-lounge', 'haru-bench', 'kumo-chair', 'kai-platform-bed', 'sora-sofa'],
  },
  {
    slug: 'outdoor', name: 'Outdoor Living', kicker: 'Collection 06',
    hero: 'outdoor-terrace', gallery: ['outdoor-garden', 'outdoor-hills'],
    summary: 'Teak and rattan for terraces, verandas and gardens.',
    story: ['Built from grade-A teak and hand-woven rattan, finished to weather gracefully to a soft silver grey.'],
    hotspots: [{ x: 50, y: 70, slug: 'riviera-outdoor-set' }],
    products: ['riviera-outdoor-set', 'cane-armchair', 'cane-folding-chair'],
  },
];

export const getCollection = (slug) => collections.find((c) => c.slug === slug);

export const productsBySlugs = (slugs) => slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean);

// SAMPLE testimonials — replace with genuine client reviews before launch.
export const testimonials = [
  { quote: 'They came to measure our awkward alcove, and the sofa fits it to the centimetre. It looks like it was always there.', name: 'Ananya R.', place: 'Gurugram', piece: 'Halden Sofa, 286 cm' },
  { quote: 'The joinery on our dining table is beautiful. We were sent photos at every stage, from raw boards to final oil.', name: 'Karan & Meera S.', place: 'New Delhi', piece: 'Sila Long Table' },
  { quote: 'Our wardrobe was planned around how I actually dress. Fifteen months on, every drawer still closes like the first day.', name: 'Ritika M.', place: 'Noida', piece: 'Arden Wardrobe' },
  { quote: 'I sent a screenshot of a chair I loved; they turned it into something better and more comfortable.', name: 'Dev P.', place: 'Jaipur', piece: 'Custom lounge chair' },
];

export const journal = [
  {
    slug: 'choosing-wood', title: 'Oak, walnut or ash? Choosing the right wood', category: 'Materials', read: '5 min',
    image: 'mat-oak', date: '2026-09-02',
    excerpt: 'How each timber looks, ages and wears — and which rooms it suits best.',
    body: [
      ['p', 'Every piece we make starts with a board. The species you choose shapes not only the colour of your furniture, but how it feels to touch, how it ages and how it copes with daily life.'],
      ['h', 'White oak'],
      ['p', 'Our most requested timber. Oak is hard, stable and has a pronounced straight grain with occasional flecks. It ages to a warm honey tone and suits almost any interior — from Japandi to classic.'],
      ['h', 'American walnut'],
      ['p', 'Rich chocolate brown with purple and grey undertones that soften to a lighter, golden brown over years of sunlight. Walnut brings depth to pale rooms and is ideal for statement tables and sideboards.'],
      ['h', 'Ash'],
      ['p', 'Pale, flexible and strong — the wood we steam-bend for chairs like Rondo. Ash takes stains and ebonising beautifully, so it is a great base for darker finishes.'],
      ['h', 'Teak'],
      ['p', 'Naturally oily and weather-resistant, teak is our choice for outdoor pieces and mid-century designs. Indoors it glows; outdoors it silvers gracefully.'],
    ],
  },
  {
    slug: 'measuring-for-a-sofa', title: 'How to measure for a made-to-measure sofa', category: 'Guides', read: '4 min',
    image: 'living-cream', date: '2026-08-12',
    excerpt: 'Wall length, walkways, doorways and lifts — the five measurements that matter.',
    body: [
      ['p', 'A custom sofa should fit your room and your life. Before you request a quote, take these measurements — or book our free in-home measurement and we will do it for you.'],
      ['h', '1. The wall'],
      ['p', 'Measure the full wall, then subtract at least 30 cm on each side for side tables or breathing room.'],
      ['h', '2. Walkways'],
      ['p', 'Leave 75–90 cm between the sofa and a coffee table edge for comfortable movement, and 45 cm between sofa and coffee table.'],
      ['h', '3. Doorways, stairs and lifts'],
      ['p', 'Note the narrowest width and height on the delivery route. We can build sofas in sections when the route is tight.'],
      ['h', '4. Seat depth and height'],
      ['p', 'Sit on a sofa you love and measure it. Taller people often prefer 62–68 cm seat depth; for an upright sit, 54–58 cm.'],
    ],
  },
  {
    slug: 'inside-the-workshop', title: 'Inside the workshop: twelve weeks of a dining table', category: 'Craft', read: '6 min',
    image: 'craft-marking', date: '2026-07-21',
    excerpt: 'From raw boards to the final coat of oil, follow a table through our workshop.',
    body: [
      ['p', 'Our tables start as rough-sawn boards that rest in the workshop for two weeks to acclimatise. Only then are they planed, matched and glued.'],
      ['h', 'Board selection'],
      ['p', 'We lay out every board and choose the grain sequence by eye, so the top reads as one calm surface.'],
      ['h', 'Joinery'],
      ['p', 'Legs are joined with mortise and tenon, and breadboard ends are pinned so the top can move with the seasons without cracking.'],
      ['h', 'Finishing'],
      ['p', 'Three coats of hard wax oil, sanded between each. You will receive photographs at every stage before delivery.'],
    ],
  },
];

export const faqs = [
  { group: 'Ordering', items: [
    ['How does ordering custom furniture work?', 'Choose a design (or send us your own reference), share your measurements and material preferences through our custom order form, and we will reply within 48 hours with a detailed quote, drawings and a production timeline. Production starts once you approve the design and pay the deposit.'],
    ['Are the prices on the website final?', 'No. Prices shown are indicative starting prices for our standard size in our standard materials. Your final price depends on size, materials and details, and is confirmed in your written quote.'],
    ['Can you make a piece from a photo I found?', 'Yes. Upload reference images in the order form. We will adapt the design for comfort, strength and your space, and send drawings before anything is made.'],
    ['Do you offer in-home measurement?', 'Yes — free within the NCR region, and available elsewhere on request.'],
  ]},
  { group: 'Production & delivery', items: [
    ['How long does it take?', 'Most pieces take 4–10 weeks depending on complexity; each product page shows its typical lead time. Fitted wardrobes and walk-ins can take 10–12 weeks.'],
    ['Do you deliver and install?', 'Our own team delivers, assembles and installs every piece, and takes the packaging away.'],
    ['Can I see my piece before delivery?', 'You will receive progress photos at key stages, and you are welcome to visit the workshop by appointment.'],
  ]},
  { group: 'Materials & care', items: [
    ['Can I get material samples?', 'Yes. We can send up to six wood and fabric samples to your home, or you can see the full library in our studio.'],
    ['How do I care for an oiled finish?', 'Wipe with a damp cloth, avoid harsh cleaners, and refresh with the maintenance oil we supply once or twice a year.'],
  ]},
  { group: 'Payments & returns', items: [
    ['What are the payment terms?', 'Typically a 50% deposit to begin production and the balance before delivery. Your quote will confirm the exact terms.'],
    ['Can I return custom furniture?', 'Because each piece is made to your specification, made-to-order items cannot usually be returned for change of mind. Any manufacturing defect is covered by our warranty — see Delivery & Returns.'],
  ]},
];
