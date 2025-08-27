package com.example.referralwallet.controller;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.service.AuthService;
import com.example.referralwallet.service.OtpService;
import com.example.referralwallet.service.UserService;
import com.example.referralwallet.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = Logger.getLogger(AuthController.class.getName());

    private final AuthService authService;
    private final OtpService otpService;
    private final UserService userService;

    public AuthController(AuthService authService, OtpService otpService, UserService userService) {
        this.authService = authService;
        this.otpService = otpService;
        this.userService = userService;
    }

    // Initialize registration and send OTP
    @PostMapping("/init-register")
    public ResponseEntity<?> initRegister(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            logger.log(Level.INFO, "📝 [DEBUG] init-register called for email: {0}, mobile: {1}",
                    new Object[]{request.getEmail(), request.getMobile()});

            authService.tempRegister(request);

            OtpDtos.OtpSendRequest otpReq = new OtpDtos.OtpSendRequest();
            otpReq.setTo(request.getMobile().replace("+91", ""));

            logger.log(Level.INFO, "📲 [DEBUG] Sending OTP to: {0}", otpReq.getTo());
            var response = otpService.sendOtp(otpReq);
            logger.log(Level.INFO, "✅ [DEBUG] OTP sent successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] init-register error: " + e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Complete registration after OTP verification
    @PostMapping("/complete-register")
    public ResponseEntity<?> completeRegistration(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            logger.log(Level.INFO, "📝 [DEBUG] complete-register called for mobile: {0}, email: {1}",
                    new Object[]{request.getMobile(), request.getEmail()});

            AuthDtos.RegisterResponse regResp = authService.registerAfterOtp(request.getMobile(), request);
            logger.log(Level.INFO, "✅ [DEBUG] User registered successfully, userId: {0}", regResp.getUserId());

            // Referral Bonus Logic
            if (request.getParentReferralId() != null && !request.getParentReferralId().isEmpty()) {
                logger.log(Level.INFO, "🎁 [DEBUG] Crediting referral bonus to parentReferralId: {0}", request.getParentReferralId());
                userService.creditReferralBonus(request.getParentReferralId());
            }

            return ResponseEntity.ok(regResp);

        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] complete-register error: " + e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<AuthDtos.LoginResponse> login(@RequestBody AuthDtos.LoginRequest request) {
        logger.log(Level.INFO, "🔑 [DEBUG] login attempt for email/mobile: {0}", request.getEmailOrMobile());
        var response = authService.login(request);
        logger.log(Level.INFO, "✅ [DEBUG] Login successful, userId: {0}, token: {1}",
                new Object[]{response.getUserId(), response.getToken()});
        return ResponseEntity.ok(response);
    }

    // Update profile (token-based)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDtos.ProfileUpdateRequest request) {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "✏️ [DEBUG] updateProfile called for userId: {0}", userId);
            userService.updateProfile(userId, request);
            logger.log(Level.INFO, "✅ [DEBUG] Profile updated successfully for userId: {0}", userId);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] updateProfile error: " + e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get profile (token-based)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "👤 [DEBUG] getProfile called for userId: {0}", userId);
            UserDtos.ProfileResponse profile = userService.getProfile(userId);
            logger.log(Level.INFO, "✅ [DEBUG] Profile fetched successfully for userId: {0}", userId);
            return ResponseEntity.ok(Map.of("data", profile));
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] getProfile error: " + e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get wallet (token-based)
    @GetMapping("/wallet")
    public ResponseEntity<?> getWallet() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "💰 [DEBUG] getWallet called for userId: {0}", userId);
            UserDtos.WalletResponse wallet = userService.getWallet(userId);
            logger.log(Level.INFO, "✅ [DEBUG] Wallet fetched successfully for userId: {0}", userId);
            return ResponseEntity.ok(Map.of("data", wallet));
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] getWallet error: " + e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get children (token-based)
    @GetMapping("/children")
    public ResponseEntity<?> getChildren() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "👶 [DEBUG] getChildren called for userId: {0}", userId);
            UserDtos.ChildrenResponse children = userService.getChildren(userId);
            logger.log(Level.INFO, "✅ [DEBUG] Children fetched successfully for userId: {0}, count: {1}",
                    new Object[]{userId, children.getChildren().size()});
            return ResponseEntity.ok(Map.of("data", children));
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] getChildren error: " + e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
