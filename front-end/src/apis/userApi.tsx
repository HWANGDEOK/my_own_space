import axios from 'axios';
import type { UserInfo } from '../types/user';

// 1. 공통 설정을 가진 axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// 요청을 보내기 직전, 토큰을 자동으로 꺼내서 헤더에 주입
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 정보 조회
export const getUserMe = async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>('/user/me');
    return response.data;
};

export default api;