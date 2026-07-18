import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { PostDtoRes } from '../types/post';
import { postApi } from '../apis/postApi';


function PostListPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuth);
    
    const [posts, setPosts] = useState<PostDtoRes[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await postApi.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error('게시글 목록을 불러오는 중 오류가 발생.', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>게시글을 불러오는 중입니다...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>📋 게시판 목록</h2>
                {/* 로그인 상태일 때만 글쓰기 버튼 활성화 */}
                {isAuthenticated && (
                    <button 
                        onClick={() => navigate('/posts/create')} 
                        style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        글쓰기
                    </button>
                )}
            </div>

            {posts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>등록된 게시글이 없습니다.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc', background: '#f8f9fa' }}>
                            <th style={{ padding: '12px', width: '80px' }}>번호</th>
                            <th style={{ padding: '12px' }}>제목</th>
                            <th style={{ padding: '12px', width: '120px' }}>작성자</th>
                            <th style={{ padding: '12px', width: '150px' }}>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr 
                                key={post.postId} 
                                onClick={() => navigate(`/posts/${post.postId}`)} 
                                style={{ borderBottom: '1px solid #eee', cursor: 'pointer', textAlign: 'center' }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f5')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <td style={{ padding: '12px' }}>{post.postId}</td>
                                <td style={{ padding: '12px', textAlign: 'left', fontWeight: '500' }}>{post.title}</td>
                                <td style={{ padding: '12px' }}>{post.author}</td>
                                <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default PostListPage;