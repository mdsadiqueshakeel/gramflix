package com.example.referralwallet.dto;

import lombok.Data;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String mobile;
        private String password;
        private String referralId; // Used for referral system
    }

    @Data
    public static class RegisterResponse {
        private String message;
        private String userId;
    }

    @Data
    public static class LoginRequest {
        private String emailOrMobile; // login via email or mobile
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;   // JWT token
        private String userId;  // User ID
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String email;
        private String token;
        private String newPassword;
    }
}
