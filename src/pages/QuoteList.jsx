import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../components/Icon';
import { ArrowButton, Crumbs, EmptyState, Qty } from '../components/ui';
import { optionLabel } from '../components/Overlays';
import { getProduct, leadText } from '../data/products';
import { formatPrice } from '../data/site';
import { useStore } from '../context/store';
import { useSeo } from '../lib/seo';

export default function QuoteList() {
  useSeo('Your quote list');
  const { quote, updateQuoteQty, removeFromQuote, clearQuote } = useStore();
  const items = quote.map((i) => ({ ...i, p: getProduct(i.slug) })).filter((i) => i.p);
  const total = items.reduce((n, i) => n + i.p.priceFrom * i.qty, 0);
  const longest = items.reduce((m, i) => Math.max(m, i.p.leadWeeks[1]), 0);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Quote list' }]} />
          <div className="page-hero__inner">
            <span className="eyebrow">{items.length} {items.length === 1 ? 'design' : 'designs'}</span>
            <h1 className="h1">Your <em>quote list</em></h1>
            <p className="lede">Designs you’d like priced together. We’ll tailor each to your sizes and materials and send one combined quote.</p>
          </div>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0, paddingBottom: 'var(--section)' }}>
        <div className="container">
          {items.length === 0 ? (
            <EmptyState icon="clipboard" title="Your quote list is empty" text="Add designs from any product page, then request a single combined quote.">
              <ArrowButton to="/shop">Explore designs</ArrowButton>
              <Link to="/custom-order" className="btn btn--ghost">Describe a custom piece</Link>
            </EmptyState>
          ) : (
            <div className="qlist">
              <ul>
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <motion.li key={i.key} layout exit={{ opacity: 0, height: 0, paddingBlock: 0 }} className="qrow">
                      <Link to={`/product/${i.p.slug}`} className={`qitem__img ${i.p.cutout ? 'is-cutout' : ''}`}><img src={i.p.image.src} alt="" /></Link>
                      <div style={{ display: 'grid', gap: 4 }}>
                        <Link to={`/product/${i.p.slug}`} className="qrow__name">{i.p.name}</Link>
                        <span className="small muted">{optionLabel(i.options) || 'Standard specification'}</span>
                        <span className="small">from {formatPrice(i.p.priceFrom)} each · made in {leadText(i.p)}</span>
                      </div>
                      <div className="qrow__actions">
                        <Qty value={i.qty} onChange={(v) => updateQuoteQty(i.key, v)} label={`Quantity for ${i.p.name}`} />
                        <button className="qitem__remove" onClick={() => removeFromQuote(i.key)}><Icon name="trash" size={16} /> Remove</button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <aside className="qlist__summary panel">
                <h2 className="h3">Summary</h2>
                <div>
                  <div className="summary-line"><span>Designs</span><strong>{items.length}</strong></div>
                  <div className="summary-line"><span>Total pieces</span><strong>{items.reduce((n, i) => n + i.qty, 0)}</strong></div>
                  <div className="summary-line"><span>Longest lead time</span><strong>up to {longest} weeks</strong></div>
                  <div className="summary-line"><span>Delivery & installation</span><strong>Quoted with your order</strong></div>
                </div>
                <div className="summary-total"><span>Indicative total</span><strong>from {formatPrice(total)}</strong></div>
                <p className="tiny muted">Prices are indicative for standard sizes. Your final price is confirmed in writing; no payment is taken on this website.</p>
                <Link to="/custom-order?from=quote" className="btn btn--lg btn--block">Request my quote</Link>
                <Link to="/shop" className="btn btn--ghost btn--block">Continue exploring</Link>
                <button className="clear-btn" onClick={clearQuote} style={{ justifySelf: 'center' }}>Clear list</button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
