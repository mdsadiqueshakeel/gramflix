package com.example.referralwallet.dto;

import lombok.Data;

public class UserDtos {
    @Data
    public static class WithdrawRequestDto {
        private String userId;
        private double amount;
    }

    @Data
    public static class PremiumRequestDto {
        private String userId;
    }
}
