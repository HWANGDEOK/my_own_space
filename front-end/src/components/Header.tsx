import { useEffect } from "react";
import { useAuthTimer } from "../hooks/useAuthTimer";
import { useUser } from "../hooks/useUser";


function Header() {
    const { data: user, isLoading } = useUser();
    const { timeLeft, decrementTime, setTimeLeft } = useAuthTimer();

    // 타이머(1초마다)
    useEffect(() => {
        if (!user) return;
        
        const timer = setInterval(() => {
            decrementTime();
        }, 1000);

        return () => clearInterval(timer);
    }, [user, decrementTime]);

    if (isLoading) return <span>로딩 중...</span>;

    return(
        <header>
            {user ? (
                <div>
                    <span>{user.nickname} 님 {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초</span>
                </div>
            ) : (
                <span></span>
            )}
        </header>
    );
}



export default Header;