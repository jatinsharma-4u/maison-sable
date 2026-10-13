import { products, MATERIAL_LABELS } from '../data/products';
import { categories } from '../data/catalog';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const index = products.map((p) => {
  const cat = categories.find((c) => c.slug === p.category);
  return {
    p,
    name: norm(p.name),
    hay: norm([p.name, cat?.name, p.style, p.type, p.blurb, ...(p.materials || []).map((m) => MATERIAL_LABELS[m] || m), ...(p.rooms || [])].join(' ')),
  };
});

const synonyms = { couch: 'sofa', settee: 'sofa', cupboard: 'wardrobe', almirah: 'wardrobe', closet: 'wardrobe', table: 'table', light: 'lamp', lights: 'lamp', pendant: 'pendant', seat: 'chair', boucle: 'boucle' };

export function searchProducts(query) {
  const q = norm(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).map((t) => synonyms[t] || t);
  return index
    .map(({ p, name, hay }) => {
      let score = 0;
      for (const t of terms) {
        if (name.startsWith(t)) score += 6;
        else if (name.includes(t)) score += 4;
        else if (hay.includes(t)) score += 2;
        else if (t.length > 3 && hay.includes(t.slice(0, -1))) score += 1; // plural tolerance
        else return null; // every term must match something
      }
      return { p, score: score + (30 - p.popular) / 100 };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

export function searchCategories(query) {
  const q = norm(query.trim());
  if (!q) return [];
  return categories.filter((c) => norm(c.name).includes(q) || norm(c.slug).includes(q));
}

export const popularSearches = ['Sofa', 'Dining table', 'Walnut', 'Bouclé', 'Bed', 'Wardrobe', 'Lamp', 'Oak'];
