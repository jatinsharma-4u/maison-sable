import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Crumbs, Img, Reveal, roomImg } from '../components/ui';
import { collections, journal } from '../data/catalog';
import { useSeo } from '../lib/seo';

export default function Journal() {
  useSeo('Inspiration & journal', 'Guides, material stories and workshop notes from Maison Sable.');
  const [lead, ...rest] = journal;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Inspiration' }]} />
          <Reveal className="page-hero__inner">
            <span className="eyebrow">Journal</span>
            <h1 className="h1">Ideas for <em>living well</em></h1>
            <p className="lede">Guides, materials and stories from the workshop.</p>
          </Reveal>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Link to={`/journal/${lead.slug}`} className="jlead">
            <span className="jlead__img"><Img {...roomImg(lead.image)} alt="" sizes="(max-width: 900px) 100vw, 60vw" eager /></span>
            <span className="jlead__text">
              <span className="jcard__meta tiny"><span className="tag">{lead.category}</span> {lead.read} read</span>
              <span className="h2">{lead.title}</span>
              <span className="muted">{lead.excerpt}</span>
              <span className="link-arrow">Read the story <Icon name="arrow" size={14} /></span>
            </span>
          </Link>
          <div className="jgrid" style={{ marginTop: 'var(--s-8)' }}>
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link to={`/journal/${a.slug}`} className="jcard">
                  <span className="jcard__img"><Img {...roomImg(a.image)} alt="" sizes="(max-width: 900px) 100vw, 33vw" /></span>
                  <span className="jcard__meta tiny"><span className="tag">{a.category}</span> {a.read} read</span>
                  <span className="jcard__title">{a.title}</span>
                  <span className="small muted">{a.excerpt}</span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={0.16}>
              <Link to="/collections" className="jcard jcard--rooms">
                <span className="jcard__img jcard__img--grid">
                  {collections.slice(0, 4).map((c) => <Img key={c.slug} {...roomImg(c.hero)} alt="" sizes="160px" />)}
                </span>
                <span className="jcard__meta tiny"><span className="tag">Rooms</span> {collections.length} collections</span>
                <span className="jcard__title">Browse our curated rooms</span>
                <span className="small muted">Complete looks for living, sleeping, dining and working.</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <div className="section" />
    </>
  );
}
