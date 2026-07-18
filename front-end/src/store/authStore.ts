import { create } from 'zustand';

interface AuthState {
    isAuth: boolean;
    setAuth: (v: boolean) => void;
    logout: () => void;
}

// 로그인 상태 관리
export const useAuthStore = create<AuthState>((set) => ({
    isAuth: false,
    setAuth: (v) => set({ isAuth: v }),
    logout: () => set({ isAuth: false }),
}));