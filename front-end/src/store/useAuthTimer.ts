import { create } from "zustand";

interface AuthTimer {
    timeLeft: number;
    setTimeLeft: (time: number) => void;
    decrementTime: () => void;
    resetTimer: () => void;
}

 // 백엔드 accessTokenMaxAge와 맞추기
const ACCESS_TOKEN_MAX_AGE = 60 * 30;

export const useAuthTimer = create<AuthTimer>((set) => ({
    timeLeft: ACCESS_TOKEN_MAX_AGE,
    setTimeLeft: (time) => set({ timeLeft: time }),
    decrementTime: () => set((state) => ({ timeLeft: Math.max(state.timeLeft - 1, 0) })),
    resetTimer: () => set({ timeLeft: ACCESS_TOKEN_MAX_AGE }),
}));