package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.config.JwtCookieProperties;
import com.hyeondeok.back_end.jwt.CookieUtil;
import com.hyeondeok.back_end.service.AuthService;
import com.hyeondeok.back_end.service.TokenCookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Duration;

@Controller
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenCookieService tokenCookieService;
    private final JwtCookieProperties jwtCookieProperties;

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtil.getValue(request, "refresh_token")
                .orElseThrow(() ->
                        new IllegalArgumentException("refresh token이 없습니다."));

        AuthService.TokenPair tokenPair = authService.refresh(
                refreshToken,
                Duration.ofSeconds(jwtCookieProperties.getRefreshTokenMaxAge())
        );

        tokenCookieService.addTokenCookies(
                response,
                tokenPair.accessToken(),
                tokenPair.refreshToken()
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        CookieUtil.getValue(request, "refresh_token")
                .ifPresent(authService::logout);

        tokenCookieService.clearTokenCookies(response);

        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/csrf")
//    public ResponseEntity<Void> csrf(CsrfToken csrfToken) {
//        // Spring Security 6 uses deferred CSRF-token creation. Accessing the value
//        // materializes it so CookieCsrfTokenRepository writes XSRF-TOKEN to the response.
//        csrfToken.getToken();
//        return ResponseEntity.noContent().build();
//    }

    @GetMapping("/config")
    public ResponseEntity<AuthConfigResponse> config() {
        return ResponseEntity.ok(
                new AuthConfigResponse(jwtCookieProperties.getAccessTokenMaxAge())
        );
    }
    public record AuthConfigResponse(long accessTokenMaxAge) {}


}
