import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Header, { MobileTabBar } from './components/Header';
import Footer from './components/Footer';
import { QuoteDrawer, Toast } from './components/Overlays';
import { ScrollTrigger, scrollToTop, useSmoothScroll } from './lib/motion';
import { useImageReveals } from './lib/reveal';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const Product = lazy(() => import('./pages/Product'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const QuoteList = lazy(() => import('./pages/QuoteList'));
const Search = lazy(() => import('./pages/Search'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Journal = lazy(() => import('./pages/Journal'));
const Article = lazy(() => import('./pages/Article'));
const Faq = lazy(() => import('./pages/Faq'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return <div className="page-loading" role="status" aria-label="Loading page" />;
}

const page = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
};

export default function App() {
  useSmoothScroll();
  const location = useLocation();
  useImageReveals(location.pathname);

  useEffect(() => {
    // Dev-only: `?__y=1200` scrolls on load (used for automated screenshot QA).
    if (!import.meta.env.DEV) return undefined;
    const y = new URLSearchParams(window.location.search).get('__y');
    if (!y) return undefined;
    // Headless screenshots ignore scroll position, so shift the page instead.
    const root = document.getElementById('root');
    root.style.transform = `translateY(-${Number(y)}px)`;
    return () => { root.style.transform = ''; };
  }, []);

  useEffect(() => {
    // Let freshly mounted pages register their ScrollTriggers, then recalc.
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        key={`bar-${location.pathname}`}
        className="route-bar"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0, transition: { scaleX: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4, delay: 0.6 } } }}
        aria-hidden
      />
      <Header />
      <main id="main" tabIndex={-1}>
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          <motion.div key={location.pathname} variants={page} initial="initial" animate="animate" exit="exit">
            <Suspense fallback={<PageFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/product/:slug" element={<Product />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:slug" element={<CollectionDetail />} />
                <Route path="/custom-order" element={<CustomOrder />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/quote" element={<QuoteList />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/:slug" element={<Article />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/delivery" element={<Legal doc="delivery" />} />
                <Route path="/privacy" element={<Legal doc="privacy" />} />
                <Route path="/terms" element={<Legal doc="terms" />} />
                <Route path="/credits" element={<Legal doc="credits" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileTabBar />
      <a className="credit-link" href="https://www.jatinsharma4u.in" target="_blank" rel="noopener noreferrer" aria-label="Website by Jatin Sharma — www.jatinsharma4u.in">www.jatinsharma4u.in</a>
      <QuoteDrawer />
      <Toast />
    </MotionConfig>
  );
}
