package com.example.referralwallet.dto;

import lombok.Data;

public class OtpDtos {
    @Data
    public static class OtpSendRequest {
        private long to;
        private String channel;
    }

    @Data
    public static class OtpSendResponse {
        private String message;
        private String devEchoOtp;
    }

    @Data
    public static class OtpVerifyRequest {
        private long to;
        private String code;
    }

    @Data
    public static class OtpVerifyResponse {
        private boolean verified;
        private String message;
    }
}