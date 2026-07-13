package com.hyeondeok.back_end.controller;

import com.hyeondeok.back_end.service.UserService;
import com.hyeondeok.back_end.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/user/test-save")
    public String testSaveUser(
            @RequestParam String nickname) {

        // OAuth2 가입 상황을 가정한 더미 데이터 전달
        // http://localhost:8080/user/test-save?nickname=hyeondeok
//        User savedUser = userService.saveUser("google", "google-sub-123456", "test1234@test.com", "name", nickname);

        return "DB 저장 완료";
    }
}
