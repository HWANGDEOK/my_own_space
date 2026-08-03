package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.config.FileProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageService {
    private final FileProperties fileProperties;

    public String uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        if (file.getSize() > fileProperties.getMaxSize().toBytes()) {
            log.warn("업로드 실패 - 파일크기 초과");
            throw new IllegalArgumentException("파일 크기는 5MB를 초과할 수 없습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !fileProperties.getAllowedTypes().contains(contentType)) {
            log.warn("업로드 실패 - MIME 타입 불일치: contentType={}, fileName={}", contentType, file.getOriginalFilename());
            throw new IllegalArgumentException("이미지 파일(jpg, png, gif, webp)만 업로드 가능합니다.");
        }

        String extension = extractExtension(file.getOriginalFilename());
        String savedFileName = UUID.randomUUID() + extension;

        try {
            Path uploadPath = Paths.get(fileProperties.getDir());
            Files.createDirectories(uploadPath); // 디렉토리 없으면 생성

            Path targetPath = uploadPath.resolve(savedFileName).normalize();

            file.transferTo(targetPath);

            return "/uploads/" + savedFileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장에 실패했습니다.", e);
        }
    }

    private String extractExtension(String originalFileName) {
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new IllegalArgumentException("확장자가 없는 파일은 업로드할 수 없습니다.");
        }
        return originalFileName.substring(originalFileName.lastIndexOf("."));
    }
}
