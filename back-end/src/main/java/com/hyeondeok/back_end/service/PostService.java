package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.dto.CommentDto;
import com.hyeondeok.back_end.dto.PostDto;
import com.hyeondeok.back_end.entity.Comment;
import com.hyeondeok.back_end.entity.Post;
import com.hyeondeok.back_end.entity.PostState;
import com.hyeondeok.back_end.repository.CommentRepository;
import com.hyeondeok.back_end.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    // 게시글 등록
    @Transactional
    public Long createPost(PostDto.PostDtoReq request) {
        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .author(request.author())
                .userId(request.userId())
                .build();
        return postRepository.save(post).getPostId();
    }

    // 게시글 전체 목록 조회 (최신순 + 삭제 제외)
    public List<PostDto.PostDtoRes> getAllPosts() {
        return postRepository.findByStateOrderByPostIdDesc(PostState.POST)
                .stream()
                .map(PostDto.PostDtoRes::PostToRes)
                .collect(Collectors.toList());
    }

    // 게시글 상세 조회 (댓글까지 DELETE 상태 필터링하여 포함)
    public PostDto.PostDetailRes getPostDetail(Long postId) {
        // 존재하지 않거나 DELETE 상태인 게시글인 경우 예외 발생
        Post post = postRepository.findById(postId)
                .filter(p -> p.getState() == PostState.POST)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 삭제된 게시글입니다."));

        // 해당 게시글에 매핑된 댓글 중 'POST' 상태인 것만 등록순(오름차순)으로 조회
        List<CommentDto.CommentDtoRes> comments = commentRepository
                .findByPost_PostIdAndStateAndParentIsNullOrderByCommentIdAsc(postId, PostState.POST)
                .stream()
                .map(CommentDto.CommentDtoRes::CommentToRes)
                .collect(Collectors.toList());

        return PostDto.PostDetailRes.postDetail(post, comments);
    }

    // 게시글 수정
    @Transactional
    public Long updatePost(Long postId, PostDto.PostUpdateReq request) {
        Post post = postRepository.findById(postId)
                .filter(p -> p.getState() == PostState.POST)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않거나 이미 삭제되었습니다."));

        if (!post.getUserId().equals(request.userId())) {
            throw new IllegalArgumentException("게시글 수정 권한이 없습니다.");
        }

        post.updatePost(request.title(), request.content());

        return post.getPostId();
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Long postId, Long requesterId, boolean isAdmin) {
        Post post = postRepository.findById(postId)
                .filter(p -> p.getState() == PostState.POST)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않거나 이미 삭제되었습니다."));

        boolean isOwner = post.getUserId().equals(requesterId);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("게시글을 삭제할 권한이 없습니다.");
        }

        post.updatePostState(PostState.DELETE);
    }



    // 댓글 등록
    @Transactional
    public Long createComment(Long postId, CommentDto.CommentDtoReq request) {
        Post post = postRepository.findById(postId)
                .filter(p -> p.getState() == PostState.POST)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        Comment parent = null;
        // parentId가 넘어왔다면 부모 댓글을 찾아서 맵핑
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .filter(c -> c.getState() == PostState.POST)
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글이 존재하지 않습니다."));
        }

        Comment comment = Comment.builder()
                .post(post)
                .parent(parent)
                .userId(request.userId())
                .author(request.author())
                .content(request.content())
                .build();

        return commentRepository.save(comment).getCommentId();
    }


    // 댓글 수정
    @Transactional
    public void updateComment(Long commentId, CommentDto.CommentDtoUpdateReq request) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> c.getState() == PostState.POST)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 삭제된 댓글입니다."));

        comment.updateCommentContent(request.content());
    }

    // 댓글 상태를 DELETE로 업데이트
    @Transactional
    public void deleteComment(Long commentId, Long requesterId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> c.getState() == PostState.POST)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 이미 삭제된 댓글입니다."));

        boolean isOwner = comment.getUserId().equals(requesterId);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("게시글을 삭제할 권한이 없습니다.");
        }

        comment.updateCommentState(PostState.DELETE);
    }
}
