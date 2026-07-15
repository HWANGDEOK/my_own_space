package com.hyeondeok.back_end.jwt;

import com.hyeondeok.back_end.config.JwtCookieProperties;
import com.hyeondeok.back_end.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private final JwtCookieProperties jwtCookieProperties;
    private final SecretKey key;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey, JwtCookieProperties jwtCookieProperties) {
        this.jwtCookieProperties = jwtCookieProperties;

        // Base64로 된 88글자를 진짜 64바이트 데이터로 해독
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        // 해독된 데이터를 바탕으로 HMAC-SHA 키 생성
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // AccessToken 생성
    public String createAccessToken(User user) {
        Date now = new Date();
        Date expiredTime = new Date(now.getTime() + jwtCookieProperties.getAccessTokenMaxAge() * 1000);

        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .claim("type", "access")
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiredTime)
                .signWith(key)
                .compact();
    }

    // refreshToken 생성
    public String createRefreshToken(User user) {
        Date now = new Date();
        Date expiredTime = new Date(now.getTime() + jwtCookieProperties.getRefreshTokenMaxAge() * 1000);

        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .id(UUID.randomUUID().toString())
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(expiredTime)
                .signWith(key)
                .compact();
    }

    // 유효성 검사(필터에서 쓸 거)
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    // 토큰에서 데이터 추출
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
