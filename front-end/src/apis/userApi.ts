import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { UserInfo } from '../types/user';
import { getCsrfTokenFromCookie } from '../utils/csrf';
import { useAuthStore } from '../store/authStore';
import { useAuthTimer } from '../store/useAuthTimer';


// 1. 공통 설정을 가진 axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const csrfToken = getCsrfTokenFromCookie();
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
    }
    return config;
});



interface RetryConfig extends InternalAxiosRequestConfig {
    retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<(success: boolean) => void> = [];

function subscribeTokenRefresh(cb: (success: boolean) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(success: boolean) {
    refreshSubscribers.forEach((cb) => cb(success));
    refreshSubscribers = [];
}


api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig;

        // refresh 요청 자체가 실패하면 그대로 로그아웃 처리 (무한루프 방지)
        if (originalRequest?.url?.includes('/auth/refresh') || originalRequest?.url?.includes('/auth/logout')) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true;

            if (isRefreshing) {
                // 이미 refresh 진행 중이면 끝날 때까지 대기 후 재시도
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((success) => {
                        if (success) {
                            resolve(api(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            isRefreshing = true;

            try {
                await api.post('/auth/refresh');

                // 재발급 성공 -> 로그인 상태 유지 + 타이머 리셋
                useAuthStore.getState().setAuthenticated(true);
                useAuthTimer.getState().resetTimer();

                onRefreshed(true);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshError) {
                onRefreshed(false);
                isRefreshing = false;

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


export const logout = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        // 서버가 이미 죽었거나 refresh_token이 없어도
        // 클라이언트 상태는 무조건 정리해야 함
        console.error('로그아웃 요청 실패:', error);
    } finally {
        useAuthStore.getState().logout();
        useAuthTimer.getState().setTimeLeft(0);
    }
};

export default api;