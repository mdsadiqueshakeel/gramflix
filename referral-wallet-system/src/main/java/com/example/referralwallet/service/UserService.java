package com.example.referralwallet.service;

import com.example.referralwallet.model.User;
import com.example.referralwallet.model.WithdrawRequest;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final EmailService emailService;

    public void requestWithdraw(String userId, double amount) {
        User user = userRepository.findById(userId).orElseThrow();
        if (user.getUserType().equals("NORMAL"))
            throw new RuntimeException("User must be PREMIUM to withdraw");
        if (user.getWalletBalance() < amount) throw new RuntimeException("Insufficient balance");

        WithdrawRequest req = new WithdrawRequest();
        req.setUserId(userId);
        req.setAmount(amount);
        req.setStatus("PENDING");
        withdrawRequestRepository.save(req);

        // send email to admin — replace admin email
        emailService.sendSimple("admin@example.com", "Withdraw Request",
                "User " + user.getEmail() + " requested withdraw of " + amount);
        System.out.println("Withdraw request created for user " + user.getEmail() + " amount=" + amount);
    }

    public void applyPremiumRequest(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setPremiumRequestStatus("PENDING");
        userRepository.save(user);
        emailService.sendSimple("admin@example.com", "Premium Upgrade Request", "User " + user.getEmail() + " requested premium.");
        System.out.println("Premium request set PENDING for " + user.getEmail());
    }

    // Approve withdraw (called by AdminService)
    public void approveWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        user.setWalletBalance(user.getWalletBalance() - req.getAmount());
        user.getWalletHistory().add(new WalletTransaction("WITHDRAW", -req.getAmount(), "Withdraw approved", new Date()));
        user.getWithdrawRequests().removeIf(w -> w.getId().equals(req.getId()));
        userRepository.save(user);
        System.out.println("Withdraw approved for " + user.getEmail() + " amount=" + req.getAmount());
    }
}
