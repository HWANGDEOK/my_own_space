export interface CommentDtoRes {
    commentId: number;
    userId: number;
    author: string;
    content: string;
    createdAt: string;
    childrenComments: CommentDtoRes[]; // 대댓글
}

export interface CommentDtoReq {
    parentId: number | null;
    userId: number;
    author: string;
    content: string;
}

export interface PostDtoRes {
    postId: number;
    userId: number;
    title: string;
    author: string;
    createdAt: string;
}

export interface PostDetailRes {
    postId: number;
    userId: number;
    title: string;
    author: string;
    content: string;
    createdAt: string;
    comments: CommentDtoRes[];
}

export interface PostDtoReq {
    userId: number;
    title: string;
    author: string;
    content: string;
}



export interface CommentCreateReq {
    parentId: number | null; // 일반 댓글은 null, 대댓글은 부모 ID
    userId: number;
    author: string;
    content: string;
}


