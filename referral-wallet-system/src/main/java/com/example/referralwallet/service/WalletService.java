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

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;

    public void creditBonus(String userId, double amount, String meta, LocalDateTime registrationDateTime) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDate regDate = registrationDateTime.toLocalDate();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);

        if (!regDate.isEqual(today)) wallet.setTodaysEarning(0.0);
        if (regDate.isBefore(weekStart)) wallet.setThisWeekEarning(0.0);

        wallet.setWalletBalance(wallet.getWalletBalance() + amount);
        wallet.setTodaysEarning(wallet.getTodaysEarning() + amount);
        wallet.setThisWeekEarning(wallet.getThisWeekEarning() + amount);
        wallet.setTotalEarning(wallet.getTotalEarning() + amount);

        wallet.getWalletHistory().add(new WalletTransaction("BONUS", amount, meta, LocalDateTime.now()));

        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    public void withdraw(String userId, double amount) {
        if (!(amount == 100 || amount == 500 || amount == 1000)) {
            throw new RuntimeException("Invalid withdrawal amount. Use 100, 500, or 1000.");
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (wallet.getWalletBalance() < amount) throw new RuntimeException("Insufficient balance.");

        wallet.setWalletBalance(wallet.getWalletBalance() - amount);
        wallet.getWalletHistory().add(new WalletTransaction("WITHDRAW", -amount, "Withdraw approved", LocalDateTime.now()));

        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }
}
