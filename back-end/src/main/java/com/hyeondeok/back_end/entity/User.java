package com.hyeondeok.back_end.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "user_tb")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String provider; // google

    @Column(nullable = false)
    private String providerId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder
    public User(String provider, String providerId, String email, String name, String nickname, Role role, LocalDateTime createdAt) {
        this.provider = provider;
        this.providerId = providerId;
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = createdAt;
    }


    public void updateProfile(String name, String email) {
        this.name = name;
        this.email = email;
        // 닉네임은 최초 랜덤 부여 후 따로 변경할 것이므로 구글 로그인 시점엔 갱신하지 않고 유지합니다.
    }
}
