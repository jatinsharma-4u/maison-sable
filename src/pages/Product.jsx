import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../components/Icon';
import ProductCard, { WishButton } from '../components/ProductCard';
import { Accordion, ArrowButton, Crumbs, ease, Qty, Reveal, SectionHead } from '../components/ui';
import { FABRICS, FINISHES, METALS, WOODS, getProduct, leadText, products, MATERIAL_LABELS } from '../data/products';
import { getCategory } from '../data/catalog';
import { formatPrice } from '../data/site';
import { useStore } from '../context/store';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

function Gallery({ p }) {
  const [[idx, dir], setState] = useState([0, 0]);
  const n = p.images.length;
  const go = (d) => setState(([i]) => [(i + d + n) % n, d]);
  const set = (i) => setState(([cur]) => [i, i > cur ? 1 : -1]);
  useEffect(() => setState([0, 0]), [p.slug]);
  const im = p.images[idx];
  return (
    <div className="gallery" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}>
      <div className="gallery__thumbs" role="tablist" aria-label="Product images">
        {p.images.map((t, i) => (
          <button key={t.src} role="tab" aria-selected={i === idx} aria-label={`Show image ${i + 1}: ${t.alt}`} className={`gallery__thumb ${t.cutout ? 'is-cutout' : ''}`} onClick={() => set(i)}>
            <img src={t.sm || t.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="gallery__stage" aria-roledescription="carousel" aria-label={`${p.name} images`} tabIndex={0}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={idx}
            className={`gallery__slide ${im.cutout ? 'is-cutout' : ''}`}
            custom={dir}
            variants={{
              enter: (d) => ({ opacity: 0, x: d * 60, scale: 1.02 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease }}
            drag={n > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) go(1);
              else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
            }}
          >
            <img src={im.src} srcSet={im.sm ? `${im.sm} 900w, ${im.src} 1800w` : undefined} sizes="(max-width: 960px) 100vw, 55vw" alt={im.alt} draggable={false} />
          </motion.div>
        </AnimatePresence>
        <span className="gallery__label tag">{im.cutout ? 'Studio shot' : 'In the room'}</span>
        <span className="gallery__count">{String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        {n > 1 && (
          <>
            <div className="gallery__nav">
              <button className="icon-btn icon-btn--solid" onClick={() => go(-1)} aria-label="Previous image"><Icon name="arrowLeft" size={18} /></button>
              <button className="icon-btn icon-btn--solid" onClick={() => go(1)} aria-label="Next image"><Icon name="arrow" size={18} /></button>
            </div>
            <div className="gallery__dots" aria-hidden>{p.images.map((t, i) => <span key={t.src} className={i === idx ? 'is-active' : ''} />)}</div>
          </>
        )}
      </div>
    </div>
  );
}

function Dimensions({ d }) {
  const [unit, setUnit] = useState('cm');
  const f = (v) => (unit === 'cm' ? `${v} cm` : `${(v / 2.54).toFixed(1)}″`);
  return (
    <div>
      <div className="unit-toggle" role="group" aria-label="Units">
        <button className={`chip chip--sm ${unit === 'cm' ? 'is-active' : ''}`} aria-pressed={unit === 'cm'} onClick={() => setUnit('cm')}>cm</button>
        <button className={`chip chip--sm ${unit === 'in' ? 'is-active' : ''}`} aria-pressed={unit === 'in'} onClick={() => setUnit('in')}>inches</button>
      </div>
      <div className="dims">
        <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
          <path d="M40 50 L150 50 L200 30 L90 30 Z" strokeOpacity=".5" />
          <path d="M40 50 L40 110 L150 110 L150 50" />
          <path d="M150 110 L200 90 L200 30" />
          <path d="M40 122 L150 122" strokeDasharray="3 3" />
          <path d="M160 120 L208 100" strokeDasharray="3 3" />
          <path d="M28 50 L28 110" strokeDasharray="3 3" />
          <text x="95" y="136" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">W</text>
          <text x="194" y="122" fontSize="10" fill="currentColor" stroke="none">D</text>
          <text x="14" y="84" fontSize="10" fill="currentColor" stroke="none">H</text>
        </svg>
        <dl>
          <div><dt>Width</dt><dd>{f(d.w)}</dd></div>
          <div><dt>Depth</dt><dd>{f(d.d)}</dd></div>
          <div><dt>Height</dt><dd>{f(d.h)}</dd></div>
          {d.seat && <div><dt>Seat height</dt><dd>{f(d.seat)}</dd></div>}
        </dl>
      </div>
      <p className="tiny muted" style={{ marginTop: 12 }}>Standard size shown. Every dimension can be adjusted — enter your measurements in the order form.</p>
    </div>
  );
}

const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

function OptionSwatches({ label, list, value, onChange }) {
  const current = list.find((o) => o.id === value);
  return (
    <div className="opt" role="radiogroup" aria-label={label}>
      <div className="opt__label"><strong>{label}</strong><span>{current?.name}</span></div>
      <div className="opt__swatches">
        {list.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} aria-label={o.name} title={o.name} className="opt-swatch" style={{ background: o.hex }} onClick={() => onChange(o.id)} />
        ))}
      </div>
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const p = getProduct(slug);
  const navigate = useNavigate();
  const { addToQuote, pushRecent, recent } = useStore();
  const [wood, setWood] = useState(p?.woods?.[0] || null);
  const [fabric, setFabric] = useState(p?.fabrics?.[0] || null);
  const [metal, setMetal] = useState(p?.metals?.[0] || null);
  const [finish, setFinish] = useState(p?.woods?.length ? 'oil' : null);
  const [size, setSize] = useState('standard');
  const [qty, setQty] = useState(1);

  useSeo(p ? p.name : 'Design not found', p ? `${p.blurb} Made to measure in ${leadText(p)}. Indicative price from ${formatPrice(p.priceFrom)}.` : undefined, p?.image.src);

  useEffect(() => {
    if (!p) return;
    pushRecent(p.slug);
    setWood(p.woods?.[0] || null);
    setFabric(p.fabrics?.[0] || null);
    setMetal(p.metals?.[0] || null);
    setFinish(p.woods?.length ? 'oil' : null);
    setSize('standard');
    setQty(1);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => (p ? products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4) : []), [p]);
  const complete = useMemo(() => (p ? products.filter((x) => x.category !== p.category && x.rooms.some((r) => p.rooms.includes(r))).sort((a, b) => a.popular - b.popular).slice(0, 3) : []), [p]);
  const recentItems = useMemo(() => recent.filter((s) => s !== slug).map(getProduct).filter(Boolean).slice(0, 4), [recent, slug]);

  if (!p) return <NotFound />;
  const cat = getCategory(p.category);

  const options = { wood, fabric: fabric, finish, size: size === 'custom' ? 'Custom size' : '' };
  if (metal) options.metal = metal;
  const today = new Date();
  const from = new Date(today.getTime() + (p.leadWeeks[0] * 7 + 3) * 864e5);
  const to = new Date(today.getTime() + (p.leadWeeks[1] * 7 + 7) * 864e5);

  const orderHref = () => {
    const q = new URLSearchParams({ product: p.slug, qty: String(qty) });
    if (wood) q.set('wood', wood);
    if (fabric) q.set('fabric', fabric);
    if (finish) q.set('finish', finish);
    if (metal) q.set('metal', metal);
    if (size === 'custom') q.set('size', 'custom');
    return `/custom-order?${q}`;
  };

  const woodList = (p.woods || []).map((id) => WOODS.find((w) => w.id === id)).filter(Boolean);
  const fabricList = (p.fabrics || []).map((id) => FABRICS.find((x) => x.id === id)).filter(Boolean);
  const metalList = (p.metals || []).map((id) => METALS.find((x) => x.id === id)).filter(Boolean);

  const accordion = [
    ['Dimensions', <Dimensions key="d" d={p.dims} />],
    ['Materials & finish', (
      <div key="m">
        <p>{p.description}</p>
        <ul style={{ marginTop: 12 }}>
          <li>Primary materials: {p.materials.map((m) => MATERIAL_LABELS[m] || m).join(', ')}</li>
          {woodList.length > 0 && <li>Timber options: {woodList.map((w) => w.name).join(', ')}</li>}
          {fabricList.length > 0 && <li>Upholstery options: {fabricList.map((x) => x.name).join(', ')}, plus more in our sample library</li>}
          {finish && <li>Finishes: {FINISHES.map((x) => x.name).join(', ')}</li>}
        </ul>
      </div>
    )],
    ['What can be customised', <ul key="c">{p.customize.map((c) => <li key={c}>{c}</li>)}<li>Anything else — just describe it in the order form</li></ul>],
    ['Production & delivery', (
      <div key="p">
        <p>Each {p.name} is made to order in our workshop. Typical production time is <strong>{leadText(p)}</strong> from drawing approval, followed by white-glove delivery by our own team.</p>
        <p style={{ marginTop: 8 }}>Ordering today, estimated delivery window: <strong>{fmtDate(from)} – {fmtDate(to)}</strong>. Your confirmed date will be in your quote. <Link to="/delivery" className="link-arrow">Delivery & returns</Link></p>
      </div>
    )],
    ['Assembly', <p key="a">Delivered fully assembled where access allows. Larger pieces (beds, wardrobes, long tables) are assembled in your room by our installers — no tools or effort required from you.</p>],
    ['Care', <p key="cr">Dust with a soft dry cloth. For oiled timber, wipe spills promptly and re-oil once or twice a year with the care kit we include. Upholstery covers are removable on most designs; professional cleaning recommended for leather and bouclé.</p>],
  ];

  return (
    <>
      <section className="section--tight pdp-page" style={{ paddingTop: 'clamp(16px, 2vw, 28px)' }}>
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: cat.name, to: `/shop/${cat.slug}` }, { label: p.name }]} />
          <div className="pdp">
            <Gallery p={p} />
            <div className="pinfo">
              <div className="pinfo__head">
                <div className="pinfo__badges">
                  <span className="tag"><Icon name="clock" size={14} /> Made in {leadText(p)}</span>
                  <span className="tag"><Icon name="ruler" size={14} /> Fully customisable</span>
                  {p.isNew && <span className="tag tag--dark">New</span>}
                </div>
                <div className="pinfo__title-row">
                  <h1 className="h1" style={{ fontSize: 'clamp(2.4rem, 1.6rem + 2.6vw, 3.8rem)' }}>{p.name}</h1>
                </div>
                <p className="lede" style={{ fontSize: 'var(--fs-md)' }}>{p.blurb}</p>
                <div className="pinfo__price">
                  <strong>from {formatPrice(p.priceFrom)}</strong>
                  <span className="small muted">indicative · standard size{p.seats ? ` · ${p.seats}` : ''}</span>
                </div>
              </div>

              <hr className="divider" />

              {woodList.length > 0 && <OptionSwatches label="Timber" list={woodList} value={wood} onChange={setWood} />}
              {fabricList.length > 0 && <OptionSwatches label="Upholstery" list={fabricList} value={fabric} onChange={setFabric} />}
              {metalList.length > 0 && <OptionSwatches label="Metal finish" list={metalList} value={metal} onChange={setMetal} />}
              {finish && (
                <div className="opt" role="radiogroup" aria-label="Finish">
                  <div className="opt__label"><strong>Finish</strong><span>{FINISHES.find((x) => x.id === finish)?.note}</span></div>
                  <div className="opt__pills">
                    {FINISHES.map((x) => <button key={x.id} type="button" role="radio" aria-checked={finish === x.id} className={`chip ${finish === x.id ? 'is-active' : ''}`} onClick={() => setFinish(x.id)}>{x.name}</button>)}
                  </div>
                </div>
              )}
              <div className="opt" role="radiogroup" aria-label="Size">
                <div className="opt__label"><strong>Size</strong><span>{size === 'standard' ? `${p.dims.w} × ${p.dims.d} × ${p.dims.h} cm` : 'You’ll enter measurements next'}</span></div>
                <div className="opt__pills">
                  <button type="button" role="radio" aria-checked={size === 'standard'} className={`chip ${size === 'standard' ? 'is-active' : ''}`} onClick={() => setSize('standard')}>Standard</button>
                  <button type="button" role="radio" aria-checked={size === 'custom'} className={`chip ${size === 'custom' ? 'is-active' : ''}`} onClick={() => setSize('custom')}><Icon name="ruler" size={15} /> Custom dimensions</button>
                </div>
              </div>

              <div className="pinfo__actions">
                <div className="pinfo__actions-row">
                  <Qty value={qty} onChange={setQty} />
                  <ArrowButton size="lg" onClick={() => navigate(orderHref())}>Customize this piece</ArrowButton>
                  <WishButton p={p} className="pinfo__wish" />
                </div>
                <button className="btn btn--ghost btn--lg btn--block" onClick={() => addToQuote(p.slug, options, qty, p.name)}>
                  <Icon name="clipboard" size={18} /> Add to quote list
                </button>
              </div>

              <div className="pinfo__note">
                <Icon name="sparkle" size={18} />
                <span>No payment online. You’ll receive drawings and a written quote within 48 hours — production only starts once you approve.</span>
              </div>

              <ul className="pinfo__perks">
                <li><Icon name="truck" size={20} /><strong>Est. delivery</strong><span>{fmtDate(from)} – {fmtDate(to)}</span></li>
                <li><Icon name="ruler" size={20} /><strong>Free measuring</strong><span>In-home visit in NCR</span></li>
                <li><Icon name="shield" size={20} /><strong>Approve first</strong><span>Drawings before we build</span></li>
              </ul>

              <Accordion items={accordion} defaultOpen={0} />
            </div>
          </div>
        </div>
      </section>

      {complete.length > 0 && (
        <section className="section--tight">
          <div className="container">
            <SectionHead eyebrow="Pairs well with" title={<>Complete <em>the room</em></>} />
            <div className="complete">
              {complete.map((x, i) => (
                <Reveal key={x.slug} delay={i * 0.06}>
                  <Link to={`/product/${x.slug}`} className="mini">
                    <span className={`mini__img ${x.cutout ? 'is-cutout' : ''}`}><img src={x.image.src} alt="" loading="lazy" /></span>
                    <span><strong>{x.name}</strong><span className="tiny muted">{getCategory(x.category)?.short} · from {formatPrice(x.priceFrom)}</span></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section--tight">
          <div className="container">
            <SectionHead eyebrow={cat.name} title={<>You may <em>also like</em></>} action={<ArrowButton to={`/shop/${cat.slug}`} variant="ghost">View all {cat.short.toLowerCase()}</ArrowButton>} />
            <div className="pgrid">{related.map((x) => <ProductCard key={x.slug} p={x} />)}</div>
          </div>
        </section>
      )}

      {recentItems.length > 0 && (
        <section className="section--tight" style={{ paddingBottom: 'var(--section)' }}>
          <div className="container">
            <SectionHead eyebrow="Recently viewed" title={<>Pick up <em>where you left off</em></>} />
            <div className="pgrid">{recentItems.map((x) => <ProductCard key={x.slug} p={x} />)}</div>
          </div>
        </section>
      )}

      <div className="sticky-buy">
        <div className="sticky-buy__info">
          <strong>{p.name}</strong>
          <span>from {formatPrice(p.priceFrom)} · {leadText(p)}</span>
        </div>
        <Link to={orderHref()} className="btn btn--sm">Customize</Link>
      </div>
    </>
  );
}
