import { useNavigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';

interface CreatePostProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    addPost: () => void;
}

function CreatePost({handleChange, addPost}:CreatePostProps) {
    const { data: user, isLoading } = useUser();
    const navigate = useNavigate();


    if (isLoading) return <div>로딩 중...</div>;
    return (
    <>
        <div style={{width: "250px"}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h3>새 게시글 작성</h3>
                <h2>작성자 {user?.nickname}</h2>
                <input name="subject" onChange={handleChange} type="text" placeholder="subject" />
                <input name="content" onChange={handleChange} type="text" placeholder="content" />
                <button onClick={() => {
                    addPost()
                }}>등록</button>
                <button onClick={() => navigate('/postboard')}>취소</button>
            </div>
        </div>
    </>
    )
}



export default CreatePost;