package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.entity.User;
import com.hyeondeok.back_end.security.PrincipalUser;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class Oauth2Service extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // registrationId는 naver, google 등 clientName
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 응답 데이터 원본
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 우리가 추출할 정보를 담을 변수들
        Map<String, Object> response = null;
        String provider = null;
        String providerId = null;
        String email = null;
        String nameAttributeKey = null;

        // 플랫폼 별로 처리
        if ("google".equalsIgnoreCase(registrationId)) {
            // 구글은 attributes에 데이터
            response = attributes;
            provider = "google";
            providerId = (String) response.get("sub");
            email = (String) response.get("email");
            nameAttributeKey = "sub";
        }

        // User 엔티티
        User user = User.builder()
                .provider(provider)
                .providerId(providerId)
                .email(email)
                .build();

        // principalUser에 정보 저장
        return new PrincipalUser(user, response, nameAttributeKey);
    }
}
