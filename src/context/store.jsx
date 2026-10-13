import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const StoreContext = createContext(null);

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — state still works in memory */
  }
};

function usePersistent(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  useEffect(() => write(key, value), [key, value]);
  return [value, setValue];
}

export function StoreProvider({ children }) {
  const [wishlist, setWishlist] = usePersistent('ms:wishlist', []);
  // Quote list: designs a customer wants to discuss in a single inquiry.
  // Each entry: { key, slug, options: { wood, fabric, finish, size }, qty }
  const [quote, setQuote] = usePersistent('ms:quote', []);
  const [recent, setRecent] = usePersistent('ms:recent', []);
  const [toast, setToast] = useState(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const toastTimer = useRef();

  const notify = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const isWished = useCallback((slug) => wishlist.includes(slug), [wishlist]);
  const toggleWish = useCallback(
    (slug, name) => {
      const has = wishlist.includes(slug);
      setWishlist((w) => (has ? w.filter((s) => s !== slug) : [slug, ...w.filter((s) => s !== slug)]));
      notify(has ? `${name || 'Item'} removed from saved` : `${name || 'Item'} saved`, has ? null : { label: 'View saved', to: '/wishlist' });
    },
    [wishlist, setWishlist, notify]
  );

  const addToQuote = useCallback(
    (slug, options = {}, qty = 1, name) => {
      const key = `${slug}|${options.wood || ''}|${options.fabric || ''}|${options.finish || ''}|${options.size || ''}`;
      setQuote((q) => {
        const existing = q.find((i) => i.key === key);
        if (existing) return q.map((i) => (i.key === key ? { ...i, qty: Math.min(20, i.qty + qty) } : i));
        return [...q, { key, slug, options, qty }];
      });
      notify(`${name || 'Design'} added to your quote list`);
      setQuoteOpen(true);
    },
    [setQuote, notify]
  );
  const addManyToQuote = useCallback(
    (slugs, label) => {
      setQuote((q) => {
        const next = [...q];
        slugs.forEach((slug) => {
          const key = `${slug}||||`;
          if (!next.some((i) => i.key === key)) next.push({ key, slug, options: {}, qty: 1 });
        });
        return next;
      });
      notify(`${label} added to your quote list`);
      setQuoteOpen(true);
    },
    [setQuote, notify]
  );
  const updateQuoteQty = useCallback((key, qty) => setQuote((q) => q.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i))), [setQuote]);
  const removeFromQuote = useCallback((key) => setQuote((q) => q.filter((i) => i.key !== key)), [setQuote]);
  const clearQuote = useCallback(() => setQuote([]), [setQuote]);

  const pushRecent = useCallback((slug) => setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 8)), [setRecent]);

  const value = useMemo(
    () => ({
      wishlist, isWished, toggleWish,
      quote, addToQuote, addManyToQuote, updateQuoteQty, removeFromQuote, clearQuote, quoteCount: quote.reduce((n, i) => n + i.qty, 0),
      quoteOpen, setQuoteOpen,
      recent, pushRecent,
      toast, notify, dismissToast: () => setToast(null),
    }),
    [wishlist, isWished, toggleWish, quote, addToQuote, addManyToQuote, updateQuoteQty, removeFromQuote, clearQuote, quoteOpen, recent, pushRecent, toast, notify]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
