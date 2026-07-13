package com.hyeondeok.back_end.jwt;

import com.hyeondeok.back_end.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {

        // Base64로 된 88글자를 진짜 64바이트 데이터로 해독
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        // 해독된 데이터를 바탕으로 HMAC-SHA 키 생성
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // User 엔티티를 받아서 토큰 생성
    public String createToken(User user) {
        Date now = new Date();
        Date expiredTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));

        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
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
