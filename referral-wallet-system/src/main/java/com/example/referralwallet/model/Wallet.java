package com.example.referralwallet.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Document(collection = "wallets")
public class Wallet {
    @Id
    private String id;
    private String userId;
    private double walletBalance = 0.0;
    private List<WalletTransaction> walletHistory = new ArrayList<>();
    private double totalCredit = 0.0;

    public Wallet(String userId, double initialBalance) {
        this.userId = userId;
        this.walletBalance = initialBalance;
        this.totalCredit = initialBalance;
        this.totalWithdrawal = 0.0;
        this.walletHistory.add(new WalletTransaction(WalletTransaction.TransactionType.CREDIT.name(), initialBalance, "Initial balance", new Date()));
    }
    private double todaysEarning = 0.0;
    private double thisWeekEarning = 0.0;
    private double totalEarning = 0.0;
    private double totalWithdrawal = 0.0;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getTotalEarning() {
        return totalEarning;
    }

    public void setTotalEarning(double totalEarning) {
        this.totalEarning = totalEarning;
    }

    public double getTotalWithdrawal() {
        return totalWithdrawal;
    }

    public void setTotalWithdrawal(double totalWithdrawal) {
        this.totalWithdrawal = totalWithdrawal;
    }

    public double getTodaysEarning() {
        return todaysEarning;
    }

    public void setTodaysEarning(double todaysEarning) {
        this.todaysEarning = todaysEarning;
    }

    public double getThisWeekEarning() {
        return thisWeekEarning;
    }

    public void setThisWeekEarning(double thisWeekEarning) {
        this.thisWeekEarning = thisWeekEarning;
    }

    public List<WalletTransaction> getWalletHistory() {
        return walletHistory;
    }
}
