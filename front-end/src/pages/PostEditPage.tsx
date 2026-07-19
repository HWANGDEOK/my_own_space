import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuthStore } from '../store/authStore';
import { postApi } from '../apis/postApi';

function PostEditPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { data: user } = useUser();
    const isAuth = useAuthStore((state) => state.isAuth);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    // 비로그인 사용자 접근 차단 및 기존 게시글 데이터 불러오기
    useEffect(() => {
        if (!isAuth) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/');
            return;
        }

        const fetchPostDetail = async () => {
            if (!postId) return;
            try {
                const data = await postApi.getPostDetail(Number(postId));
                
                if (user && data.userId !== user.userId) {
                    alert('본인의 게시글만 수정할 수 있습니다.');
                    navigate('/postboard');
                    return;
                }

                setTitle(data.title);
                setContent(data.content);
            } catch (error) {
                console.error('수정할 게시글 조회 실패:', error);
                alert('게시글을 불러오는데 실패했습니다.');
                navigate('/postboard');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPostDetail();
        }
    }, [isAuth, navigate, postId, user]);

    // 수정 완료
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
            await postApi.updatePost(Number(postId), {
                title,
                content,
                userId: user.userId
            });
            alert('게시글이 수정되었습니다.');
            navigate(`/posts/${postId}`);

        } catch (error) {
            console.error(error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>기존 내용을 불러오는 중입니다...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <h2>✏️ 게시글 수정</h2>
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
                    <button type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        수정 완료</button>
                </div>
            </form>
        </div>
    );
}

export default PostEditPage;