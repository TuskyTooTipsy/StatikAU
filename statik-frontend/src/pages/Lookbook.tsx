import { Link } from 'react-router-dom';
import { communityHighlights } from '../data/brand';
import { usePageMeta } from '../hooks/usePageMeta';

const editorialRows = [
  {
    title: 'Night Shift Campaign',
    body: 'The primary campaign language: low light, sharp surfaces, moving reflections, and garments photographed like products with presence rather than just stock inventory.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Driver / Build Spotlights',
    body: 'Profiles on real people, real builds, and the fits they wear around the scene. This is where the media side of STATIK can become a long-term moat.',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'From the Community',
    body: 'A structured space for future owner-submitted photography, event coverage, and selected creative contributions without turning the page into a noisy feed.',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80',
  },
];

export default function Lookbook() {
  usePageMeta('Lookbook', 'Editorial campaigns, culture frames, and community modules that make STATIK feel larger than a store.');

  return (
    <div className="space-y-14 pb-10 pt-8">
      <section className="shell">
        <div className="page-hero overflow-hidden rounded-[2.5rem] border border-white/10 p-6 md:p-10 xl:p-14">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="eyebrow">Lookbook / Media / Community</p>
              <h1 className="headline-xl mt-3">A culture hub, not a placeholder gallery.</h1>
              <p className="body-muted mt-5 max-w-3xl text-base">
                The lookbook now reads like a premium editorial feed: campaign cuts, driver features, community build angles, and a stronger visual language that can grow with real assets.
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-sm leading-8 text-silver/70">
                The live structure is ready for owned photography, featured builds, and future campaign drops, while still feeling deliberate today instead of like a grid of generic placeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-5 lg:grid-cols-3">
        {communityHighlights.map((item) => (
          <article key={item.title} className="group relative overflow-hidden rounded-[2rem] border border-white/10">
            <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative flex min-h-[420px] flex-col justify-end gap-3 p-6">
              <span className="eyebrow">{item.tag}</span>
              <h2 className="text-2xl font-semibold text-bone">{item.title}</h2>
              <p className="text-sm leading-7 text-silver/70">{item.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="shell space-y-6">
        {editorialRows.map((item, index) => (
          <article key={item.title} className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6 xl:grid-cols-[1fr_1.05fr] xl:items-center">
            <div className={`${index % 2 === 1 ? 'xl:order-2' : ''} space-y-4`}>
              <p className="eyebrow">Editorial module {index + 1}</p>
              <h2 className="headline-md">{item.title}</h2>
              <p className="body-muted max-w-2xl">{item.body}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary h-11 px-5 text-xs">Pitch a feature</Link>
                <Link to="/shop/featured-drop" className="btn-secondary h-11 px-5 text-xs">Wear the drop</Link>
              </div>
            </div>
            <div className={`${index % 2 === 1 ? 'xl:order-1' : ''} overflow-hidden rounded-[1.75rem] border border-white/10`}>
              <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" loading="lazy" />
            </div>
          </article>
        ))}
      </section>

      <section className="shell panel p-7 md:p-10" id="community">
        <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="eyebrow">Community submissions</p>
            <h2 className="headline-lg mt-3">Built to showcase real drivers, real builds, and real scene imagery.</h2>
            <p className="body-muted mt-5 max-w-2xl">
              As owned content comes in, this page is already structured to hold featured builds, campaign galleries, and community contributions without needing a redesign from scratch.
            </p>
          </div>
          <Link to="/contact" className="btn-primary h-11 px-5 text-xs">Submit your story</Link>
        </div>
      </section>
    </div>
  );
}
