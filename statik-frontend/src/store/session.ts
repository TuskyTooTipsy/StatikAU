import { create } from 'zustand';
import { profiles, siteConfig } from '../data/platform';
import type { Profile, UserRole } from '../types/platform';

interface SessionState {
  role: UserRole;
  currentProfile: Profile;
  maintenanceMode: boolean;
  setRole: (role: UserRole) => void;
  toggleMaintenanceMode: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  role: 'admin',
  currentProfile: profiles[0],
  maintenanceMode: siteConfig.maintenanceMode,
  setRole: (role) => set({ role }),
  toggleMaintenanceMode: () => set((state) => ({ maintenanceMode: !state.maintenanceMode })),
}));
