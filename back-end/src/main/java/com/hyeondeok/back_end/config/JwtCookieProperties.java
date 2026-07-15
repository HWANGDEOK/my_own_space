package com.hyeondeok.back_end.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "jwt.cookie")
public class JwtCookieProperties {
    private boolean secure;
    private long accessMaxAge;
    private long refreshMaxAge;
}
