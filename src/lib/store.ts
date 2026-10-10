"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { mockUsers } from "@/lib/data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (data: Partial<User> & { password: string }) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, _password: string) => {
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        // Demo: allow any login
        set({ user: mockUsers[0], isAuthenticated: true });
        return true;
      },

      register: (data) => {
        const newUser: User = {
          id: String(Date.now()),
          name: data.name || "New User",
          email: data.email || "",
          role: data.role || "job_seeker",
          city: data.city || "Yaoundé",
          region: data.region || "Centre",
          skills: data.skills || [],
          xp: 0,
          badges: [],
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (data) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...data } });
      },
    }),
    { name: "auth-storage" }
  )
);

interface AppState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: Notification[];
  addNotification: (n: Notification) => void;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  createdAt: string;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  notifications: [],
  addNotification: (n) =>
    set((state) => ({ notifications: [n, ...state.notifications].slice(0, 10) })),
}));
