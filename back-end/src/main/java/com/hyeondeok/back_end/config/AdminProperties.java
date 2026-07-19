package com.hyeondeok.back_end.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "admin")
public class AdminProperties {
    private String activationKey;
}
