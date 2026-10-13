import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import ProductCard, { QuickView } from './ProductCard';
import { ease, EmptyState, ArrowButton } from './ui';
import { categories } from '../data/catalog';
import { formatPrice } from '../data/site';
import { applyFilters, LEAD_FILTERS, MATERIAL_FILTERS, readFilters, SORTS, STYLES, TONES, productMaterials, productTones } from '../lib/filters';
import { lockScroll } from '../lib/motion';

const PAGE = 12;
const STEP = 5000;

function Group({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fgroup">
      <button type="button" className="fgroup__title" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {title} <Icon name="chevronDown" size={16} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} style={{ overflow: 'hidden' }}>
            <div className="fgroup__body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriceRange({ bounds, min, max, onChange }) {
  const [lo, setLo] = useState(min ?? bounds[0]);
  const [hi, setHi] = useState(max ?? bounds[1]);
  useEffect(() => { setLo(min ?? bounds[0]); setHi(max ?? bounds[1]); }, [min, max, bounds]);
  const pct = (v) => ((v - bounds[0]) / (bounds[1] - bounds[0] || 1)) * 100;
  const commit = () => onChange(lo <= bounds[0] ? null : lo, hi >= bounds[1] ? null : hi);
  return (
    <div className="range">
      <div className="range__vals"><span>{formatPrice(lo)}</span><span>{formatPrice(hi)}{hi >= bounds[1] ? '+' : ''}</span></div>
      <div className="range__track">
        <span className="range__fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" min={bounds[0]} max={bounds[1]} step={STEP} value={lo} aria-label="Minimum price"
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - STEP))} onPointerUp={commit} onKeyUp={commit} onTouchEnd={commit} />
        <input type="range" min={bounds[0]} max={bounds[1]} step={STEP} value={hi} aria-label="Maximum price"
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + STEP))} onPointerUp={commit} onKeyUp={commit} onTouchEnd={commit} />
      </div>
    </div>
  );
}

/**
 * Filterable, sortable product listing. Filter state lives in the URL so it survives reloads,
 * back/forward and sharing.
 */
export default function ProductBrowser({ items, showCategories = true, emptyCta }) {
  const [sp, setSp] = useSearchParams();
  const f = useMemo(() => readFilters(sp), [sp]);
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const [qv, setQv] = useState(null);

  const bounds = useMemo(() => {
    const prices = items.map((p) => p.priceFrom);
    return [Math.floor(Math.min(...prices) / STEP) * STEP, Math.ceil(Math.max(...prices) / STEP) * STEP];
  }, [items]);

  const results = useMemo(() => applyFilters(items, f), [items, f]);
  const [term, setTerm] = useState(f.q);
  useEffect(() => {
    const t = setTimeout(() => { if (term !== f.q) update({ q: term.trim() || null }); }, 250);
    return () => clearTimeout(t);
  }, [term]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setShown(PAGE), [sp]);
  useEffect(() => {
    lockScroll(sheet);
    return () => lockScroll(false);
  }, [sheet]);

  const update = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => {
      if (v == null || v === '' || (Array.isArray(v) && !v.length) || v === false) next.delete(k);
      else next.set(k, Array.isArray(v) ? v.join(',') : v === true ? '1' : String(v));
    });
    setSp(next, { replace: true, preventScrollReset: true });
  };
  const toggle = (key, val) => update({ [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val] });
  const reset = () => {
    setTerm('');
    const next = new URLSearchParams();
    if (f.sort !== 'featured') next.set('sort', f.sort);
    setSp(next, { replace: true });
  };

  const count = (pred) => items.filter(pred).length;

  const chips = [
    ...f.cat.map((v) => ({ k: 'cat', v, label: categories.find((c) => c.slug === v)?.short })),
    ...f.mat.map((v) => ({ k: 'mat', v, label: MATERIAL_FILTERS.find((m) => m[0] === v)?.[1] })),
    ...f.tone.map((v) => ({ k: 'tone', v, label: TONES.find((t) => t.id === v)?.name })),
    ...f.style.map((v) => ({ k: 'style', v, label: v })),
    ...f.lead.map((v) => ({ k: 'lead', v, label: LEAD_FILTERS.find((l) => l[0] === v)?.[1] })),
  ];
  if (f.min != null || f.max != null) chips.push({ k: 'price', label: `${formatPrice(f.min ?? bounds[0])} – ${formatPrice(f.max ?? bounds[1])}` });
  if (f.isNew) chips.push({ k: 'new', label: 'New arrivals' });
  if (f.q) chips.push({ k: 'q', label: `“${f.q}”` });

  const removeChip = (c) => {
    if (c.k === 'price') update({ min: null, max: null });
    else if (c.k === 'new') update({ new: null });
    else if (c.k === 'q') { setTerm(''); update({ q: null }); }
    else toggle(c.k, c.v);
  };

  const filterBody = (
    <>
      {showCategories && (
        <Group title="Category">
          {categories.map((c) => {
            const n = count((p) => p.category === c.slug);
            if (!n) return null;
            return (
              <label key={c.slug} className="check">
                <input type="checkbox" checked={f.cat.includes(c.slug)} onChange={() => toggle('cat', c.slug)} /> {c.name} <small>{n}</small>
              </label>
            );
          })}
        </Group>
      )}
      <Group title="Indicative price">
        <PriceRange bounds={bounds} min={f.min} max={f.max} onChange={(min, max) => update({ min, max })} />
      </Group>
      <Group title="Material">
        {MATERIAL_FILTERS.map(([id, label]) => {
          const n = count((p) => productMaterials(p).has(id));
          if (!n) return null;
          return (
            <label key={id} className="check">
              <input type="checkbox" checked={f.mat.includes(id)} onChange={() => toggle('mat', id)} /> {label} <small>{n}</small>
            </label>
          );
        })}
      </Group>
      <Group title="Colour & tone">
        <div className="swatch-row">
          {TONES.map((t) => {
            const n = count((p) => productTones(p).has(t.id));
            if (!n) return null;
            return (
              <button key={t.id} type="button" className="swatch-btn" style={{ background: t.hex }} aria-pressed={f.tone.includes(t.id)} aria-label={`${t.name} (${n})`} title={t.name} onClick={() => toggle('tone', t.id)} />
            );
          })}
        </div>
      </Group>
      <Group title="Style">
        {STYLES.map((s) => {
          const n = count((p) => p.style === s);
          if (!n) return null;
          return (
            <label key={s} className="check">
              <input type="checkbox" checked={f.style.includes(s)} onChange={() => toggle('style', s)} /> {s} <small>{n}</small>
            </label>
          );
        })}
      </Group>
      <Group title="Production time">
        {LEAD_FILTERS.map(([id, label, pred]) => (
          <label key={id} className="check">
            <input type="checkbox" checked={f.lead.includes(id)} onChange={() => toggle('lead', id)} /> {label} <small>{count(pred)}</small>
          </label>
        ))}
        <label className="switch" style={{ marginTop: 8 }}>
          <span>New arrivals only</span>
          <input type="checkbox" checked={f.isNew} onChange={(e) => update({ new: e.target.checked })} />
        </label>
      </Group>
    </>
  );

  const visible = results.slice(0, shown);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar__left">
          <button className="chip filter-toggle" onClick={() => setSheet(true)} aria-haspopup="dialog">
            <Icon name="filter" size={16} /> Filters{chips.length > 0 && <span className="filter-toggle__count">{chips.length}</span>}
          </button>
          <span className="toolbar__count" aria-live="polite">{results.length} {results.length === 1 ? 'design' : 'designs'}</span>
        </div>
        <label className="toolbar__search">
          <Icon name="search" size={17} />
          <span className="sr-only">Search within these designs</span>
          <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search designs, materials…" autoComplete="off" />
          {term && <button type="button" onClick={() => setTerm('')} aria-label="Clear search"><Icon name="close" size={14} /></button>}
        </label>
        <div className="toolbar__right">
          <label className="select-wrap">
            <span className="sr-only">Sort by</span>
            <select value={f.sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <Icon name="chevronDown" size={14} />
          </label>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="filters" aria-label="Filters" data-lenis-prevent>{filterBody}</aside>

        {createPortal(
        <AnimatePresence>
          {sheet && (
            <>
              <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
              <motion.aside
                className="filters is-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.5, ease }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, info) => info.offset.y > 120 && setSheet(false)}
                data-lenis-prevent
              >
                <div className="sheet-handle" aria-hidden />
                <div className="filters__head">
                  <div><strong>Filters</strong><span>{results.length} {results.length === 1 ? 'design' : 'designs'}</span></div>
                  <button className="icon-btn" onClick={() => setSheet(false)} aria-label="Close filters" autoFocus><Icon name="close" /></button>
                </div>
                <div className="filters__body" onPointerDownCapture={(e) => e.stopPropagation()}>{filterBody}</div>
                <div className="filters__foot">
                  <button className="btn btn--ghost" onClick={reset}>Clear</button>
                  <button className="btn" onClick={() => setSheet(false)}>Show {results.length} {results.length === 1 ? 'design' : 'designs'}</button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
          document.body
        )}

        <div>
          {chips.length > 0 && (
            <div className="active-chips" aria-label="Active filters">
              {chips.map((c) => (
                <button key={`${c.k}-${c.v || ''}`} className="chip chip--sm" onClick={() => removeChip(c)} aria-label={`Remove filter ${c.label}`}>
                  {c.label} <Icon name="close" size={12} />
                </button>
              ))}
              <button className="clear-btn" onClick={reset}>Clear all</button>
            </div>
          )}

          {results.length === 0 ? (
            <EmptyState icon="filter" title="No designs match those filters" text="Try removing a filter — or tell us exactly what you need and we’ll design it for you.">
              <button className="btn btn--ghost" onClick={reset}>Clear filters</button>
              {emptyCta || <ArrowButton to="/custom-order">Request a custom piece</ArrowButton>}
            </EmptyState>
          ) : (
            <>
              <motion.div className="pgrid pgrid--3" layout>
                <AnimatePresence mode="popLayout" initial={false}>
                  {visible.map((p, i) => (
                    <motion.div
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: Math.min(i % PAGE, 8) * 0.04 } }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                    >
                      <ProductCard p={p} onQuickView={setQv} sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 360px" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              <div className="loadmore">
                <p className="small muted">Showing {visible.length} of {results.length}</p>
                <div className="loadmore__bar" aria-hidden><span style={{ width: `${(visible.length / results.length) * 100}%` }} /></div>
                {visible.length < results.length && (
                  <button className="btn btn--ghost" onClick={() => setShown((n) => n + PAGE)}>Load more designs</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <QuickView p={qv} onClose={() => setQv(null)} />
    </>
  );
}
