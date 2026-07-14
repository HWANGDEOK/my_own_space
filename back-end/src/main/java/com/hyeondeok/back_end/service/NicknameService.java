package com.hyeondeok.back_end.service;

import com.hyeondeok.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NicknameService {

    private final UserRepository userRepository;

    // 1. 조합할 형용사 배열
    private final String[] adjectives = {
            "행복한", "즐거운", "용감한", "신비로운", "빛나는",
            "똑똑한", "따뜻한", "부지런한", "날렵한", "유쾌한",
            "든든한", "상냥한", "정직한", "싱그러운", "포근한"
    };

    // 2. 조합할 명사 배열
    private final String[] nouns = {
            "호랑이", "독수리", "부엉이", "쿼카", "도토리",
            "펭귄", "팬더", "코알라", "사자", "토끼",
            "늑구", "까마귀", "서퍼", "탐험가", "나무늘보", "빙수"
    };

    private final Random random = new Random();


    public String generateRandomNickname() {
        int maxAttempts = 10; // 최대 시도 횟수
        int attempts = 0;
        String randomNick;

        while (attempts < maxAttempts) {
            String adjective = adjectives[random.nextInt(adjectives.length)];
            String noun = nouns[random.nextInt(nouns.length)];
            int randomNumber = 1000 + random.nextInt(9000);
            randomNick = String.format("%s%s_%d", adjective, noun, randomNumber);

            if (!userRepository.existsByNickname(randomNick)) {
                return randomNick;
            }

            attempts++;
        }

        return "케이스초과_" + UUID.randomUUID().toString().substring(0, 8);
    }
}
