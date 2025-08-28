package com.example.referralwallet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "wallets")
public class Wallet {
    @Id
    private String id;
    private String userId;
    private double walletBalance = 0.0;
    private List<WalletTransaction> walletHistory = new ArrayList<>();
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
