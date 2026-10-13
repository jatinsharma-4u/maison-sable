import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { ease, Qty } from './ui';
import { useStore } from '../context/store';
import { getProduct, WOODS, FABRICS, FINISHES } from '../data/products';
import { formatPrice } from '../data/site';
import { lockScroll } from '../lib/motion';

export const optionLabel = (opts = {}) =>
  [
    opts.wood && WOODS.find((w) => w.id === opts.wood)?.name,
    opts.fabric && FABRICS.find((f) => f.id === opts.fabric)?.name,
    opts.finish && FINISHES.find((f) => f.id === opts.finish)?.name,
    opts.size,
  ].filter(Boolean).join(' · ');

export function QuoteDrawer() {
  const { quote, quoteOpen, setQuoteOpen, updateQuoteQty, removeFromQuote } = useStore();
  const close = () => setQuoteOpen(false);
  useEffect(() => {
    if (!quoteOpen) return undefined;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && setQuoteOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey); };
  }, [quoteOpen, setQuoteOpen]);

  const items = quote.map((i) => ({ ...i, p: getProduct(i.slug) })).filter((i) => i.p);
  const indicative = items.reduce((n, i) => n + i.p.priceFrom * i.qty, 0);

  return (
    <AnimatePresence>
      {quoteOpen && (
        <motion.div className="drawer" role="dialog" aria-modal="true" aria-labelledby="quote-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="drawer__scrim" onClick={close} />
          <motion.aside className="drawer__panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.55, ease }} data-lenis-prevent>
            <div className="drawer__head">
              <div>
                <h2 id="quote-title" className="h3">Your quote list</h2>
                <p className="tiny muted">Collect designs here, then send them in one inquiry.</p>
              </div>
              <button className="icon-btn icon-btn--solid" onClick={close} aria-label="Close quote list" autoFocus><Icon name="close" /></button>
            </div>
            {items.length === 0 ? (
              <div className="drawer__empty">
                <div className="empty__icon"><Icon name="clipboard" size={28} /></div>
                <p className="h3">Nothing here yet</p>
                <p className="muted small">Add designs you’d like priced — we’ll quote them together, in your sizes and materials.</p>
                <Link to="/shop" className="btn" onClick={close}>Explore designs</Link>
              </div>
            ) : (
              <>
                <ul className="drawer__list">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }} transition={{ duration: 0.35, ease }} className="qitem">
                        <Link to={`/product/${i.p.slug}`} onClick={close} className={`qitem__img ${i.p.cutout ? 'is-cutout' : ''}`}><img src={i.p.image.src} alt="" /></Link>
                        <div className="qitem__body">
                          <Link to={`/product/${i.p.slug}`} onClick={close} className="qitem__name">{i.p.name}</Link>
                          <span className="tiny muted">{optionLabel(i.options) || 'Standard specification'}</span>
                          <span className="tiny">from {formatPrice(i.p.priceFrom)} each</span>
                          <div className="qitem__row">
                            <Qty value={i.qty} onChange={(v) => updateQuoteQty(i.key, v)} label={`Quantity for ${i.p.name}`} />
                            <button className="qitem__remove" onClick={() => removeFromQuote(i.key)} aria-label={`Remove ${i.p.name}`}><Icon name="trash" size={16} /> Remove</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="drawer__foot">
                  <div className="drawer__total">
                    <span>Indicative total</span>
                    <strong>from {formatPrice(indicative)}</strong>
                  </div>
                  <p className="tiny muted">Final pricing depends on your sizes and materials and is confirmed in your written quote. No payment is taken online.</p>
                  <Link to="/custom-order?from=quote" onClick={close} className="btn btn--block btn--lg">Request quote for {items.length} {items.length === 1 ? 'design' : 'designs'}</Link>
                  <Link to="/quote" onClick={close} className="btn btn--ghost btn--block">Review full list</Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast() {
  const { toast, dismissToast } = useStore();
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.4, ease }}>
            <Icon name="check" size={16} />
            <span>{toast.message}</span>
            {toast.action && <Link to={toast.action.to} onClick={dismissToast} className="toast__action">{toast.action.label}</Link>}
            <button onClick={dismissToast} aria-label="Dismiss notification" className="toast__close"><Icon name="close" size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
