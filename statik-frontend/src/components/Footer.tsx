import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/session';

export default function Footer() {
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const site = useSessionStore((state) => state.site);

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/80 py-10">
      <div className="shell grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="eyebrow">STATIK / private scene network</p>
          <h2 className="headline-lg max-w-3xl">Built for the side of car culture that actually wants a network, not just another storefront.</h2>
          <p className="body-muted max-w-2xl">Events drive the public hook. Profiles, communities, friend connections, and group chat create the real reason to come back. The shop stays secondary and locked until the admin team opens it.</p>
        </div>
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Access</p>
          <div className="mt-4 grid gap-3 text-sm text-silver/72">
            <Link to="/events" className="footer-link">Explore events</Link>
            {viewerUser ? <Link to="/members" className="footer-link">Enter member hub</Link> : <Link to="/join" className="footer-link">Create account</Link>}
            <Link to="/members/communities" className="footer-link">Communities</Link>
            {site && !site.shopLocked ? <Link to="/shop" className="footer-link">Shop archive</Link> : <span className="footer-link opacity-70">Shop locked by admin</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
