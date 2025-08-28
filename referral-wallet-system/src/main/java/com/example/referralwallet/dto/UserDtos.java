package com.example.referralwallet.dto;

import java.util.List;

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
        private String referralLink;

        private String status;
        private String premiumRequestStatus;
        private String referralId;
        private String referredByName;
        private String walletId;
        private List<String> children;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
    }

    @Data
    public static class WalletResponse {
        private double walletBalance;
        private double todaysEarning;
        private double thisWeekEarning;
        private double totalEarning;
        private double totalWithdrawal;

    }

    @Data
    public static class Child {
        private String name;
        private String email;
        private String mobile;
        private String userType;
        private String referralId;
        private String referralLink;

        public String getReferralLink() {
            return referralLink;
        }

        public Child(String name, String email, String mobile, String userType, String referralId, String referralLink) {
            this.name = name;
            this.email = email;
            this.mobile = mobile;
            this.userType = userType;
            this.referralId = referralId;
            this.referralLink = referralLink;
        }
    }

    @Data
    public static class ChildrenResponse {
        private List<Child> children;
        private int totalChildren;
        private int normalUsers;
        private int premiumUsers;
    }
}