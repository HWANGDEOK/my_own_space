package com.hyeondeok.back_end.security;

import com.hyeondeok.back_end.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.List;
import java.util.Map;

public class PrincipalUser extends DefaultOAuth2User {
    private User user;

    public PrincipalUser(User user, Map<String, Object> attributes, String nameAttributeKey) {
        // 부모 클래스에 권한(ROLE_USER), 속성, 식별자 키를 전달
        super(List.of(new SimpleGrantedAuthority("ROLE_USER")), attributes, nameAttributeKey);

        this.user = user;
    }
}
