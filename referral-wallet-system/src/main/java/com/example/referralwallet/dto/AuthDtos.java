package com.example.referralwallet.dto;

import lombok.Data;

public class AuthDtos {
    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String mobile;
        private String password;
        private String referral;
        private String otpCode;

        public String getReferral() {
            return referral;
        }

        public void setReferral(String referral) {
            this.referral = referral;
        }

        public String getEmail() {
            return email;
        }
    }

    @Data
    public static class RegisterResponse {
        private String message;
        private String userId;
    }

    @Data
    public static class LoginRequest {
        private String emailOrMobile;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String userId;
        private String token;
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