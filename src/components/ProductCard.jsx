import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { ease, Img } from './ui';
import { useStore } from '../context/store';
import { formatPrice } from '../data/site';
import { leadText, WOODS, FABRICS } from '../data/products';
import { getCategory } from '../data/catalog';
import { lockScroll } from '../lib/motion';

function Swatches({ p, max = 4 }) {
  const list = [...(p.woods || []).map((id) => WOODS.find((w) => w.id === id)), ...(p.fabrics || []).map((id) => FABRICS.find((f) => f.id === id))].filter(Boolean);
  if (!list.length) return null;
  return (
    <span className="pcard__swatches" aria-label={`${list.length} material options`}>
      {list.slice(0, max).map((s) => <span key={s.id} style={{ background: s.hex }} title={s.name} />)}
      {list.length > max && <small>+{list.length - max}</small>}
    </span>
  );
}

export function WishButton({ p, className = '' }) {
  const { isWished, toggleWish } = useStore();
  const on = isWished(p.slug);
  return (
    <button
      type="button"
      className={`wish ${on ? 'is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${p.name} from saved` : `Save ${p.name}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(p.slug, p.name); }}
    >
      <motion.span key={on ? 'on' : 'off'} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
        <Icon name="heart" size={18} />
      </motion.span>
    </button>
  );
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

export default function ProductCard({ p, onQuickView, sizes = '(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw' }) {
  const cat = getCategory(p.category);
  const [ref, inView] = useInView();
  return (
    <article className={`pcard ${inView ? 'is-in' : ''}`} ref={ref}>
      <Link to={`/product/${p.slug}`} className="pcard__link" aria-label={`${p.name}, from ${formatPrice(p.priceFrom)}`}>
        <div className={`pcard__media ${p.cutout ? 'is-cutout' : 'is-photo'}`}>
          {p.cutout ? (
            <img className="pcard__img" src={p.image.src} alt={p.image.alt} loading="lazy" decoding="async" />
          ) : (
            <Img className="pcard__img" src={p.image.src} sm={p.image.sm} alt={p.image.alt} sizes={sizes} />
          )}
          {p.hover && (
            <span className="pcard__hover" aria-hidden>
              <Img src={p.hover.src} sm={p.hover.sm} alt="" sizes={sizes} />
            </span>
          )}
          <span className="pcard__tags">
            {p.isNew && <span className="tag tag--dark">New</span>}
            {p.signature && <span className="tag">Signature</span>}
          </span>
        </div>
        <div className="pcard__body">
          <div className="pcard__row">
            <h3 className="pcard__name">{p.name}</h3>
            <span className="pcard__price"><small>from</small> {formatPrice(p.priceFrom)}</span>
          </div>
          <div className="pcard__row pcard__row--meta">
            <span className="tiny muted">{cat?.short} · Made in {leadText(p)}</span>
            <Swatches p={p} />
          </div>
        </div>
      </Link>
      <WishButton p={p} className="pcard__wish" />
      {onQuickView && (
        <button type="button" className="pcard__quick" onClick={() => onQuickView(p)} aria-label={`Quick view ${p.name}`}>
          <Icon name="eye" size={16} /> <span>Quick view</span>
        </button>
      )}
    </article>
  );
}

export function QuickView({ p, onClose }) {
  const [idx, setIdx] = useState(0);
  const { addToQuote } = useStore();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    setIdx(0);
    if (!p) return undefined;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey); };
  }, [p]);

  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="qv-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="modal__scrim" onClick={onClose} />
          <motion.div className="modal__panel qv" initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.5, ease }} data-lenis-prevent>
            <button className="icon-btn icon-btn--solid modal__close" onClick={onClose} aria-label="Close quick view" autoFocus><Icon name="close" /></button>
            <div className={`qv__media ${p.images[idx].cutout ? 'is-cutout' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.img key={idx} src={p.images[idx].src} alt={p.images[idx].alt} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }} />
              </AnimatePresence>
              {p.images.length > 1 && (
                <div className="qv__dots" role="tablist" aria-label="Images">
                  {p.images.map((im, i) => (
                    <button key={im.src} role="tab" aria-selected={i === idx} aria-label={`Image ${i + 1}`} onClick={() => setIdx(i)} className={i === idx ? 'is-active' : ''} />
                  ))}
                </div>
              )}
            </div>
            <div className="qv__info">
              <span className="eyebrow">{getCategory(p.category)?.name}</span>
              <h2 id="qv-title" className="h3">{p.name}</h2>
              <p className="muted">{p.blurb}</p>
              <dl className="qv__facts">
                <div><dt>Indicative price</dt><dd>from {formatPrice(p.priceFrom)}</dd></div>
                <div><dt>Standard size</dt><dd>{p.dims.w} × {p.dims.d} × {p.dims.h} cm</dd></div>
                <div><dt>Made in</dt><dd>{leadText(p)}</dd></div>
              </dl>
              <div className="qv__actions">
                <Link to={`/custom-order?product=${p.slug}`} className="btn btn--block">Customize this piece</Link>
                <button className="btn btn--ghost btn--block" onClick={() => { addToQuote(p.slug, {}, 1, p.name); onClose(); }}>Add to quote list</button>
              </div>
              <Link to={`/product/${p.slug}`} className="link-arrow">View full details <Icon name="arrow" size={14} /></Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ,
    document.body
  );
}
