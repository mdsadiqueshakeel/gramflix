package com.example.referralwallet.service;

import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.DayOfWeek;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;

    public void creditBonus(String userId, double amount, String meta, LocalDateTime registrationDateTime) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // Calculate earnings for today (last 24 hours)
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        double todaysEarning = wallet.getWalletHistory().stream()
                .filter(transaction -> transaction.getCreatedAt().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime().isAfter(twentyFourHoursAgo) && transaction.getAmount() > 0)
                .mapToDouble(WalletTransaction::getAmount)
                .sum();
        wallet.setTodaysEarning(todaysEarning);

        // Calculate earnings for this week (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        double thisWeekEarning = wallet.getWalletHistory().stream()
                .filter(transaction -> transaction.getCreatedAt().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime().isAfter(sevenDaysAgo) && transaction.getAmount() > 0)
                .mapToDouble(WalletTransaction::getAmount)
                .sum();
        wallet.setThisWeekEarning(thisWeekEarning);

        wallet.setWalletBalance(wallet.getWalletBalance() + amount);

        wallet.setTotalEarning(wallet.getTotalEarning() + amount);
        wallet.setTotalWithdrawal(wallet.getTotalWithdrawal()+amount);
        wallet.getWalletHistory().add(new WalletTransaction("BONUS", amount, meta, new Date()));

        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    public void withdraw(String userId, double amount) {
        if (!(amount == 100 || amount == 900 || amount == 3000)) {
            throw new RuntimeException("Invalid withdrawal amount. Use 100, 900, or 3000.");
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (wallet.getWalletBalance() < amount) throw new RuntimeException("Insufficient balance.");

        wallet.setWalletBalance(wallet.getWalletBalance() - amount);
        wallet.getWalletHistory().add(new WalletTransaction("WITHDRAW", -amount, "Withdraw approved", new Date()));

        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }
}
