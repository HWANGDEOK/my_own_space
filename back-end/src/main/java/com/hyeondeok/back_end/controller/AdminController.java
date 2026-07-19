package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.config.AdminProperties;
import com.hyeondeok.back_end.entity.User;
import com.hyeondeok.back_end.jwt.JwtTokenProvider;
import com.hyeondeok.back_end.repository.UserRepository;
import com.hyeondeok.back_end.service.TokenCookieService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final AdminProperties adminProperties;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenCookieService tokenCookieService;


    @PostMapping("/activate")
    @Transactional
    public ResponseEntity<Void> activate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ActivateRequest adminReq,
            HttpServletResponse response) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


        Long userId = Long.parseLong(userDetails.getUsername());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.activateAdmin(); // UPDATE 반영 (Transactional 필요)

        // role 바껴서 들고 있는 accessToken 새로 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(user);
        tokenCookieService.addAccessTokenCookie(response, newAccessToken);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/deactivate")
    @Transactional
    public ResponseEntity<Void> deactivate(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletResponse response) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.parseLong(userDetails.getUsername());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.deactivateAdmin();

        String newAccessToken = jwtTokenProvider.createAccessToken(user);
        tokenCookieService.addAccessTokenCookie(response, newAccessToken);

        return ResponseEntity.noContent().build();
    }

    public record ActivateRequest(String key) {}
}
