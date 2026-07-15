import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';


function Profile() {
    const { data: user, isLoading, isError } = useUser();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
    
        if (!token) {
                alert("로그인이 필요한 페이지입니다.");
                window.location.href = '/';
                return;
        }

        if (isError) {
            alert("인증이 만료되었거나 잘못된 접근입니다.");
            localStorage.removeItem("accessToken");
            window.location.href = '/';
        }
    }, [isError]);

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