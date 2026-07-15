import { create } from "zustand";

interface AuthTimer {
    timeLeft: number;
    setTimeLeft: (time:number) => void;
    decrementTime: () => void;
}

export const useAuthTimer = create<AuthTimer>((set) => ({
    timeLeft: 60 * 30,
    setTimeLeft: (time) => set({ timeLeft: time}),
    decrementTime: () => set((state) => ({ timeLeft: state.timeLeft - 1 })),
}))