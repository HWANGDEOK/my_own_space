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

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const passUrls = ['/auth/config'];
        const isPass = passUrls.some(url => originalRequest.url?.includes(url));
        
        // 만약 실패한 요청 자체가 토큰 재발급(/auth/refresh) 요청인 경우
        // 또는 이미 한 번 재시도했던 요청이거나, 제외(pass) 대상이 아닌 경우 -> 즉시 로그아웃 처리
        const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');


        // refresh 요청 자체가 실패했거나 originalRequest가 없으면 바로 실패 처리
        if (isRefreshRequest || !originalRequest.retry && !isPass ) {
            console.log("refresh 요청 실패 했거나 재요청 실패로 로그아웃")
            useAuthStore.getState().logout();
            useAuthTimer.getState().setTimeLeft(0);


            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
            return Promise.reject(error);
        }

        // 401 에러가 발생
        if (error.response?.status === 401) {
            if (isPass) {
                return Promise.reject(error);
            }   
        }
        // 재시도 401 에러 발생하면 그냥 로그아웃 처리
        if (originalRequest.retry) {
            console.log("재시도 요청마저 401 실패 - 강제 로그아웃 처리");
            useAuthStore.getState().logout();
            useAuthTimer.getState().setTimeLeft(0);
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }

            return Promise.reject(error);
        }
        
        originalRequest.retry = true; // 재시도 플래그
        
        try {
            // 토큰 재발급 요청
            console.log("액세스 토큰 만료로 인한 재발급 요청 시작...");

            await api.post('/auth/refresh');
            console.log("재발급 끝, 재시도 요청")
            // 전역 상태 단순 동기화
            useAuthStore.getState().setAuth(true);
            useAuthTimer.getState().resetTimer();

            // 원래 보냈던 요청 재시도
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().logout();
            useAuthTimer.getState().setTimeLeft(0);
            console.log("재시도 요청 에러")
            
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
            
            return Promise.reject(refreshError);
        }
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
