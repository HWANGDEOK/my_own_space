import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuthStore } from '../store/authStore';
import { postApi } from '../apis/postApi';


function PostCreatePage() {
    const navigate = useNavigate();
    const { data: user } = useUser();
    const isAuth = useAuthStore((state) => state.isAuth);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 비로그인 사용자가 접근했을 때 차단 처리
    useEffect(() => {
        if (!isAuth) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/');
        }
    }, [isAuth, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('사용자 정보를 불러올 수 없습니다. 다시 시도해주세요.');
            return;
        }
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            await postApi.createPost({
                title,
                content,
                author: user.nickname,
                userId: user.userId
            });
            alert('게시글이 등록되었습니다.');
            navigate('/posts');
        } catch (error) {
            console.error(error);
            alert('게시글 등록에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <h2>✍️ 새 게시글 작성</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    style={{ padding: '12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>취소</button>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등록</button>
                </div>
            </form>
        </div>
    );
}

export default PostCreatePage;