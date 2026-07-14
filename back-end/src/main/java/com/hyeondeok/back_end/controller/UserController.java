package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.dto.UserDto;
import com.hyeondeok.back_end.repository.UserRepository;
import com.hyeondeok.back_end.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;


    @GetMapping("/me")
    public ResponseEntity<UserDto> getUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        // JwtAuthenticationFilter 에서의 userId 꺼내기
        Long userId = Long.parseLong(userDetails.getUsername());

        // 유저 조회 후 UserDto 프론트로 리턴
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return ResponseEntity.ok(new UserDto(user));
    }
}
