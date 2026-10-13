import Icon from '../components/Icon';
import { ArrowButton, Crumbs, Img, Reveal, roomImg, SectionHead } from '../components/ui';
import { BedFeature, CtaBanner } from './Home';
import { useGsap } from '../lib/motion';
import { useSeo } from '../lib/seo';

const values = [
  ['ruler', 'Made for one home', 'We don’t keep warehouses of stock. Each piece is drawn for a specific room and a specific person, then built once.'],
  ['hammer', 'Honest construction', 'Solid hardwood frames, mortise-and-tenon joints and dovetailed drawers. We use metal fixings only where they genuinely make a piece stronger.'],
  ['leaf', 'Materials that age well', 'Oiled timbers, natural linens, wool and leather — materials that wear in rather than wear out, and can be repaired.'],
];

const process = [
  ['01', 'Conversation', 'We listen first: your room, your routines, what you love and what annoys you about your current furniture.'],
  ['02', 'Drawing', 'Dimensioned drawings and material samples, revised until it feels exactly right. You approve before anything is cut.'],
  ['03', 'Making', 'One maker takes your piece from rough board to final finish, sending photographs along the way.'],
  ['04', 'Placing', 'We deliver, assemble and position the piece in your home — and come back if anything ever needs attention.'],
];

const materials = [
  ['mat-oak', 'White oak', 'Straight grain, ages to honey'],
  ['mat-walnut', 'Walnut', 'Deep, warm, and rich'],
  ['mat-ash', 'Ash', 'Pale, strong, steam-bends'],
  ['mat-linen', 'Linen', 'Breathable and textural'],
  ['mat-boucle', 'Bouclé & wool', 'Soft, looped, hard-wearing'],
];

export default function About() {
  useSeo('About the studio', 'Maison Sable is a custom furniture studio and workshop. Learn about our design philosophy, materials and how we make every piece by hand.');
  const ref = useGsap((gsap) => {
    gsap.fromTo('.about-hero__img img', { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'power3.out' });
    gsap.fromTo('.about-wide img', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.about-wide', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return (
    <div ref={ref}>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <div className="about-hero">
            <Reveal className="page-hero__inner">
              <span className="eyebrow">The studio</span>
              <h1 className="h1">Wood doesn’t age — <em>it gains character.</em></h1>
              <p className="lede">A small studio making furniture slowly, by hand, for the people who live with it.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <ArrowButton to="/custom-order">Start a custom order</ArrowButton>
                <ArrowButton to="/contact" variant="ghost">Visit the workshop</ArrowButton>
              </div>
            </Reveal>
            <div className="about-hero__img"><Img {...roomImg('craft-plane')} alt="A maker planing timber in the Maison Sable workshop" sizes="(max-width: 900px) 100vw, 45vw" eager /></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="What we believe" title={<>Three things <em>we won’t compromise on</em></>} />
          <div className="values">
            {values.map(([icon, t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="value">
                <span className="value__icon"><Icon name={icon} size={24} /></span>
                <h3 className="h3">{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="media about-wide" style={{ aspectRatio: '21 / 9', borderRadius: 'var(--r-xl)' }}>
            <Img {...roomImg('craft-shop')} alt="The workshop floor with work in progress" sizes="100vw" style={{ height: '120%' }} />
          </div>
        </div>
      </section>

      <section className="section editorial">
        <div className="container editorial__grid">
          <Reveal className="editorial__big"><Img {...roomImg('bed-walnut')} alt="A low walnut platform bed in front of a timber slat wall" sizes="(max-width: 900px) 100vw, 58vw" /></Reveal>
          <div className="editorial__text">
            <span className="cathead__kicker">/Our philosophy</span>
            <h2 className="h2">Rooms that feel like <em>a deep breath</em></h2>
            <p className="muted">We design for the quiet moments — the hour before sleep, a long dinner, a Sunday on the sofa. Proportion, texture and light matter more to us than trends.</p>
            <dl className="editorial__stats">
              <div><dt>Production</dt><dd>4–10 wks</dd></div>
              <div><dt>Quote</dt><dd>48 hrs</dd></div>
              <div><dt>Materials</dt><dd>60+</dd></div>
            </dl>
            <ArrowButton to="/collections" variant="ghost">Explore the rooms</ArrowButton>
          </div>
          <Reveal className="editorial__small" delay={0.1}><Img {...roomImg('living-cream')} alt="A soft cream living room" sizes="(max-width: 900px) 60vw, 26vw" /></Reveal>
        </div>
      </section>

      <BedFeature eyebrow="/Signature beds" />

      <section className="section">
        <div className="container story-grid">
          <Reveal>
            <span className="eyebrow">How we work</span>
            <h2 className="h2" style={{ marginTop: 12 }}>A slower way <em>to make furniture</em></h2>
          </Reveal>
          <ol className="timeline">
            {process.map(([n, t, d]) => (
              <Reveal as="li" key={n}>
                <span className="num">{n}</span>
                <h3 className="h3">{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="Materials library" title={<>Chosen to <em>last a lifetime</em></>} text="See and feel every timber and fabric in our studio, or ask for samples to be sent home." />
          <div className="materials">
            {materials.map(([img, t, d], i) => (
              <Reveal key={t} delay={i * 0.06} className="material">
                <span className="material__img"><Img {...roomImg(img)} alt={`${t} sample`} sizes="240px" /></span>
                <strong>{t}</strong>
                <span className="small muted">{d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </div>
  );
}
