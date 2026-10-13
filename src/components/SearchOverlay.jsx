import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { ease } from './ui';
import { popularSearches, searchCategories, searchProducts } from '../lib/search';
import { categories } from '../data/catalog';
import { formatPrice } from '../data/site';

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);
  const cats = useMemo(() => searchCategories(q).slice(0, 3), [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(-1);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (active >= 0 && results[active]) navigate(`/product/${results[active].slug}`);
    else if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="search" role="dialog" aria-modal="true" aria-label="Search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="search__scrim" onClick={onClose} />
          <motion.div className="search__panel" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.45, ease }} data-lenis-prevent>
            <div className="container">
              <form className="search__form" onSubmit={submit} role="search">
                <Icon name="search" size={22} />
                <label htmlFor="site-search" className="sr-only">Search designs</label>
                <input
                  id="site-search"
                  ref={inputRef}
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setActive(-1); }}
                  onKeyDown={onKeyDown}
                  placeholder="Search sofas, oak, bouclé, beds…"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results"
                  aria-activedescendant={active >= 0 ? `sr-${active}` : undefined}
                />
                {q && <button type="button" className="search__clear" onClick={() => setQ('')} aria-label="Clear search"><Icon name="close" size={16} /></button>}
                <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><Icon name="close" /></button>
              </form>

              {!q.trim() ? (
                <div className="search__idle">
                  <div>
                    <p className="eyebrow eyebrow--plain">Popular searches</p>
                    <div className="chips-row">
                      {popularSearches.map((s) => <button key={s} className="chip chip--sm" onClick={() => setQ(s)}>{s}</button>)}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow eyebrow--plain">Browse categories</p>
                    <div className="search__cats">
                      {categories.slice(0, 6).map((c) => (
                        <Link key={c.slug} to={`/shop/${c.slug}`} className="search__cat"><img src={c.thumb} alt="" loading="lazy" />{c.short}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="search__results" id="search-results" role="listbox" aria-label="Suggestions">
                  {cats.length > 0 && (
                    <div className="chips-row" style={{ marginBottom: 16 }}>
                      {cats.map((c) => <Link key={c.slug} to={`/shop/${c.slug}`} className="chip chip--sm">In {c.name} <Icon name="arrow" size={13} /></Link>)}
                    </div>
                  )}
                  {results.length ? (
                    <ul className="search__list">
                      {results.map((p, i) => (
                        <li key={p.slug} id={`sr-${i}`} role="option" aria-selected={i === active}>
                          <Link to={`/product/${p.slug}`} className={`search__item ${i === active ? 'is-active' : ''}`} onMouseEnter={() => setActive(i)}>
                            <span className={`search__thumb ${p.cutout ? 'is-cutout' : ''}`}><img src={p.image.src} alt="" loading="lazy" /></span>
                            <span className="search__meta"><strong>{p.name}</strong><span className="tiny muted">{categories.find((c) => c.slug === p.category)?.name} · from {formatPrice(p.priceFrom)}</span></span>
                            <Icon name="arrowUpRight" size={18} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted search__none">No designs match “{q}”. We can still make it — <Link to="/custom-order" className="link-arrow">describe your piece <Icon name="arrow" size={13} /></Link></p>
                  )}
                  {results.length > 0 && (
                    <button className="link-arrow search__all" onClick={submit}>See all results for “{q}” <Icon name="arrow" size={14} /></button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
