package com.hyeondeok.back_end.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 시스템 내부 식별자 (PK)

    // 1. OAuth2 연동을 위한 핵심 변수
    @Column(nullable = false)
    private String provider; // "google", "naver"

    @Column(nullable = false)
    private String providerId; // 소셜 플랫폼에서 나에게 준 유저의 "고유 숫자/문자열 ID"

    // 2. 소셜 가입 시 받아올 유저 정보
    @Column(nullable = false)
    private String email; // 사용자의 이메일

    @Column(nullable = false)
    private String nickname; // 사용자의 이름 또는 닉네임


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder
    public User(String provider, String providerId, String email, String nickname, Role role) {
        this.provider = provider;
        this.providerId = providerId;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }
}
