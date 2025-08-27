package com.example.referralwallet.controller;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.service.AuthService;
import com.example.referralwallet.service.OtpService;
import com.example.referralwallet.service.UserService;
import com.example.referralwallet.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserService userService;

    // Initialize registration and send OTP
    @PostMapping("/init-register")
    public ResponseEntity<?> initRegister(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            System.out.println("📝 [DEBUG] init-register called for email: " + request.getEmail() + ", mobile: " + request.getMobile());
            authService.tempRegister(request);

            OtpDtos.OtpSendRequest otpReq = new OtpDtos.OtpSendRequest();
            otpReq.setTo(Long.parseLong(request.getMobile().replace("+91", "")));

            System.out.println("📲 [DEBUG] Sending OTP to: " + otpReq.getTo());
            var response = otpService.sendOtp(otpReq);
            System.out.println("✅ [DEBUG] OTP sent successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] init-register error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Complete registration after OTP verification
    @PostMapping("/complete-register")
    public ResponseEntity<?> completeRegistration(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            System.out.println("📝 [DEBUG] complete-register called for mobile: " + request.getMobile() + ", email: " + request.getEmail());
            AuthDtos.RegisterResponse regResp = authService.registerAfterOtp(request.getMobile(), request);
            System.out.println("✅ [DEBUG] User registered successfully, userId: " + regResp.getUserId());
            return ResponseEntity.ok(regResp);
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] complete-register error: " + e.getMessage());
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<AuthDtos.LoginResponse> login(@RequestBody AuthDtos.LoginRequest request) {
        System.out.println("🔑 [DEBUG] login attempt for email/mobile: " + request.getEmailOrMobile());
        var response = authService.login(request);
        System.out.println("✅ [DEBUG] Login successful, userId: " + response.getUserId() + ", token: " + response.getToken());
        return ResponseEntity.ok(response);
    }

    // Update profile (token-based)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDtos.ProfileUpdateRequest request) {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            System.out.println("✏️ [DEBUG] updateProfile called for userId: " + userId);
            userService.updateProfile(userId, request);
            System.out.println("✅ [DEBUG] Profile updated successfully for userId: " + userId);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] updateProfile error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get profile (token-based)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            System.out.println("👤 [DEBUG] getProfile called for userId: " + userId);
            UserDtos.ProfileResponse profile = userService.getProfile(userId);
            System.out.println("✅ [DEBUG] Profile fetched successfully for userId: " + userId);
            return ResponseEntity.ok(Map.of("data", profile));
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] getProfile error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get wallet (token-based)
    @GetMapping("/wallet")
    public ResponseEntity<?> getWallet() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            System.out.println("💰 [DEBUG] getWallet called for userId: " + userId);
            UserDtos.WalletResponse wallet = userService.getWallet(userId);
            System.out.println("✅ [DEBUG] Wallet fetched successfully for userId: " + userId);
            return ResponseEntity.ok(Map.of("data", wallet));
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] getWallet error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get children (token-based)
    @GetMapping("/children")
    public ResponseEntity<?> getChildren() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            System.out.println("👶 [DEBUG] getChildren called for userId: " + userId);
            UserDtos.ChildrenResponse children = userService.getChildren(userId);
            System.out.println("✅ [DEBUG] Children fetched successfully for userId: " + userId + ", count: " + children.getChildren().size());
            return ResponseEntity.ok(Map.of("data", children));
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] getChildren error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
