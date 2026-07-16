package com.hyeondeok.back_end.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String bigDoor() {
        return "Hello, SpringBoot";
    }
}
