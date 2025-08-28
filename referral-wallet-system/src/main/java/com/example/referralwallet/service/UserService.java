package com.example.referralwallet.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.model.User;
import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.model.WithdrawRequest;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import com.example.referralwallet.repository.WithdrawRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final WalletRepository walletRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final ReferralService referralService;

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

        String withdrawApproveLink = "http://localhost:8080/api/admin/withdraw/approve/" + req.getId();
        String withdrawRejectLink = "http://localhost:8080/api/admin/withdraw/reject/" + req.getId();
        String withdrawEmailBody = "User " + user.getEmail() + " requested withdraw of " + amount + ".\n" +
                "<a href=\"" + withdrawApproveLink + "\">Accept</a> | " +
                "<a href=\"" + withdrawRejectLink + "\">Reject</a>";
        emailService.sendSimple("admin@example.com", "Withdraw Request", withdrawEmailBody);
        System.out.println("✅ [DEBUG] Withdraw request created for " + user.getEmail());
    }

    // ==================== PREMIUM REQUEST ====================
    public void applyPremiumRequest(String userId, String mobileNumber) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremiumRequestStatus("PENDING");
        userRepository.save(user);

        String premiumApproveLink = "http://localhost:8080/api/admin/premium/approve/" + user.getId();
        String premiumRejectLink = "http://localhost:8080/api/admin/premium/reject/" + user.getId();
        String premiumEmailBody = "User " + user.getEmail() + " with mobile " + mobileNumber + " requested premium.\n" +
                "<a href=\"" + premiumApproveLink + "\">Accept</a> | " +
                "<a href=\"" + premiumRejectLink + "\">Reject</a>";
        emailService.sendSimple("admin@example.com", "Premium Upgrade Request", premiumEmailBody);
        System.out.println("🔔 [DEBUG] Premium request set PENDING for " + user.getEmail());
    }

    // ==================== APPROVE PREMIUM (FOR ADMIN) ====================
    public void approvePremiumRequest(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUserType("PREMIUM");
        user.setPremiumRequestStatus("APPROVED");
        userRepository.save(user);

        // Credit parent bonus if referred by someone
        if (user.getReferredBy() != null && !user.getReferredBy().isEmpty()) {
            referralService.creditPremiumUpgradeBonus(user.getReferredBy(), user.getId());
        }

        emailService.sendSimple(user.getEmail(), "Premium Upgrade Approved",
                "Your premium upgrade request has been approved.");
        System.out.println("✅ [DEBUG] Premium upgrade approved for " + user.getEmail());
    }

    // ==================== REJECT PREMIUM (FOR ADMIN) ====================
    public void rejectPremiumRequest(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremiumRequestStatus("REJECTED");
        userRepository.save(user);

        emailService.sendSimple(user.getEmail(), "Premium Upgrade Rejected",
                "Your premium upgrade request has been rejected.");
        System.out.println("❌ [DEBUG] Premium upgrade rejected for " + user.getEmail());
    }

    // ==================== APPROVE WITHDRAW (FOR ADMIN) ====================
    public void approveWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setWalletBalance(wallet.getWalletBalance() - req.getAmount());
        wallet.setTotalWithdrawal(wallet.getTotalWithdrawal() + req.getAmount());
        wallet.getWalletHistory().add(new WalletTransaction(WalletTransaction.TransactionType.WITHDRAW.name(), -req.getAmount(), "Withdraw approved", LocalDateTime.now()));
        walletRepository.save(wallet);

        req.setStatus("APPROVED");
        withdrawRequestRepository.save(req);

        System.out.println("✅ [DEBUG] Withdraw approved for " + user.getEmail() + ", amount=" + req.getAmount());
    }

    // ==================== REJECT WITHDRAW (FOR ADMIN) ====================
    public void rejectWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        // Optionally, you might want to revert the wallet balance or add a transaction for rejection
        // For now, just update the status
        req.setStatus("REJECTED");
        withdrawRequestRepository.save(req);

        emailService.sendSimple(user.getEmail(), "Withdraw Request Rejected",
                "Your withdraw request for " + req.getAmount() + " has been rejected.");
        System.out.println("❌ [DEBUG] Withdraw rejected for " + user.getEmail() + ", amount=" + req.getAmount());
    }

    // ==================== GET WITHDRAW REQUEST BY ID ====================
    public WithdrawRequest getWithdrawRequestById(String requestId) {
        return withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Withdraw request not found"));
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
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
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
        response.setTotalWithdrawal(wallet.getTotalWithdrawal());
        System.out.println("💰 [DEBUG] Fetched wallet for userId: " + userId + ", Balance=" + wallet.getWalletBalance());
        return response;
    }

    // ==================== GET CHILDREN ====================
    public UserDtos.ChildrenResponse getChildren(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserDtos.ChildrenResponse response = new UserDtos.ChildrenResponse();
        List<UserDtos.Child> children = new ArrayList<>();
        int normalUsersCount = 0;
        int premiumUsersCount = 0;

        for (String childId : user.getChildren()) {
            Optional<User> child = userRepository.findById(childId);
            if (child.isPresent()) {
                User c = child.get();
                children.add(new UserDtos.Child(c.getName(), c.getEmail(), c.getMobile(), c.getUserType(), c.getReferralId(), c.getReferralLink()));
                if ("NORMAL".equals(c.getUserType())) {
                    normalUsersCount++;
                } else if ("PREMIUM".equals(c.getUserType())) {
                    premiumUsersCount++;
                }
            }
        }
        response.setChildren(children);
        response.setTotalChildren(children.size());
        response.setNormalUsers(normalUsersCount);
        response.setPremiumUsers(premiumUsersCount);
        System.out.println("👶 [DEBUG] Fetched " + children.size() + " children for " + user.getEmail() + ", Normal: " + normalUsersCount + ", Premium: " + premiumUsersCount);
        return response;
    }
}
