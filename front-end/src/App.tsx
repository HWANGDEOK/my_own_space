import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import PostDetail from "./PostDetail";
import type { Post } from "./types/post";

function App() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const [posts, setPosts] = useState<Post[]>([
        { postId: 1, username: "user1", date: "2026", subject:"첫 인사", content: "안녕하세요" },
        { postId: 2, username: "user2", date: "2026", subject:"가입 인사", content: "반갑습니다." }
    ]);


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
            {/* <Route path="/post/posting" element={<PostCreate} /> */}
        </Routes>
        </>
    )
    }

export default App
