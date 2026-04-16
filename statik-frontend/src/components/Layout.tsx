import type { ReactNode } from 'react';
import CartDrawer from './CartDrawer';
import CartFlyout from './CartFlyout';
import CartMotionLayer from './CartMotionLayer';
import Footer from './Footer';
import Navbar from './Navbar';
import AnnouncementBar from './platform/AnnouncementBar';
import { useSessionStore } from '../store/session';

export default function Layout({ children }: { children: ReactNode }) {
  const maintenanceMode = useSessionStore((state) => state.maintenanceMode);
  const role = useSessionStore((state) => state.role);
  const blocked = maintenanceMode && role !== 'admin' && role !== 'super-admin' && role !== 'moderator';

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-bone">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-orb left-[8%] top-12" />
        <div className="ambient-orb right-[8%] top-[26%]" />
        <div className="ambient-grid" />
      </div>
      <AnnouncementBar />
      <Navbar />
      <main>
        {blocked ? (
          <div className="shell py-20">
            <div className="page-hero rounded-[2.75rem] border border-white/10 p-8 md:p-12">
              <p className="eyebrow">Maintenance mode</p>
              <h1 className="headline-lg mt-3">STATIK is temporarily paused for public access.</h1>
              <p className="body-muted mt-5 max-w-2xl text-base">Admin and moderation access stays live so the operations team can manage imports, approvals, and site-level settings.</p>
            </div>
          </div>
        ) : children}
      </main>
      <Footer />
      <CartDrawer />
      <CartFlyout />
      <CartMotionLayer />
    </div>
  );
}
