package com.example.referralwallet.dto;

import lombok.Data;

public class OtpDtos {

    @Data
    public static class OtpSendRequest {
        private String to;
        private String channel; // "whatsapp" or "email"
        private String customOtp; // optional, for testing with a specific OTP
    }

    @Data
    public static class OtpSendResponse {
        private String message;
        private String devEchoOtp; // optional, only for dev
    }

    @Data
    public static class OtpVerifyRequest {
        private String to;
        private String code;
    }

    @Data
    public static class OtpVerifyResponse {
        private boolean verified;
        private String message;
    }
}
