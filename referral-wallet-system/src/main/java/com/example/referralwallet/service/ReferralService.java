package com.example.referralwallet.service;

import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public void creditParentBonus(String referralCode, String childUserId) {
        userRepository.findByReferralId(referralCode).ifPresent(parent -> {
            Optional<Wallet> walletOpt = walletRepository.findByUserId(parent.getId());
            walletOpt.ifPresent(wallet -> {
                wallet.setWalletBalance(wallet.getWalletBalance() + 200);
                walletRepository.save(wallet);
                System.out.println("Parent bonus credited to " + parent.getEmail());
            });
        });
    }
}