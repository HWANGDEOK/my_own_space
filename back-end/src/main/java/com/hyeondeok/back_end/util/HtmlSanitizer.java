package com.hyeondeok.back_end.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

public class HtmlSanitizer {
    // 이미지, 기본 서식(굵게, 기울임, 링크, 리스트 등)만 허용
    private static final PolicyFactory POLICY = new HtmlPolicyBuilder()
            .allowElements("p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li", "h1", "h2", "h3", "blockquote", "img", "a")
            .allowAttributes("src", "alt").onElements("img")
            .allowAttributes("href").onElements("a")
            .allowUrlProtocols("https", "http")
            .toFactory();

    public String sanitize(String rawHtml) {
        return POLICY.sanitize(rawHtml);
    }
}
