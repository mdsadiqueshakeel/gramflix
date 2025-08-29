package com.example.referralwallet.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "passwordResetTokens")
public class PasswordResetToken {
    @Id
    private String id;
    private String token;
    private String userId;
    private LocalDateTime expiryDate;
    private boolean used;
}