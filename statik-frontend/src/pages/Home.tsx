import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminMetrics, events, officialPosts, partnerPlacements, platformSummary, profiles } from '../data/platform';
import { fetchProducts } from '../api';
import { useEffect, useState } from 'react';
import type { Product } from '../types/catalog';
import EventCard from '../components/platform/EventCard';
import PostCard from '../components/platform/PostCard';
import ProfileCard from '../components/platform/ProfileCard';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  usePageMeta('STATIK World', 'Events, profiles, updates, and premium automotive culture under one blacked-out STATIK platform.');

  useEffect(() => {
    fetchProducts().then((items) => setProducts(items.slice(0, 3))).catch(console.error);
  }, []);

  const featuredEvents = events.filter((event) => event.featured || event.sponsored).slice(0, 3);
  const featuredProfiles = profiles.filter((profile) => profile.featured).concat(profiles.slice(1, 3)).slice(0, 3);

  return (
    <div className="space-y-24 pb-12 pt-8">
      <section className="shell">
        <div className="hero-panel overflow-hidden rounded-[2.75rem] border border-white/10 p-6 md:p-10 xl:p-14">
          <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="eyebrow">STATIK World / events first / culture platform</p>
                <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="headline-xl max-w-5xl">
                  {platformSummary.headline}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.08 }} className="max-w-3xl text-base leading-8 text-silver/74 md:text-lg">
                  {platformSummary.subheadline}
                </motion.p>
              </div>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.12 }} className="flex flex-wrap gap-4">
                <Link to="/events" className="btn-primary h-12 px-6 text-xs">Explore events</Link>
                <Link to="/community" className="btn-secondary h-12 px-6 text-xs">Explore profiles</Link>
                <Link to="/submit" className="btn-secondary h-12 px-6 text-xs">Submit to STATIK</Link>
              </motion.div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {platformSummary.stats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-xl">
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-bone">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-silver/62">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="relative min-h-[420px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/45">
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80" alt="STATIK hero" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.82)),radial-gradient(circle_at_top,rgba(199,77,39,0.18),transparent_32%)]" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-bone">Blackout identity</span>
                    <img src="/brand/statik-logo-emblem.jpg" alt="STATIK emblem" className="h-14 w-14 rounded-2xl border border-white/10 object-cover" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.75rem] border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
                      <p className="eyebrow">Featured update</p>
                      <p className="mt-3 text-xl font-semibold text-bone">{officialPosts[0].title}</p>
                      <p className="mt-3 text-sm leading-7 text-silver/68">{officialPosts[0].excerpt}</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
                      <p className="eyebrow">Featured event</p>
                      <p className="mt-3 text-xl font-semibold text-bone">{events[0].name}</p>
                      <p className="mt-3 text-sm leading-7 text-silver/68">{events[0].location} • {events[0].date}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {adminMetrics.map((metric) => (
                  <div key={metric.label} className="panel p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-silver/45">{metric.label}</p>
                    <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-bone">{metric.value}</p>
                    <p className="mt-2 text-sm text-silver/60">{metric.delta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell space-y-8">
        <SectionHeading
          eyebrow="Priority 1 / events and discovery"
          title="The event layer now drives the platform."
          description="Featured events, archive logic, sponsored placements, and source-labelled imports create a real discovery engine rather than a dead calendar page."
          action={<Link to="/events" className="btn-secondary h-11 px-5 text-xs">Open all events</Link>}
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {featuredEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      </section>

      <section className="shell grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Priority 1 / official feed"
            title="STATIK updates feel like a living editorial-social hybrid."
            description="Admins publish. Users interact. The result feels alive without becoming a low-quality social clone."
            action={<Link to="/updates" className="btn-secondary h-11 px-5 text-xs">Open updates</Link>}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            {officialPosts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </div>
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow">Partner lanes</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-bone">Monetization goes beyond the shop.</h3>
            <div className="mt-5 space-y-4">
              {partnerPlacements.map((placement) => (
                <div key={placement.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-bone">{placement.title}</p>
                  <p className="mt-2 text-sm leading-7 text-silver/64">{placement.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <img src="/brand/media-kit-reference.png" alt="Media kit reference" className="h-64 w-full object-cover object-top" />
            <div className="space-y-3 p-6">
              <p className="eyebrow">Profile analytics direction</p>
              <p className="text-xl font-semibold text-bone">QR, clicks, and media-kit style value presentation all belong inside the platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell space-y-8">
        <SectionHeading
          eyebrow="Priority 1 / profile identity"
          title="Profiles are no longer just bios. They are the identity layer of the scene."
          description="Every approved user can own a public profile with links, build details, sponsor sections, media, and QR-based traffic."
          action={<Link to="/community" className="btn-secondary h-11 px-5 text-xs">Explore community</Link>}
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {featuredProfiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
        </div>
      </section>

      <section className="shell space-y-8">
        <SectionHeading
          eyebrow="Priority 3 / shop as revenue layer"
          title="The shop still hits hard, but it no longer dominates the story."
          description="Commerce lives inside the culture platform instead of trying to pretend the store is the whole brand."
          action={<Link to="/shop" className="btn-secondary h-11 px-5 text-xs">Open shop</Link>}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
