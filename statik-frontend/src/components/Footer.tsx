import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';

const footerGroups = [
  {
    title: 'STATIK World',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Updates', href: '/updates' },
      { label: 'Events', href: '/events' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Participation',
    links: [
      { label: 'Submit', href: '/submit' },
      { label: 'Account', href: '/account' },
      { label: 'Search', href: '/search' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Shop', href: '/shop' },
      { label: 'Cart', href: '/cart' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Lookbook', href: '/lookbook' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Admin', href: '/admin' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black/75 pb-8 pt-10 backdrop-blur-xl">
      <div className="shell space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-4">
            <p className="eyebrow">STATIK</p>
            <h2 className="headline-lg max-w-2xl">Events, profiles, updates, community, then commerce.</h2>
            <p className="body-muted max-w-2xl">The platform now behaves like an automotive culture operating system: event discovery up front, identity-driven profiles in the middle, moderated submissions behind the scenes, and premium commerce as one revenue layer inside the whole world.</p>
          </div>
          <NewsletterSignup compact />
        </div>
        <div className="grid gap-8 border-t border-white/10 pt-10 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.2fr]">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs uppercase tracking-[0.24em] text-silver/50">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-silver/75">
                {group.links.map((link) => (
                  <li key={link.href}><Link to={link.href} className="transition hover:text-bone">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-silver/50">Brand system</h3>
            <div className="mt-4 space-y-3 text-sm text-silver/75">
              <p>Blackout palette. Blade geometry. High contrast. Cinematic car-culture atmosphere. Premium control surfaces over generic dashboards.</p>
              <img src="/brand/statik-logo-primary.jpg" alt="STATIK wordmark" className="h-16 rounded-2xl object-cover" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-silver/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} STATIK. Built for the scene, not the sidelines.</p>
          <p>Events-first platform • moderated community • premium secondary shop</p>
        </div>
      </div>
    </footer>
  );
}
