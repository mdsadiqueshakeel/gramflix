package com.example.referralwallet.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WalletTransaction {
    private String id;
    private String userId;
    private double amount;
    private String type; // e.g., "CREDIT", "DEBIT"
    private String meta; // renamed description to meta for consistency
    private LocalDateTime timestamp = LocalDateTime.now(); // single timestamp

    public WalletTransaction() {
        // default constructor
    }

    public WalletTransaction(String type, double amount, String meta, LocalDateTime timestamp) {
        this.type = type;
        this.amount = amount;
        this.meta = meta;
        this.timestamp = timestamp;
    }
}
