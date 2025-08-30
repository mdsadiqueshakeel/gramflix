package com.example.referralwallet.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class WalletTransaction {
    private String id;
    private String userId;
    private double amount;
    private TransactionType type; // e.g., "CREDIT", "DEBIT"
    private String meta; // renamed description to meta for consistency
    private Date createdAt = new Date();


    public WalletTransaction() {
        // default constructor
    }

    public enum TransactionType {
        CREDIT,
        REFERRAL,
        PREMIUM_BONUS,
        WITHDRAW
    }

    public WalletTransaction(String type, double amount, String meta, Date createdAt) {
        this.type = TransactionType.valueOf(type);
        this.amount = amount;
        this.meta = meta;
        this.createdAt = createdAt;
    }
}
