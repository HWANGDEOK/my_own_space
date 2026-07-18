package com.hyeondeok.back_end.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comment_tb")
@Getter
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // 부모 댓글: 외래키명을 parent_id로 잡고 상위 댓글을 참조합니다. (대댓글이 아니라면 null 가능)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    // 자식 댓글들: 하나의 댓글 아래에 여러 대댓글이 올 수 있으므로 1:N 매핑
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Comment> childrenComments = new ArrayList<>();

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostState state = PostState.POST;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Comment(Post post, String content, String author, Long userId) {
        this.post = post;
        this.content = content;
        this.author = author;
        this.userId = userId;
        this.state = PostState.POST;
    }
}
