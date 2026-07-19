package com.hyeondeok.back_end.dto;

import com.hyeondeok.back_end.entity.Comment;
import com.hyeondeok.back_end.entity.PostState;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.stream.Collectors.toList;

public class CommentDto {
    // 댓글 등록(요청 받는거)
    public record CommentDtoReq(
            Long parentId,
            Long userId,
            String author,
            String content
    ) {}


    // 댓글 조회(응답 하는거)
    public record CommentDtoRes(
            Long commentId,
            Long userId,
            String author,
            String content,
            LocalDateTime createdAt,
            List<CommentDtoRes> childrenComment
    ) {
        public static CommentDtoRes CommentToRes(Comment comment) {
            return new CommentDtoRes(
                    comment.getCommentId(),
                    comment.getUserId(),
                    comment.getAuthor(),
                    comment.getContent(),
                    comment.getCreatedAt(),
                    comment.getChildrenComments().stream()
                            .filter(c -> c.getState() == PostState.POST)
                            .map(CommentDto.CommentDtoRes::CommentToRes)
                            .toList()
            );
        }
    }

    public record CommentDtoUpdateReq(
            String content
    ) {}

}
