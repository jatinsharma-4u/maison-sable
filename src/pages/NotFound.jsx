import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowButton } from '../components/ui';
import { categories } from '../data/catalog';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo('Page not found');
  useEffect(() => {
    // Tell crawlers this is not a real page.
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);
  return (
    <section className="nf">
      <div className="container">
        <div className="nf__stage" aria-hidden>
          <span className="nf__num">404</span>
          <motion.img
            className="nf__chair"
            src="/img/p/rondo.webp"
            alt=""
            initial={{ rotate: -14, y: -40, opacity: 0 }}
            animate={{ rotate: -8, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
          />
        </div>
        <h1 className="h2">This seat <em>is empty.</em></h1>
        <p>The page you’re looking for has moved, or never existed. Let’s find you somewhere comfortable to land.</p>
        <div className="nf__actions">
          <ArrowButton to="/">Back to home</ArrowButton>
          <Link to="/shop" className="btn btn--ghost">Explore designs</Link>
        </div>
        <div className="nf__links">
          {categories.slice(0, 5).map((c) => <Link key={c.slug} to={`/shop/${c.slug}`} className="chip chip--sm">{c.short}</Link>)}
        </div>
      </div>
    </section>
  );
}
