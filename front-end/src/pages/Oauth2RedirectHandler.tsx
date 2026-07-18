import { useQueryClient } from '@tanstack/react-query';
import { useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAuthTimer } from '../store/useAuthTimer';


function Oauth2RedirectHandler() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);
    const resetTimer = useAuthTimer((state) => state.resetTimer);
    // const isProcessed = useRef<boolean>(false);

    useEffect(() => {
        // if (isProcessed.current) return;
        // isProcessed.current = true;

        // 리다이렉트 시점엔 이미 서버가 access/refresh 쿠키를 심어준 상태
        // 실제 인증 여부는 /user/me 재검증으로 확정 (react-query 캐시 무효화)
        setAuth(true);
        resetTimer();
        queryClient.invalidateQueries({ queryKey: ['userMe'] });
        navigate('/');
    }, [navigate, setAuth, resetTimer, queryClient]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>로그인 처리 중입니다. 잠시만 기다려주세요...</h2>
        </div>
    );
};

export default Oauth2RedirectHandler;