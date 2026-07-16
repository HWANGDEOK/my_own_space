import { create } from "zustand";

interface AuthTimer {
    timeLeft: number;
    maxAge: number;
    setTimeLeft: (time1: number) => void;
    setMaxAge: (time2: number) => void;
    decrementTime: () => void;
    resetTimer: () => void;
}


export const useAuthTimer = create<AuthTimer>((set) => ({
    timeLeft: 0,
    maxAge: 0,
    setTimeLeft: (time1) => set({ timeLeft: time1 }),
    // 백엔드 값을 가져와서 세팅하는 함수
    setMaxAge: (time2) => set({ maxAge: time2, timeLeft: time2 }),

    decrementTime: () => set((state) => ({ timeLeft: Math.max(state.timeLeft - 1, 0) })),

    // 서버에서 받은 maxAge로 리셋
    resetTimer: () => set((state) => ({timeLeft: state.maxAge}) ),
}));