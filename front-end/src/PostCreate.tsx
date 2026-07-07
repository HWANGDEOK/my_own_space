import { useNavigate } from 'react-router-dom';



function PostCreate(handleChange,addPost,newPost) {

    const navigate = useNavigate();

    return (
        <div style={{width: "250px"}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h3>새 게시글 작성</h3>
                <input name="content" onChange={handleChange} type="text" placeholder="content" />
                <input name="subject" onChange={handleChange} type="text" placeholder="subject" />
                <button onClick={() => addPost(newPost)}>등록</button>
                <button onClick={() => navigate('/')}>취소</button>
            </div>
        </div>
    )
}