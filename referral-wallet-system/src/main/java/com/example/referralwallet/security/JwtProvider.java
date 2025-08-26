package com.example.referralwallet.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtProvider {

    @Value("${jwt.expiration}")
    private long expiration;

    private final SecretKey key; // Use a secure key

    // Initialize with a secure 256-bit key
    public JwtProvider() {
        this.key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        log.debug("Generated secure JWT key with algorithm HS256: {} bits", key.getEncoded().length * 8);
    }

    public SecretKey key() {
        return key;
    }

    public String generateToken(String userId) {
        log.debug("Generating token for userId: {}", userId);
        String token = Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
        log.debug("Generated token: {}", token);
        return token;
    }

    public String getUserIdFromToken(String token) {
        log.debug("Extracting userId from token: {}", token);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        String userId = claims.getSubject();
        log.debug("Extracted userId: {}", userId);
        return userId;
    }

    public boolean validateToken(String token) {
        log.debug("Validating token: {}", token);
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            log.debug("Token validation successful");
            return true;
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}