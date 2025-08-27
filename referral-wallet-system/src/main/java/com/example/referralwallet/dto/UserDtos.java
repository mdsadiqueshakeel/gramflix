package com.example.referralwallet.dto;

import lombok.Data;

import java.util.List;

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

    @Data
    public static class ProfileUpdateRequest {
        private String userId;
        private String name;
        private String email;
        private String mobile;
        private String password;
    }

    @Data
    public static class ProfileResponse {
        private String userId;
        private String name;
        private String email;
        private String mobile;
        private String userType;
        private String status;
        private String premiumRequestStatus;
        private String referralId;
        private String referralLink;
        private String referredBy;
        private String walletId;
        private List<String> children;
    }

    @Data
    public static class WalletResponse {
        private double walletBalance;
        private double todaysEarning;
        private double thisWeekEarning;
        private double totalEarning;
    }

    @Data
    public static class Child {
        private String email;
        private String mobile;

        public Child(String email, String mobile) {
            this.email = email;
            this.mobile = mobile;
        }
    }

    @Data
    public static class ChildrenResponse {
        private List<Child> children;
    }
}