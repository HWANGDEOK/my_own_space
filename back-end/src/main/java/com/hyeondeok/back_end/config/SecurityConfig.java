package com.hyeondeok.back_end.config;

import com.hyeondeok.back_end.security.Oauth2SuccessHandler;
import com.hyeondeok.back_end.service.Oauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final Oauth2UserService oauth2UserService;
    private final Oauth2SuccessHandler oauth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // REST API 관련 설정
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)

            // jwt 인증이라 세션 생성 없이
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // url 권한
            .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
            )

            .oauth2Login(oauth2 -> oauth2
                    // 구글 로그인창으로 기본 엔드포인트 규칙 설정
                    .authorizationEndpoint(authorization -> authorization
                            .baseUri("/oauth2/authorization")
                    )
                    .userInfoEndpoint(userInfo -> userInfo
                            .userService(oauth2UserService)
                    )
                    .successHandler(oauth2SuccessHandler)
            );

        return http.build();
    }
}
