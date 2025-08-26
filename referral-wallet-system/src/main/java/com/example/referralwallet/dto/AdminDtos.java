package com.example.referralwallet.dto;

import lombok.Data;

public class AdminDtos {
    @Data
    public static class ApproveRejectDto {
        private String userId;
        private String withdrawRequestId;
    }
}
