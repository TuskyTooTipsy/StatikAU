import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import BrandLogo from './platform/BrandLogo';
import { useSessionStore } from '../store/session';

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Updates', href: '/updates' },
  { label: 'Events', href: '/events' },
  { label: 'Community', href: '/community' },
  { label: 'Submit', href: '/submit' },
  { label: 'Shop', href: '/shop' },
  { label: 'Search', href: '/search' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openCart = useCartStore((state) => state.openDrawer);
  const role = useSessionStore((state) => state.role);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/85 backdrop-blur-2xl">
      <div className="shell flex h-20 items-center justify-between gap-6">
        <BrandLogo />
        <nav className="hidden items-center gap-2 lg:flex">
          {publicLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) => `rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${isActive ? 'bg-white/10 text-bone' : 'text-silver/64 hover:bg-white/5 hover:text-bone'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/account" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-silver/70 transition hover:text-bone lg:inline-flex">Account</Link>
          {role === 'admin' || role === 'super-admin' || role === 'moderator' ? (
            <Link to="/admin" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-silver/70 transition hover:text-bone lg:inline-flex">Admin</Link>
          ) : null}
          <button type="button" onClick={openCart} className="relative rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-bone">
            Cart
            {itemCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-[10px] text-black">{itemCount}</span> : null}
          </button>
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-bone lg:hidden">Menu</button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 z-[56] h-screen w-full max-w-sm overflow-y-auto border-l border-white/10 bg-[#050505] p-6 lg:hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <BrandLogo compact />
                <button type="button" className="btn-secondary h-11 px-4 text-xs" onClick={() => setMobileOpen(false)}>Close</button>
              </div>
              <div className="mt-6 space-y-4">
                {publicLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-bone">{link.label}</Link>
                ))}
                <Link to="/account" onClick={() => setMobileOpen(false)} className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-bone">Account</Link>
                {role === 'admin' || role === 'super-admin' || role === 'moderator' ? <Link to="/admin" onClick={() => setMobileOpen(false)} className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-bone">Admin</Link> : null}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
