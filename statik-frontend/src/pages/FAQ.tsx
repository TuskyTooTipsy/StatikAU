import { faqItems } from '../data/brand';
import { usePageMeta } from '../hooks/usePageMeta';

export default function FAQ() {
  usePageMeta('FAQ', 'Answers on processing, shipping, returns, fit, and collaborations for STATIK.');

  return (
    <div className="space-y-12 pb-10 pt-8">
      <section className="shell page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Support</p>
        <h1 className="headline-xl mt-3">Frequently asked questions, now written like part of the brand.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">
          Clear, polished, and conversion-friendly answers on production timing, shipping, drop structure, returns, and partnerships.
        </p>
      </section>
      <section className="shell space-y-4">
        {faqItems.map((item) => (
          <details key={item.question} className="panel p-5 md:p-6">
            <summary className="cursor-pointer list-none text-lg font-semibold text-bone">{item.question}</summary>
            <p className="mt-4 max-w-4xl text-base leading-8 text-silver/72">{item.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
