import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { ArrowButton, Crumbs, Img, Reveal, roomImg } from '../components/ui';
import { journal } from '../data/catalog';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

export default function Article() {
  const { slug } = useParams();
  const a = journal.find((x) => x.slug === slug);
  useSeo(a ? a.title : 'Story not found', a?.excerpt);
  if (!a) return <NotFound />;
  const next = journal[(journal.indexOf(a) + 1) % journal.length];
  return (
    <article>
      <section className="page-hero">
        <div className="container container--narrow">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Inspiration', to: '/journal' }, { label: a.category }]} />
          <Reveal className="page-hero__inner">
            <span className="jcard__meta tiny"><span className="tag">{a.category}</span> {a.read} read · {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <h1 className="h1">{a.title}</h1>
            <p className="lede">{a.excerpt}</p>
          </Reveal>
        </div>
      </section>
      <div className="container">
        <div className="article-hero"><Img {...roomImg(a.image)} alt="" sizes="100vw" eager /></div>
      </div>
      <div className="container container--narrow prose article-body">
        {a.body.map(([t, text], i) => (t === 'h' ? <h2 key={i}>{text}</h2> : <p key={i}>{text}</p>))}
      </div>
      <section className="section">
        <div className="container container--narrow">
          <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow eyebrow--plain">Ready when you are</p>
              <p className="h3" style={{ marginTop: 6 }}>Turn the idea into a piece.</p>
            </div>
            <ArrowButton to="/custom-order">Start a custom order</ArrowButton>
          </div>
          <Link to={`/journal/${next.slug}`} className="next-article">
            <span className="tiny muted">Next story</span>
            <span className="h3">{next.title}</span>
            <Icon name="arrow" size={20} />
          </Link>
        </div>
      </section>
    </article>
  );
}
