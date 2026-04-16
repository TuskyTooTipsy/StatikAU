import { Link } from 'react-router-dom';
import { brandPillars } from '../data/brand';
import { usePageMeta } from '../hooks/usePageMeta';

export default function About() {
  usePageMeta('About', 'The story behind STATIK: premium automotive streetwear and media built for people who actually live the scene.');

  return (
    <div className="space-y-14 pb-10 pt-8">
      <section className="shell">
        <div className="page-hero overflow-hidden rounded-[2.5rem] border border-white/10 p-6 md:p-10 xl:p-14">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="eyebrow">About STATIK</p>
              <h1 className="headline-xl mt-3">A premium automotive streetwear and media label built from real car culture.</h1>
              <p className="body-muted mt-5 max-w-3xl text-base">
                STATIK exists for people who live the scene, not spectators. The brand is shaped by engineered aesthetics, night movement, visual storytelling, and the confidence that comes from restraint instead of noise.
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-sm leading-8 text-silver/70">
                The goal is simple: create garments, imagery, and an online experience that feels sharper than generic merch, more human than sterile luxury, and more intentional than whatever is trending for a week.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-5 md:grid-cols-2">
        {brandPillars.map((pillar) => (
          <article key={pillar.title} className="panel p-6 md:p-7">
            <p className="eyebrow">{pillar.title}</p>
            <p className="mt-4 text-base leading-8 text-silver/72">{pillar.body}</p>
          </article>
        ))}
      </section>

      <section className="shell grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-7 md:p-10">
          <p className="eyebrow">What makes STATIK different</p>
          <h2 className="headline-lg mt-3">The brand world matters as much as the garment.</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-silver/72">
            <p>STATIK does not aim to be loud hypewear or sterile luxury. It sits between the two: clean, dangerous, polished, and grounded in the visual language of machines, night light, and city movement.</p>
            <p>Quality matters, but so does context. That means the website needs storytelling, not filler. The lookbook needs culture, not placeholders. The support pages need clarity, not legal leftovers.</p>
            <p>As the range expands, future collections, limited drops, footwear, and women’s capsules can slot into the same architecture without the brand losing focus.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Quality / Craft / Materials', 'Heavyweight fabrics, sharp product detail, and cleaner garment notes that explain fit, materials, and care without fluff.'],
            ['Culture / Community / Media', 'Campaign frames, build spotlights, and visual storytelling that give the brand a life beyond transactions.'],
            ['Future collections / limited drops', 'The site architecture is prepared for release cycles, category growth, and more premium merchandising over time.'],
            ['Built in Australia, worn anywhere', 'The perspective is local, but the visual language is strong enough to travel globally without losing its roots.'],
          ].map(([title, body]) => (
            <div key={title} className="panel p-6">
              <p className="font-semibold text-bone">{title}</p>
              <p className="mt-3 text-sm leading-7 text-silver/68">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell panel p-7 md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="eyebrow">Where it goes next</p>
            <h2 className="headline-lg mt-3">A brand platform ready for premium campaigns, drops, and scale.</h2>
            <p className="body-muted mt-5 max-w-2xl">
              The foundation now supports better category architecture, richer PDP content, smoother cart interactions, deeper support pages, and a lookbook that can grow into a full culture hub as owned assets arrive.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop/featured-drop" className="btn-primary h-11 px-5 text-xs">Shop the drop</Link>
            <Link to="/lookbook" className="btn-secondary h-11 px-5 text-xs">Explore lookbook</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
