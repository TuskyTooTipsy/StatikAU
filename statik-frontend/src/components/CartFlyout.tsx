import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';

export default function CartFlyout() {
  const { toastVisible, dismissToast, lastAddedItem, openCart } = useCartStore();

  useEffect(() => {
    if (!toastVisible) return undefined;
    const timeout = window.setTimeout(() => dismissToast(), 3200);
    return () => window.clearTimeout(timeout);
  }, [toastVisible, dismissToast]);

  return (
    <AnimatePresence>
      {toastVisible && lastAddedItem ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          className="pointer-events-none fixed bottom-5 right-5 z-[72] w-[min(92vw,380px)]"
        >
          <div className="panel pointer-events-auto flex items-center gap-4 p-4 shadow-2xl shadow-black/30">
            <img src={lastAddedItem.image} alt={lastAddedItem.title} className="h-16 w-14 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.24em] text-silver/60">Added to cart</p>
              <p className="mt-1 truncate text-sm font-semibold text-bone">{lastAddedItem.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-silver/60">{lastAddedItem.optionLabel || 'Default'} · ${lastAddedItem.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" className="btn-secondary h-10 px-4 text-[11px]" onClick={openCart}>
                View cart
              </button>
              <Link to="/cart" className="text-center text-[11px] uppercase tracking-[0.2em] text-silver/60 transition hover:text-bone">
                Open bag
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
