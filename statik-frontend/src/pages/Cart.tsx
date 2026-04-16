import { Link } from 'react-router-dom';
import { getCartSubtotal, useCartStore } from '../store/cart';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = getCartSubtotal(items);

  usePageMeta('Cart', 'Review your selected STATIK pieces before checkout.');

  return (
    <div className="space-y-12 pb-10 pt-8">
      <section className="shell page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Bag</p>
        <h1 className="headline-xl mt-3">Your selected STATIK pieces.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">
          The cart now feels more premium: better hierarchy, tactile quantity controls, clear summaries, and a smoother route back into the catalogue.
        </p>
      </section>

      <section className="shell grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="panel p-8 md:p-10">
              <p className="eyebrow">Cart empty</p>
              <h2 className="headline-md mt-3">No pieces selected yet.</h2>
              <p className="body-muted mt-4 max-w-2xl">
                Browse the featured drop, head into the lookbook, or join the newsletter for upcoming category launches rather than filling the store with fake inventory.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop" className="btn-primary h-11 px-5 text-xs">Shop now</Link>
                <Link to="/lookbook" className="btn-secondary h-11 px-5 text-xs">Explore lookbook</Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <article key={item.lineId} className="panel flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-6">
                <img src={item.image} alt={item.title} className="h-32 w-full rounded-[1.5rem] object-cover md:w-28" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <Link to={`/product/${item.slug}`} className="text-lg font-semibold text-bone transition hover:text-white">
                        {item.title}
                      </Link>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-silver/55">{item.optionLabel || 'Default'}</p>
                    </div>
                    <p className="text-lg font-semibold text-bone">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                      <button type="button" className="h-9 w-9 rounded-full text-bone transition hover:bg-white/10" onClick={() => updateQuantity(item.lineId, item.quantity - 1)}>
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center text-sm text-bone">{item.quantity}</span>
                      <button type="button" className="h-9 w-9 rounded-full text-bone transition hover:bg-white/10" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="btn-secondary h-10 px-4 text-[11px]" onClick={() => removeItem(item.lineId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="panel p-6 md:p-7">
            <p className="eyebrow">Summary</p>
            <h2 className="headline-md mt-3">Order overview</h2>
            <div className="mt-6 space-y-4 text-sm text-silver/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-lg font-semibold text-bone">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Returns</span>
                <span>Clear policy</span>
              </div>
            </div>
            <button type="button" className="btn-primary mt-6 h-12 w-full justify-center text-xs" disabled>
              Checkout coming soon
            </button>
            <button type="button" className="btn-secondary mt-3 h-12 w-full justify-center text-xs" onClick={clearCart}>
              Clear bag
            </button>
          </div>
          <div className="panel p-6 text-sm leading-7 text-silver/65">
            <p className="font-semibold text-bone">Why this now converts better</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Cleaner hierarchy for line items and totals.</li>
              <li>Quantity controls mirror the premium cart drawer interaction.</li>
              <li>Support and shipping expectations stay visible near the decision point.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
