package com.hyeondeok.back_end.dto;

import com.hyeondeok.back_end.entity.Post;

import java.time.LocalDateTime;
import java.util.List;

public class PostDto {
    // 게시글 등록 (요청 받는거)
    public record PostDtoReq(
            Long userId,
            String title,
            String author,
            String content
    ) {}

    // 게시글 목록 조회 (응답 하는거)
    public record PostDtoRes(
            Long postId,
            Long userId,
            String title,
            String author,
            LocalDateTime createdAt
    ) {
        public static PostDtoRes PostToRes(Post post) {
            return new PostDtoRes(
                    post.getPostId(),
                    post.getUserId(),
                    post.getTitle(),
                    post.getAuthor(),
                    post.getCreatedAt()
            );
        }
    }

    public record PostDetailRes(
            Long postId,
            Long userId,
            String title,
            String author,
            String content,
            LocalDateTime createdAt,
            List<CommentDto.CommentDtoRes> comments
    ) {
        public static PostDetailRes postDetail(Post post, List<CommentDto.CommentDtoRes> filteredComments) {
            return new PostDetailRes(
                    post.getPostId(),
                    post.getUserId(),
                    post.getTitle(),
                    post.getAuthor(),
                    post.getContent(),
                    post.getCreatedAt(),
                    filteredComments
            );
        }
    }

    public record PostUpdateReq(
            Long userId,        // 작성자 ID
            String title,       // 수정할 제목
            String content      // 수정할 내용
    ) {}
}
