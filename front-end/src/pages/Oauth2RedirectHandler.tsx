import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AuthLogin {
    setIsLoggedIn: (value: boolean) => void;
}

function Oauth2RedirectHandler({setIsLoggedIn}:AuthLogin) {
    const navigate = useNavigate();
    const isProcessed = useRef<boolean>(false);

    useEffect(() => {
        if (isProcessed.current) return;
        isProcessed.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('accessToken', token);
            console.log('토큰 저장 성공!');
            setIsLoggedIn(true);
            navigate('/');
        } else {
            alert('로그인에 실패했습니다.');
            navigate('/');
        }
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>로그인 처리 중입니다. 잠시만 기다려주세요...</h2>
        </div>
    );
};

export default Oauth2RedirectHandler;