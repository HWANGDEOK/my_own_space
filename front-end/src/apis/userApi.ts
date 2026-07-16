import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { UserInfo } from '../types/user';

import { useAuthStore } from '../store/authStore';
import { useAuthTimer } from '../store/useAuthTimer';



// 공통 설정을 가진 axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});



interface RetryConfig extends InternalAxiosRequestConfig {
    retry?: boolean;
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig;

        // refresh 요청 자체가 실패했거나 originalRequest가 없으면 바로 실패 처리 (무한 루프 방지)
        if (!originalRequest || originalRequest.url?.includes('/auth/refresh')) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        // 401 에러가 발생했고, 아직 재시도 하지 않은 경우
        if (error.response?.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true; // 재시도 플래그

            try {
                // 토큰 재발급 요청 (쿠키에 Refresh Token이 담겨 전송된다고 가정)
                await api.post('/auth/refresh');

                // 전역 상태 단순 동기화
                useAuthStore.getState().setAuthenticated(true);
                useAuthTimer.getState().resetTimer();

                // 원래 보냈던 요청 재시도
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                useAuthTimer.getState().setTimeLeft(0);
                window.location.href = '/';
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



// 정보 조회
export const getUserMe = async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>('/user/me');
    return response.data;
};

// 로그아웃
export const logout = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('로그아웃 요청 실패:', error);
    } finally {
        useAuthStore.getState().logout();
        useAuthTimer.getState().setTimeLeft(0);
    }
};

export default api;
