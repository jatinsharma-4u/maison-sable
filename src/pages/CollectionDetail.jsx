import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../components/Icon';
import ProductCard, { QuickView } from '../components/ProductCard';
import { ArrowButton, Crumbs, ease, Img, Reveal, roomImg, SectionHead } from '../components/ui';
import { collections, getCollection, productsBySlugs } from '../data/catalog';
import { getProduct } from '../data/products';
import { formatPrice } from '../data/site';
import { useStore } from '../context/store';
import { useGsap } from '../lib/motion';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

export default function CollectionDetail() {
  const { slug } = useParams();
  const c = getCollection(slug);
  const [spot, setSpot] = useState(null);
  const [qv, setQv] = useState(null);
  const { addManyToQuote } = useStore();
  useSeo(c ? c.name : 'Collection not found', c?.summary);
  const ref = useGsap((gsap) => {
    gsap.fromTo('.chero > img', { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
    gsap.utils.toArray('.gallery-strip > div').forEach((el, i) => {
      gsap.fromTo(el, { y: 40 + i * 10 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.gallery-strip', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }, [slug]);
  if (!c) return <NotFound />;
  const items = productsBySlugs(c.products);
  const others = collections.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: c.name }]} />
          <div className="chero">
            <img src={`/img/r/${c.hero}.webp`} srcSet={`/img/r/${c.hero}-sm.webp 900w, /img/r/${c.hero}.webp 1800w`} sizes="100vw" alt={`${c.name}: ${c.summary}`} fetchpriority="high" />
            <div className="chero__text">
              <span className="eyebrow">{c.kicker}</span>
              <h1 className="h1">{c.name}</h1>
              <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: '48ch' }}>{c.summary}</p>
            </div>
            {c.hotspots.map((h, i) => {
              const p = getProduct(h.slug);
              return (
                <div key={h.slug} className="hotspot-wrap" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                  <button className="hotspot" aria-label={`Show ${p.name}`} aria-expanded={spot === i} onClick={() => setSpot(spot === i ? null : i)}><span /></button>
                  <AnimatePresence>
                    {spot === i && (
                      <motion.div className="hs-pop" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.3, ease }}>
                        <Link to={`/product/${p.slug}`} className="glass-card">
                          <span className="glass-card__text"><small>/ In this room</small><strong>{p.name}</strong><span>from {formatPrice(p.priceFrom)}</span></span>
                          <span className="glass-card__go"><Icon name="arrowUpRight" size={16} /></span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container story-grid">
          <Reveal>
            <span className="eyebrow">The story</span>
            <h2 className="h2" style={{ marginTop: 12 }}>Designed as <em>a whole room</em></h2>
          </Reveal>
          <Reveal delay={0.1} className="prose">
            {c.story.map((s) => <p key={s.slice(0, 20)} style={{ fontSize: 'var(--fs-lg)' }}>{s}</p>)}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
              <button className="btn" onClick={() => addManyToQuote(items.slice(0, 4).map((p) => p.slug), `4 pieces from ${c.name}`)}>Add the key pieces to my quote</button>
              <ArrowButton to="/custom-order" variant="ghost">Plan this room with us</ArrowButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container gallery-strip">
          {c.gallery.map((g) => <div key={g}><Img {...roomImg(g)} alt="" sizes="(max-width: 900px) 50vw, 25vw" /></div>)}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Shop the look" title={<>Pieces in <em>this room</em></>} text="Every piece can be resized and made in your choice of timber and fabric." />
          <div className="pgrid">{items.map((p) => <ProductCard key={p.slug} p={p} onQuickView={setQv} />)}</div>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--section)' }}>
        <div className="container">
          <SectionHead eyebrow="Keep exploring" title={<>More <em>rooms</em></>} action={<ArrowButton to="/collections" variant="ghost">All collections</ArrowButton>} />
          <div className="related-cols">
            {others.map((o) => (
              <Link key={o.slug} to={`/collections/${o.slug}`} className="roomcard" style={{ aspectRatio: '4 / 3.6' }}>
                <Img {...roomImg(o.hero)} alt={`${o.name} collection`} sizes="(max-width: 760px) 100vw, 33vw" />
                <span className="roomcard__shade" />
                <span className="roomcard__body"><span className="roomcard__name">{o.name}</span><span className="roomcard__sum">{o.summary}</span></span>
                <span className="roomcard__go"><Icon name="arrowUpRight" size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <QuickView p={qv} onClose={() => setQv(null)} />
    </div>
  );
}
