package com.example.referralwallet.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class TokenGenerator {
    private final SecureRandom secureRandom = new SecureRandom();
    private static final String ALPHANUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // numeric OTP (length digits)
    public String numericOtp(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append((char)('0' + secureRandom.nextInt(10)));
        }
        return sb.toString();
    }

    // secure random alphanumeric token
    public String randomToken(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUM.charAt(secureRandom.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }

    // URL-safe token (base64) of n bytes
    public String randomUrlSafeToken(int byteLen) {
        byte[] b = new byte[byteLen];
        secureRandom.nextBytes(b);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(b);
    }
}
