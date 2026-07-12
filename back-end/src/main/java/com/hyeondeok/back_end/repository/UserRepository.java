package com.hyeondeok.back_end.repository;

import com.hyeondeok.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 이미 소셜 가입된 유저인지 조회
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
