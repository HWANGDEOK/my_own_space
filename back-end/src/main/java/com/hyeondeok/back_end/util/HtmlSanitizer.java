package com.hyeondeok.back_end.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

@Component
public class HtmlSanitizer {
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
