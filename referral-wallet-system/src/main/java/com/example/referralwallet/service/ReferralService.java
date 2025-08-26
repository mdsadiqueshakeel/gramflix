package com.example.referralwallet.service;

import com.example.referralwallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final UserRepository userRepository;

    /**
     * Credits parent (referrer) bonus when a referred user registers.
     */
    public void creditParentBonus(String referralCode, String childUserId) {
        userRepository.findByReferralId(referralCode).ifPresent(parent -> {
            parent.setWalletBalance(parent.getWalletBalance() + 200); // example bonus
            // You can add WalletTransaction here if you have that model
            userRepository.save(parent);
            System.out.println("Parent bonus credited to " + parent.getEmail());
        });
    }
}
