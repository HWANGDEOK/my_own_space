package com.hyeondeok.back_end.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.unit.DataSize;

import java.util.List;

@Getter
@Component
@ConfigurationProperties(prefix = "file.upload")
public class FileProperties {

    private String dir;
    private DataSize maxSize;
    private List<String> allowedTypes;

}