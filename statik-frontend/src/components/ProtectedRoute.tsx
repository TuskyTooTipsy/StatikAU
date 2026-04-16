import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '../store/session';

export default function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const initialized = useSessionStore((state) => state.initialized);
  const loading = useSessionStore((state) => state.loading);
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="shell py-20">
        <div className="panel-cut p-8 text-sm uppercase tracking-[0.28em] text-silver/60">Checking access…</div>
      </div>
    );
  }

  if (!viewerUser) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && viewerUser.role !== 'admin') {
    return <Navigate to="/members" replace />;
  }

  return <>{children}</>;
}
