package com.hyeondeok.back_end.dto;

import com.hyeondeok.back_end.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserDto {
    private Long userId;
    private String email;
    private String name;
    private String nickname;
    private String role;

    // 엔티티를 DTO 객체로 변환
    public UserDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.nickname = user.getNickname();
        this.role = user.getRole().name();
    }
}
