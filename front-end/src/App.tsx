import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import PostDetail from "./PostDetail";
import PostCreate from "./PostCreate";
import type { Post } from "./types/post";
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);

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

    const addPost = ():void => {
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
        setIsModalOpen(false);
        setNewPost({ postId: 0, username: "", date: "", subject: "", content: "" });
        navigate('/');
    };

    
    return (
    
        <>
        <header>
            <button onClick={() => {
                setIsLogin(true)
                console.log("로그인!")
            }}>로그인</button>
            <button style={{backgroundColor: "#03a94d"}} onClick={() => setIsLogin(true)}>네이버 로그인</button>
            <button onClick={() => {
                setIsLogin(false)
                console.log("로그아웃!")
            }}>로그아웃</button>
            <button onClick={() => navigate('/')}>홈으로</button>
        </header>
        
        <Routes>
            <Route path="/" element={
            <Home
                isLogin={isLogin}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
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
        </Routes>
        </>
    )
    }

export default App
