import { STYLES } from '../data/products';
import { searchProducts } from './search';

export const TONES = [
  { id: 'ivory', name: 'Ivory & cream', hex: '#EEE6D8' },
  { id: 'natural', name: 'Natural wood', hex: '#C9A77C' },
  { id: 'brown', name: 'Cognac & teak', hex: '#8B5A35' },
  { id: 'dark', name: 'Walnut & charcoal', hex: '#4B3A2E' },
  { id: 'black', name: 'Black', hex: '#24211F' },
  { id: 'green', name: 'Sage & moss', hex: '#7D7D5C' },
];

const toneOf = {
  oak: 'natural', ash: 'ivory', teak: 'brown', walnut: 'dark', ebonised: 'black',
  linen: 'ivory', boucle: 'ivory', cotton: 'natural', velvet: 'green', wool: 'dark', leather: 'brown',
  brass: 'natural', black: 'black', bronze: 'brown',
};

export const productTones = (p) => {
  const ids = [...(p.woods || []), ...(p.fabrics || []), ...(p.metals || [])];
  const set = new Set(ids.map((i) => toneOf[i]).filter(Boolean));
  if (!set.size) set.add('ivory');
  return set;
};

export const MATERIAL_FILTERS = [
  ['oak', 'Oak'], ['walnut', 'Walnut'], ['ash', 'Ash'], ['teak', 'Teak'],
  ['fabric', 'Upholstered'], ['leather', 'Leather'], ['rattan', 'Rattan & cane'], ['steel', 'Metal'], ['stone', 'Stone'],
];

export const productMaterials = (p) => {
  const m = new Set([...(p.materials || []), ...(p.woods || [])]);
  if ((p.fabrics || []).some((f) => f !== 'leather')) m.add('fabric');
  if ((p.fabrics || []).includes('leather')) m.add('leather');
  if (m.has('cane')) m.add('rattan');
  if ((p.metals || []).length) m.add('steel');
  return m;
};

export const LEAD_FILTERS = [
  ['fast', 'Up to 6 weeks', (p) => p.leadWeeks[1] <= 6],
  ['mid', '6 – 9 weeks', (p) => p.leadWeeks[1] > 6 && p.leadWeeks[1] <= 9],
  ['long', 'Over 9 weeks', (p) => p.leadWeeks[1] > 9],
];

export const SORTS = [
  ['featured', 'Featured'],
  ['popular', 'Most popular'],
  ['newest', 'Newest'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['name', 'Name A–Z'],
];

export { STYLES };

const list = (sp, key) => (sp.get(key) ? sp.get(key).split(',').filter(Boolean) : []);

export function readFilters(sp) {
  return {
    cat: list(sp, 'cat'),
    mat: list(sp, 'mat'),
    tone: list(sp, 'tone'),
    style: list(sp, 'style'),
    lead: list(sp, 'lead'),
    min: sp.get('min') ? Number(sp.get('min')) : null,
    max: sp.get('max') ? Number(sp.get('max')) : null,
    isNew: sp.get('new') === '1',
    sort: sp.get('sort') || 'featured',
    q: sp.get('q') || '',
  };
}

export function applyFilters(items, f) {
  const matches = f.q.trim() ? new Set(searchProducts(f.q).map((p) => p.slug)) : null;
  const out = items.filter((p) => {
    if (matches && !matches.has(p.slug)) return false;
    if (f.cat.length && !f.cat.includes(p.category)) return false;
    if (f.mat.length) {
      const m = productMaterials(p);
      if (!f.mat.some((x) => m.has(x))) return false;
    }
    if (f.tone.length) {
      const t = productTones(p);
      if (!f.tone.some((x) => t.has(x))) return false;
    }
    if (f.style.length && !f.style.includes(p.style)) return false;
    if (f.lead.length && !f.lead.some((id) => LEAD_FILTERS.find((l) => l[0] === id)?.[2](p))) return false;
    if (f.min != null && p.priceFrom < f.min) return false;
    if (f.max != null && p.priceFrom > f.max) return false;
    if (f.isNew && !p.isNew) return false;
    return true;
  });
  const by = {
    featured: (a, b) => (b.signature ? 1 : 0) - (a.signature ? 1 : 0) || a.popular - b.popular,
    popular: (a, b) => a.popular - b.popular,
    newest: (a, b) => b.added.localeCompare(a.added),
    'price-asc': (a, b) => a.priceFrom - b.priceFrom,
    'price-desc': (a, b) => b.priceFrom - a.priceFrom,
    name: (a, b) => a.name.localeCompare(b.name),
  }[f.sort] || (() => 0);
  return [...out].sort(by);
}
