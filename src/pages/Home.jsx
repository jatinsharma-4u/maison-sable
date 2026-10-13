import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, AnimatePresence, LayoutGroup, motion, useMotionValue } from 'framer-motion';
import Icon from '../components/Icon';
import ProductCard, { QuickView } from '../components/ProductCard';
import { ArrowButton, ease, Img, Reveal, roomImg, SectionHead, staggerItem, staggerParent } from '../components/ui';
import { products, getProduct, leadText } from '../data/products';
import { categories, collections, getCategory, journal, testimonials } from '../data/catalog';
import { formatPrice } from '../data/site';
import { useGsap } from '../lib/motion';
import { useSeo } from '../lib/seo';

const heroSlides = [
  { img: 'hero-living', product: 'dune-coffee-table', label: 'Living room', pos: '50% 62%', posM: '45% 88%' },
  { img: 'living-taupe', product: 'halden-sofa', label: 'Lounge', pos: '50% 60%', posM: '30% 82%' },
  { img: 'dining-long', product: 'sila-dining-table', label: 'Dining room', pos: '50% 55%', posM: '50% 92%' },
  { img: 'bed-rattan', product: 'nara-bed', label: 'Bedroom', pos: '50% 60%', posM: '62% 85%' },
];
const HERO_MS = 6500;

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => setI((n) => (n + 1) % heroSlides.length), HERO_MS);
    return () => clearTimeout(t);
  }, [i, paused]);
  const slide = heroSlides[i];
  const p = getProduct(slide.product);
  const ref = useGsap((gsap, ST, root) => {
    gsap.to('.hero__media', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__content', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.hero__line > span', { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: 0.1, delay: 0.2 });
    gsap.from('.hero__fade', { opacity: 0, y: 18, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.6 });
  });
  return (
    <section className="hero" ref={ref} aria-roledescription="carousel" aria-label="Featured rooms" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero__media">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.img}
            className="hero__slide"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 1.2, ease }, scale: { duration: 7, ease: 'linear' } } }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease } }}
          >
            <img
              src={`/img/r/${slide.img}.webp`}
              srcSet={`/img/r/${slide.img}-sm.webp 900w, /img/r/${slide.img}.webp 1800w`}
              sizes="100vw"
              alt={p.images.find((im) => !im.cutout)?.alt || p.name}
              style={{ '--pos': slide.pos, '--pos-m': slide.posM }}
              fetchpriority={i === 0 ? 'high' : 'auto'}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero__shade" />

      <div className="container hero__inner">
        <div className="hero__mtop hero__fade" aria-hidden>
          <span>{String(i + 1).padStart(2, '0')} <i>/ {String(heroSlides.length).padStart(2, '0')}</i></span>
          <AnimatePresence mode="wait"><motion.span key={slide.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>{slide.label}</motion.span></AnimatePresence>
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow hero__fade">Made-to-measure furniture</p>
          <h1 className="hero__title">
            <span className="hero__line"><span>Timeless design,</span></span>
            <span className="hero__line"><span><em>everyday comfort.</em></span></span>
          </h1>
          <p className="hero__lede hero__fade">
Handmade furniture, built to your exact measurements.
          </p>
          <div className="hero__ctas hero__fade">
            <Link to="/shop" className="btn btn--clay btn--lg">Explore designs</Link>
            <Link to="/custom-order" className="btn btn--light btn--lg hero__cta-2">Start a custom order</Link>
          </div>
        </div>

        <div className="hero__foot hero__fade">
          <div className="hero__progress" role="tablist" aria-label="Choose slide">
            {heroSlides.map((s, n) => (
              <button key={s.img} role="tab" aria-selected={n === i} aria-label={`${s.label} (${n + 1} of ${heroSlides.length})`} onClick={() => setI(n)} className={n === i ? 'is-active' : ''}>
                <span className="hero__bar">{n === i && <motion.span key={`${i}-${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0.02 : 1 }} transition={{ duration: paused ? 0.2 : HERO_MS / 1000, ease: 'linear' }} />}</span>
                <span className="hero__bar-label">{String(n + 1).padStart(2, '0')} <span>{s.label}</span></span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={p.slug} className="hero__card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease }}>
              <Link to={`/product/${p.slug}`} className="glass-card">
                <span className={`glass-card__img ${p.cutout ? 'is-cutout' : ''}`}><img src={p.image.src} alt="" /></span>
                <span className="glass-card__text">
                  <small>/{String(i + 1).padStart(2, '0')} · {slide.label}</small>
                  <strong>{p.name}</strong>
                  <span>from {formatPrice(p.priceFrom)}</span>
                </span>
                <span className="glass-card__go"><Icon name="arrowUpRight" size={16} /></span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const ref = useGsap((gsap) => {
    gsap.fromTo('.intro__text .w', { opacity: 0.2 }, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: '.intro__text', start: 'top 85%', end: 'bottom 60%', scrub: true } });
  });
  const lead = 'Discover furniture crafted with care, blending timeless craftsmanship, comfort and beauty —';
  const tail = 'designed for modern living with refined elegance in every piece.';
  const picks = ['armchairs', 'storage', 'lighting', 'tables'].map(getCategory);
  return (
    <section className="intro section" ref={ref}>
      <div className="container">
        <p className="intro__text">
          {lead.split(' ').map((w, n) => <span className="w" key={`a${n}`}>{w} </span>)}
          <span className="intro__muted">{tail.split(' ').map((w, n) => <span className="w" key={`b${n}`}>{w} </span>)}</span>
        </p>

        <div className="cathead">
          <Reveal className="cathead__left">
            <span className="cathead__kicker">/Categories</span>
            <h2 className="h2">Explore our crafted pieces</h2>
          </Reveal>
          <Reveal className="cathead__right" delay={0.08}>
            <Link to="/shop" className="btn btn--ghost btn--sm">Browse all categories <Icon name="arrow" size={14} /></Link>
            <p>We create pieces that blend design and function. Simple, warm, and beautifully made furniture.</p>
          </Reveal>
        </div>

        <motion.ul className="cats__grid" variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10%' }}>
          {picks.map((c, n) => (
            <motion.li key={c.slug} variants={staggerItem}>
              <Link to={`/shop/${c.slug}`} className="catcard">
                <span className="catcard__name">{c.short}</span>
                <img src={c.thumb} alt="" loading="lazy" className="catcard__img" />
                <span className="catcard__num">{String(n + 1).padStart(2, '0')}</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
        <nav className="cats__more" aria-label="More categories">
          {categories.filter((c) => !picks.includes(c)).map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`}>{c.name}</Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

function LifestyleBand() {
  const tiles = [
    { img: 'bed-oak', slug: 'odin-oak-bed', n: '/08' },
    { img: 'living-low', slug: 'haru-bench', n: '/14' },
  ];
  const ref = useGsap((gsap) => {
    gsap.utils.toArray('.band__tile > img').forEach((el) => {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
  return (
    <section className="band" ref={ref} aria-label="Shop the room">
      {tiles.map((t) => {
        const p = getProduct(t.slug);
        return (
          <div className="band__tile" key={t.slug}>
            <Img {...roomImg(t.img)} alt={p.images.find((im) => !im.cutout)?.alt || ''} sizes="(max-width: 760px) 100vw, 50vw" />
            <Link to={`/product/${p.slug}`} className="glass-card band__card">
              <span className={`glass-card__img ${p.cutout ? 'is-cutout' : ''}`}><img src={p.image.src} alt="" loading="lazy" /></span>
              <span className="glass-card__text"><small>{t.n}</small><strong>{p.name}</strong><span>from {formatPrice(p.priceFrom)}</span></span>
            </Link>
          </div>
        );
      })}
    </section>
  );
}

function Featured({ onQuickView }) {
  const tabs = [
    { id: 'popular', label: 'Most loved', list: () => [...products].sort((a, b) => a.popular - b.popular).slice(0, 8) },
    { id: 'new', label: 'New arrivals', list: () => products.filter((p) => p.isNew).sort((a, b) => b.added.localeCompare(a.added)).slice(0, 8) },
    { id: 'seating', label: 'Seating', list: () => products.filter((p) => ['sofas', 'armchairs'].includes(p.category) && p.cutout).slice(0, 8) },
  ];
  const [tab, setTab] = useState('popular');
  const list = useMemo(() => tabs.find((t) => t.id === tab).list(), [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="section featured">
      <div className="container">
        <SectionHead
          eyebrow="Popular designs"
          title={<>Timeless pieces for <em>modern living</em></>}
          action={
            <div className="tabs" role="tablist" aria-label="Filter featured designs">
              <LayoutGroup id="feat-tabs">
                {tabs.map((t) => (
                  <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tabs__btn ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
                    {tab === t.id && <motion.span layoutId="tab-pill" className="tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span>{t.label}</span>
                  </button>
                ))}
              </LayoutGroup>
            </div>
          }
        />
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="pgrid" variants={staggerParent} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            {list.map((p) => (
              <motion.div key={p.slug} variants={staggerItem}><ProductCard p={p} onQuickView={onQuickView} /></motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="center-row"><ArrowButton to={tab === 'new' ? '/new-arrivals' : '/shop'}>View all designs</ArrowButton></div>
      </div>
    </section>
  );
}

const sigSlides = ['lune-curved-sofa', 'halden-sofa', 'carlo-leather-sofa', 'fjord-sofa'];
const SIG_MS = 5200;

function Signature() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => { setDir(1); setI((n) => (n + 1) % sigSlides.length); }, SIG_MS);
    return () => clearTimeout(t);
  }, [i, paused]);
  const go = (d) => { setDir(d); setI((n) => (n + d + sigSlides.length) % sigSlides.length); };
  const p = getProduct(sigSlides[i]);
  const word = p.name.split(' ')[0];
  const ref = useGsap((gsap, ST, root) => {
    gsap.fromTo('.sig__wordwrap', { xPercent: 4 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return (
    <section className="sig section" ref={ref} aria-roledescription="carousel" aria-labelledby="sig-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container">
        <div className="sig__head">
          <div>
            <span className="cathead__kicker">/Signature sofas</span>
            <h2 id="sig-title" className="h2">Sculpted for <em>slow evenings</em></h2>
          </div>
          <div className="sig__nav">
            <span className="sig__count" aria-live="polite">{String(i + 1).padStart(2, '0')} <span>/ {String(sigSlides.length).padStart(2, '0')}</span></span>
            <button className="icon-btn icon-btn--solid" onClick={() => go(-1)} aria-label="Previous sofa"><Icon name="arrowLeft" size={18} /></button>
            <button className="icon-btn icon-btn--solid" onClick={() => go(1)} aria-label="Next sofa"><Icon name="arrow" size={18} /></button>
          </div>
        </div>

        <div className="sig__stage">
          <div className="sig__wordwrap" aria-hidden>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={word} className="sig__word" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease }}>
                {word}
              </motion.p>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.img
              key={p.slug}
              className="sig__piece"
              src={p.image.src}
              alt={p.image.alt}
              custom={dir}
              variants={{ enter: (d) => ({ opacity: 0, x: d * 120, scale: 0.96 }), center: { opacity: 1, x: 0, scale: 1 }, exit: (d) => ({ opacity: 0, x: d * -120, scale: 0.96 }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.9, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        <div className="sig__info">
          <AnimatePresence mode="wait">
            <motion.div key={p.slug} className="sig__copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
              <div className="sig__tags">
                <span className="tag">{p.style}</span>
                <span className="tag">{p.seats || 'Made to measure'}</span>
                <span className="tag">{leadText(p)}</span>
              </div>
              <h3 className="sig__name">{p.name}</h3>
              <p className="muted">{p.blurb}</p>
            </motion.div>
          </AnimatePresence>
          <div className="sig__side">
            <p className="sig__price">from <strong>{formatPrice(p.priceFrom)}</strong></p>
            <div className="sig__ctas">
              <Link to={`/custom-order?product=${p.slug}`} className="btn">Customize</Link>
              <Link to={`/product/${p.slug}`} className="btn btn--ghost">View details</Link>
            </div>
          </div>
        </div>
        <div className="sig__thumbs" role="tablist" aria-label="Choose a sofa">
          {sigSlides.map((s, n) => {
            const sp = getProduct(s);
            return (
              <button key={s} role="tab" aria-selected={n === i} aria-label={sp.name} className={`sig__thumb ${n === i ? 'is-active' : ''}`} onClick={() => { setDir(n > i ? 1 : -1); setI(n); }}>
                <img src={sp.image.src} alt="" loading="lazy" />
                <span className="sig__thumb-bar">{n === i && <motion.span key={`${i}-${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0.02 : 1 }} transition={{ duration: paused ? 0.2 : SIG_MS / 1000, ease: 'linear' }} />}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { n: '01', t: 'Share your idea', d: 'Pick a design from our collection or upload a photo of something you love. Tell us your room, sizes and how you’ll use it.', img: 'living-cream' },
  { n: '02', t: 'Drawings & quote', d: 'Within 48 hours you receive a detailed quote with dimensioned drawings, material suggestions and a production timeline.', img: 'craft-tools' },
  { n: '03', t: 'Made by hand', d: 'One maker builds your piece from start to finish. You receive progress photos — from raw boards to the final coat of oil.', img: 'craft-marking' },
  { n: '04', t: 'Delivered & installed', d: 'Our own team delivers, assembles and places your furniture, and takes every bit of packaging away.', img: 'bed-soft' },
];

function Process() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="process section" aria-labelledby="process-title">
      <div className="container process__grid">
        <div className="process__sticky">
          <span className="eyebrow eyebrow--light">How bespoke works</span>
          <h2 id="process-title" className="h2">From sketch to <em>your living room</em></h2>
          <div className="process__media">
            <AnimatePresence initial={false}>
              <motion.div key={active} className="process__img" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }}>
                <Img {...roomImg(steps[active].img)} alt="" sizes="(max-width: 900px) 100vw, 45vw" />
              </motion.div>
            </AnimatePresence>
            <div className="process__progress" aria-hidden>{steps.map((s, i) => <span key={s.n} className={i <= active ? 'is-on' : ''} />)}</div>
          </div>
        </div>
        <ol className="process__steps">
          {steps.map((s, i) => (
            <li key={s.n} data-i={i} ref={(el) => (refs.current[i] = el)} className={`process__step ${active === i ? 'is-active' : ''}`}>
              <span className="process__n">{s.n}</span>
              <h3 className="h3">{s.t}</h3>
              <p>{s.d}</p>
              <div className="process__mobile-img"><Img {...roomImg(steps[i].img)} alt="" sizes="100vw" /></div>
            </li>
          ))}
          <li className="process__cta">
            <ArrowButton to="/custom-order" variant="light" size="lg">Start your custom order</ArrowButton>
            <p className="small">No commitment — the consultation and quote are free.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}

function Rooms() {
  const viewport = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  const moved = useRef(false);
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return;
      const max = Math.min(0, viewport.current.clientWidth - track.current.scrollWidth);
      setBounds({ left: max, right: 0 });
      if (x.get() < max) x.set(max);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [x]);
  const step = (d) => {
    const card = track.current?.firstElementChild;
    const w = card ? card.getBoundingClientRect().width + 16 : 300;
    const target = Math.max(bounds.left, Math.min(0, x.get() - d * w));
    animate(x, target, { type: 'spring', stiffness: 260, damping: 34 });
  };
  return (
    <section className="section rooms">
      <div className="container">
        <div className="cathead">
          <Reveal className="cathead__left">
            <span className="cathead__kicker">/Rooms</span>
            <h2 className="h2">Love where <em>you live</em></h2>
          </Reveal>
          <div className="rooms__nav">
            <Link to="/collections" className="btn btn--ghost btn--sm rooms__all">All collections <Icon name="arrow" size={14} /></Link>
            <button className="icon-btn icon-btn--solid" onClick={() => step(-1)} aria-label="Previous rooms"><Icon name="arrowLeft" size={18} /></button>
            <button className="icon-btn icon-btn--solid" onClick={() => step(1)} aria-label="Next rooms"><Icon name="arrow" size={18} /></button>
          </div>
        </div>
        <div className="rooms__viewport" ref={viewport}>
          <motion.div
            ref={track}
            className="rooms__track"
            style={{ x }}
            drag="x"
            dragConstraints={bounds}
            dragElastic={0.08}
            dragTransition={{ power: 0.25, timeConstant: 260 }}
            onDragStart={() => { moved.current = true; }}
            onDragEnd={() => setTimeout(() => { moved.current = false; }, 50)}
          >
            {collections.map((c) => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="roomcard rooms__card"
                draggable={false}
                onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } }}
              >
                <Img {...roomImg(c.hero)} alt={`${c.name} collection`} sizes="(max-width: 700px) 72vw, 320px" draggable={false} />
                <span className="roomcard__shade" />
                <span className="roomcard__kicker">{c.kicker}</span>
                <span className="roomcard__body">
                  <span className="roomcard__name">{c.name.replace('The ', '')}</span>
                  <span className="roomcard__sum">{c.products.length} pieces</span>
                </span>
                <span className="roomcard__go"><Icon name="arrowUpRight" size={18} /></span>
              </Link>
            ))}
          </motion.div>
        </div>
        <p className="rooms__hint tiny muted" aria-hidden>Drag to explore <Icon name="arrow" size={12} /></p>
      </div>
    </section>
  );
}

export function BedFeature({ eyebrow = '/Bedroom' }) {
  const bed = getProduct('nara-bed');
  const ref = useGsap((gsap, ST, root) => {
    const path = root.querySelector('.bedf__line path');
    if (path) {
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top 75%', end: 'center 45%', scrub: true } });
    }
    gsap.fromTo('.bedf__bed', { y: 60, scale: 0.94 }, { y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.bedf__stage', start: 'top bottom', end: 'center center', scrub: true } });
  });
  const [open, setOpen] = useState(true);
  return (
    <section className="bedf section" ref={ref} aria-labelledby="bedf-title">
      <div className="container">
        <span className="cathead__kicker bedf__kicker">{eyebrow}</span>
        <Reveal as="h2" className="bedf__statement" id="bedf-title">
          Our <b>bed</b> collection blends calm Scandinavian lines with <i>sculptural</i> forms, bringing <b>comfort</b> and <b>style</b> to every room.
        </Reveal>
      </div>
      <div className="bedf__stage">
        <svg className="bedf__line" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden>
          <path d="M-20 360 C 180 360, 260 140, 470 170 S 760 330, 980 200 S 1260 40, 1460 90" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="container bedf__inner">
          <img className="bedf__bed" src={bed.image.src} alt={bed.image.alt} loading="lazy" />
          <button className="hotspot bedf__spot" aria-label="Show bed details" aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /></button>
          <AnimatePresence>
            {open && (
              <motion.div className="bedf__card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, ease }}>
                <span className="bedf__card-k">Bed material</span>
                <p>Washed linen over a padded headboard, on a solid oak frame with pegged joints.</p>
                <div className="bedf__card-row">
                  <span>from <strong>{formatPrice(bed.priceFrom)}</strong></span>
                  <Link to={`/product/${bed.slug}`} className="btn btn--sm">View bed</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
function Craft() {
  const ref = useGsap((gsap) => {
    gsap.utils.toArray('.craft .clip').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(18% 18% 18% 18% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: true } });
    });
    gsap.to('.marquee__inner', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return (
    <section className="section craft" ref={ref}>
      <div className="container">
        <div className="craft__head">
          <Reveal>
            <span className="eyebrow">Craftsmanship</span>
            <h2 className="h2" style={{ marginTop: 12 }}>Crafted gently, <em>in our own workshop.</em></h2>
          </Reveal>
          <Reveal delay={0.1}><p className="lede">We don’t outsource. Every frame is cut, joined and finished under one roof by makers who sign their work. Traditional joinery where it matters, modern precision where it helps.</p></Reveal>
        </div>
        <div className="craft__grid">
          <div className="craft__img craft__img--a clip"><Img {...roomImg('craft-plane')} alt="A maker planing a board by hand" sizes="(max-width: 900px) 100vw, 40vw" /></div>
          <div className="craft__fact"><strong>1</strong><span>maker builds each piece from start to finish</span></div>
          <div className="craft__fact"><strong>6</strong><span>progress photo updates, board to final oil</span></div>
          <div className="craft__img craft__img--b clip"><Img {...roomImg('craft-chisel')} alt="Chiselling a joint" sizes="(max-width: 900px) 50vw, 25vw" /></div>
          <div className="craft__fact craft__fact--dark"><strong>3</strong><span>coats of hard-wax oil, hand-sanded between each</span></div>
          <div className="craft__img craft__img--c clip"><Img {...roomImg('mat-walnut')} alt="Walnut grain detail" sizes="(max-width: 900px) 50vw, 25vw" /></div>
        </div>
      </div>
      <div className="marquee" aria-hidden>
        <div className="marquee__inner">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>Oak <i>✦</i> Walnut <i>✦</i> Linen <i>✦</i> Bouclé <i>✦</i> Ash <i>✦</i> Teak <i>✦</i> Wool <i>✦</i> Leather <i>✦</i>&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d) => setI((n) => (n + d + testimonials.length) % testimonials.length);
  return (
    <section className="section testi" aria-labelledby="testi-title">
      <div className="container testi__grid">
        <div className="testi__media">
          <Img {...roomImg('living-pair')} alt="" sizes="(max-width: 900px) 100vw, 40vw" />
        </div>
        <div className="testi__body">
          <span className="eyebrow" id="testi-title">Client stories</span>
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease }} className="testi__fig">
              <blockquote className="testi__quote">“{t.quote}”</blockquote>
              <figcaption><strong>{t.name}</strong> · {t.place}<span className="muted"> — {t.piece}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="testi__controls">
            <button className="icon-btn icon-btn--solid" onClick={() => go(-1)} aria-label="Previous review"><Icon name="arrowLeft" size={18} /></button>
            <span className="testi__count" aria-live="polite">{String(i + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
            <button className="icon-btn icon-btn--solid" onClick={() => go(1)} aria-label="Next review"><Icon name="arrow" size={18} /></button>
          </div>
          <p className="tiny muted testi__note">Illustrative reviews — replace with verified client feedback before launch.</p>
        </div>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="section section--flush-top">
      <div className="container">
        <SectionHead eyebrow="Inspiration" title={<>Notes from <em>the studio</em></>} action={<ArrowButton to="/journal" variant="ghost">All stories</ArrowButton>} />
        <div className="jgrid">
          {journal.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <Link to={`/journal/${a.slug}`} className="jcard">
                <span className="jcard__img"><Img {...roomImg(a.image)} alt="" sizes="(max-width: 900px) 100vw, 33vw" /></span>
                <span className="jcard__meta tiny"><span className="tag">{a.category}</span> {a.read} read</span>
                <span className="jcard__title">{a.title}</span>
                <span className="small muted">{a.excerpt}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  const ref = useGsap((gsap) => {
    gsap.fromTo('.ctab__bg img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.ctab', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return (
    <section className="section section--flush-top" ref={ref}>
      <div className="container">
        <div className="ctab">
          <div className="ctab__bg"><Img {...roomImg('dining-window')} alt="" sizes="100vw" /></div>
          <div className="ctab__content">
            <h2 className="h2">Ready to create a piece <em>made just for you?</em></h2>
            <p>Tell us what you have in mind. We’ll reply within 48 hours with ideas, drawings and a clear quote.</p>
            <div className="ctab__ctas">
              <ArrowButton to="/custom-order" variant="light" size="lg">Start a custom order</ArrowButton>
              <Link to="/contact" className="btn btn--glass btn--lg">Talk to a designer</Link>
            </div>
          </div>
          <ul className="ctab__chips">
            <li><Icon name="user" size={18} /> Personal designer</li>
            <li><Icon name="ruler" size={18} /> Free in-home measurement</li>
            <li><Icon name="shield" size={18} /> Approve drawings first</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useSeo(null, 'Maison Sable designs and builds made-to-measure sofas, beds, dining tables and storage in solid wood and natural fabrics. Explore designs and request a custom quote.');
  const [qv, setQv] = useState(null);
  return (
    <>
      <Hero />
      <Intro />
      <LifestyleBand />
      <Featured onQuickView={setQv} />
      <Signature />
      <Rooms />
      <BedFeature />
      <Process />
      <Craft />
      <Testimonials />
      <Journal />
      <CtaBanner />
      <QuickView p={qv} onClose={() => setQv(null)} />
    </>
  );
}
