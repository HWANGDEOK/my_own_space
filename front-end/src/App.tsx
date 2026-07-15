import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import PostHome from "./PostHome";
import PostDetail from "./PostDetail";
import PostCreate from "./CreatePost";
import type { Post } from "./types/post";
import { useNavigate } from 'react-router-dom';
import OAuth2RedirectHandler from "./pages/Oauth2RedirectHandler";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/authStore";
import { useUser } from "./hooks/useUser";
import { useLogout } from "./hooks/useLogout";

function App() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

    // 앱 최초 로드 시 로그인 상태 확인 (httpOnly 쿠키라 JS로 직접 확인 불가 -> API로 확인)
    const { data: user, isSuccess, isError } = useUser();


    useEffect(() => {
        if (isSuccess && user) {
            setAuthenticated(true);
        }
        if (isError) {
            setAuthenticated(false);
        }
    }, [isSuccess, isError, user, setAuthenticated]);

    const handleLogout = useLogout();


    const [posts, setPosts] = useState<Post[]>([
        { postId: 1, username: "user1", date: "2026", subject:"첫 인사", content: "안녕하세요" },
        { postId: 2, username: "user2", date: "2026", subject:"가입 인사", content: "반갑습니다." }
    ]);
    const [newPost, setNewPost] = useState<Post>({
        postId: 0,
        username: "",
        date: "",
        subject: "",
        content: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
            setNewPost({
            ...newPost,
            [name]: value
        });
    };

    const addPost = () => {
        if (!newPost.content || !newPost.subject) {
            alert("제목 및 내용을 입력하세요");
            return;
        }
        setPosts([
            ...posts, 
            {
            ...newPost,
            postId: Date.now(),
            username: "User",
            date: new Date().toLocaleDateString(),
        }]);
        setNewPost({ postId: 0, username: "", date: "", subject: "", content: "" });
        navigate('/postboard');
    };

    
    return (
    
        <>
        <header>
            {!isAuthenticated ? (
                <>
                    <button style={{backgroundColor: "#3C83F6"}} 
                    onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                    >구글 로그인</button>
                </>
            ) : (
                <>
                    <button onClick={handleLogout}>로그아웃</button>
                    <button onClick={() => navigate('/profile')}>마이프로필</button>
                </>
            )}

            <button onClick={() => navigate('/')}>홈으로</button>
        </header>
        <div>
            <button onClick={() => navigate('/postboard')}>게시판</button>
            <button onClick={() => navigate('/profile')}>프로필</button>

        </div>
        
        <Routes>
            <Route path="/postboard" element={
            <PostHome
                posts={posts}
                setPosts={setPosts} />}
            />
            
            <Route path="/post/:id" element={<PostDetail posts={posts} />} />
            <Route path="/post/posting" element={
                <PostCreate 
                    handleChange={handleChange} 
                    addPost={() => addPost()} 
                />} 
            />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
        </>
    )
    }

export default App
