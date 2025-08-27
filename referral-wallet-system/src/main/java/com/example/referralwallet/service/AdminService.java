package com.example.referralwallet.service;

import com.example.referralwallet.model.User;
import com.example.referralwallet.model.WithdrawRequest;
import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import com.example.referralwallet.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRepo;
    private final WalletRepository walletRepository;
    private final EmailService emailService;

    // Approve premium and credit parent if exists
    public void approvePremium(String userId) {
        System.out.println("🚀 [DEBUG] Approving premium for userId: " + userId);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUserType("PREMIUM");
        user.setPremiumRequestStatus("APPROVED");
        userRepository.save(user);
        System.out.println("✅ [DEBUG] User upgraded to PREMIUM: " + user.getEmail());

        // Credit parent bonus when child upgrades to premium
        if (user.getReferredBy() != null) {
            System.out.println("🔗 [DEBUG] User was referred by: " + user.getReferredBy());
            userRepository.findByReferralId(user.getReferredBy()).ifPresentOrElse(parentUser -> {
                walletRepository.findByUserId(parentUser.getId()).ifPresentOrElse(parentWallet -> {

                    double bonusAmount = 200; // Fixed bonus when child upgrades
                    parentWallet.setWalletBalance(parentWallet.getWalletBalance() + bonusAmount);
                    parentWallet.setTodaysEarning(parentWallet.getTodaysEarning() + bonusAmount);
                    parentWallet.setThisWeekEarning(parentWallet.getThisWeekEarning() + bonusAmount);
                    parentWallet.setTotalEarning(parentWallet.getTotalEarning() + bonusAmount);

                    parentWallet.getWalletHistory().add(
                            new WalletTransaction("BONUS", bonusAmount, "Child upgraded premium", LocalDateTime.now())
                    );
                    walletRepository.save(parentWallet);

                    System.out.println("💰 [DEBUG] Parent bonus of " + bonusAmount + " credited to " + parentUser.getEmail());
                    System.out.println("📊 [DEBUG] Parent wallet updated: Balance=" + parentWallet.getWalletBalance() +
                            ", Today=" + parentWallet.getTodaysEarning() +
                            ", ThisWeek=" + parentWallet.getThisWeekEarning() +
                            ", Total=" + parentWallet.getTotalEarning());

                }, () -> System.out.println("⚠️ [DEBUG] Parent wallet not found for " + parentUser.getEmail()));
            }, () -> System.out.println("⚠️ [DEBUG] Parent user not found with referralId: " + user.getReferredBy()));
        } else {
            System.out.println("ℹ️ [DEBUG] User was not referred by anyone");
        }

        emailService.sendSimple(user.getEmail(), "Premium Approved", "Your account is now premium.");
        System.out.println("✉️ [DEBUG] Premium approval email sent to " + user.getEmail());
    }

    // Reject premium request
    public void rejectPremium(String userId) {
        System.out.println("🚫 [DEBUG] Rejecting premium for userId: " + userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremiumRequestStatus("REJECTED");
        userRepository.save(user);

        emailService.sendSimple(user.getEmail(), "Premium Rejected", "Premium request rejected.");
        System.out.println("✉️ [DEBUG] Premium rejection email sent to " + user.getEmail());
    }

    // Approve withdraw request
    public void approveWithdraw(String withdrawRequestId) {
        System.out.println("💵 [DEBUG] Approving withdraw request: " + withdrawRequestId);
        WithdrawRequest req = withdrawRepo.findById(withdrawRequestId)
                .orElseThrow(() -> new RuntimeException("Withdraw request not found"));
        req.setStatus("APPROVED");
        withdrawRepo.save(req);

        walletRepository.findByUserId(req.getUserId()).ifPresentOrElse(userWallet -> {
            userWallet.setWalletBalance(userWallet.getWalletBalance() - req.getAmount());
            userWallet.getWalletHistory().add(
                    new WalletTransaction("WITHDRAW", -req.getAmount(), "Withdraw approved", LocalDateTime.now())
            );
            walletRepository.save(userWallet);

            System.out.println("✅ [DEBUG] Withdraw approved for userId: " + req.getUserId() +
                    ", Amount: " + req.getAmount() +
                    ", Remaining Balance: " + userWallet.getWalletBalance());
        }, () -> System.out.println("⚠️ [DEBUG] Wallet not found for withdraw request userId: " + req.getUserId()));

        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        emailService.sendSimple(user.getEmail(), "Withdraw Approved", "Your withdraw of " + req.getAmount() + " approved.");
        System.out.println("✉️ [DEBUG] Withdraw approval email sent to " + user.getEmail());
    }

    // Reject withdraw request
    public void rejectWithdraw(String withdrawRequestId) {
        System.out.println("❌ [DEBUG] Rejecting withdraw request: " + withdrawRequestId);
        WithdrawRequest req = withdrawRepo.findById(withdrawRequestId)
                .orElseThrow(() -> new RuntimeException("Withdraw request not found"));
        req.setStatus("REJECTED");
        withdrawRepo.save(req);

        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        emailService.sendSimple(user.getEmail(), "Withdraw Rejected", "Your withdraw request was rejected.");
        System.out.println("✉️ [DEBUG] Withdraw rejection email sent to " + user.getEmail());
    }
}
