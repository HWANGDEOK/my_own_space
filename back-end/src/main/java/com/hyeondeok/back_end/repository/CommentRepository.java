package com.hyeondeok.back_end.repository;

import com.hyeondeok.back_end.entity.Comment;
import com.hyeondeok.back_end.entity.PostState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPost_PostIdAndStateOrderByCommentIdAsc(Long postId, PostState state);
    List<Comment> findByPost_PostIdAndParentIsNullAndStateOrderByCommentIdAsc(Long postId, PostState state);
}
