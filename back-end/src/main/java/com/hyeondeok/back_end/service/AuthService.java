package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.entity.User;
import com.hyeondeok.back_end.jwt.JwtTokenProvider;
import com.hyeondeok.back_end.repository.RefreshTokenRepository;
import com.hyeondeok.back_end.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public TokenPair refresh(String refreshToken, Duration refreshTtl) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않거나 만료된 refresh token입니다.");
        }

        Claims claims = jwtTokenProvider.getClaims(refreshToken);

        if (!"refresh".equals(claims.get("type", String.class))) {
            throw new IllegalArgumentException("refresh token이 아닙니다.");
        }

        Long userId = Long.valueOf(claims.getSubject());
        String tokenId = claims.getId();

        if (tokenId == null ||
                !refreshTokenRepository.matches(userId, tokenId, refreshToken)) {
            throw new IllegalArgumentException("만료되었거나 폐기된 refresh token입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // rotation: 기존 refresh token은 즉시 무효화
        refreshTokenRepository.delete(userId, tokenId);

        String newAccessToken = jwtTokenProvider.createAccessToken(user);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(user);

        Claims newRefreshClaims = jwtTokenProvider.getClaims(newRefreshToken);

        refreshTokenRepository.save(
                userId,
                newRefreshClaims.getId(),
                newRefreshToken,
                refreshTtl
        );

        return new TokenPair(newAccessToken, newRefreshToken);
    }

    public record TokenPair(String accessToken, String refreshToken) {
    }
}