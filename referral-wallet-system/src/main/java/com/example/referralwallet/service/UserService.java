package com.example.referralwallet.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.Date;

import org.springframework.data.domain.Sort;
// import org.springframework.data.mongodb.core.aggregation.VariableOperators.Map;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.model.User;
import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.dto.WithdrawRequestResponse;
import com.example.referralwallet.model.WalletTransaction;
import com.example.referralwallet.model.WithdrawRequest;
import com.example.referralwallet.model.PasswordResetToken;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import com.example.referralwallet.repository.WithdrawRequestRepository;
import com.example.referralwallet.repository.PasswordResetTokenRepository;

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
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    // ==================== WITHDRAW REQUEST ====================
    public void requestWithdraw(String userId, double amount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Wallet not found"));

        System.out.println("💵 [DEBUG] Withdraw request by " + user.getEmail() + ", amount=" + amount);

        if (user.getUserType().equals("NORMAL"))
            throw new RuntimeException("❌ User must be PREMIUM to withdraw");

        if (!(amount == 100 || amount == 900 || amount == 3000))
            throw new RuntimeException("❌ Withdraw amount must be 100, 900, or 3000");

        // Lifetime Restriction Checks
        // Check for Previous APPROVED Requests:
        List<WithdrawRequest> approved100Requests = withdrawRequestRepository.findByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), "APPROVED");
        if (amount == 100) {
            boolean alreadyWithdrew100 = approved100Requests.stream().anyMatch(req -> req.getAmount() == 100);
            if (alreadyWithdrew100) {
                throw new RuntimeException("❌ You already withdrew ₹100 once.");
            }
        } else if (amount == 900) {
            boolean alreadyWithdrew900 = approved100Requests.stream().anyMatch(req -> req.getAmount() == 900);
            if (alreadyWithdrew900) {
                throw new RuntimeException("❌ You already withdrew ₹900 once.");
            }
            // Referral Check for ₹900:
            if (!user.isReferredChildBoughtPremium()) {
                throw new RuntimeException("❌ You can withdraw ₹900 only after a referred child buys premium.");
            }
        } else if (amount == 3000) {
            // Referral Check for ₹3000:
            if (user.getChildren().size() < 2 || user.getChildren().stream().filter(childId -> {
                User childUser = userRepository.findById(childId).orElse(null);
                return childUser != null && "PREMIUM".equals(childUser.getUserType());
            }).count() < 2) {
                throw new RuntimeException("❌ You can withdraw ₹3000 only after 2 referred children buy premium.");
            }
        }

        // Balance Check (Prevention):
        if (wallet.getWalletBalance() < amount)
            throw new RuntimeException("⚠️ Insufficient wallet balance");

        WithdrawRequest req = new WithdrawRequest();
        req.setUserId(userId);
        req.setAmount(amount);
        req.setStatus("PENDING");
        req.setCreatedAt(LocalDateTime.now());
        withdrawRequestRepository.save(req);

        // Do not update any withdrawal flags yet.
        // The hasWithdrawn100 and hasWithdrawn900 flags are updated only upon successful approval.

        String withdrawApproveLink = "http://localhost:8080/api/admin/withdraw/approve/" + req.getId();
        String withdrawRejectLink = "http://localhost:8080/api/admin/withdraw/reject/" + req.getId();
        String withdrawEmailBody = "User " + user.getEmail() + " requested withdraw of " + amount + ".<br/><br/>" +
                "<a href=\"" + withdrawApproveLink + "\" style=\"background-color: #4CAF50; color: white; padding: 12px 24px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; font-weight: bold;\">Accept</a> " +
                "<a href=\"" + withdrawRejectLink + "\" style=\"background-color: #f44336; color: white; padding: 12px 24px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; font-weight: bold; margin-left: 15px;\">Reject</a>";
        emailService.sendSimple("projecttesting897@gmail.com", "Withdraw Request", withdrawEmailBody);
        System.out.println("✅ [DEBUG] Withdraw request created for " + user.getEmail());
    }

    // ==================== PASSWORD RESET ====================
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // For security reasons, do not reveal if the user does not exist
            System.out.println("⚠️ [DEBUG] Password reset requested for non-existent email: " + email);
            return;
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(5);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserId(user.getId());
        resetToken.setExpiryDate(expiryDate);
        resetToken.setUsed(false);
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        String emailBody = "To reset your password, click the button below:<br/><br/>" +
                "<a href=\"" + resetLink + "\" style=\"background-color: #4CAF50; color: white; padding: 12px 24px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; font-weight: bold;\">Reset Password</a><br/><br/>" +
                "This link will expire in 5 minutes.";
        emailService.sendSimple(email, "Password Reset Request", emailBody);
        System.out.println("📧 [DEBUG] Password reset link sent to " + email);
    }

    public boolean verifyPasswordResetToken(String token) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = optionalToken.get();
        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        return true;
    }

    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            throw new RuntimeException("Invalid or expired token.");
        }

        PasswordResetToken resetToken = optionalToken.get();
        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token.");
        }

        User user = userRepository.findById(resetToken.getUserId()).orElseThrow(() -> new RuntimeException("User not found."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        System.out.println("🔑 [DEBUG] Password reset successfully for user: " + user.getEmail());
    }

    // ==================== PREMIUM REQUEST ====================
    public void applyPremiumRequest(String userId, String mobileNumber) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremiumRequestStatus("PENDING");
        userRepository.save(user);

        String premiumApproveLink = "http://localhost:8080/api/admin/premium/approve/" + user.getId();
        String premiumRejectLink = "http://localhost:8080/api/admin/premium/reject/" + user.getId();
        String premiumEmailBody = "User " + user.getEmail() + " with mobile " + mobileNumber + " requested premium.<br/><br/>" +
                "<a href=\"" + premiumApproveLink + "\" style=\"background-color: #FF0000; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-weight: bold;\">Accept</a> " +
                "<a href=\"" + premiumRejectLink + "\" style=\"background-color: #FF0000; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-weight: bold; margin-left: 10px;\">Reject</a>";
        emailService.sendSimple("projecttesting897@gmail.com", "Premium Upgrade Request", premiumEmailBody);
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
            User parentUser = userRepository.findById(user.getReferredBy())
                    .orElseThrow(() -> new RuntimeException("Parent user not found"));
            referralService.creditPremiumUpgradeBonus(parentUser.getReferralId(), user.getId());
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
    public List<WithdrawRequestResponse> getUserWithdrawRequests(String userId) {
        // Get all requests sorted by createdAt in descending order
        List<WithdrawRequest> allRequests = withdrawRequestRepository.findByUserId(userId);
        allRequests.sort((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()));
        
        // Group by amount and take the first (latest) request for each amount
        Map<Double, WithdrawRequest> latestRequests = allRequests.stream()
            .collect(Collectors.toMap(
                WithdrawRequest::getAmount,
                req -> req,
                (existing, replacement) -> existing)); // Keep first occurrence (latest due to sort)
        
        // Convert to response objects
        return latestRequests.values().stream()
            .map(req -> new WithdrawRequestResponse(
                req.getUserId(),
                req.getAmount(),
                req.getStatus(),
                Date.from(req.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant()),
                req.getUpdatedAt() != null ? Date.from(req.getUpdatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant()) : null))
            .collect(Collectors.toList());
    }

    public void approveWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Wallet not found"));

        // Final Balance Check (Extra Safety):
        if (wallet.getWalletBalance() < req.getAmount()) {
            throw new RuntimeException("⚠️ Insufficient wallet balance for approval. Current balance: " + wallet.getWalletBalance() + ", requested: " + req.getAmount());
        }

        // Deduct Wallet Balance:
        wallet.setWalletBalance(wallet.getWalletBalance() - req.getAmount());
        wallet.setTotalWithdrawal(wallet.getTotalWithdrawal() + req.getAmount());
        wallet.getWalletHistory().add(new WalletTransaction(WalletTransaction.TransactionType.WITHDRAW.name(), -req.getAmount(), "Withdraw approved", new Date()));
        walletRepository.save(wallet);

        // Mark Request Approved:
        req.setStatus("APPROVED");
        withdrawRequestRepository.save(req);

        // Now update withdrawal flags:
        if (req.getAmount() == 100) {
            user.setHasWithdrawn100(true);
        } else if (req.getAmount() == 900) {
            user.setHasWithdrawn900(true);
        }
        userRepository.save(user);

        System.out.println("✅ [DEBUG] Withdraw approved for " + user.getEmail() + ", amount=" + req.getAmount());
    }

    // ==================== REJECT WITHDRAW (FOR ADMIN) ====================
    public void rejectWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        // Do Not Touch Wallet or Flags:
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

    // ==================== GET USER BY ID ====================
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==================== UPDATE PROFILE ====================
    public void updateProfile(String userId, UserDtos.ProfileUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
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
        if (user.getReferredBy() != null) {
            User parent = userRepository.findById(user.getReferredBy()).orElse(null);
            response.setReferredByName(parent != null ? parent.getName() : null);
        }
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
