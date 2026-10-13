import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { ease, Img, roomImg } from './ui';
import { site } from '../data/site';
import { categories, collections } from '../data/catalog';
import { useStore } from '../context/store';
import { getLenis, lockScroll } from '../lib/motion';
import SearchOverlay from './SearchOverlay';

const catIcons = { sofas: 'sofa', armchairs: 'armchair', dining: 'table', tables: 'table', bedroom: 'bed', storage: 'storage', office: 'desk', lighting: 'lamp', outdoor: 'chair' };

function Announcement() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % site.announcements.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="announce" role="region" aria-label="Announcements">
      <div className="container announce__inner">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease }}
          >
            {site.announcements[i]}
          </motion.p>
        </AnimatePresence>
        <Link to="/custom-order" className="announce__link">Book a free consultation <Icon name="arrow" size={13} /></Link>
      </div>
    </div>
  );
}

function ShopMega({ onNavigate }) {
  return (
    <div className="mega__grid container">
      <div className="mega__col mega__col--cats">
        <p className="eyebrow eyebrow--plain">Shop by category</p>
        <ul className="mega__cats">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop/${c.slug}`} onClick={onNavigate} className="mega__cat">
                <span className="mega__cat-thumb"><img src={c.thumb} alt="" loading="lazy" /></span>
                <span>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mega__links">
          <Link to="/shop" onClick={onNavigate} className="link-arrow">Shop all designs <Icon name="arrow" size={14} /></Link>
          <Link to="/new-arrivals" onClick={onNavigate} className="link-arrow">New arrivals <Icon name="arrow" size={14} /></Link>
        </div>
      </div>
      <Link to="/new-arrivals" onClick={onNavigate} className="mega__feature">
        <Img {...roomImg('living-round')} sizes="320px" alt="Lune curved sofa in a pale living room" />
        <span className="mega__feature-label"><small>Just landed</small>The Lune Curved Sofa</span>
      </Link>
      <Link to="/custom-order" onClick={onNavigate} className="mega__feature mega__feature--dark">
        <Img {...roomImg('craft-marking')} sizes="320px" alt="A craftsman marking a board in the workshop" />
        <span className="mega__feature-label"><small>Bespoke</small>Design your own piece</span>
      </Link>
    </div>
  );
}

function CollectionsMega({ onNavigate }) {
  return (
    <div className="mega__grid mega__grid--rooms container">
      {collections.map((c) => (
        <Link key={c.slug} to={`/collections/${c.slug}`} onClick={onNavigate} className="mega__room">
          <span className="mega__room-img"><Img {...roomImg(c.hero)} sizes="220px" alt="" /></span>
          <span className="mega__room-name">{c.name}</span>
          <span className="tiny muted">{c.summary}</span>
        </Link>
      ))}
    </div>
  );
}

const navItems = [
  { label: 'Shop', to: '/shop', mega: 'shop' },
  { label: 'Collections', to: '/collections', mega: 'collections' },
  { label: 'New In', to: '/new-arrivals' },
  { label: 'Inspiration', to: '/journal' },
  { label: 'About', to: '/about' },
];

export default function Header() {
  const { wishlist, quoteCount, setQuoteOpen } = useStore();
  const [mega, setMega] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef();
  const location = useLocation();
  const overlay = location.pathname === '/' && !scrolled && !mega;

  // Close overlays on route change
  useEffect(() => {
    setMega(null);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Sticky header: compact after scrolling; hide on scroll-down, reveal on scroll-up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 420);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    lockScroll(menuOpen || searchOpen);
    return () => lockScroll(false);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMega(null);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMega = (m) => {
    clearTimeout(closeTimer.current);
    setMega(m);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 140);
  };

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Announcement />
      <header className={`header ${overlay ? 'is-overlay' : ''} ${scrolled ? 'is-scrolled' : ''} ${hidden && !mega ? 'is-hidden' : ''} ${mega ? 'has-mega' : ''}`} onMouseLeave={scheduleClose}>
        <div className="container header__inner">
          <Link to="/" className="logo" aria-label={`${site.name} — home`}>
            <span className="logo__mark" aria-hidden>
              <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="5" fill="currentColor" /><path d="M9 21c0-3.2 3-4.8 7-4.8s7 1.6 7 4.8v2H9z" fill="var(--logo-inner)" /><rect x="11.5" y="9" width="9" height="7.6" rx="3.4" fill="var(--logo-inner)" /></svg>
            </span>
            <span className="logo__word">Maison <em>Sable</em></span>
          </Link>

          <nav className="nav" aria-label="Primary">
            <ul className="nav__list">
              {navItems.map((item) => (
                <li key={item.label} onMouseEnter={() => (item.mega ? openMega(item.mega) : scheduleClose())}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''} ${mega === item.mega && item.mega ? 'is-open' : ''}`}
                    onFocus={() => item.mega && openMega(item.mega)}
                    aria-haspopup={item.mega ? 'true' : undefined}
                    aria-expanded={item.mega ? mega === item.mega : undefined}
                  >
                    {item.label}
                    {item.mega && <Icon name="chevronDown" size={14} className="nav__chev" />}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search designs">
              <Icon name="search" />
            </button>
            <Link to="/wishlist" className="icon-btn hide-sm" aria-label={`Saved designs (${wishlist.length})`}>
              <Icon name="heart" />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>
            <button className="icon-btn" onClick={() => setQuoteOpen(true)} aria-label={`Quote list (${quoteCount} items)`}>
              <Icon name="clipboard" />
              <AnimatePresence>
                {quoteCount > 0 && (
                  <motion.span className="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={quoteCount}>
                    {quoteCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link to="/custom-order" className="btn btn--sm header__cta">Custom order</Link>
            <button className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Icon name="menu" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              className="mega"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease }}
              onMouseEnter={() => openMega(mega)}
            >
              {mega === 'shop' ? <ShopMega onNavigate={() => setMega(null)} /> : <CollectionsMega onNavigate={() => setMega(null)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>{mega && <motion.div className="mega-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMega(null)} />}</AnimatePresence>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }) {
  const [shopOpen, setShopOpen] = useState(false);
  const { wishlist } = useStore();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const links = [
    ['Collections', '/collections'],
    ['New arrivals', '/new-arrivals'],
    ['Custom order', '/custom-order'],
    ['Inspiration', '/journal'],
    ['About the studio', '/about'],
    ['Contact', '/contact'],
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mmenu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          data-lenis-prevent
        >
          <div className="mmenu__top container">
            <Link to="/" className="logo" onClick={onClose}><span className="logo__word">Maison <em>Sable</em></span></Link>
            <button className="icon-btn icon-btn--solid" onClick={onClose} aria-label="Close menu" autoFocus><Icon name="close" /></button>
          </div>
          <motion.nav
            className="mmenu__nav container"
            aria-label="Mobile"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <button className="mmenu__link" onClick={() => setShopOpen((s) => !s)} aria-expanded={shopOpen}>
                Shop <Icon name="chevronDown" size={22} className={shopOpen ? 'rot' : ''} />
              </button>
              <AnimatePresence initial={false}>
                {shopOpen && (
                  <motion.ul className="mmenu__sub" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.4, ease }}>
                    <li><Link to="/shop" onClick={onClose}><Icon name="grid" size={18} /> All designs</Link></li>
                    {categories.map((c) => (
                      <li key={c.slug}><Link to={`/shop/${c.slug}`} onClick={onClose}><Icon name={catIcons[c.slug]} size={18} /> {c.name}</Link></li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
            {links.map(([label, to]) => (
              <motion.div key={to} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <Link className="mmenu__link" to={to} onClick={onClose}>{label}</Link>
              </motion.div>
            ))}
          </motion.nav>
          <div className="mmenu__foot container">
            <Link to="/wishlist" onClick={onClose} className="chip"><Icon name="heart" size={16} /> Saved ({wishlist.length})</Link>
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="chip"><Icon name="phone" size={16} /> Call the studio</a>
            <p className="tiny muted">{site.hours}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MobileTabBar() {
  const { wishlist } = useStore();
  const items = [
    { to: '/', label: 'Home', icon: 'home', end: true },
    { to: '/shop', label: 'Shop', icon: 'grid' },
    { to: '/custom-order', label: 'Custom', icon: 'ruler', primary: true },
    { to: '/wishlist', label: 'Saved', icon: 'heart', count: wishlist.length },
    { to: '/search', label: 'Search', icon: 'search' },
  ];
  return (
    <nav className="tabbar" aria-label="Quick navigation">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) => `tabbar__item ${it.primary ? 'tabbar__item--primary' : ''} ${isActive ? 'is-active' : ''}`}
          onClick={(e) => {
            if (it.to === window.location.pathname) {
              e.preventDefault();
              const l = getLenis();
              if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <span className="tabbar__icon">
            <Icon name={it.icon} size={it.primary ? 22 : 21} />
            {it.count > 0 && <span className="badge">{it.count}</span>}
          </span>
          <span className="tabbar__label">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
