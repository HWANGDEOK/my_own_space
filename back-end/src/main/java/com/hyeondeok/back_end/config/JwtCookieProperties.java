package com.hyeondeok.back_end.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt.cookie")
public class JwtCookieProperties {
    private long accessTokenMaxAge;
    private long refreshTokenMaxAge;
    private boolean secure;
}
