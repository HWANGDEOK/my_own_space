package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.config.JwtCookieProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenCookieService {
    private final JwtCookieProperties jwtCookieProperties;

    public void addTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(jwtCookieProperties.isSecure()) // 운영 HTTPS에서는 반드시 true
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofSeconds(jwtCookieProperties.getAccessMaxAge()))
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(jwtCookieProperties.isSecure()) // 운영 HTTPS에서는 반드시 true
                .sameSite("Strict")
                .path("/api/auth") // refresh/logout 요청에만 전송
                .maxAge(Duration.ofSeconds(jwtCookieProperties.getRefreshMaxAge()))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

    }

    public void clearTokenCookies(HttpServletResponse response) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(jwtCookieProperties.isSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(jwtCookieProperties.isSecure())
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ZERO)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }
}
