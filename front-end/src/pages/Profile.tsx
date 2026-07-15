import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useAuthStore } from '../store/authStore';
import { useAuthTimer } from '../store/useAuthTimer';


function Profile() {
    const { data: user, isLoading, isError } = useUser();
    const logout = useAuthStore((state) => state.logout);
    const setTimeLeft = useAuthTimer((state) => state.setTimeLeft);


    useEffect(() => {
        if (isError) {
            alert("인증이 만료되었거나 잘못된 접근입니다.");
            logout()
            setTimeLeft(0);
            window.location.href = '/';
        }
    }, [isError, logout, setTimeLeft]);

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>마이페이지</h2>
        <hr />
        {user && (
            <div style={{ lineHeight: '2' }}>
                <p><strong>회원 번호:</strong> {user.userId}</p>
                <p><strong>이름:</strong> {user.name}</p>
                <p><strong>닉네임:</strong> {user.nickname}</p>
                <p><strong>이메일:</strong> {user.email}</p>
            </div>
        )}
        </div>
        );
    };

    export default Profile;