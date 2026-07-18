import type {CommentDtoReq, PostDetailRes, PostDtoReq, PostDtoRes, } from "../types/post";
import api from "./userApi";

export const postApi = {
    // 게시글 생성
    createPost: async (data: PostDtoReq): Promise<number> => {
        const response = await api.post<number>('/posts', data);
        return response.data;
    },

    // 게시글 목록 조회
    getAllPosts: async (): Promise<PostDtoRes[]> => {
        const response = await api.get<PostDtoRes[]>('/posts');
        return response.data;
    },

    // 게시글 상세 조회
    getPostDetail: async (postId: number): Promise<PostDetailRes> => {
        const response = await api.get<PostDetailRes>(`/posts/${postId}`);
        return response.data;
    },

    // 댓글/대댓글 생성
    createComment: async (postId: number, data: CommentDtoReq): Promise<number> => {
        const response = await api.post<number>(`/api/posts/${postId}/comments`, data);
        return response.data;
    }
};