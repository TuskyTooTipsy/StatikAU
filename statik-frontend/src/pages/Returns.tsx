import { returnPoints } from '../data/brand';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Returns() {
  usePageMeta('Returns', 'Returns, exchanges, and post-purchase policy notes for STATIK.');

  return (
    <div className="space-y-12 pb-10 pt-8">
      <section className="shell page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Support / Returns</p>
        <h1 className="headline-xl mt-3">A cleaner return policy with better customer confidence.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">
          Returns should feel professional and transparent. The experience is now framed around faults, incorrect items, eligible unworn returns, and the reality of limited drop releases.
        </p>
      </section>
      <section className="shell grid gap-5 md:grid-cols-2">
        {returnPoints.map((point, index) => (
          <article key={point} className="panel p-6">
            <p className="eyebrow">0{index + 1}</p>
            <p className="mt-4 text-base leading-8 text-silver/72">{point}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
