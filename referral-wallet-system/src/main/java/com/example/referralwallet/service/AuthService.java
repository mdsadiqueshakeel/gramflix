package com.example.referralwallet.service;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.model.User;
                import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import com.example.referralwallet.security.JwtProvider;
import com.example.referralwallet.util.TokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferralService referralService;
    private final JwtProvider jwtProvider;
    private final TokenGenerator tokenGenerator;

    private final ConcurrentHashMap<String, AuthDtos.RegisterRequest> tempUsers = new ConcurrentHashMap<>();

    public void tempRegister(AuthDtos.RegisterRequest request) {
        log.debug("Temp registering user with email: {}", request.getEmail());
        Optional<User> existingUser = userRepository.findByEmailOrMobile(request.getEmail(), request.getMobile());
        if (existingUser.isPresent()) {
            log.debug("User already exists with email: {}", request.getEmail());
            throw new RuntimeException("User already exists");
        }
        tempUsers.put(request.getEmail(), request);
        log.debug("Temp user stored for email: {}", request.getEmail());
    }

    public AuthDtos.RegisterResponse registerAfterOtp(String mobile, AuthDtos.RegisterRequest request) {
        log.debug("Registering user after OTP for mobile: {}, email: {}", mobile, request.getEmail());
        AuthDtos.RegisterRequest storedRequest = tempUsers.get(request.getEmail());
        if (storedRequest == null) {
            log.debug("No pending registration found for email: {}", request.getEmail());
            throw new RuntimeException("No pending registration found for " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType("NORMAL");
        user.setStatus("ACTIVE");
        user.setPremiumRequestStatus("NONE");

        String referralId = tokenGenerator.randomToken(8).toUpperCase();
        user.setReferralId(referralId);
        user.setReferralLink("https://yourapp.com/register?ref=" + referralId);

        if (request.getReferralId() != null && !request.getReferralId().isEmpty()) {
            user.setReferredBy(request.getReferralId());
        }

        user = userRepository.save(user);
        log.debug("User saved with ID: {}", user.getId());

        Wallet wallet = new Wallet();
        wallet.setUserId(user.getId());
        wallet.setWalletBalance(0.0);
        wallet.setTodaysEarning(0.0);
        wallet.setThisWeekEarning(0.0);
        wallet.setTotalEarning(0.0);
        wallet = walletRepository.save(wallet);
        log.debug("Wallet saved with ID: {}", wallet.getId());

        user.setWalletId(wallet.getId());
        userRepository.save(user);
        log.debug("User updated with wallet ID: {}", wallet.getId());

        if (request.getReferralId() != null && !request.getReferralId().isEmpty()) {
            final User finalUser = user; // Make user effectively final
            Optional<User> parentOpt = userRepository.findByReferralId(request.getReferralId());
            parentOpt.ifPresent(parent -> {
                parent.getChildren().add(finalUser.getId());
                userRepository.save(parent);
                log.debug("Parent updated with child ID: {}", finalUser.getId());
            });
            referralService.creditParentBonus(request.getReferralId(), user.getId());
            log.debug("Parent bonus credited for referral ID: {}", request.getReferralId());
        }

        tempUsers.remove(request.getEmail());
        log.debug("Temp user removed for email: {}", request.getEmail());

        AuthDtos.RegisterResponse response = new AuthDtos.RegisterResponse();
        response.setMessage("User registered successfully after OTP verification");
        response.setUserId(user.getId());
        log.debug("Registration response prepared with user ID: {}", user.getId());
        return response;
    }

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        log.debug("Login attempt for email/mobile: {}", request.getEmailOrMobile());
        User user = userRepository.findByEmailOrMobile(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> {
                    log.debug("User not found for email/mobile: {}", request.getEmailOrMobile());
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.debug("Invalid password for user ID: {}", user.getId());
            throw new RuntimeException("Invalid password");
        }

        AuthDtos.LoginResponse response = new AuthDtos.LoginResponse();
        response.setUserId(user.getId());
        response.setToken(jwtProvider.generateToken(user.getId()));
        log.debug("Login successful, token generated for user ID: {}", user.getId());
        return response;
    }

    public java.util.List<User> getAllUsers() {
            log.debug("Fetching all users");
        return userRepository.findAll();
    }
}