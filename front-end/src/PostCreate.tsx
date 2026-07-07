import { useNavigate } from 'react-router-dom';

interface PostCreateProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    addPost: () => void;
}

function PostCreate({handleChange, addPost}:PostCreateProps) {

    const navigate = useNavigate();

    return (
    <>
        <div style={{width: "250px"}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h3>새 게시글 작성</h3>
                <input name="subject" onChange={handleChange} type="text" placeholder="subject" />
                <input name="content" onChange={handleChange} type="text" placeholder="content" />
                <button onClick={() => {
                    addPost()
                    navigate('/')
                }}>등록</button>
                <button onClick={() => navigate('/')}>취소</button>
            </div>
        </div>
    </>
    )
}



export default PostCreate;