// hooks/useLogout.ts
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // 사용 중인 라우터에 맞게
import { logout } from '../apis/userApi';

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return async () => {
        await logout();
        queryClient.removeQueries({ queryKey: ['userMe'] });
        console.log('로그아웃 성공')
        navigate('/');
    };
}