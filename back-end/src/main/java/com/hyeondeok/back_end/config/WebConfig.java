package com.hyeondeok.back_end.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final FileProperties fileProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = fileProperties.getUploadDir();

        // 경로 끝에 반드시 '/'가 붙어있어야 내부 파일들과 정상 매핑됩니다.
        String location = uploadDir.endsWith("/") ? "file:" + uploadDir : "file:" + uploadDir + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
