package com.example.referralwallet.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public void creditReferralBonus(String referralCode, String childUserId) {
        userRepository.findByReferralId(referralCode).ifPresent(parent -> {
            Optional<Wallet> walletOpt = walletRepository.findByUserId(parent.getId());
            walletOpt.ifPresent(wallet -> {
                double points = 0;
                String description = "";

                if ("NORMAL".equals(parent.getUserType())) {
                    points = 5;
                    description = "Referred new user (NORMAL parent)";
                } else if ("PREMIUM".equals(parent.getUserType())) {
                    points = 20;
                    description = "Referred new user (PREMIUM parent)";
                }

                if (points > 0) {
                    updateWallet(wallet, points, WalletTransaction.TransactionType.REFERRAL, description);
                }
            });
        });
    }

    public void creditPremiumUpgradeBonus(String parentReferralId, String childUserId) {
        userRepository.findByReferralId(parentReferralId).ifPresent(parent -> {
            Optional<Wallet> walletOpt = walletRepository.findByUserId(parent.getId());
            walletOpt.ifPresent(wallet -> {
                double points = 200;
                String description = "Child user upgraded to PREMIUM";
                updateWallet(wallet, points, WalletTransaction.TransactionType.PREMIUM_BONUS, description);
                parent.setReferredChildBoughtPremium(true);
                userRepository.save(parent);
            });
        });
    }

    public boolean isValidReferralId(String referralId) {
        return userRepository.findByReferralId(referralId).isPresent();
    }

    private void updateWallet(Wallet wallet, double points, WalletTransaction.TransactionType type, String description) {
        wallet.setWalletBalance(wallet.getWalletBalance() + points);
        wallet.setTotalEarning(wallet.getTotalEarning() + points);

        // Update todaysEarning and thisWeekEarning (simplified for now, actual implementation needs date logic)
        wallet.setTodaysEarning(wallet.getTodaysEarning() + points);
        wallet.setThisWeekEarning(wallet.getThisWeekEarning() + points);

        WalletTransaction transaction = new WalletTransaction(
                type.name(),
                points,
                description,
                LocalDateTime.now()
        );
        wallet.getWalletHistory().add(transaction);
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }
}