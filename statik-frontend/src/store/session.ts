import { create } from 'zustand';
import { profiles, siteConfig } from '../data/platform';
import type { Profile, UserRole } from '../types/platform';
import type { AuthPayload, NetworkProfile, NetworkSiteState, NetworkUser } from '../types/network';
import { networkApi, setStoredToken, getStoredToken } from '../api/network';

interface SessionState {
  role: UserRole;
  currentProfile: Profile;
  maintenanceMode: boolean;
  setRole: (role: UserRole) => void;
  toggleMaintenanceMode: () => void;
  token: string | null;
  viewerUser: NetworkUser | null;
  viewerProfile: NetworkProfile | null;
  site: NetworkSiteState | null;
  initialized: boolean;
  loading: boolean;
  hydrate: () => Promise<void>;
  applyAuthPayload: (payload: AuthPayload) => void;
  clearSession: () => void;
}

const legacyProfile = profiles[0];

function mapRole(role: 'user' | 'admin' | null | undefined): UserRole {
  return role === 'admin' ? 'admin' : 'user';
}

export const useSessionStore = create<SessionState>((set, get) => ({
  role: 'guest',
  currentProfile: legacyProfile,
  maintenanceMode: siteConfig.maintenanceMode,
  setRole: (role) => set({ role }),
  toggleMaintenanceMode: () => set((state) => ({ maintenanceMode: !state.maintenanceMode })),
  token: typeof window !== 'undefined' ? getStoredToken() : null,
  viewerUser: null,
  viewerProfile: null,
  site: null,
  initialized: false,
  loading: false,
  hydrate: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ initialized: true, token: null, viewerUser: null, viewerProfile: null, role: 'guest' });
      return;
    }

    set({ loading: true, token });
    try {
      const payload = await networkApi.me();
      get().applyAuthPayload({ ...payload, token });
    } catch {
      setStoredToken(null);
      set({ token: null, viewerUser: null, viewerProfile: null, role: 'guest', initialized: true, loading: false });
    }
  },
  applyAuthPayload: (payload) => {
    if (payload.token) setStoredToken(payload.token);
    set({
      token: payload.token || get().token,
      viewerUser: payload.user,
      viewerProfile: payload.profile,
      site: payload.site,
      role: mapRole(payload.user.role),
      initialized: true,
      loading: false,
      maintenanceMode: payload.site.maintenanceMode,
    });
  },
  clearSession: () => {
    setStoredToken(null);
    set({
      token: null,
      viewerUser: null,
      viewerProfile: null,
      site: null,
      role: 'guest',
      initialized: true,
      loading: false,
      maintenanceMode: false,
    });
  },
}));
