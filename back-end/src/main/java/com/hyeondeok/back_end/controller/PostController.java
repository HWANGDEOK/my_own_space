package com.hyeondeok.back_end.controller;


import com.hyeondeok.back_end.dto.CommentDto;
import com.hyeondeok.back_end.dto.PostDto;
import com.hyeondeok.back_end.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;


    // 게시글 생성
    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody PostDto.PostDtoReq request) {
        Long postId = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(postId);
    }


    // 게시글 목록 조회 (최신순, DELETE 제외)
    @GetMapping
    public ResponseEntity<List<PostDto.PostDtoRes>> getAllPosts() {
        List<PostDto.PostDtoRes> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // 게시글 상세 조회 (필터링된 대댓글 목록 포함)
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto.PostDetailRes> getPostDetail(@PathVariable("postId") Long postId) {
        PostDto.PostDetailRes postDetail = postService.getPostDetail(postId);
        return ResponseEntity.ok(postDetail);
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<Long> updatePost(
            @PathVariable Long postId,
            @RequestBody PostDto.PostUpdateReq request) {

        Long updatedPostId = postService.updatePost(postId, request);
        return ResponseEntity.ok(updatedPostId);
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {

        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }




    // 댓글 및 대댓글 생성
    // 일반 댓글 등록 시: parentId를 null로 전송
    // 대댓글 등록 시: parentId에 부모 댓글 ID를 포함하여 전송
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Long> createComment(
            @PathVariable("postId") Long postId,
            @RequestBody CommentDto.CommentDtoReq request) {

        Long commentId = postService.createComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentId);
    }



    // 댓글 수정
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<String> updateComment(
            @PathVariable("commentId") Long commentId,
            @RequestBody CommentDto.CommentDtoUpdateReq request) {

        try {
            postService.updateComment(commentId, request);
            return ResponseEntity.ok("댓글이 성공적으로 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 수정 중 오류가 발생했습니다.");
        }
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable("commentId") Long commentId) {

        try {
            postService.deleteComment(commentId);
            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제 중 오류가 발생했습니다.");
        }
    }
}
