import { useEffect } from 'react';

// Editorial images that unmask as they scroll into view (styles: .media-reveal in base.css).
const SELECTOR = [
  '.shop-hero__img', '.about-hero__img', '.editorial__big', '.editorial__small', '.jlead__img', '.jcard__img',
  '.article-hero', '.testi__media', '.band__tile', '.na-feature__stage', '.gallery-strip > div',
  '.process__mobile-img', '.chero', '.roomcard', '.about-wide', '.mega-none',
].join(',');

export function useImageReveals(key) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let io;
    // Wait a beat for the incoming page (lazy chunk + transition) to mount.
    const t = setTimeout(() => {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        }),
        { rootMargin: '0px 0px -6% 0px' }
      );
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.classList.contains('is-revealed')) return;
        el.classList.add('media-reveal');
        io.observe(el);
      });
    }, 450);
    return () => { clearTimeout(t); io?.disconnect(); };
  }, [key]);
}
