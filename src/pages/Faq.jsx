import Icon from '../components/Icon';
import { Accordion, ArrowButton, Crumbs, Reveal } from '../components/ui';
import { faqs } from '../data/catalog';
import { site } from '../data/site';
import { useSeo } from '../lib/seo';

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');

export default function Faq() {
  useSeo('Frequently asked questions', 'How custom furniture ordering, pricing, production, delivery and care work at Maison Sable.');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQs' }]} />
          <Reveal className="page-hero__inner">
            <span className="eyebrow">Help centre</span>
            <h1 className="h1">Questions, <em>answered</em></h1>
            <p className="lede">Everything about ordering made-to-measure furniture.</p>
          </Reveal>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0, paddingBottom: 'var(--section)' }}>
        <div className="container faq-layout">
          <nav className="faq-nav" aria-label="FAQ sections">
            {faqs.map((g) => <a key={g.group} href={`#${slug(g.group)}`}>{g.group}</a>)}
          </nav>
          <div>
            {faqs.map((g) => (
              <div key={g.group} id={slug(g.group)} className="faq-group" style={{ scrollMarginTop: 'calc(var(--header-h) + 24px)' }}>
                <h2 className="h3">{g.group}</h2>
                <Accordion items={g.items.map(([q, a]) => [q, <p key={q}>{a}</p>])} defaultOpen={-1} />
              </div>
            ))}
            <div className="panel" style={{ marginTop: 'var(--s-8)', display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span className="ccard__icon"><Icon name="phone" /></span>
                <div><strong>Still have a question?</strong><p className="small muted">Our studio team is happy to help.</p></div>
              </div>
              <ArrowButton to="/contact">Contact us</ArrowButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
