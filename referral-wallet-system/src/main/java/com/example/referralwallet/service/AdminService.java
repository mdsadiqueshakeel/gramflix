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
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRepo;
    private final WalletRepository walletRepository;
    private final EmailService emailService;
    private final UserService userService;

    // Approve premium and credit parent if exists
    public void approvePremium(String userId) {
        System.out.println("🚀 [DEBUG] Approving premium for userId: " + userId);
        userService.approvePremiumRequest(userId);
        System.out.println("✅ [DEBUG] Premium approval process completed for userId: " + userId);
    }

    // Reject premium request
    public void rejectPremium(String userId) {
        System.out.println("🚫 [DEBUG] Rejecting premium for userId: " + userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremiumRequestStatus("REJECTED");
        userRepository.save(user);

        emailService.sendHtml(user.getEmail(), "Premium Rejected", "Premium request rejected.");
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
            userWallet.setTotalWithdrawal(userWallet.getTotalWithdrawal() + req.getAmount());
            userWallet.getWalletHistory().add(
                    new WalletTransaction(WalletTransaction.TransactionType.WITHDRAW.name(), -req.getAmount(),
                            "Withdraw approved", new Date()));
            walletRepository.save(userWallet);

            System.out.println("✅ [DEBUG] Withdraw approved for userId: " + req.getUserId() +
                    ", Amount: " + req.getAmount() +
                    ", Remaining Balance: " + userWallet.getWalletBalance());
        }, () -> System.out.println("⚠️ [DEBUG] Wallet not found for withdraw request userId: " + req.getUserId()));

        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        emailService.sendHtml(user.getEmail(), "Withdraw Approved",
                "Your withdraw of " + req.getAmount() + " approved.");
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
        emailService.sendHtml(user.getEmail(), "Withdraw Rejected", "Your withdraw request was rejected.");
        System.out.println("✉️ [DEBUG] Withdraw rejection email sent to " + user.getEmail());
    }
}
