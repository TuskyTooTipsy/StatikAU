import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BrandLogo from './platform/BrandLogo';
import { useSessionStore } from '../store/session';
import { networkApi } from '../api/network';

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Submit', href: '/submit' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const site = useSessionStore((state) => state.site);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  async function handleLogout() {
    try {
      await networkApi.logout();
    } catch {
      // ignore logout failures
    }
    clearSession();
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/88 backdrop-blur-2xl">
      <div className="shell flex h-20 items-center justify-between gap-6">
        <BrandLogo />
        <nav className="hidden items-center gap-2 lg:flex">
          {publicLinks.map((link) => (
            <NavLink key={link.href} to={link.href} end={link.href === '/'} className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
          {viewerUser ? (
            <>
              <NavLink to="/members" className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : ''}`}>Members</NavLink>
              <NavLink to="/members/communities" className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : ''}`}>Communities</NavLink>
              <NavLink to="/members/friends" className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : ''}`}>Friends</NavLink>
            </>
          ) : null}
          {site && !site.shopLocked ? <NavLink to="/shop" className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : ''}`}>Shop</NavLink> : null}
        </nav>
        <div className="flex items-center gap-2">
          {viewerUser ? (
            <>
              {viewerUser.role === 'admin' ? <Link to="/admin" className="btn-secondary h-11 px-4 text-[11px]">Admin</Link> : null}
              <Link to="/members/profile" className="btn-secondary hidden h-11 px-4 text-[11px] md:inline-flex">Profile</Link>
              <button type="button" onClick={handleLogout} className="btn-primary h-11 px-4 text-[11px]">Leave session</button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="btn-secondary hidden h-11 px-4 text-[11px] sm:inline-flex">Sign in</Link>
              <Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Join STATIK</Link>
            </>
          )}
          <button type="button" onClick={() => setMobileOpen(true)} className="btn-secondary h-11 px-4 text-[11px] lg:hidden">Menu</button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="lg:hidden">
          <button type="button" className="fixed inset-0 z-[70] bg-black/80" onClick={() => setMobileOpen(false)} />
          <aside className="fixed right-0 top-0 z-[71] h-screen w-[88vw] max-w-sm border-l border-white/10 bg-[#050505] p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <BrandLogo compact />
              <button type="button" className="btn-secondary h-10 px-4 text-[11px]" onClick={() => setMobileOpen(false)}>Close</button>
            </div>
            <div className="mt-6 grid gap-3">
              {publicLinks.map((link) => <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="mobile-nav-link">{link.label}</Link>)}
              {viewerUser ? (
                <>
                  <Link to="/members" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Members</Link>
                  <Link to="/members/communities" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Communities</Link>
                  <Link to="/members/friends" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Friends</Link>
                  <Link to="/members/profile" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Profile</Link>
                  {viewerUser.role === 'admin' ? <Link to="/admin" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Admin</Link> : null}
                  {site && !site.shopLocked ? <Link to="/shop" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Shop</Link> : null}
                  <button type="button" onClick={handleLogout} className="btn-primary mt-2 h-11 justify-center text-[11px]">Leave session</button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Sign in</Link>
                  <Link to="/join" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 h-11 justify-center text-[11px]">Join STATIK</Link>
                </>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
