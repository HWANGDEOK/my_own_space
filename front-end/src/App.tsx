import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import OAuth2RedirectHandler from "./pages/Oauth2RedirectHandler";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/authStore";
import { useUser } from "./hooks/useUser";
import Home from "./pages/Home";
import api, { logout } from "./apis/userApi";
import { useAuthTimer } from "./store/useAuthTimer";
import Header from "./components/Header";
import PostListPage from "./pages/PostListPage";

function App() {
    const navigate = useNavigate();
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
    const {setMaxAge} = useAuthTimer();

    // 최초로드 시 유저정보 가져오기
    const { data: user, isError, isLoading } = useUser();

    // 토큰 만료 시간 받아와서 타이머에 세팅하기
    // 최초 1회 앱 설정 정보(accessTokenMaxAge) 세팅 전담
    useEffect(() => {
        const fetchConfig = async () => {
        try {
            const response = await api.get<{ accessTokenMaxAge: number }>('/auth/config');
            setMaxAge(response.data.accessTokenMaxAge);
        } catch (error) {
            console.error("인증 설정(config)을 가져오는데 실패했습니다.", error);
        }
        };

        fetchConfig();
    }, [setMaxAge]);


    useEffect(() => {
        if (user) {
            // 유저 정보를 성공적으로 가져왔다면
            setAuthenticated(true);
        }
    }, [user, setAuthenticated]);

    useEffect(() => {
        if (isError) {
            // 유저 정보를 가져오는 데 완전히 실패시
            logout();
        }
    }, [isError]);

    


    
    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>로딩 중...</div>;
    }
    
    return (
    
        <>
        <Header />
        <div>
            <button onClick={() => navigate('/postboard')}>게시판</button>

        </div>
        
        <Routes>
            <Route path="/postboard" element={<PostListPage />}/>
            {/* <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/post/posting" element={<PostCreate />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
        </>
    )
    }

export default App
