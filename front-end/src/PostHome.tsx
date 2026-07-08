import { Link } from "react-router-dom";
import type { HomeProps } from "./types/post";
import { useNavigate } from 'react-router-dom';


function PostHome({posts, setPosts}:HomeProps) {
    const navigate = useNavigate(); 
    
    const delPost = (id: number) => {
        const filteredPosts = posts.filter((post) => post.postId !== id);
        setPosts(filteredPosts);
    };



    return (<>
        {/* <button onClick={() => {
            if (!isLogin) {
                alert("로그인이 필요합니다");
                return;
                }
            setIsModalOpen(!isModalOpen)}}>다른거
        </button> */}

        <button onClick={() => {
            const loginStatus = !!localStorage.getItem('isLoggedIn');
                if (loginStatus) {
                    navigate('/post/posting')
                } else {
                    alert("로그인이 필요합니다.")
                }
            }
        }>게시글 등록</button>

        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th>번호</th>
                <th>작성자</th>
                <th>작성일자</th>
                <th>제목</th>
                <th>관리</th>
            </tr>
            </thead>
            <tbody>
            {posts.map((post) => (
                <tr key={post.postId} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                <td>{post.postId}</td>
                <td>{post.username}</td>
                <td>{post.date}</td>
                <td>
                    <Link to={`/post/${post.postId}`} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                        {post.subject}
                    </Link>
                </td>
                <td>
                    <button onClick={() => delPost(post.postId)}>삭제</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* 나중에 다른 기능으로 쓸 모달창 */}
        {/* {isModalOpen && (
            <div style={{width: "250px"}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h3></h3>
                    <input name="content" onChange={handleChange} type="text" placeholder="content" />
                    <input name="subject" onChange={handleChange} type="text" placeholder="subject" />
                    <button onClick={() => addPost(newPost)}>등록</button>
                    <button onClick={() => setIsModalOpen(false)}>취소</button>
                </div>
            </div>
        )} */}
    </>
    )
}

export default PostHome;