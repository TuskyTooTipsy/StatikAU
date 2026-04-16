import { shippingPoints } from '../data/brand';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Shipping() {
  usePageMeta('Shipping', 'Processing windows, dispatch expectations, and delivery notes for STATIK orders.');

  return (
    <div className="space-y-12 pb-10 pt-8">
      <section className="shell page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Support / Shipping</p>
        <h1 className="headline-xl mt-3">Clear delivery expectations, premium trust cues.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">
          Shipping information should build confidence, not force customers to guess. STATIK now surfaces dispatch timing, tracking expectations, and delivery context with more polish.
        </p>
      </section>
      <section className="shell grid gap-5 md:grid-cols-2">
        {shippingPoints.map((point, index) => (
          <article key={point} className="panel p-6">
            <p className="eyebrow">0{index + 1}</p>
            <p className="mt-4 text-base leading-8 text-silver/72">{point}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
