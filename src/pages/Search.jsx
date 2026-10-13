import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import { ArrowButton, Crumbs, EmptyState } from '../components/ui';
import { categories } from '../data/catalog';
import { products } from '../data/products';
import { popularSearches, searchCategories, searchProducts } from '../lib/search';
import { useSeo } from '../lib/seo';

export default function Search() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const [value, setValue] = useState(q);
  useEffect(() => setValue(q), [q]);
  useSeo(q ? `Search: ${q}` : 'Search');

  // Live results while typing; the URL updates (debounced) so results are shareable.
  useEffect(() => {
    const t = setTimeout(() => {
      if (value.trim() !== q) setSp(value.trim() ? { q: value.trim() } : {}, { replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => searchProducts(value), [value]);
  const cats = useMemo(() => searchCategories(value), [value]);
  const popular = products.slice().sort((a, b) => a.popular - b.popular).slice(0, 4);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
          <h1 className="h1">Search</h1>
          <form className="search-page__form" role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" size={22} />
            <label htmlFor="search-page" className="sr-only">Search designs</label>
            <input id="search-page" type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Try “walnut table” or “bouclé chair”" autoFocus autoComplete="off" />
          </form>
          <div className="chips-row" style={{ marginTop: 16 }}>
            {(value ? cats.map((c) => [c.name, `/shop/${c.slug}`]) : categories.slice(0, 6).map((c) => [c.short, `/shop/${c.slug}`])).map(([l, to]) => (
              <Link key={to} to={to} className="chip chip--sm">{l}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0, paddingBottom: 'var(--section)' }}>
        <div className="container">
          {!value.trim() ? (
            <>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 12 }}>Popular searches</p>
              <div className="chips-row" style={{ marginBottom: 40 }}>
                {popularSearches.map((s) => <button key={s} className="chip" onClick={() => setValue(s)}>{s}</button>)}
              </div>
              <h2 className="h3" style={{ marginBottom: 20 }}>Most loved designs</h2>
              <div className="pgrid">{popular.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            </>
          ) : results.length ? (
            <>
              <p className="muted" style={{ marginBottom: 20 }} aria-live="polite">{results.length} {results.length === 1 ? 'result' : 'results'} for “{value}”</p>
              <div className="pgrid">{results.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            </>
          ) : (
            <EmptyState icon="search" title={`No results for “${value}”`} text="Check the spelling or try a broader word like “sofa” or “oak”. Can’t find it? We can make it.">
              <ArrowButton to="/custom-order">Describe your piece</ArrowButton>
              <Link to="/shop" className="btn btn--ghost">Browse all designs</Link>
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
