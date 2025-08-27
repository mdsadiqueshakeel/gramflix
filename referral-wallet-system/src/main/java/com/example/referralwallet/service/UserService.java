package com.example.referralwallet.service;

import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.model.User;
import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.model.WithdrawRequest;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import com.example.referralwallet.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final WalletRepository walletRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // ==================== REFERRAL BONUS ====================
    public void creditReferralBonus(String parentReferralId) {
        System.out.println("🔗 [DEBUG] Starting referral bonus for parentReferralId: " + parentReferralId);

        User parent = userRepository.findByReferralId(parentReferralId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        Wallet wallet = walletRepository.findByUserId(parent.getId())
                .orElseThrow(() -> new RuntimeException("Wallet not found for parent"));

        // Determine bonus amount based on parent type
        double bonusAmount = parent.getUserType().equals("PREMIUM") ? 20 : 5;

        // Update wallet
        wallet.setWalletBalance(wallet.getWalletBalance() + bonusAmount);

        // Update earnings
        LocalDateTime now = LocalDateTime.now();
        wallet.setTodaysEarning(wallet.getTodaysEarning() + bonusAmount);
        wallet.setThisWeekEarning(wallet.getThisWeekEarning() + bonusAmount);
        wallet.setTotalEarning(wallet.getTotalEarning() + bonusAmount);

        // Add wallet transaction
        WalletTransaction txn = new WalletTransaction(
                "REFERRAL",
                bonusAmount,
                "Referral signup bonus",
                now
        );
        wallet.getWalletHistory().add(txn);

        wallet.setUpdatedAt(now);
        walletRepository.save(wallet);

        System.out.println("🎁 [DEBUG] Referral bonus of " + bonusAmount + " points credited to " + parent.getEmail());
        System.out.println("📊 [DEBUG] Wallet Balance=" + wallet.getWalletBalance() +
                ", Today=" + wallet.getTodaysEarning() +
                ", ThisWeek=" + wallet.getThisWeekEarning() +
                ", Total=" + wallet.getTotalEarning());
    }

    // ==================== WITHDRAW REQUEST ====================
    public void requestWithdraw(String userId, double amount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Wallet not found"));

        System.out.println("💵 [DEBUG] Withdraw request by " + user.getEmail() + ", amount=" + amount);

        if (user.getUserType().equals("NORMAL"))
            throw new RuntimeException("❌ User must be PREMIUM to withdraw");

        if (!(amount == 100 || amount == 500 || amount == 1000))
            throw new RuntimeException("❌ Withdraw amount must be 100, 500, or 1000");

        if (wallet.getWalletBalance() < amount)
            throw new RuntimeException("⚠️ Insufficient wallet balance");

        WithdrawRequest req = new WithdrawRequest();
        req.setUserId(userId);
        req.setAmount(amount);
        req.setStatus("PENDING");
        withdrawRequestRepository.save(req);

        emailService.sendSimple("admin@example.com", "Withdraw Request",
                "User " + user.getEmail() + " requested withdraw of " + amount);
        System.out.println("✅ [DEBUG] Withdraw request created for " + user.getEmail());
    }

    // ==================== PREMIUM REQUEST ====================
    public void applyPremiumRequest(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremiumRequestStatus("PENDING");
        userRepository.save(user);

        emailService.sendSimple("admin@example.com", "Premium Upgrade Request",
                "User " + user.getEmail() + " requested premium.");
        System.out.println("🔔 [DEBUG] Premium request set PENDING for " + user.getEmail());
    }

    // ==================== APPROVE WITHDRAW (FOR ADMIN) ====================
    public void approveWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setWalletBalance(wallet.getWalletBalance() - req.getAmount());
        wallet.getWalletHistory().add(new WalletTransaction("WITHDRAW", -req.getAmount(), "Withdraw approved", LocalDateTime.now()));
        walletRepository.save(wallet);

        req.setStatus("APPROVED");
        withdrawRequestRepository.save(req);

        System.out.println("✅ [DEBUG] Withdraw approved for " + user.getEmail() + ", amount=" + req.getAmount());
    }

    // ==================== UPDATE PROFILE ====================
    public void updateProfile(String userId, UserDtos.ProfileUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
        System.out.println("📝 [DEBUG] Profile updated for " + user.getEmail());
    }

    // ==================== GET PROFILE ====================
    public UserDtos.ProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserDtos.ProfileResponse response = new UserDtos.ProfileResponse();
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMobile(user.getMobile());
        response.setUserType(user.getUserType());
        response.setStatus(user.getStatus());
        response.setPremiumRequestStatus(user.getPremiumRequestStatus());
        response.setReferralId(user.getReferralId());
        response.setReferralLink(user.getReferralLink());
        response.setReferredBy(user.getReferredBy());
        response.setWalletId(user.getWalletId());
        response.setChildren(user.getChildren());
        System.out.println("🔍 [DEBUG] Fetched profile for " + user.getEmail());
        return response;
    }

    // ==================== GET WALLET ====================
    public UserDtos.WalletResponse getWallet(String userId) {
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Wallet not found"));
        UserDtos.WalletResponse response = new UserDtos.WalletResponse();
        response.setWalletBalance(wallet.getWalletBalance());
        response.setTodaysEarning(wallet.getTodaysEarning());
        response.setThisWeekEarning(wallet.getThisWeekEarning());
        response.setTotalEarning(wallet.getTotalEarning());
        System.out.println("💰 [DEBUG] Fetched wallet for userId: " + userId + ", Balance=" + wallet.getWalletBalance());
        return response;
    }

    // ==================== GET CHILDREN ====================
    public UserDtos.ChildrenResponse getChildren(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserDtos.ChildrenResponse response = new UserDtos.ChildrenResponse();
        List<UserDtos.Child> children = new ArrayList<>();
        for (String childId : user.getChildren()) {
            Optional<User> child = userRepository.findById(childId);
            child.ifPresent(c -> children.add(new UserDtos.Child(c.getEmail(), c.getMobile())));
        }
        response.setChildren(children);
        System.out.println("👶 [DEBUG] Fetched " + children.size() + " children for " + user.getEmail());
        return response;
    }
}
