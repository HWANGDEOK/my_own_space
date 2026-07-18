package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.entity.Role;
import com.hyeondeok.back_end.entity.User;
import com.hyeondeok.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User saveUser(String provider, String providerId, String email, String name, String nickname) {
        // 이미 가입된 유저인지 확인
        return userRepository.findByProviderAndProviderId(provider, providerId)
                .map(existingUser -> {
                    // 정보 갱신
                    existingUser.updateProfile(name, email);

                    return existingUser;
                })
                .orElseGet(() -> {
                    // 존재하지 않는 회원이라면 DB에 저장
                    User newUser = User.builder()
                            .provider(provider)
                            .providerId(providerId)
                            .email(email)
                            .name(name)
                            .nickname(nickname)
                            .role(Role.ROLE_USER)
                            .build();

                    return userRepository.save(newUser);
                });
    }

}
