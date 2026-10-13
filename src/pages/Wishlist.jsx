import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import { ArrowButton, Crumbs, EmptyState, Reveal, SectionHead } from '../components/ui';
import { getProduct, products } from '../data/products';
import { useStore } from '../context/store';
import { useSeo } from '../lib/seo';

export default function Wishlist() {
  useSeo('Saved designs');
  const { wishlist, toggleWish, addManyToQuote } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);
  const suggestions = products.filter((p) => !wishlist.includes(p.slug)).sort((a, b) => a.popular - b.popular).slice(0, 4);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Saved' }]} />
          <div className="section-head" style={{ marginBottom: 0 }}>
            <Reveal className="section-head__text">
              <span className="eyebrow">{items.length} saved {items.length === 1 ? 'design' : 'designs'}</span>
              <h1 className="h1">Your <em>saved</em> designs</h1>
              <p>Saved on this device. Send them all for pricing in one go.</p>
            </Reveal>
            {items.length > 0 && (
              <button className="btn" onClick={() => addManyToQuote(items.map((p) => p.slug), `${items.length} saved ${items.length === 1 ? 'design' : 'designs'}`)}>
                <Icon name="clipboard" size={18} /> Add all to quote list
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          {items.length === 0 ? (
            <EmptyState icon="heart" title="Nothing saved yet" text="Tap the heart on any design to keep it here while you decide.">
              <ArrowButton to="/shop">Explore designs</ArrowButton>
              <Link to="/collections" className="btn btn--ghost">Browse rooms</Link>
            </EmptyState>
          ) : (
            <motion.div className="pgrid" layout>
              <AnimatePresence>
                {items.map((p) => (
                  <motion.div key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }} className="wish-item">
                    <ProductCard p={p} />
                    <div className="wish-item__actions">
                      <Link to={`/custom-order?product=${p.slug}`} className="btn btn--sm">Customize</Link>
                      <button className="btn btn--sm btn--ghost" onClick={() => toggleWish(p.slug, p.name)}>Remove</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="You might also like" title={<>Popular <em>right now</em></>} />
          <div className="pgrid">{suggestions.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </div>
      </section>
    </>
  );
}
