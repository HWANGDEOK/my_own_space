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
        // Oauth2UserService에서 생성해서 넘겨준 인증 유저 객체 추출
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 2. 구글이 준 고유 식별자(sub) 추출
        String providerId = (String) oAuth2User.getAttributes().get("sub");

        // 3. 토큰을 생성하기 위해 DB에서 해당 유저의 진짜 엔티티를 조회합니다.
        User user = userRepository.findByProviderAndProviderId("google", providerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        // 4. 토큰 발행
        String accessToken = jwtTokenProvider.createToken(user);
        log.info("JWT 토큰 발행 완료: {}", accessToken);

        // 5. 프론트엔드(React) 결과 페이지로 토큰을 실어서 리다이렉트
        // 나중에 프론트엔드 라우터 주소로 변경
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3306/oauth2/redirect")
                .queryParam("token", accessToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
