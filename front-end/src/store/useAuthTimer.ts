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


// import { create } from "zustand";

// interface AuthState {
//   accessToken: string | null;
//   timeLeft: number;
//   setAccessToken: (token: string) => void;
//   clearAuth: () => void;
//   decrementTime: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   accessToken: null,
//   timeLeft: 0, // 만료 시간 타이머 (초 단위)

//   // 📍 로그인/토큰 갱신 성공 시 메모리에 저장
//   setAccessToken: (token) => set({ 
//     accessToken: token, 
//     timeLeft: 30 * 60 // 토큰 수명: 30분 (1800초) 설정
//   }),

//   // 📍 로그아웃 또는 세션 만료 시 메모리 청소
//   clearAuth: () => set({ 
//     accessToken: null, 
//     timeLeft: 0 
//   }),

//   // 📍 1초마다 타이머 줄이기
//   decrementTime: () => set((state) => ({ 
//     timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0 
//   })),
// }));