// ============================================================
// Global Store — Zustand
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
}

interface AuthStore {
  user: AppUser | null;
  token: string | null;
  setAuth: (user: AppUser, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('agri_token', token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem('agri_token');
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'agri_auth' }
  )
);
