package com.hyeondeok.back_end.security;


import com.hyeondeok.back_end.entity.User;
import com.hyeondeok.back_end.jwt.JwtTokenProvider;
import com.hyeondeok.back_end.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Oauth2UserService 에서 생성해서 넘겨준 인증 유저 객체 추출
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 구글이 준 고유 식별자(sub) 추출
        String provider = (String) oAuth2User.getAttributes().get("provider");
        String providerId = (String) oAuth2User.getAttributes().get("sub");

        // 토큰을 생성하기 위해 해당 유저 조회
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        // 토큰 발행
        String accessToken = jwtTokenProvider.createToken(user);

        // 프론트결과 페이지로 토큰을 실어서 리다이렉트
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", accessToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
