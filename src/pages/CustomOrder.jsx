import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../components/Icon';
import { Crumbs, ease, Img, roomImg } from '../components/ui';
import { optionLabel } from '../components/Overlays';
import { FABRICS, FINISHES, METALS, WOODS, getProduct, products } from '../data/products';
import { formatPrice, site } from '../data/site';
import { useStore } from '../context/store';
import { submitForm, isSubmissionConfigured } from '../lib/submit';
import { getLenis } from '../lib/motion';
import { useSeo } from '../lib/seo';

const Lottie = lazy(() => import('lottie-react'));

// ——— Furniture types and the fields each one needs
const TYPES = [
  { id: 'sofa', label: 'Sofa', icon: 'sofa', wood: true, upholstery: 'yes', dims: [228, 94, 82] },
  { id: 'armchair', label: 'Armchair', icon: 'armchair', wood: true, upholstery: 'yes', dims: [88, 84, 74] },
  { id: 'bed', label: 'Bed', icon: 'bed', wood: true, upholstery: 'optional', dims: [200, 225, 110] },
  { id: 'dining-table', label: 'Dining table', icon: 'table', wood: true, upholstery: 'no', dims: [200, 95, 75] },
  { id: 'chair', label: 'Chairs & stools', icon: 'chair', wood: true, upholstery: 'optional', dims: [50, 52, 80] },
  { id: 'wardrobe', label: 'Wardrobe', icon: 'wardrobe', wood: true, upholstery: 'no', dims: [240, 60, 240] },
  { id: 'storage', label: 'Sideboard & storage', icon: 'storage', wood: true, upholstery: 'no', dims: [180, 46, 72] },
  { id: 'desk', label: 'Desk', icon: 'desk', wood: true, upholstery: 'no', dims: [150, 70, 75] },
  { id: 'table', label: 'Coffee & side table', icon: 'table', wood: true, upholstery: 'no', dims: [120, 60, 38] },
  { id: 'other', label: 'Something else', icon: 'sparkle', wood: true, upholstery: 'optional', dims: [null, null, null] },
];
const typeFromProduct = { lighting: 'other', outdoor: 'sofa', bench: 'other' };

const SPECIFIC = {
  sofa: [
    { key: 'seats', label: 'Seating', options: ['2 seater', '3 seater', '4 seater', '5+ seater'] },
    { key: 'config', label: 'Configuration', options: ['Straight', 'L-shape / corner', 'U-shape', 'Modular sections', 'With chaise'] },
  ],
  armchair: [{ key: 'base', label: 'Base', options: ['Fixed legs', 'Swivel', 'Rocking'] }],
  bed: [
    { key: 'mattress', label: 'Mattress size', options: ['Single 90 × 190', 'Queen 152 × 198', 'King 180 × 200', 'Custom'] },
    { key: 'storage', label: 'Under-bed storage', options: ['None', 'Drawers', 'Hydraulic lift-up'] },
  ],
  'dining-table': [
    { key: 'shape', label: 'Shape', options: ['Rectangular', 'Round', 'Oval', 'Square'] },
    { key: 'seating', label: 'Seats', options: ['4', '6', '8', '10–12'] },
  ],
  chair: [{ key: 'kind', label: 'Type', options: ['Dining chair', 'Bar / counter stool', 'Desk chair'] }],
  wardrobe: [
    { key: 'doors', label: 'Doors', options: ['Hinged', 'Sliding', 'Open / walk-in', 'Not sure'] },
    { key: 'interior', label: 'Interior priority', options: ['Mostly hanging', 'Mostly drawers & shelves', 'Balanced'] },
  ],
  storage: [{ key: 'use', label: 'Main use', options: ['Dining sideboard', 'TV / media unit', 'Bookcase', 'Chest of drawers'] }],
  desk: [{ key: 'height', label: 'Working height', options: ['Sitting', 'Standing', 'Adjustable'] }],
  table: [{ key: 'shape', label: 'Shape', options: ['Rectangular', 'Round', 'Oval', 'Organic'] }],
};

const BUDGETS = ['Under ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,00,000', '₹2,00,000 – ₹4,00,000', 'Above ₹4,00,000', 'Not sure yet'];
const TIMELINES = ['As soon as possible', 'Within 2 months', '2–4 months', 'Flexible'];
const STEPS = ['Piece', 'Size', 'Materials', 'Details', 'Contact', 'Review'];
const MAX_FILES = 6;
const MAX_MB = 8;
const DRAFT_KEY = 'ms:order-draft';

const blank = {
  type: '', refMode: 'none', productSlug: '', quoteItems: [],
  w: '', d: '', h: '', qty: 1, measureVisit: false, specific: {},
  wood: '', finish: 'oil', upholstered: true, fabric: '', fabricNote: '', metal: '',
  details: '', budget: '', timeline: '', city: '', pincode: '',
  name: '', phone: '', email: '', contactPref: 'whatsapp', consent: false,
};

const readDraft = () => {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { return null; }
};

function Field({ id, label, hint, error, optional, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">{label}{optional && <span className="field__opt">Optional</span>}</label>
      {children}
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="field__error" id={`${id}-err`} role="alert">{error}</motion.p>}</AnimatePresence>
    </div>
  );
}

function ChoicePills({ name, options, value, onChange }) {
  return (
    <div className="pills" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} className={`chip ${value === o ? 'is-active' : ''}`} onClick={() => onChange(value === o ? '' : o)}>{o}</button>
      ))}
    </div>
  );
}

function Swatches({ label, list, value, onChange, error }) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <div className="mat-grid" role="radiogroup" aria-label={label}>
        {list.map((o) => (
          <button type="button" key={o.id} role="radio" aria-checked={value === o.id} className={`mat ${value === o.id ? 'is-active' : ''}`} onClick={() => onChange(o.id)}>
            <span className="mat__dot" style={{ background: o.hex }} />
            <span>{o.name}</span>
            {value === o.id && <Icon name="check" size={16} className="mat__check" />}
          </button>
        ))}
      </div>
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}

function Uploader({ files, setFiles }) {
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef(null);
  const previews = useMemo(() => files.map((f) => ({ f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const add = (list) => {
    const incoming = Array.from(list);
    const ok = [];
    const problems = [];
    incoming.forEach((f) => {
      if (!/^image\/(jpeg|png|webp|heic|heif|gif)$/i.test(f.type) && !/\.(heic|heif)$/i.test(f.name)) problems.push(`${f.name}: not an image`);
      else if (f.size > MAX_MB * 1024 * 1024) problems.push(`${f.name}: larger than ${MAX_MB} MB`);
      else ok.push(f);
    });
    const room = MAX_FILES - files.length;
    if (ok.length > room) problems.push(`Only ${MAX_FILES} images allowed`);
    setFiles([...files, ...ok.slice(0, Math.max(0, room))]);
    setErr(problems.join(' · '));
  };

  return (
    <div className="field">
      <span className="field__label">Reference images <span className="field__opt">Optional</span></span>
      <div
        className={`dropzone ${drag ? 'is-drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
      >
        <input ref={inputRef} id="ref-files" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
        <span className="dropzone__icon"><Icon name="upload" size={22} /></span>
        <p><strong>Add photos</strong> of furniture you love, your room, or a sketch</p>
        <p className="tiny muted">JPG, PNG, WEBP or HEIC · up to {MAX_FILES} images · {MAX_MB} MB each</p>
        <div className="dropzone__btns">
          <label htmlFor="ref-files" className="btn btn--sm btn--ghost"><Icon name="image" size={16} /> Choose images</label>
        </div>
      </div>
      {err && <p className="field__error" role="alert">{err}</p>}
      {previews.length > 0 && (
        <ul className="thumbs">
          <AnimatePresence>
            {previews.map(({ f, url }, i) => (
              <motion.li key={f.name + f.size + f.lastModified} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <img src={url} alt={`Reference ${i + 1}: ${f.name}`} />
                <button type="button" onClick={() => setFiles(files.filter((x) => x !== f))} aria-label={`Remove ${f.name}`}><Icon name="close" size={14} /></button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function ProductPicker({ type, value, onChange }) {
  const list = products.filter((p) => !type || type === 'other' || p.type === type || (typeFromProduct[p.type] === type));
  return (
    <div className="picker" role="radiogroup" aria-label="Choose a design">
      {list.map((p) => (
        <button key={p.slug} type="button" role="radio" aria-checked={value === p.slug} className={`picker__item ${value === p.slug ? 'is-active' : ''}`} onClick={() => onChange(value === p.slug ? '' : p.slug)}>
          <span className={`picker__img ${p.cutout ? 'is-cutout' : ''}`}><img src={p.image.src} alt="" loading="lazy" /></span>
          <span className="picker__name">{p.name}</span>
          <span className="tiny muted">from {formatPrice(p.priceFrom)}</span>
          {value === p.slug && <span className="picker__check"><Icon name="check" size={14} /></span>}
        </button>
      ))}
    </div>
  );
}

const buildSummary = (form, type, product) => {
  const lines = [
    `Furniture: ${type?.label || '—'}`,
    product ? `Design: ${product.name}` : form.refMode === 'upload' ? 'Design: own reference images' : 'Design: open brief',
    ...(form.quoteItems.length ? ['Quote list:', ...form.quoteItems.map((i) => `  • ${i.qty} × ${getProduct(i.slug)?.name} (${optionLabel(i.options) || 'standard'})`)] : []),
    form.measureVisit ? 'Size: please measure on site' : `Size: ${form.w || '?'} × ${form.d || '?'} × ${form.h || '?'} cm`,
    `Quantity: ${form.qty}`,
    ...Object.entries(form.specific).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    form.wood && `Timber: ${WOODS.find((w) => w.id === form.wood)?.name}`,
    form.finish && `Finish: ${FINISHES.find((f) => f.id === form.finish)?.name}`,
    form.upholstered && form.fabric && `Upholstery: ${FABRICS.find((f) => f.id === form.fabric)?.name}${form.fabricNote ? ` (${form.fabricNote})` : ''}`,
    form.metal && `Metal: ${METALS.find((m) => m.id === form.metal)?.name}`,
    form.details && `Notes: ${form.details}`,
    form.budget && `Budget: ${form.budget}`,
    form.timeline && `Timeline: ${form.timeline}`,
    `Location: ${form.city}${form.pincode ? ` ${form.pincode}` : ''}`,
    `Name: ${form.name}`, `Phone: ${form.phone}`, `Email: ${form.email}`, `Preferred contact: ${form.contactPref}`,
  ];
  return lines.filter(Boolean).join('\n');
};

export default function CustomOrder() {
  useSeo('Custom furniture order', 'Tell us about the piece you want made — type, size, materials and budget — and receive drawings and a quote within 48 hours.');
  const [sp] = useSearchParams();
  const { quote, clearQuote } = useStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({ state: 'idle' }); // idle | sending | sent | offline | error
  const [restored, setRestored] = useState(false);
  const topRef = useRef(null);

  const [form, setForm] = useState(() => {
    const draft = readDraft();
    const slug = sp.get('product');
    const p = slug && getProduct(slug);
    const fromQuote = sp.get('from') === 'quote' && quote.length > 0;
    if (!p && !fromQuote) {
      if (draft) return { ...blank, ...draft, consent: false };
      return blank;
    }
    const base = { ...blank };
    if (p) {
      const type = TYPES.find((t) => t.id === (typeFromProduct[p.type] || p.type)) || TYPES[TYPES.length - 1];
      Object.assign(base, {
        type: type.id, refMode: 'catalog', productSlug: p.slug,
        wood: sp.get('wood') || p.woods?.[0] || '', fabric: sp.get('fabric') || p.fabrics?.[0] || '',
        finish: sp.get('finish') || 'oil', metal: sp.get('metal') || p.metals?.[0] || '',
        upholstered: (p.fabrics || []).length > 0 || type.upholstery === 'yes',
        qty: Math.max(1, Math.min(50, Number(sp.get('qty')) || 1)),
      });
      if (sp.get('size') !== 'custom') Object.assign(base, { w: String(p.dims.w), d: String(p.dims.d), h: String(p.dims.h) });
    }
    if (fromQuote) {
      const first = getProduct(quote[0].slug);
      base.quoteItems = quote;
      base.refMode = 'catalog';
      if (!base.type && first) base.type = TYPES.find((t) => t.id === (typeFromProduct[first.type] || first.type))?.id || 'other';
      if (!base.productSlug && first) base.productSlug = first.slug;
    }
    return base;
  });

  useEffect(() => {
    if (readDraft() && !sp.get('product') && sp.get('from') !== 'quote') setRestored(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status.state === 'sent') return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, consent: false })); } catch { /* ignore */ }
  }, [form, status.state]);

  const type = TYPES.find((t) => t.id === form.type);
  const product = form.productSlug ? getProduct(form.productSlug) : null;
  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => { const n = { ...e }; Object.keys(patch).forEach((k) => delete n[k]); return n; });
  };
  const showUpholstery = type && (type.upholstery === 'yes' || (type.upholstery === 'optional' && form.upholstered));
  const woodOptions = product?.woods?.length ? WOODS.filter((w) => product.woods.includes(w.id)).concat(WOODS.filter((w) => !product.woods.includes(w.id))) : WOODS;

  const pickType = (id) => {
    const t = TYPES.find((x) => x.id === id);
    const patch = { type: id, specific: {} };
    if (!form.w && !form.d && !form.h && t.dims[0]) Object.assign(patch, { w: String(t.dims[0]), d: String(t.dims[1]), h: String(t.dims[2]) });
    if (t.upholstery === 'yes') patch.upholstered = true;
    if (t.upholstery === 'no') patch.upholstered = false;
    if (product && product.type !== id && typeFromProduct[product.type] !== id) patch.productSlug = '';
    set(patch);
  };

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.type) e.type = 'Please choose the type of furniture.';
      if (form.refMode === 'catalog' && !form.productSlug && !form.quoteItems.length) e.productSlug = 'Pick a design, or choose another option above.';
    }
    if (s === 1) {
      if (!form.measureVisit) {
        ['w', 'd', 'h'].forEach((k) => {
          const v = Number(form[k]);
          if (!form[k]) e[k] = 'Required';
          else if (!Number.isFinite(v) || v < 10 || v > 600) e[k] = '10–600 cm';
        });
      }
      if (!(form.qty >= 1 && form.qty <= 50)) e.qty = 'Between 1 and 50';
    }
    if (s === 2) {
      if (type?.wood && !form.wood) e.wood = 'Choose a timber (you can change it later).';
      if (showUpholstery && !form.fabric) e.fabric = 'Choose an upholstery family.';
    }
    if (s === 3) {
      if (!form.city.trim()) e.city = 'Tell us where the piece will be delivered.';
      if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'PIN code should be 6 digits.';
      if (form.details.length > 2000) e.details = 'Please keep this under 2000 characters.';
    }
    if (s === 4) {
      if (form.name.trim().length < 2) e.name = 'Please enter your name.';
      const digits = form.phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) e.phone = 'Enter a valid phone number (10 digits, with or without +91).';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    }
    if (s === 5 && !form.consent) e.consent = 'Please confirm so we can contact you about this request.';
    setErrors(e);
    if (Object.keys(e).length) {
      setTimeout(() => document.querySelector('.has-error input, .has-error textarea, .field__error')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
      return false;
    }
    return true;
  };

  const scrollTop = () => {
    const el = topRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > y) { const l = getLenis(); if (l) l.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' }); }
  };
  const next = () => { if (validate(step)) { setDir(1); setStep((s) => Math.min(STEPS.length - 1, s + 1)); scrollTop(); } };
  const back = () => { setDir(-1); setErrors({}); setStep((s) => Math.max(0, s - 1)); scrollTop(); };
  const goto = (i) => { setDir(i > step ? 1 : -1); setErrors({}); setStep(i); scrollTop(); };

  const reference = useMemo(() => `MS-${Date.now().toString(36).slice(-6).toUpperCase()}`, [status.state === 'sent' || status.state === 'offline']); // eslint-disable-line react-hooks/exhaustive-deps
  const summary = buildSummary(form, type, product);

  const submit = async () => {
    if (!validate(5)) return;
    setStatus({ state: 'sending' });
    const payload = { ...form, typeLabel: type?.label, productName: product?.name || '', summary, fileCount: files.length };
    const res = await submitForm('custom-order', payload, files);
    if (res.ok) {
      setStatus({ state: 'sent' });
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      if (form.quoteItems.length) clearQuote();
    } else if (res.offline) {
      setStatus({ state: 'offline' });
    } else {
      setStatus({ state: 'error', message: res.error });
    }
    scrollTop();
  };

  const startOver = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setForm(blank); setFiles([]); setStep(0); setStatus({ state: 'idle' }); setRestored(false); setErrors({});
  };

  // ——— Result screens
  if (status.state === 'sent' || status.state === 'offline') {
    const sent = status.state === 'sent';
    const mail = `mailto:${site.email}?subject=${encodeURIComponent(`Custom furniture request — ${type?.label || ''}`)}&body=${encodeURIComponent(summary)}`;
    const wa = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Maison Sable, I'd like a quote:\n\n${summary}`)}`;
    return (
      <section className="section" ref={topRef}>
        <div className="container container--narrow">
          <motion.div className="result panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            {sent ? (
              <>
                <div className="result__anim" aria-hidden>
                  <Suspense fallback={<div style={{ height: 140 }} />}>
                    <SuccessAnimation />
                  </Suspense>
                </div>
                <span className="eyebrow eyebrow--plain">Reference {reference}</span>
                <h1 className="h2">Thank you, {form.name.split(' ')[0]}. <em>We’ve received your request.</em></h1>
                <p className="lede">A designer will review your brief and reply within 48 hours by {form.contactPref === 'email' ? 'email' : form.contactPref === 'phone' ? 'phone' : 'WhatsApp'} with initial drawings and a quote. Nothing is charged until you approve the design.</p>
                <ol className="result__next">
                  <li><strong>Within 48 hours</strong><span>Drawings, material suggestions and your quote</span></li>
                  <li><strong>Optional visit</strong><span>On-site measuring and sample viewing</span></li>
                  <li><strong>Approve & build</strong><span>Production starts after your sign-off</span></li>
                </ol>
              </>
            ) : (
              <>
                <div className="result__icon"><Icon name="mail" size={28} /></div>
                <span className="eyebrow eyebrow--plain">Not sent yet</span>
                <h1 className="h2">Your request is ready — <em>please send it to us directly.</em></h1>
                <p className="lede">Online submission isn’t connected on this site yet, so your request has <strong>not</strong> been sent. Your details are saved on this device. Send them in one tap by email or WhatsApp{files.length ? ', and attach your reference images there' : ''}:</p>
                <div className="result__ctas">
                  <a className="btn btn--lg" href={mail}><Icon name="mail" size={18} /> Send by email</a>
                  <a className="btn btn--ghost btn--lg" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={18} /> Send on WhatsApp</a>
                </div>
                <details className="result__summary">
                  <summary>View request summary</summary>
                  <pre>{summary}</pre>
                </details>
                <p className="tiny muted">Site owner: set <code>VITE_FORM_ENDPOINT</code> to a form backend to receive requests directly (see README).</p>
              </>
            )}
            <div className="result__ctas">
              <Link to="/shop" className="btn btn--ghost">Keep exploring</Link>
              <button className="link-arrow" onClick={startOver}>Start a new request <Icon name="arrow" size={14} /></button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero order-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Custom order' }]} />
          <div className="order-hero__grid">
            <div className="page-hero__inner">
              <span className="eyebrow">Custom order · about 4 minutes</span>
              <h1 className="h1">Tell us about <em>your piece.</em></h1>
              <p className="lede">Drawings and a clear quote within 48 hours. No obligation.</p>
            </div>
            <ul className="order-hero__trust">
              <li><Icon name="clock" size={18} /> <span>Reply within <b>48 hours</b></span></li>
              <li><Icon name="shield" size={18} /> <span>Approve drawings <b>before we build</b></span></li>
              <li><Icon name="ruler" size={18} /> <span>Free measuring <b>visit in NCR</b></span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0, paddingBottom: 'var(--section)' }}>
        <div className="container order" ref={topRef}>
          <aside className="order__side">
            <ol className="stepper" aria-label="Progress">
              {STEPS.map((s, i) => (
                <li key={s} className={`stepper__item ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
                  <button type="button" onClick={() => i < step && goto(i)} disabled={i >= step} aria-current={i === step ? 'step' : undefined}>
                    <span className="stepper__dot">{i < step ? <Icon name="check" size={12} stroke={2.4} /> : i + 1}</span>
                    <span className="stepper__label">{s}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="order__progress" aria-hidden><motion.span animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.5, ease }} /></div>
            <p className="order__mstep" aria-live="polite">Step {step + 1} of {STEPS.length} · <strong>{STEPS[step]}</strong></p>
            {(product || type) && (
              <div className="order__card">
                {product ? (
                  <>
                    <span className={`order__card-img ${product.cutout ? 'is-cutout' : ''}`}><img src={product.image.src} alt="" /></span>
                    <span><small className="muted">Starting from</small><strong>{product.name}</strong><span className="tiny muted">from {formatPrice(product.priceFrom)}</span></span>
                  </>
                ) : (
                  <>
                    <span className="order__card-img"><Icon name={type.icon} size={28} /></span>
                    <span><small className="muted">Your piece</small><strong>{type.label}</strong><span className="tiny muted">Bespoke design</span></span>
                  </>
                )}
              </div>
            )}
            <div className="order__help">
              <Img {...roomImg('craft-tools')} alt="" sizes="300px" />
              <div>
                <strong>Prefer to talk?</strong>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                <span className="tiny">{site.hours}</span>
              </div>
            </div>
          </aside>

          <div className="order__main">
            {restored && step === 0 && (
              <div className="notice">
                <Icon name="sparkle" size={16} /> We restored your saved draft.
                <button className="clear-btn" onClick={startOver}>Start fresh</button>
              </div>
            )}
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                variants={{ enter: (d) => ({ opacity: 0, x: d * 40 }), center: { opacity: 1, x: 0 }, exit: (d) => ({ opacity: 0, x: d * -40 }) }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
                className="ostep"
              >
                {step === 0 && (
                  <>
                    <header className="ostep__head"><h2 className="h3">What would you like made?</h2><p className="muted">Choose the closest type — you can describe the details later.</p></header>
                    <div className="field">
                      <span className="field__label" id="type-label">Furniture type</span>
                      <div className="type-grid" role="radiogroup" aria-labelledby="type-label">
                        {TYPES.map((t) => (
                          <button key={t.id} type="button" role="radio" aria-checked={form.type === t.id} className={`type ${form.type === t.id ? 'is-active' : ''}`} onClick={() => pickType(t.id)}>
                            <Icon name={t.icon} size={28} stroke={1.3} />
                            <span>{t.label}</span>
                          </button>
                        ))}
                      </div>
                      {errors.type && <p className="field__error" role="alert">{errors.type}</p>}
                    </div>

                    {form.quoteItems.length > 0 && (
                      <div className="field">
                        <span className="field__label">From your quote list</span>
                        <ul className="qlist-mini">
                          {form.quoteItems.map((i) => {
                            const p = getProduct(i.slug);
                            return p && <li key={i.key}><span className={`qitem__img ${p.cutout ? 'is-cutout' : ''}`}><img src={p.image.src} alt="" /></span><span><strong>{i.qty} × {p.name}</strong><span className="tiny muted">{optionLabel(i.options) || 'Standard specification'}</span></span></li>;
                          })}
                        </ul>
                      </div>
                    )}

                    <div className="field">
                      <span className="field__label">Design reference</span>
                      <div className="seg" role="radiogroup" aria-label="Design reference">
                        {[['catalog', 'Start from one of your designs'], ['upload', 'I have my own reference'], ['none', 'I’m open to ideas']].map(([v, l]) => (
                          <button key={v} type="button" role="radio" aria-checked={form.refMode === v} className={`seg__btn ${form.refMode === v ? 'is-active' : ''}`} onClick={() => set({ refMode: v })}>{l}</button>
                        ))}
                      </div>
                    </div>
                    {form.refMode === 'catalog' && (
                      <div className="field">
                        <span className="field__label">Choose a design {type && <span className="field__opt">{type.label}</span>}</span>
                        <ProductPicker type={form.type} value={form.productSlug} onChange={(slug) => {
                          const p = getProduct(slug);
                          const patch = { productSlug: slug };
                          if (p) Object.assign(patch, { w: String(p.dims.w), d: String(p.dims.d), h: String(p.dims.h), wood: p.woods?.[0] || form.wood, fabric: p.fabrics?.[0] || form.fabric, metal: p.metals?.[0] || '' });
                          set(patch);
                        }} />
                        {errors.productSlug && <p className="field__error" role="alert">{errors.productSlug}</p>}
                      </div>
                    )}
                    {(form.refMode === 'upload' || form.refMode === 'catalog') && <Uploader files={files} setFiles={setFiles} />}
                    {form.refMode === 'none' && <p className="notice notice--soft"><Icon name="sparkle" size={16} /> Perfect — our designers will propose two or three directions based on your room and preferences.</p>}
                  </>
                )}

                {step === 1 && (
                  <>
                    <header className="ostep__head"><h2 className="h3">Size & quantity</h2><p className="muted">Approximate is fine — we confirm every measurement before building.</p></header>
                    <div className="dims-row">
                      {[['w', 'Width / length'], ['d', 'Depth'], ['h', 'Height']].map(([k, l]) => (
                        <Field key={k} id={`dim-${k}`} label={l} error={errors[k]}>
                          <div className="input-unit">
                            <input id={`dim-${k}`} className="input" type="number" inputMode="numeric" min="10" max="600" value={form[k]} disabled={form.measureVisit}
                              onChange={(e) => set({ [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `dim-${k}-err` : undefined} placeholder="—" />
                            <span>cm</span>
                          </div>
                        </Field>
                      ))}
                    </div>
                    {product && !form.measureVisit && <p className="tiny muted">Standard {product.name}: {product.dims.w} × {product.dims.d} × {product.dims.h} cm.</p>}
                    <label className="check check--card">
                      <input type="checkbox" checked={form.measureVisit} onChange={(e) => set({ measureVisit: e.target.checked, w: e.target.checked ? '' : form.w, d: e.target.checked ? '' : form.d, h: e.target.checked ? '' : form.h })} />
                      <span><strong>Not sure? Measure for me.</strong><span className="tiny muted">We’ll schedule a free in-home measuring visit (NCR) or a video call elsewhere.</span></span>
                    </label>
                    <Field id="qty" label="Quantity" error={errors.qty}>
                      <div className="qty qty--lg">
                        <button type="button" onClick={() => set({ qty: Math.max(1, form.qty - 1) })} aria-label="Decrease quantity" disabled={form.qty <= 1}><Icon name="minus" size={16} /></button>
                        <input id="qty" type="number" min="1" max="50" value={form.qty} onChange={(e) => set({ qty: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })} />
                        <button type="button" onClick={() => set({ qty: Math.min(50, form.qty + 1) })} aria-label="Increase quantity" disabled={form.qty >= 50}><Icon name="plus" size={16} /></button>
                      </div>
                    </Field>
                    {(SPECIFIC[form.type] || []).map((s) => (
                      <div className="field" key={s.key}>
                        <span className="field__label">{s.label} <span className="field__opt">Optional</span></span>
                        <ChoicePills name={s.label} options={s.options} value={form.specific[s.key] || ''} onChange={(v) => set({ specific: { ...form.specific, [s.key]: v } })} />
                      </div>
                    ))}
                  </>
                )}

                {step === 2 && (
                  <>
                    <header className="ostep__head"><h2 className="h3">Materials & finish</h2><p className="muted">Choose a direction — we’ll send physical samples before anything is cut.</p></header>
                    {type?.wood && <Swatches label="Timber" list={woodOptions} value={form.wood} onChange={(v) => set({ wood: v })} error={errors.wood} />}
                    {type?.wood && (
                      <div className="field">
                        <span className="field__label">Finish</span>
                        <div className="mat-grid mat-grid--2" role="radiogroup" aria-label="Finish">
                          {FINISHES.map((f) => (
                            <button type="button" key={f.id} role="radio" aria-checked={form.finish === f.id} className={`mat ${form.finish === f.id ? 'is-active' : ''}`} onClick={() => set({ finish: f.id })}>
                              <span><strong>{f.name}</strong><small className="muted">{f.note}</small></span>
                              {form.finish === f.id && <Icon name="check" size={16} className="mat__check" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {type?.upholstery === 'optional' && (
                      <label className="switch switch--card">
                        <span><strong>Upholstered</strong><span className="tiny muted">Add padding and fabric (seat, headboard or panels)</span></span>
                        <input type="checkbox" checked={form.upholstered} onChange={(e) => set({ upholstered: e.target.checked })} />
                      </label>
                    )}
                    <AnimatePresence initial={false}>
                      {showUpholstery && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: 'hidden' }}>
                          <Swatches label="Upholstery" list={FABRICS} value={form.fabric} onChange={(v) => set({ fabric: v })} error={errors.fabric} />
                          <Field id="fabric-note" label="Fabric colour or notes" optional hint="E.g. “warm oatmeal”, “performance fabric — we have a dog”.">
                            <input id="fabric-note" className="input" value={form.fabricNote} onChange={(e) => set({ fabricNote: e.target.value })} maxLength={140} />
                          </Field>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {product?.metals?.length > 0 && (
                      <Swatches label="Metal finish" list={METALS.filter((m) => product.metals.includes(m.id))} value={form.metal} onChange={(v) => set({ metal: v })} />
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <header className="ostep__head"><h2 className="h3">Details, budget & delivery</h2><p className="muted">Anything that helps us design the right piece.</p></header>
                    <Field id="details" label="Special requirements or changes" optional hint="Design changes, storage needs, who will use it, room constraints, stairs or lifts…" error={errors.details}>
                      <textarea id="details" className="input textarea" rows={5} value={form.details} onChange={(e) => set({ details: e.target.value })} maxLength={2000} />
                      <span className="counter tiny muted">{form.details.length}/2000</span>
                    </Field>
                    <div className="field">
                      <span className="field__label">Budget range <span className="field__opt">Optional</span></span>
                      <ChoicePills name="Budget range" options={BUDGETS} value={form.budget} onChange={(v) => set({ budget: v })} />
                    </div>
                    <div className="field">
                      <span className="field__label">Preferred timeline <span className="field__opt">Optional</span></span>
                      <ChoicePills name="Preferred timeline" options={TIMELINES} value={form.timeline} onChange={(v) => set({ timeline: v })} />
                    </div>
                    <div className="grid-2">
                      <Field id="city" label="Delivery city" error={errors.city}>
                        <input id="city" className="input" autoComplete="address-level2" value={form.city} onChange={(e) => set({ city: e.target.value })} aria-invalid={!!errors.city} aria-describedby={errors.city ? 'city-err' : undefined} />
                      </Field>
                      <Field id="pincode" label="PIN code" optional error={errors.pincode}>
                        <input id="pincode" className="input" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.pincode} onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '') })} aria-invalid={!!errors.pincode} />
                      </Field>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <header className="ostep__head"><h2 className="h3">How can we reach you?</h2><p className="muted">We only use these details to respond to this request.</p></header>
                    <Field id="name" label="Full name" error={errors.name}>
                      <input id="name" className="input" autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
                    </Field>
                    <div className="grid-2">
                      <Field id="phone" label="Phone" error={errors.phone}>
                        <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" value={form.phone} onChange={(e) => set({ phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-err' : undefined} />
                      </Field>
                      <Field id="email" label="Email" error={errors.email}>
                        <input id="email" className="input" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
                      </Field>
                    </div>
                    <div className="field">
                      <span className="field__label">Preferred way to talk</span>
                      <div className="seg" role="radiogroup" aria-label="Preferred contact method">
                        {[['whatsapp', 'WhatsApp'], ['phone', 'Phone call'], ['email', 'Email']].map(([v, l]) => (
                          <button key={v} type="button" role="radio" aria-checked={form.contactPref === v} className={`seg__btn ${form.contactPref === v ? 'is-active' : ''}`} onClick={() => set({ contactPref: v })}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <header className="ostep__head"><h2 className="h3">Review your request</h2><p className="muted">Check everything looks right. You can edit any section.</p></header>
                    <div className="review">
                      {[
                        [0, 'Piece', [type?.label, product ? `Based on ${product.name}` : form.refMode === 'upload' ? 'Own reference' : 'Open to ideas', files.length ? `${files.length} reference image${files.length > 1 ? 's' : ''}` : null, form.quoteItems.length ? `${form.quoteItems.length} designs from quote list` : null]],
                        [1, 'Size', [form.measureVisit ? 'Measuring visit requested' : `${form.w} × ${form.d} × ${form.h} cm`, `Quantity: ${form.qty}`, ...Object.values(form.specific).filter(Boolean)]],
                        [2, 'Materials', [form.wood && WOODS.find((w) => w.id === form.wood)?.name, form.finish && type?.wood && FINISHES.find((f) => f.id === form.finish)?.name, showUpholstery && form.fabric && FABRICS.find((f) => f.id === form.fabric)?.name, form.fabricNote, form.metal && METALS.find((m) => m.id === form.metal)?.name]],
                        [3, 'Details', [form.details && `“${form.details.slice(0, 140)}${form.details.length > 140 ? '…' : ''}”`, form.budget && `Budget: ${form.budget}`, form.timeline && `Timeline: ${form.timeline}`, `${form.city}${form.pincode ? `, ${form.pincode}` : ''}`]],
                        [4, 'Contact', [form.name, form.phone, form.email, `Prefers ${form.contactPref}`]],
                      ].map(([i, title, vals]) => (
                        <div className="review__row" key={title}>
                          <div><span className="review__title">{title}</span><p>{vals.filter(Boolean).join(' · ')}</p></div>
                          <button type="button" className="chip chip--sm" onClick={() => goto(i)} aria-label={`Edit ${title}`}><Icon name="edit" size={14} /> Edit</button>
                        </div>
                      ))}
                    </div>
                    <label className={`check check--card ${errors.consent ? 'has-error' : ''}`}>
                      <input type="checkbox" checked={form.consent} onChange={(e) => set({ consent: e.target.checked })} aria-invalid={!!errors.consent} />
                      <span>I agree to be contacted about this request and accept the <Link to="/privacy" className="link-arrow" style={{ display: 'inline' }}>privacy policy</Link>.</span>
                    </label>
                    {errors.consent && <p className="field__error" role="alert">{errors.consent}</p>}
                    {!isSubmissionConfigured() && (
                      <p className="notice notice--soft"><Icon name="mail" size={16} /> Online sending isn’t connected yet — after you continue, you’ll be able to send this request by email or WhatsApp.</p>
                    )}
                    {status.state === 'error' && (
                      <p className="notice notice--error" role="alert"><Icon name="close" size={16} /> We couldn’t send your request ({status.message}). Please try again, or call us on {site.phone}.</p>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="order__nav">
              {step > 0 ? <button type="button" className="btn btn--ghost" onClick={back}><Icon name="arrowLeft" size={16} /> Back</button> : <span />}
              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn--lg" onClick={next}>Continue <Icon name="arrow" size={16} /></button>
              ) : (
                <button type="button" className="btn btn--lg btn--clay" onClick={submit} disabled={status.state === 'sending'} aria-busy={status.state === 'sending'}>
                  {status.state === 'sending' ? <><span className="spinner" aria-hidden /> Sending…</> : isSubmissionConfigured() ? <>Submit request <Icon name="arrow" size={16} /></> : <>Prepare my request <Icon name="arrow" size={16} /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SuccessAnimation() {
  const [data, setData] = useState(null);
  useEffect(() => { import('../lib/successLottie').then((m) => setData(m.default)); }, []);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!data) return <div style={{ height: 140 }} />;
  return <Lottie animationData={data} loop={false} autoplay={!reduced} initialSegment={reduced ? [99, 100] : undefined} style={{ width: 140, height: 140 }} />;
}
