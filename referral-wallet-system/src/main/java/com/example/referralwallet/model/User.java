package com.example.referralwallet.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String mobile;
    private String password;
    private String userType = "NORMAL"; // NORMAL or PREMIUM
    private String status;
    private String premiumRequestStatus = "NONE"; // NONE, PENDING, APPROVED
    private String referralId;
    private String referralLink;
    private String referredBy;
    private String walletId; // Reference to Wallet
    private double totalWithdrawal;
    private List<String> children = new ArrayList<>();
    private boolean hasWithdrawn100 = false;
    private boolean hasWithdrawn900 = false;
    private boolean referredChildBoughtPremium = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public String getId() {
        return id;
    }

    public void setPremiumRequestStatus(String premiumRequestStatus) {
        this.premiumRequestStatus = premiumRequestStatus;
    }

    public String getEmail() {
        return email;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
