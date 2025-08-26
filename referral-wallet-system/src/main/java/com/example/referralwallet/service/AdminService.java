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
public class AdminService {

    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRepo;
    private final EmailService emailService; // make sure only one EmailService exists

    public void approvePremium(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setUserType("PREMIUM");
        user.setPremiumRequestStatus("APPROVED");
        userRepository.save(user);

        // credit parent bonus
        if (user.getReferredBy() != null) {
            userRepository.findByReferralId(user.getReferredBy()).ifPresent(parent -> {
                parent.setWalletBalance(parent.getWalletBalance() + 200);
                parent.getWalletHistory().add(new WalletTransaction("BONUS", 200, "Child upgraded premium", new Date()));
                userRepository.save(parent);
                System.out.println("Parent bonus credited to " + parent.getEmail());
            });
        }

        emailService.sendSimple(user.getEmail(), "Premium Approved", "Your account is now premium.");
        System.out.println("Premium approved for " + user.getEmail());
    }

    public void rejectPremium(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setPremiumRequestStatus("REJECTED");
        userRepository.save(user);
        emailService.sendSimple(user.getEmail(), "Premium Rejected", "Premium request rejected.");
        System.out.println("Premium rejected for " + user.getEmail());
    }

    public void approveWithdraw(String withdrawRequestId) {
        WithdrawRequest req = withdrawRepo.findById(withdrawRequestId).orElseThrow();
        req.setStatus("APPROVED");
        withdrawRepo.save(req);

        User user = userRepository.findById(req.getUserId()).orElseThrow();
        user.setWalletBalance(user.getWalletBalance() - req.getAmount());
        user.getWalletHistory().add(new WalletTransaction("WITHDRAW", -req.getAmount(), "Withdraw approved", new Date()));
        userRepository.save(user);

        emailService.sendSimple(user.getEmail(), "Withdraw Approved", "Your withdraw of " + req.getAmount() + " approved.");
        System.out.println("Withdraw request approved id=" + withdrawRequestId);
    }

    public void rejectWithdraw(String withdrawRequestId) {
        WithdrawRequest req = withdrawRepo.findById(withdrawRequestId).orElseThrow();
        req.setStatus("REJECTED");
        withdrawRepo.save(req);

        User user = userRepository.findById(req.getUserId()).orElseThrow();
        emailService.sendSimple(user.getEmail(), "Withdraw Rejected", "Your withdraw request was rejected.");
        System.out.println("Withdraw request rejected id=" + withdrawRequestId);
    }
}
