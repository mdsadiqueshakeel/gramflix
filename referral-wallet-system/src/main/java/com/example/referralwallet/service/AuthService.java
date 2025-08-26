package com.example.referralwallet.service;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.model.User;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferralService referralService;
    private final JwtProvider jwtProvider;

    // Temporarily stores registration requests before OTP verification, with expiration
    private final Map<String, TempRegistration> tempUsers = new ConcurrentHashMap<>();

    // Inner class to track expiration
    private static class TempRegistration {
        AuthDtos.RegisterRequest request;
        Instant expiresAt;

        TempRegistration(AuthDtos.RegisterRequest request) {
            this.request = request;
            this.expiresAt = Instant.now().plus(5, ChronoUnit.MINUTES);
        }
    }

    /** Step 1: Store temp registration (before OTP verification) */
    public void tempRegister(AuthDtos.RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmailOrMobile(request.getEmail(), request.getMobile());
        if (existingUser.isPresent()) throw new RuntimeException("User already exists");

        // Clean up expired entries
        tempUsers.entrySet().removeIf(entry -> entry.getValue().expiresAt.isBefore(Instant.now()));

        // Store by mobile (as string) since OTP uses mobile
        String mobile = request.getMobile();
        if (!mobile.startsWith("+")) mobile = "+91" + mobile;
        mobile = mobile.replace("+91", ""); // Store 10-digit number
        tempUsers.put(mobile, new TempRegistration(request));
        log.info("Temp registration stored for mobile: {}", mobile);
    }

    /** Step 2: After OTP verification, permanently register */
    public AuthDtos.RegisterResponse registerAfterOtp(String mobile) {
        // Clean up expired entries
        tempUsers.entrySet().removeIf(entry -> entry.getValue().expiresAt.isBefore(Instant.now()));

        TempRegistration temp = tempUsers.get(mobile);
        if (temp == null) throw new RuntimeException("No pending registration found for mobile: " + mobile);

        AuthDtos.RegisterRequest request = temp.request;
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // hash password
        user.setUserType("NORMAL");
        user.setPremiumRequestStatus("NONE");
        user.setWalletBalance(0);

        user = userRepository.save(user);
        log.info("User registered with ID: {}", user.getId());

        // Referral bonus
        if (request.getReferralId() != null && !request.getReferralId().isEmpty()) {
            try {
                referralService.creditParentBonus(request.getReferralId(), user.getId());
                log.info("Referral bonus credited for referralId: {}", request.getReferralId());
            } catch (Exception e) {
                log.warn("Failed to credit referral bonus: {}", e.getMessage());
            }
        }

        tempUsers.remove(mobile);
        log.info("Temp registration removed for mobile: {}", mobile);

        AuthDtos.RegisterResponse response = new AuthDtos.RegisterResponse();
        response.setMessage("User registered successfully after OTP verification");
        response.setUserId(user.getId());
        return response;
    }

    /** Login */
    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmailOrMobile(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        AuthDtos.LoginResponse response = new AuthDtos.LoginResponse();
        response.setUserId(user.getId());
        response.setToken(jwtProvider.generateToken(user.getId()));
        return response;
    }

    /** Admin/Debug: get all users */
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}