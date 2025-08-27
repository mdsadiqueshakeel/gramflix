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
import java.util.Date;
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

    public void requestWithdraw(String userId, double amount) {
        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow();
        if (user.getUserType().equals("NORMAL"))
            throw new RuntimeException("User must be PREMIUM to withdraw");
        if (wallet.getWalletBalance() < amount) throw new RuntimeException("Insufficient balance");

        WithdrawRequest req = new WithdrawRequest();
        req.setUserId(userId);
        req.setAmount(amount);
        req.setStatus("PENDING");
        withdrawRequestRepository.save(req);

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

    public void approveWithdraw(WithdrawRequest req) {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow();
        wallet.setWalletBalance(wallet.getWalletBalance() - req.getAmount());
        wallet.getWalletHistory().add(new WalletTransaction("WITHDRAW", -req.getAmount(), "Withdraw approved", new Date()));
        walletRepository.save(wallet);
        req.setStatus("APPROVED");
        withdrawRequestRepository.save(req);
        System.out.println("Withdraw approved for " + user.getEmail() + " amount=" + req.getAmount());
    }

    public void updateProfile(String userId, UserDtos.ProfileUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
    }

    public UserDtos.ProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
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
        return response;
    }

    public UserDtos.WalletResponse getWallet(String userId) {
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow();
        UserDtos.WalletResponse response = new UserDtos.WalletResponse();
        response.setWalletBalance(wallet.getWalletBalance());
        response.setTodaysEarning(wallet.getTodaysEarning());
        response.setThisWeekEarning(wallet.getThisWeekEarning());
        response.setTotalEarning(wallet.getTotalEarning());
        return response;
    }

    public UserDtos.ChildrenResponse getChildren(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        UserDtos.ChildrenResponse response = new UserDtos.ChildrenResponse();
        List<UserDtos.Child> children = new ArrayList<>();
        for (String childId : user.getChildren()) {
            Optional<User> child = userRepository.findById(childId);
            child.ifPresent(c -> children.add(new UserDtos.Child(c.getEmail(), c.getMobile())));
        }
        response.setChildren(children);
        return response;
    }
}