package com.example.referralwallet.dto;

import lombok.Data;

@Data
public class PasswordResetTokenVerificationRequest {
    private String token;
}