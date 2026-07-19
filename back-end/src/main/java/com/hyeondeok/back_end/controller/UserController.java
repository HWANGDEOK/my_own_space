package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.dto.UserDto;
import com.hyeondeok.back_end.repository.UserRepository;
import com.hyeondeok.back_end.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getUserInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {

        // 유저 정보가 정상적으로 인증 필터를 통과해 존재하는 경우 (정상 로그인 상태)
        if (userDetails != null) {
            Long userId = Long.parseLong(userDetails.getUsername());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            return ResponseEntity.ok(new UserDto(user));
        }

        // 인증 정보는 없는데(null), 쿠키에 'access_token' 자체가 존재하는지 확인
        boolean hasAccessTokenCookie = false;
        if (request.getCookies() != null) {
            hasAccessTokenCookie = Arrays.stream(request.getCookies())
                    .anyMatch(cookie -> "access_token".equals(cookie.getName()));
        }

        // 상황별 분기 처리
        if (!hasAccessTokenCookie) {
            // 비로그인 쿠키에 access_token 자체가 아예 없음 -> 에러 안 터뜨리고 null 반환
            return ResponseEntity.ok(null);
        }

        // 쿠키는 들고 왔는데 userDetails 가 null 이라는 건 필터에서 만료 및 유효하지 않음
        // 프론트엔드가 401 -> /auth/refresh 요청
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
