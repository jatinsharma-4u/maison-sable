import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { site } from '../data/site';
import { categories, collections } from '../data/catalog';
import { getLenis, useGsap } from '../lib/motion';
import { submitForm } from '../lib/submit';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', msg: '' });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState({ status: 'error', msg: 'Please enter a valid email address.' });
      return;
    }
    setState({ status: 'loading', msg: '' });
    const res = await submitForm('newsletter', { email });
    if (res.ok) setState({ status: 'done', msg: 'Thank you — you’re on the list.' });
    else if (res.offline) setState({ status: 'offline', msg: 'Newsletter sign-up isn’t connected yet — your email was not sent. Please try again after launch.' });
    else setState({ status: 'error', msg: 'Something went wrong. Please try again.' });
  };
  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate>
      <label htmlFor="nl-email" className="newsletter__label">Letters from the workshop — new designs, material stories and studio events. Monthly, never more.</label>
      <div className="newsletter__row">
        <input id="nl-email" type="email" inputMode="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => { setEmail(e.target.value); setState({ status: 'idle', msg: '' }); }} aria-invalid={state.status === 'error'} aria-describedby="nl-msg" />
        <button className="btn btn--light" disabled={state.status === 'loading'}>{state.status === 'loading' ? 'Sending…' : 'Subscribe'}</button>
      </div>
      <p id="nl-msg" className={`newsletter__msg is-${state.status}`} role="status">{state.msg}</p>
    </form>
  );
}

const ribbon = ['craft-marking', 'mat-oak', 'bed-soft', 'craft-chisel', 'living-cream', 'mat-walnut', 'dining-shelves', 'craft-tools'];

export default function Footer() {
  const [curtain, setCurtain] = useState(false);
  const ref = useGsap((gsap, ST, root) => {
    gsap.fromTo('.footer__word span span', { yPercent: 105 }, { yPercent: 0, stagger: 0.035, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: '.footer__word', start: 'top 98%' } });
    gsap.fromTo('.footer__ribbon-track', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: true } });
  });
  useEffect(() => {
    // Curtain reveal only when the whole footer fits in the viewport (desktop).
    const check = () => {
      const el = ref.current;
      if (!el) return;
      setCurtain(window.innerWidth >= 900 && el.offsetHeight < window.innerHeight - 40);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [ref]);
  useEffect(() => {
    document.body.classList.toggle('has-curtain', curtain);
  }, [curtain]);
  const toTop = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className={`footer ${curtain ? 'is-curtain' : ''}`} ref={ref}>
      <div className="footer__ribbon" aria-hidden>
        <div className="footer__ribbon-track">
          {[...ribbon, ...ribbon].map((r, i) => <img key={i} src={`/img/r/${r}-sm.webp`} alt="" loading="lazy" />)}
        </div>
      </div>
      <div className="container">
        <div className="footer__top">
          <div className="footer__intro">
            <p className="footer__kicker">/Studio letters</p>
            <h2 className="footer__headline">Let’s make something <em>that lasts.</em></h2>
            <Newsletter />
          </div>
          <div className="footer__cols">
            <div>
              <h3 className="footer__h">Shop</h3>
              <ul>
                <li><Link to="/shop">All designs</Link></li>
                {categories.slice(0, 5).map((c) => <li key={c.slug}><Link to={`/shop/${c.slug}`}>{c.name}</Link></li>)}
                <li><Link to="/new-arrivals">New arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="footer__h">Rooms</h3>
              <ul>{collections.map((c) => <li key={c.slug}><Link to={`/collections/${c.slug}`}>{c.name.replace('The ', '')}</Link></li>)}</ul>
            </div>
            <div>
              <h3 className="footer__h">Studio</h3>
              <ul>
                <li><Link to="/custom-order">Custom order</Link></li>
                <li><Link to="/about">About us</Link></li>
                <li><Link to="/journal">Inspiration</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/delivery">Delivery & returns</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="footer__h">Visit</h3>
              <address className="footer__addr">
                {site.address.map((l) => <span key={l}>{l}</span>)}
                <span className="muted-dark">{site.hours}</span>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </address>
            </div>
          </div>
        </div>
        <div className="footer__word" aria-hidden>
          <span className="footer__word-a">{'Maison'.split('').map((ch, i) => <span key={i}>{ch}</span>)}</span>
          <span className="footer__word-b">{'Sable'.split('').map((ch, i) => <span key={i}>{ch}</span>)}</span>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <nav aria-label="Legal" className="footer__legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/credits">Image credits</Link>
          </nav>
          <div className="footer__social">
            <a href={site.social.instagram} aria-label="Instagram" className="icon-btn"><Icon name="instagram" size={18} /></a>
            <a href={site.social.pinterest} aria-label="Pinterest" className="icon-btn"><Icon name="pinterest" size={18} /></a>
            <a href={site.social.linkedin} aria-label="LinkedIn" className="icon-btn"><Icon name="linkedin" size={18} /></a>
          </div>
          <a className="footer__credit" href="https://www.jatinsharma4u.in" target="_blank" rel="noopener noreferrer">www.jatinsharma4u.in</a>
          <button className="footer__top-btn" onClick={toTop}>Back to top <Icon name="arrow" size={14} /></button>
        </div>
      </div>
    </footer>
  );
}
