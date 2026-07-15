package com.hyeondeok.back_end.config;

import com.hyeondeok.back_end.filter.JwtFilter;
import com.hyeondeok.back_end.jwt.JwtTokenProvider;
import com.hyeondeok.back_end.security.Oauth2SuccessHandler;
import com.hyeondeok.back_end.service.Oauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableConfigurationProperties(JwtCookieProperties.class)
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final Oauth2UserService oauth2UserService;
    private final Oauth2SuccessHandler oauth2SuccessHandler;
    private final JwtTokenProvider jwtTokenProvider;

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
                    .requestMatchers("/api/auth/refresh").permitAll()
                    .anyRequest().authenticated()
            )

            .oauth2Login(oauth2 -> oauth2
                    .authorizationEndpoint(authorization -> authorization
                            .baseUri("/oauth2/authorization")
                    )
                    .userInfoEndpoint(userInfo -> userInfo
                            .userService(oauth2UserService)
                    )
                    .successHandler(oauth2SuccessHandler)
            )
                .addFilterBefore(new JwtFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // cors 허용 범위 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfiguration.setAllowedMethods(List.of("*"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setExposedHeaders(List.of("Authorization"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }
}
