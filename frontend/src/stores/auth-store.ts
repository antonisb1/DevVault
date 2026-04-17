import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '../api/types';

type AuthState = {
  accessToken: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (payload: { accessToken: string; user: User }) => void;
  clearSession: () => void;
  markHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hydrated: false,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      clearSession: () => set({ accessToken: null, user: null }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'devvault-auth',
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);

export const authStore = {
  getState: () => useAuthStore.getState(),
  setSession: (payload: { accessToken: string; user: User }) => useAuthStore.getState().setSession(payload),
  clear: () => useAuthStore.getState().clearSession(),
};
