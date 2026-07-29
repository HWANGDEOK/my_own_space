package com.hyeondeok.back_end.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Component
@ConfigurationProperties(prefix = "file")
public class FileProperties {

    private String uploadDir;

}