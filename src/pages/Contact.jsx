import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../components/Icon';
import { Crumbs, ease, Reveal } from '../components/ui';
import { site } from '../data/site';
import { submitForm } from '../lib/submit';
import { useSeo } from '../lib/seo';

const TOPICS = ['New custom piece', 'Question about a design', 'Existing order', 'Trade & architects', 'Something else'];

export default function Contact() {
  useSeo('Contact', 'Talk to the Maison Sable studio about a custom piece, an existing order or a workshop visit.');
  const [f, setF] = useState({ name: '', email: '', phone: '', topic: TOPICS[0], message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | offline | error
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
    if (f.phone && f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number or leave it blank.';
    if (f.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 30);
      return;
    }
    setStatus('sending');
    const res = await submitForm('contact', f);
    setStatus(res.ok ? 'sent' : res.offline ? 'offline' : 'error');
  };

  const mail = `mailto:${site.email}?subject=${encodeURIComponent(`${f.topic} — ${f.name}`)}&body=${encodeURIComponent(`${f.message}\n\n${f.name}\n${f.phone}`)}`;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0, paddingBottom: 'var(--section)' }}>
        <div className="container contact-grid">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
            <h1 className="h1" style={{ marginTop: 12 }}>Let’s talk about <em>your space.</em></h1>
            <p className="lede" style={{ marginTop: 16 }}>Designs, orders or a workshop visit — we reply within one working day.</p>
            <div className="contact-cards">
              <a className="ccard" href={`tel:${site.phone.replace(/\s/g, '')}`}><span className="ccard__icon"><Icon name="phone" /></span><span><strong>{site.phone}</strong><span>{site.hours}</span></span></a>
              <a className="ccard" href={`https://wa.me/${site.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><span className="ccard__icon"><Icon name="whatsapp" /></span><span><strong>WhatsApp the studio</strong><span>Send photos and measurements anytime</span></span></a>
              <a className="ccard" href={`mailto:${site.email}`}><span className="ccard__icon"><Icon name="mail" /></span><span><strong>{site.email}</strong><span>For drawings, references and documents</span></span></a>
              <div className="ccard"><span className="ccard__icon"><Icon name="pin" /></span><span><strong>Visit by appointment</strong><span>{site.address.join(', ')}</span></span></div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="panel">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div key="sent" className="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }} style={{ padding: '24px 0' }}>
                  <div className="result__icon"><Icon name="check" size={28} /></div>
                  <h2 className="h3">Message received</h2>
                  <p className="muted">Thank you, {f.name.split(' ')[0]}. We’ll be in touch within one working day.</p>
                  <Link to="/shop" className="btn btn--ghost">Explore designs</Link>
                </motion.div>
              ) : status === 'offline' ? (
                <motion.div key="offline" className="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }} style={{ padding: '24px 0' }}>
                  <div className="result__icon"><Icon name="mail" size={28} /></div>
                  <h2 className="h3">Your message hasn’t been sent yet</h2>
                  <p className="muted">Online messaging isn’t connected on this site yet. Send the same message by email in one tap:</p>
                  <div className="result__ctas">
                    <a className="btn" href={mail}><Icon name="mail" size={18} /> Send by email</a>
                    <button className="btn btn--ghost" onClick={() => setStatus('idle')}>Edit message</button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="h3" style={{ marginBottom: 20 }}>Send a message</h2>
                  <div className="field">
                    <span className="field__label" id="topic-l">What’s it about?</span>
                    <div className="pills" role="radiogroup" aria-labelledby="topic-l">
                      {TOPICS.map((t) => <button type="button" role="radio" aria-checked={f.topic === t} key={t} className={`chip ${f.topic === t ? 'is-active' : ''}`} onClick={() => set('topic', t)}>{t}</button>)}
                    </div>
                  </div>
                  <div className="grid-2" style={{ marginTop: 24 }}>
                    <div className={`field ${errors.name ? 'has-error' : ''}`}>
                      <label className="field__label" htmlFor="c-name">Name</label>
                      <input id="c-name" className="input" autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-e' : undefined} />
                      {errors.name && <p className="field__error" id="c-name-e">{errors.name}</p>}
                    </div>
                    <div className={`field ${errors.email ? 'has-error' : ''}`}>
                      <label className="field__label" htmlFor="c-email">Email</label>
                      <input id="c-email" className="input" type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-e' : undefined} />
                      {errors.email && <p className="field__error" id="c-email-e">{errors.email}</p>}
                    </div>
                  </div>
                  <div className={`field ${errors.phone ? 'has-error' : ''}`}>
                    <label className="field__label" htmlFor="c-phone">Phone <span className="field__opt">Optional</span></label>
                    <input id="c-phone" className="input" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'c-phone-e' : undefined} />
                    {errors.phone && <p className="field__error" id="c-phone-e">{errors.phone}</p>}
                  </div>
                  <div className={`field ${errors.message ? 'has-error' : ''}`}>
                    <label className="field__label" htmlFor="c-msg">Message</label>
                    <textarea id="c-msg" className="input textarea" rows={6} value={f.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-msg-e' : undefined} maxLength={3000} />
                    {errors.message && <p className="field__error" id="c-msg-e">{errors.message}</p>}
                  </div>
                  {status === 'error' && <p className="notice notice--error" role="alert" style={{ marginTop: 16 }}><Icon name="close" size={16} /> Sending failed. Please try again or email {site.email}.</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
                    <p className="tiny muted" style={{ maxWidth: '36ch' }}>Planning a new piece? The <Link to="/custom-order" className="link-arrow" style={{ display: 'inline' }}>custom order form</Link> gets you a quote fastest.</p>
                    <button className="btn btn--lg" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <Icon name="arrow" size={16} /></button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </>
  );
}
