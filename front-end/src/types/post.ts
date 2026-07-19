// 게시글 조회용
export interface PostDtoRes {
    postId: number;
    userId: number;
    title: string;
    author: string;
    createdAt: string;
}

// 게시글 내부 조회용
export interface PostDetailRes {
    postId: number;
    userId: number;
    title: string;
    author: string;
    content: string;
    createdAt: string;
    comments: CommentDtoRes[];
}

// 게시글 등록용
export interface PostDtoReq {
    userId: number;
    title: string;
    author: string;
    content: string;
}

// 게시글 수정
export interface PostUpdateReq {
    userId: number;
    title: string;
    content: string;
}



// 댓글 계층
export interface CommentDtoRes {
    commentId: number;
    userId: number;
    author: string;
    content: string;
    createdAt: string;
    childrenComment: CommentDtoRes[]; // 대댓글
}

// 댓글 등록
export interface CommentCreateReq {
    parentId: number | null; // 일반 댓글은 null, 대댓글은 부모 ID
    userId: number;
    author: string;
    content: string;
}

// 댓글 등록
export interface CommentDtoReq {
    parentId: number | null;
    userId: number;
    author: string;
    content: string;
}


export interface CommentDtoUpdateReq {
    content: string;
}