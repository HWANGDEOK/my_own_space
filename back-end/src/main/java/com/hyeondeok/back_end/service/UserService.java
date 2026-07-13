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
                    // 기존 유저가 존재, 구글 프로필 정보가 변경되었을 수 있으므로 업데이트
                    log.info("기존 유저 로그인 - 정보 업데이트 진행: {}", email);

                    // 더티 체킹(Dirty Checking)을 이용해 엔티티 정보 갱신
                    // (엔티티 내부에 정보 변경 메서드를 만들어도 좋고, 여기서는 재빌드나 세터 대용으로 사용 가능)
                    // 지금은 엔티티가 불변(Immutable)에 가깝게 설계되어 있으므로 새로 갱신된 객체를 받아오는 방식을 쓰거나
                    User updatedUser = User.builder()
                            .provider(existingUser.getProvider())
                            .providerId(existingUser.getProviderId())
                            .email(email)
                            .name(name)
                            .nickname(existingUser.getNickname())
                            .role(existingUser.getRole())
                            .createdAt(existingUser.getCreatedAt())
                            .build();

                    return userRepository.save(updatedUser);
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
                            .createdAt(LocalDateTime.now())
                            .build();

                    return userRepository.save(newUser);
                });
    }

}
