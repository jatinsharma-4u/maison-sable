import { Link, useParams } from 'react-router-dom';
import ProductBrowser from '../components/ProductBrowser';
import Icon from '../components/Icon';
import { Crumbs, Img, Reveal, roomImg, SectionHead } from '../components/ui';
import { products } from '../data/products';
import { categories, collections, getCategory } from '../data/catalog';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

const roomFor = { sofas: 'living-room', armchairs: 'living-room', tables: 'living-room', dining: 'dining-room', bedroom: 'bedroom', storage: 'bedroom', office: 'home-office', lighting: 'dining-room', outdoor: 'outdoor' };

export default function Shop() {
  const { category } = useParams();
  const cat = category ? getCategory(category) : null;
  useSeo(cat ? cat.name : 'Shop all designs', cat ? cat.intro : 'Browse every Maison Sable design — sofas, chairs, tables, beds, storage and lighting, all made to measure.');
  if (category && !cat) return <NotFound />;

  const items = cat ? products.filter((p) => p.category === cat.slug) : products;
  const related = cat ? [collections.find((c) => c.slug === roomFor[cat.slug]), ...collections.filter((c) => c.slug !== roomFor[cat.slug])].slice(0, 3) : [];

  return (
    <>
      <section className="page-hero shop-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: cat ? '/shop' : undefined }, ...(cat ? [{ label: cat.name }] : [])]} />
          <div className="shop-hero__grid">
            <Reveal className="page-hero__inner">
              <span className="eyebrow">{cat ? `${items.length} designs` : `${products.length} designs · 9 categories`}</span>
              <h1 className="h1">{cat ? cat.name : <>Every piece, <em>made for you</em></>}</h1>
              <p className="lede">{cat ? cat.intro : 'Start with a design. Change everything else.'}</p>
            </Reveal>
            {cat && (
              <Reveal delay={0.1} className="shop-hero__img">
                <Img src={cat.hero} sm={cat.hero.replace('.webp', '-sm.webp')} alt="" sizes="(max-width: 900px) 100vw, 45vw" eager />
              </Reveal>
            )}
          </div>
          <nav className="catnav" aria-label="Categories" style={{ marginTop: 28 }}>
            <Link to="/shop" className={`chip ${!cat ? 'is-active' : ''}`} aria-current={!cat ? 'page' : undefined}>All</Link>
            {categories.map((c) => (
              <Link key={c.slug} to={`/shop/${c.slug}`} className={`chip ${cat?.slug === c.slug ? 'is-active' : ''}`} aria-current={cat?.slug === c.slug ? 'page' : undefined}>
                <img src={c.thumb} alt="" /> {c.short}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <ProductBrowser key={cat?.slug || 'all'} items={items} showCategories={!cat} />
        </div>
      </section>
      {cat && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="Room inspiration" title={<>See it <em>in a room</em></>} />
            <div className="related-cols">
              {related.map((c) => (
                <Link key={c.slug} to={`/collections/${c.slug}`} className="roomcard" style={{ aspectRatio: '4 / 3.6' }}>
                  <Img {...roomImg(c.hero)} alt={`${c.name} collection`} sizes="(max-width: 760px) 100vw, 33vw" />
                  <span className="roomcard__shade" />
                  <span className="roomcard__body"><span className="roomcard__name">{c.name}</span><span className="roomcard__sum">{c.summary}</span></span>
                  <span className="roomcard__go"><Icon name="arrowUpRight" size={18} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
