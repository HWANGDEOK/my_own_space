package com.hyeondeok.back_end.repository;

import com.hyeondeok.back_end.jwt.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {

    private final StringRedisTemplate redisTemplate;

    private String key(Long userId, String tokenId) {
        return "refresh:" + userId + ":" + tokenId;
    }

    public void save(Long userId, String tokenId, String refreshToken, Duration ttl) {
        redisTemplate.opsForValue().set(
                key(userId, tokenId),
                TokenHashUtil.sha256(refreshToken),
                ttl
        );
    }

    public boolean matches(Long userId, String tokenId, String refreshToken) {
        String savedHash = redisTemplate.opsForValue().get(key(userId, tokenId));
        return savedHash != null && savedHash.equals(TokenHashUtil.sha256(refreshToken));
    }

    public void delete(Long userId, String tokenId) {
        redisTemplate.delete(key(userId, tokenId));
    }
}
