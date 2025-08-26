package com.example.referralwallet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String mobile;
    private String password;   // store hashed password here

    private String referralId;
    private String referralLink;
    private String referredBy;

    private String userType = "NORMAL"; // NORMAL | PREMIUM | ADMIN
    private String status = "INACTIVE"; // INACTIVE | ACTIVE

    private double walletBalance = 0.0;
    private List<WalletTransaction> walletHistory = new ArrayList<>();

    private String premiumRequestStatus = "NONE"; // NONE | PENDING | APPROVED | REJECTED
    private List<WithdrawRequest> withdrawRequests = new ArrayList<>();

    private String resetPasswordTokenHash;
    private Date resetPasswordExpires;

    private Date createdAt = new Date();
    private Date updatedAt = new Date();
}
