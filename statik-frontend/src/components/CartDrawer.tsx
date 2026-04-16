import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getCartSubtotal, useCartStore } from '../store/cart';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = getCartSubtotal(items);

  useEffect(() => {
    if (!isOpen) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-label="Close cart"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="fixed right-0 top-0 z-[71] flex h-screen w-full max-w-md flex-col border-l border-white/10 bg-[#090909]/95 px-6 pb-6 pt-5 shadow-2xl"
            aria-label="Cart drawer"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow">Cart</p>
                <h3 className="mt-2 text-2xl font-semibold text-bone">Ready when you are.</h3>
              </div>
              <button type="button" onClick={closeCart} className="btn-secondary h-11 px-4 text-xs">
                Close
              </button>
            </div>
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-4 py-10">
                <p className="text-lg font-medium text-bone">Your cart is empty.</p>
                <p className="body-muted max-w-sm">
                  Start with the featured drop, explore the staples, or join the list for the next category launch.
                </p>
                <Link to="/shop" onClick={closeCart} className="btn-primary h-11 px-5 text-xs">
                  Explore the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="custom-scroll mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.lineId} className="panel flex gap-4 p-4">
                      <img src={item.image} alt={item.title} className="h-24 w-20 rounded-2xl object-cover" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link to={`/product/${item.slug}`} onClick={closeCart} className="font-semibold text-bone transition hover:text-white">
                              {item.title}
                            </Link>
                            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-silver/60">{item.optionLabel || 'Default'}</p>
                          </div>
                          <button type="button" className="text-xs uppercase tracking-[0.2em] text-silver/60 transition hover:text-bone" onClick={() => removeItem(item.lineId)}>
                            Remove
                          </button>
                        </div>
                        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                            <button type="button" className="h-8 w-8 rounded-full text-bone transition hover:bg-white/10" onClick={() => updateQuantity(item.lineId, item.quantity - 1)}>
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-sm text-bone">{item.quantity}</span>
                            <button type="button" className="h-8 w-8 rounded-full text-bone transition hover:bg-white/10" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-bone">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between text-sm text-silver/70">
                    <span>Subtotal</span>
                    <span className="text-lg font-semibold text-bone">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-silver/60">Shipping, duties, and any final discounts are calculated at checkout.</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Link to="/cart" onClick={closeCart} className="btn-secondary h-11 justify-center text-xs">
                      View bag
                    </Link>
                    <button type="button" className="btn-primary h-11 justify-center text-xs" disabled>
                      Checkout soon
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
