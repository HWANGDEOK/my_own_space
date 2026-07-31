package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.config.FileProperties;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/image")
public class ImageController {

    private final FileProperties fileProperties;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        if (file.getSize() > fileProperties.getMaxSize().toBytes()) {
            throw new IllegalArgumentException("파일 크기는 5MB를 초과할 수 없습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !fileProperties.getAllowedTypes().contains(contentType)) {
            throw new IllegalArgumentException("이미지 파일(jpg, png, gif, webp)만 업로드 가능합니다.");
        }
        try {
            // 파일명 중복 방지 UUID 생성
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String savedFileName = UUID.randomUUID().toString() + extension;

            // 로컬에 파일 저장
            Path uploadPath = Paths.get(fileProperties.getDir());
            Files.createDirectories(uploadPath); // 디렉토리 없으면 생성

            // 최종 URL 주소 생성
            String serverUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String fileAccessUrl = serverUrl + "/image_uploads/" + savedFileName;

            // 응답 ("url": "http://localhost:8080/uploads/uuid.jpg")
            return ResponseEntity.ok(Map.of("url", fileAccessUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
        }
    }
}
