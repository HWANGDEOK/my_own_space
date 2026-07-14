package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class Oauth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final NicknameService nicknameService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 식별자 값 가져오기
        String attributeKey = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // 유저정보 추출
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 추출할 정보를 담을 변수들
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String nickname = nicknameService.generateRandomNickname();

        User user = userService.saveUser(provider, providerId, email, name, nickname);

        // Spring Security Context 에 인증된 유저 정보를 넘겨주기 위해 DefaultOAuth2User 객체를 생성 후 반환
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
                attributes,
                attributeKey
        );
    }
}
