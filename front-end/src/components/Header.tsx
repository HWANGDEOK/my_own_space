import { useEffect } from "react";
import { useAuthTimer } from "../store/useAuthTimer";
import { useAuthStore } from "../store/authStore";
import api from "../apis/userApi";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";


function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore();
    const { timeLeft, maxAge, decrementTime, resetTimer, setTimeLeft } = useAuthTimer();

    // 카운트다운 인터벌 관리
    useEffect(() => {
        // 비로그인이거나 서버 스펙(maxAge)이 아직 준비되지 않았다면 타이머 정지
        if (!isAuthenticated || maxAge <= 0) return;

        const interval = setInterval(() => {
        decrementTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated, maxAge, decrementTime]);

    // 시간이 0이 되었을 때 Refresh 자동 요청
    useEffect(() => {
        if (isAuthenticated && maxAge > 0 && timeLeft === 0) {
        const handleSilentRefresh = async () => {
            try {
                console.log("타이머가 0초가 되어 세션 연장을 시도합니다.");
                await api.post('/auth/refresh');
                resetTimer();
            } catch (error) {
                console.error("세션 연장 실패 - 인터셉터가 로그아웃 처리합니다.", error);
            }
        };

        handleSilentRefresh();
        }
    }, [timeLeft, isAuthenticated, maxAge, resetTimer]);

    // 초 단위를 '분:초' 형태로 변환해 주는 헬퍼 함수 (예: 120 -> 02:00)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }
    const handleLogout = useLogout();

    return (
        <header>
            {!isAuthenticated ? (
                <>
                    <button style={{backgroundColor: "#3C83F6", color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'}} 
                    onClick={handleGoogleLogin}
                    >구글 로그인</button>
                    <button onClick={() => navigate('/profile')}>프로필</button>
                </>
            ) : (
                <>
                    <span style={{ fontWeight: 'bold', color: '#ff4d4f', marginRight: '10px' }}>
                            남은 로그인 시간: {formatTime(timeLeft)}
                    </span>
                    <button onClick={handleLogout}>로그아웃</button>
                    <button onClick={() => navigate('/profile')}>프로필</button>
                </>
            )}
        </header>

    );
}



export default Header;