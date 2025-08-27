package com.example.referralwallet.model;

import lombok.Data;
import java.util.Date;

@Data
public class WalletTransaction {
    private String id;
    private String userId;
    private double amount;
    private String type; // e.g., "CREDIT", "DEBIT"
    private String description;
    private Date timestamp;

    public WalletTransaction(String type, double amount, String description, Date timestamp) {
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.timestamp = timestamp;
    }
}