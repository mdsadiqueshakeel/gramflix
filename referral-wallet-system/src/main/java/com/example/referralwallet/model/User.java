package com.example.referralwallet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
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
    private String password;
    private String userType;
    private String status;
    private String premiumRequestStatus;
    private String referralId;
    private String referralLink;
    private String referredBy;
    private String walletId; // Reference to Wallet
    private List<String> children = new ArrayList<>();
}