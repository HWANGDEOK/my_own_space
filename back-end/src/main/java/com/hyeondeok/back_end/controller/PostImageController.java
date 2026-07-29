package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.config.FileProperties;
import com.hyeondeok.back_end.config.WebConfig;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostImageController {

    private final FileProperties fileProperties;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file, HttpServletRequest request) {
        try {
            // 파일명 중복 방지 UUID 생성
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String savedFileName = UUID.randomUUID().toString() + extension;

            // 로컬에 파일 저장
            File targetFile = new File(fileProperties.getUploadDir() + savedFileName);
            file.transferTo(targetFile);

            // 최종 URL 주소 생성
            String serverUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String fileAccessUrl = serverUrl + "/uploads/" + savedFileName;

            // 응답 ("url": "http://localhost:8080/uploads/uuid.jpg")
            return ResponseEntity.ok(Map.of("url", fileAccessUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
        }
    }
}
