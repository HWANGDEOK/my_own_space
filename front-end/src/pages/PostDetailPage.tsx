import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import type { CommentDtoRes, PostDetailRes } from '../types/post';
import { postApi } from '../apis/postApi';
import countAllComments from '../util/postUtil';



function PostDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    
    // 비로그인 시 /user/me가 401 에러를 던져서 react-query가 isError 상태가 되어도 
    // 화면 전체가 깨지거나 alert가 뜨지 않고 단순 'user = null'인 상태로 다룸
    const { data: user } = useUser();

    const [post, setPost] = useState<PostDetailRes | null>(null);
    const [loading, setLoading] = useState(true);
    
    // 입력 폼 상태 관리
    const [commentContent, setCommentContent] = useState('');
    const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchDetail = async () => {
        if (!postId) return;

        // 게시글 가져오기
        try {
            const data = await postApi.getPostDetail(Number(postId));
            setPost(data);
        } catch (error) {
            console.error('게시글 상세 조회 실패:', error);
            alert('존재하지 않거나 삭제된 게시글입니다.');
            navigate('/posts');
        } finally {
            setLoading(false);
        }
    };

    // postId 변경시 게시글 다시 가져오기
    useEffect(() => {
        fetchDetail();
    }, [postId]);

    // 일반 댓글 등록
    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('로그인이 필요합니다.');
        if (!commentContent.trim()) return;

        try {
            await postApi.createComment(Number(postId), {
                parentId: null,
                userId: user.userId,
                author: user.nickname || user.name,
                content: commentContent
            });
            setCommentContent('');
            fetchDetail();
        } catch (error) {
            console.log(error);
            alert('댓글 등록에 실패했습니다.');
        }
    };

    // 2. 대댓글(답글) 등록
    const handleCreateReply = async (parentId: number) => {
        if (!user) return alert('로그인이 필요합니다.');
        if (!replyContent.trim()) return;

        try {
            await postApi.createComment(Number(postId), {
                parentId: parentId,
                userId: user.userId,
                author: user.nickname || user.name,
                content: replyContent
            });
            setReplyContent('');
            setReplyTargetId(null);
            fetchDetail();
        } catch (error) {
            console.error(error);
            alert('답글 등록에 실패했습니다.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>본문을 불러오는 중입니다...</div>;
    if (!post) return null;

    return (
        <div style={{ padding: '20px', maxWidth: '850px', margin: '0 auto' }}>
            {/* 본문 영역 */}
            <div style={{ borderBottom: '2px solid #222', paddingBottom: '15px', marginBottom: '20px' }}>
                <button 
                    onClick={() => navigate('/posts')} 
                    style={{ padding: '6px 12px', marginBottom: '15px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                    ← 목록으로
                </button>
                <h1 style={{ margin: '5px 0', fontSize: '26px', color: '#111' }}>{post.title}</h1>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                    작성자: <strong style={{ color: '#333' }}>{post.author}</strong>
                    <span style={{ margin: '0 10px' }}>|</span>
                    작성일: {new Date(post.createdAt).toLocaleString()}
                </div>
            </div>
            
            {/* 본문 내용 */}
            <div style={{ minHeight: '200px', fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-wrap', borderBottom: '1px solid #ddd', paddingBottom: '40px', color: '#222' }}>
                {post.content}
            </div>

            {/* 댓글 섹션 */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>💬 댓글 ({countAllComments(post.comments)}개)</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    {post.comments.map((comment) => (
                        <div key={comment.commentId} style={{ borderBottom: '1px solid #f1f3f5', paddingBottom: '15px' }}>
                            {/* 부모 댓글 */}
                            <div style={{ padding: '12px 15px', background: '#fcfcfc', borderRadius: '6px', border: '1px solid #eaeaea' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                    <strong>{comment.author}</strong>
                                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                                
                                {/* 💡 로그인한 회원에게만 답글 작성 버튼 노출 */}
                                {user && (
                                    <button 
                                        onClick={() => setReplyTargetId(replyTargetId === comment.commentId ? null : comment.commentId)}
                                        style={{ fontSize: '12px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: '5px 0 0 0', fontWeight: 'bold' }}
                                    >
                                        {replyTargetId === comment.commentId ? '[취소]' : '[답글달기]'}
                                    </button>
                                )}
                            </div>

                            {/* 자식 대댓글 리스트 순회 (DTO 규격 맞춤: childrenComment) */}
                            {comment.childrenComments && comment.childrenComments.map((reply) => (
                                <div key={reply.commentId} style={{ marginLeft: '40px', marginTop: '8px', padding: '10px 15px', background: '#f8f9fa', borderRadius: '6px', borderLeft: '3px solid #007bff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                        <strong>↳ {reply.author}</strong>
                                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#444', whiteSpace: 'pre-wrap' }}>{reply.content}</p>
                                </div>
                            ))}

                            {/* 대댓글 토글 입력 폼 */}
                            {replyTargetId === comment.commentId && (
                                <div style={{ marginLeft: '40px', marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="답글 내용을 입력하세요..." 
                                        value={replyContent} 
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                                    />
                                    <button 
                                        onClick={() => handleCreateReply(comment.commentId)} 
                                        style={{ padding: '0 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        등록
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 📝 최상위 댓글 입력 영역 */}
                {user ? (
                    <form onSubmit={handleCreateComment} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="깨끗하고 따뜻한 댓글을 남겨보세요."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                        />
                        <button 
                            type="submit" 
                            style={{ padding: '0 25px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >
                            등록
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', color: '#888', fontSize: '13px', padding: '15px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                        로그인한 사용자만 댓글을 작성할 수 있습니다.
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostDetailPage;