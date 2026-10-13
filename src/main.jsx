import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/dm-sans';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/product.css';
import './styles/pages.css';
import './styles/form.css';
import App from './App';
import { StoreProvider } from './context/store';

// Dev-only screenshot QA mode: treat every observed element as in view so reveals render.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('__y')) {
  window.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { setTimeout(() => this.cb([{ isIntersecting: true, intersectionRatio: 1, target: el, boundingClientRect: el.getBoundingClientRect() }], this), 0); }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
