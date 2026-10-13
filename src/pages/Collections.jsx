import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Crumbs, Img, Reveal, roomImg } from '../components/ui';
import { collections } from '../data/catalog';
import { CtaBanner } from './Home';
import { useSeo } from '../lib/seo';

export default function Collections() {
  useSeo('Room collections', 'Curated living rooms, bedrooms, dining rooms and home offices — complete looks you can make your own.');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
          <Reveal className="page-hero__inner">
            <span className="eyebrow">{collections.length} curated rooms</span>
            <h1 className="h1">Rooms, <em>composed for living</em></h1>
            <p className="lede">Complete looks — shop them as they are, or make them yours.</p>
          </Reveal>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container coll-index">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.06}>
              <Link to={`/collections/${c.slug}`} className="roomcard">
                <Img {...roomImg(c.hero)} alt={`${c.name} collection`} sizes={i < 2 ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 33vw'} eager={i < 2} />
                <span className="roomcard__shade" />
                <span className="roomcard__kicker">{c.kicker}</span>
                <span className="roomcard__body">
                  <span className="roomcard__name">{c.name}</span>
                  <span className="roomcard__sum">{c.summary} · {c.products.length} pieces</span>
                </span>
                <span className="roomcard__go"><Icon name="arrowUpRight" size={18} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <div className="section--tight" />
      <CtaBanner />
    </>
  );
}
