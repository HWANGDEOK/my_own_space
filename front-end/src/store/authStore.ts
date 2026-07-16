import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    setAuthenticated: (v: boolean) => void;
    logout: () => void;
}

// 로그인 상태 관리
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    setAuthenticated: (v) => set({ isAuthenticated: v }),
    logout: () => set({ isAuthenticated: false }),
}));