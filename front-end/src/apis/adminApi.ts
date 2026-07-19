import api from "./userApi";


export const adminApi = {

    activateAdmin: async (key: string): Promise<void> => {
        await api.post<void>('/admin/activate', { key });
    },

// 관리자 모드 비활성화 (role을 ROLE_USER로 되돌림 + access_token 재발급)
    deactivateAdmin: async (): Promise<void> => {
        await api.post<void>('/admin/deactivate');
    }

}