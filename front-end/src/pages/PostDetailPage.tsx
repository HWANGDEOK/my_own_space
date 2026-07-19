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

    // 댓글 수정
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

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

    // 게시글 삭제 핸들러
    const handleDeletePost = async () => {
        if (!postId) return;
        if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

        try {
            await postApi.deletePost(Number(postId), Number(user?.userId)); 
            alert('게시글이 삭제되었습니다.');
            navigate('/postboard');
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

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

    // 댓글/대댓글 수정 제출
    const handleUpdateComment = async (commentId: number) => {
        if (!editContent.trim()) return;
        try {
            // 프로젝트 API 형식에 맞게 조절하세요 (예: postApi.updateComment(commentId, content))
            await postApi.updateComment(commentId, { content: editContent });
            setEditingCommentId(null);
            setEditContent('');
            fetchDetail();
        } catch (error) {
            console.error(error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    // 댓글/대댓글 삭제
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;
        try {
            await postApi.deleteComment(commentId);
            fetchDetail();
        } catch (error) {
            console.error(error);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    // 수정 모드 진입 설정 정리 리팩토링
    const startEditing = (commentId: number, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
        setReplyTargetId(null); // 답글 창 열려있으면 닫기
    };



    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>본문을 불러오는 중입니다...</div>;
    if (!post) return null;

    const isMyPost = user && user.userId === post.userId;

    return (
        <div style={{ padding: '20px', maxWidth: '850px', margin: '0 auto' }}>
            {/* 본문 영역 */}
            <div style={{ borderBottom: '2px solid #222', paddingBottom: '15px', marginBottom: '20px' }}>
                <button 
                    onClick={() => navigate('/postboard')} 
                    style={{ cursor: 'pointer', backgroundColor: '#f8f9fa'}}
                >목록으로</button>

                <h1 style={{}}>{post.title}</h1>
                <div style={{}}>
                    작성자: <strong style={{}}>{post.author}</strong>
                    <span style={{}}>|</span>
                    작성일: {new Date(post.createdAt).toLocaleString()}
                </div>
                {/* 💡 본인 게시글일 경우에만 수정/삭제 버튼 노출 */}
                    {isMyPost && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                                onClick={() => navigate(`/posts/${postId}/edit`)} //
                                style={{ ...actionBtnStyle, padding: '2px 6px', border: '1px solid #ccc', borderRadius: '4px' }}
                            >
                                수정
                            </button>
                            <button 
                                onClick={handleDeletePost} 
                                style={{ ...actionBtnStyle, padding: '2px 6px', border: '1px solid #dc3545', color: '#dc3545', borderRadius: '4px' }}
                            >
                                삭제
                            </button>
                        </div>
                    )}
            </div>
            
            {/* 본문 내용 */}
            <div style={{}}>
                {post.content}
            </div>

            {/* 댓글 섹션 */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>💬 댓글 ({countAllComments(post.comments)}개)</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    
                    {post.comments.map((comment) => { // 임시로 임포트나 타입 에러 방지를 위해 any 또는 타입 조정
                        const isMyComment = user && user.userId === comment.userId;
                        const isEditing = editingCommentId === comment.commentId;

                        return (
                            /* 📦 1. 부모와 자식 대댓글을 통째로 감싸는 하나의 "댓글 그룹 카드" */
                            <div 
                                key={comment.commentId} 
                                style={{ 
                                    background: '#fcfcfc', 
                                    borderRadius: '8px', 
                                    border: '1px solid #eaeaea', 
                                    padding: '15px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                }}
                            >
                                {/* 👤 2. 부모 댓글 영역 */}
                                <div style={{ 
                                    borderBottom: comment.childrenComment?.length > 0 || replyTargetId === comment.commentId ? '1px dashed #eee' : 'none', 
                                    paddingBottom: comment.childrenComment?.length > 0 || replyTargetId === comment.commentId ? '12px' : '0' 
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                        <strong>{comment.author}</strong>
                                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>

                                    {/* 부모 댓글 수정 모드 분기 */}
                                    {isEditing ? (
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                            <input 
                                                type="text"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                                            />
                                            <button onClick={() => handleUpdateComment(comment.commentId)} style={{ ...actionBtnStyle, color: '#007bff', fontWeight: 'bold' }}>저장</button>
                                            <button onClick={() => setEditingCommentId(null)} style={actionBtnStyle}>취소</button>
                                        </div>
                                    ) : (
                                        <>
                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {user && (
                                                    <button 
                                                        onClick={() => {
                                                            setReplyTargetId(replyTargetId === comment.commentId ? null : comment.commentId);
                                                            setEditingCommentId(null);
                                                        }}
                                                        style={{ ...actionBtnStyle, color: '#007bff', fontWeight: 'bold', marginLeft: 0 }}
                                                    >
                                                        {replyTargetId === comment.commentId ? '[취소]' : '[답글달기]'}
                                                    </button>
                                                )}
                                                {isMyComment && (
                                                    <>
                                                        <button onClick={() => startEditing(comment.commentId, comment.content)} style={actionBtnStyle}>[수정]</button>
                                                        <button onClick={() => handleDeleteComment(comment.commentId)} style={{ ...actionBtnStyle, color: '#dc3545' }}>[삭제]</button>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* 👪 3. 부모 내부로 들어온 자식 대댓글(답글) 리스트 영역 */}
                                {/* 💡 comment.childrenComments 대신, 위에서 정의한 replies 배열을 사용합니다. */}
                                {comment.childrenComment?.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', paddingLeft: '15px' }}>
                                        {comment.childrenComment?.map((reply: CommentDtoRes) => {
                                            const isMyReply = user && user.userId === reply.userId;
                                            const isReplyEditing = editingCommentId === reply.commentId;

                                            return (
                                                <div 
                                                    key={reply.commentId} 
                                                    style={{ 
                                                        padding: '10px 12px', 
                                                        background: '#f8f9fa', 
                                                        borderRadius: '6px', 
                                                        borderLeft: '3px solid #007bff' 
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                        <strong>↳ {reply.author}</strong>
                                                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                                    </div>

                                                    {/* 대댓글 수정 모드 분기 */}
                                                    {isReplyEditing ? (
                                                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                                            <input 
                                                                type="text"
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                                                            />
                                                            <button onClick={() => handleUpdateComment(reply.commentId)} style={{ ...actionBtnStyle, color: '#007bff', fontWeight: 'bold' }}>저장</button>
                                                            <button onClick={() => setEditingCommentId(null)} style={actionBtnStyle}>취소</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#444', whiteSpace: 'pre-wrap' }}>{reply.content}</p>
                                                            {isMyReply && (
                                                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                                    <button onClick={() => startEditing(reply.commentId, reply.content)} style={{ ...actionBtnStyle, marginLeft: 0 }}>[수정]</button>
                                                                    <button onClick={() => handleDeleteComment(reply.commentId)} style={{ ...actionBtnStyle, color: '#dc3545' }}>[삭제]</button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* 📝 4. 부모 내부로 들어온 대댓글 입력 폼 */}
                                {replyTargetId === comment.commentId && (
                                    <div style={{ marginTop: '12px', paddingLeft: '15px', display: 'flex', gap: '10px' }}>
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
                        );
                    })}
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



const actionBtnStyle: React.CSSProperties = {
    fontSize: '12px',
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '5px 0 0 0',
    fontWeight: 'normal',
    marginLeft: '10px'
};