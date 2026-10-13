import { useEffect } from 'react';
import { site } from '../data/site';

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export function useSeo(title, description, image) {
  useEffect(() => {
    const full = title ? `${title} — ${site.name}` : `${site.name} — Custom Furniture, Made to Measure`;
    document.title = full;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:type', 'website');
    if (image) setMeta('property', 'og:image', image);
  }, [title, description, image]);
}
