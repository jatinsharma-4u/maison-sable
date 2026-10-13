import { Link } from 'react-router-dom';
import ProductBrowser from '../components/ProductBrowser';
import Icon from '../components/Icon';
import { Crumbs, Reveal } from '../components/ui';
import { products } from '../data/products';
import { formatPrice } from '../data/site';
import { useGsap } from '../lib/motion';
import { useSeo } from '../lib/seo';

export default function NewArrivals() {
  useSeo('New arrivals', 'The newest Maison Sable designs — fresh from the workshop and ready to be made to your measurements.');
  const fresh = products.filter((p) => p.isNew).sort((a, b) => b.added.localeCompare(a.added));
  const [lead, ...rest] = fresh;
  const ref = useGsap((gsap) => {
    gsap.fromTo('.na-feature__img', { yPercent: 8, scale: 0.94 }, { yPercent: -6, scale: 1, ease: 'none', scrollTrigger: { trigger: '.na-feature', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return (
    <div ref={ref}>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'New arrivals' }]} />
          <Reveal className="page-hero__inner">
            <span className="eyebrow">{fresh.length} new designs · Autumn 2026</span>
            <h1 className="h1">Fresh from <em>the workshop</em></h1>
            <p className="lede">Our newest pieces, ready to be made yours.</p>
          </Reveal>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Link to={`/product/${lead.slug}`} className="na-feature">
            <div className="na-feature__text">
              <span className="tag tag--dark">Just launched</span>
              <h2 className="h2">{lead.name}</h2>
              <p className="muted">{lead.blurb}</p>
              <span className="small">from <strong>{formatPrice(lead.priceFrom)}</strong></span>
              <span className="link-arrow">Explore the design <Icon name="arrow" size={14} /></span>
            </div>
            <div className="na-feature__stage">
              <img className="na-feature__img" src={lead.image.src} alt={lead.image.alt} />
            </div>
            <ul className="na-feature__more" aria-label="Also new">
              {rest.slice(0, 3).map((p) => (
                <li key={p.slug} className={p.cutout ? 'is-cutout' : ''}><img src={p.image.src} alt="" loading="lazy" /><span>{p.name}</span></li>
              ))}
            </ul>
          </Link>
        </div>
      </section>
      <section className="section--tight" style={{ paddingBottom: 'var(--section)' }}>
        <div className="container">
          <ProductBrowser items={fresh} />
        </div>
      </section>
    </div>
  );
}
