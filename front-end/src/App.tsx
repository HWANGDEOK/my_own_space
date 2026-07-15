import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PostHome from "./PostHome";
import PostDetail from "./PostDetail";
import PostCreate from "./CreatePost";
import type { Post } from "./types/post";
import { useNavigate } from 'react-router-dom';
import OAuth2RedirectHandler from "./pages/Oauth2RedirectHandler";
import Profile from "./pages/Profile";
import Header from "./components/Header";

function App() {
    const navigate = useNavigate();
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        () => !!localStorage.getItem('accessToken')
    );

    
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

    const handleLogout = () => {
        console.log("로그아웃!");
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        navigate('/');
    }
    
    return (
    
        <>
        <header>
            {!isLoggedIn ? (
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
        <Header />
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
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
        </>
    )
    }

export default App
