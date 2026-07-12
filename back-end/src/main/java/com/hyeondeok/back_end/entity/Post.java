package com.hyeondeok.back_end.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Column
    private long userId;

    @Column
    private String username;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private String subject;

    @Column
    private LocalDateTime postdate;

    @PrePersist
    public void prePersist() {
        this.postdate = LocalDateTime.now();
    }
}
