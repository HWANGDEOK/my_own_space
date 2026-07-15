package com.hyeondeok.back_end.security;


import com.hyeondeok.back_end.config.JwtCookieProperties;
import com.hyeondeok.back_end.entity.User;
import com.hyeondeok.back_end.jwt.JwtTokenProvider;
import com.hyeondeok.back_end.repository.RefreshTokenRepository;
import com.hyeondeok.back_end.repository.UserRepository;
import com.hyeondeok.back_end.service.TokenCookieService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final JwtCookieProperties jwtCookieProperties;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenCookieService tokenCookieService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Oauth2UserService 에서 생성해서 넘겨준 인증 유저 객체 추출
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // provider, provider 의 식별자(sub) 추출
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String provider = oauthToken.getAuthorizedClientRegistrationId();
        String providerId = (String) oAuth2User.getAttributes().get("sub");

        // 토큰을 생성하기 위해 해당 유저 조회
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        // 토큰 발행
        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user);

        Claims refreshClaims = jwtTokenProvider.getClaims(refreshToken);
        String tokenId = refreshClaims.getId();

        refreshTokenRepository.save(
                user.getUserId(),
                tokenId,
                refreshToken,
                Duration.ofSeconds(jwtCookieProperties.getRefreshTokenMaxAge())
        );

        tokenCookieService.addTokenCookies(response, accessToken, refreshToken);

        getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/oauth2/redirect");
    }

}
