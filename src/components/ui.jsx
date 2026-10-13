import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

export const ease = [0.22, 1, 0.36, 1];

/** Scroll-into-view reveal (Framer Motion). */
export function Reveal({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Staggered container + item for grids. */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Responsive, lazy image with a soft fade-in once decoded. */
export function Img({ src, sm, alt, sizes = '100vw', eager = false, className = '', ...rest }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      srcSet={sm ? `${sm} 900w, ${src} 1800w` : undefined}
      sizes={sm ? sizes : undefined}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      onLoad={() => setLoaded(true)}
      className={`img-fade ${loaded ? 'is-loaded' : ''} ${className}`}
      {...rest}
    />
  );
}

export const roomImg = (name) => ({ src: `/img/r/${name}.webp`, sm: `/img/r/${name}-sm.webp` });

export function ArrowButton({ to, children, variant = '', size = '', onClick, type, ...rest }) {
  const cls = `btn ${variant ? `btn--${variant}` : ''} ${size ? `btn--${size}` : ''}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="btn__arrow" aria-hidden>
        <Icon name="arrow" size={14} stroke={1.8} />
      </span>
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  return <button type={type || 'button'} className={cls} onClick={onClick} {...rest}>{inner}</button>;
}

export function SectionHead({ eyebrow, title, text, action }) {
  return (
    <div className="section-head">
      <Reveal className="section-head__text">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="h2">{title}</h2>
        {text && <p>{text}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}

export function Crumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label} style={{ display: 'contents' }}>
          {i > 0 && <span aria-hidden>/</span>}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function Accordion({ items, defaultOpen = 0, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion ${className}`}>
      {items.map(([title, body], i) => {
        const isOpen = open === i;
        const id = `acc-${title.replace(/\W+/g, '-').toLowerCase()}`;
        return (
          <div className={`accordion__item ${isOpen ? 'is-open' : ''}`} key={title}>
            <h3>
              <button className="accordion__trigger" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{title}</span>
                <span className="accordion__icon" aria-hidden><Icon name="plus" size={18} /></span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  className="accordion__panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <div className="accordion__body">{body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function Qty({ value, onChange, label = 'Quantity', min = 1, max = 20 }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity" disabled={value <= min}>
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity" disabled={value >= max}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function EmptyState({ icon = 'sparkle', title, text, children }) {
  return (
    <div className="empty">
      <div className="empty__icon"><Icon name={icon} size={28} /></div>
      <h2 className="h3">{title}</h2>
      {text && <p className="muted">{text}</p>}
      <div className="empty__actions">{children}</div>
    </div>
  );
}
