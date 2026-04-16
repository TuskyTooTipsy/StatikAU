import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SessionBootstrap from './SessionBootstrap';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-bone">
      <SessionBootstrap />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_25%),linear-gradient(180deg,#050505_0%,#090909_45%,#040404_100%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '90px 90px', maskImage: 'radial-gradient(circle at center, black, transparent 72%)' }} />
      </div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
