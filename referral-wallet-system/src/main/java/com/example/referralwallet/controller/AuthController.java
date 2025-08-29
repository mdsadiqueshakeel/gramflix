package com.example.referralwallet.controller;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.referralwallet.dto.ApiResponse;
import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.service.AuthService;
import com.example.referralwallet.service.OtpService;
import com.example.referralwallet.service.ReferralService;
import com.example.referralwallet.service.UserService;
import com.example.referralwallet.util.SecurityUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = Logger.getLogger(AuthController.class.getName());

    private final AuthService authService;
    private final OtpService otpService;
    private final UserService userService;
    private final ReferralService referralService;

    public AuthController(AuthService authService, OtpService otpService, UserService userService, ReferralService referralService) {
        this.authService = authService;
        this.otpService = otpService;
        this.userService = userService;
        this.referralService = referralService;
    }

    // Initialize registration and send OTP
    @PostMapping("/init-register")
    public ResponseEntity<ApiResponse> initRegister(@RequestBody AuthDtos.RegisterRequest request) {
        ApiResponse response;
        try {
            logger.log(Level.INFO, "📝 [DEBUG] init-register called for email: {0}, mobile: {1}",
                    new Object[]{request.getEmail(), request.getMobile()});
    
            // 1️⃣ Validate mobile number length
            if (request.getMobile() == null || request.getMobile().length() != 10) {
                response = new ApiResponse(false, "Mobile number must be 10 digits");
                return ResponseEntity.badRequest().body(response);
            }

            
    
            // 2️⃣ MANDATORY: Validate referral ID
            if (request.getReferral() == null || request.getReferral().isEmpty()) {
                response = new ApiResponse(false, "Referral ID is required to register");
                return ResponseEntity.badRequest().body(response);
            }
    
            // 3️⃣ Validate referral exists in DB
            // The original code had a direct userRepository.findByReferralId call here.
            // It's better to use the referralService.isValidReferralId method for consistency and proper validation.
            if (!referralService.isValidReferralId(request.getReferral())) {
                response = new ApiResponse(false, "Invalid referral ID");
                return ResponseEntity.badRequest().body(response);
            }
    
           
    
            // 5️⃣ Temp register user for OTP
            authService.tempRegister(request);
    
            // 6️⃣ Send OTP
            OtpDtos.OtpSendRequest otpReq = new OtpDtos.OtpSendRequest();
            otpReq.setTo(request.getMobile().replace("+91", ""));
            logger.log(Level.INFO, "📲 [DEBUG] Sending OTP to: {0}", otpReq.getTo());
            OtpDtos.OtpSendResponse otpSendResponse = otpService.sendOtp(otpReq);
            logger.log(Level.INFO, "✅ [DEBUG] OTP sent successfully");
    
            // 7️⃣ Response
            response = new ApiResponse(true, "OTP sent successfully", otpSendResponse.getDevEchoOtp());
            return ResponseEntity.ok(response);
    
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] init-register error: " + e.getMessage(), e);
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Complete registration after OTP verification
    @PostMapping("/complete-register")
    public ResponseEntity<ApiResponse> completeRegistration(@RequestBody AuthDtos.RegisterRequest request) {
        ApiResponse response;
        try {
            logger.log(Level.INFO, "📝 [DEBUG] complete-register called for mobile: {0}, email: {1}",
                    new Object[]{request.getMobile(), request.getEmail()});

            AuthDtos.RegisterResponse regResp = authService.registerAfterOtp(request.getMobile(), request);
            logger.log(Level.INFO, "✅ [DEBUG] User registered successfully, userId: {0}", regResp.getUserId());

            response = new ApiResponse(true, "Registration successful");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] complete-register error: " + e.getMessage(), e);
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthDtos.LoginRequest request) {
        ApiResponse apiResponse;
        try {
            logger.log(Level.INFO, "🔑 [DEBUG] login attempt for email/mobile: {0}", request.getEmailOrMobile());
            AuthDtos.LoginResponse loginResponse = authService.login(request);
            logger.log(Level.INFO, "✅ [DEBUG] Login successful, userId: {0}, token: {1}",
                    new Object[]{loginResponse.getUserId(), loginResponse.getToken()});
            apiResponse = new ApiResponse(true, "Login successful", loginResponse);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] login error: " + e.getMessage(), e);
            apiResponse = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }

    // Update profile (token-based)
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@RequestBody UserDtos.ProfileUpdateRequest request) {
        ApiResponse response;
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "✏️ [DEBUG] updateProfile called for userId: {0}", userId);
            userService.updateProfile(userId, request);
            logger.log(Level.INFO, "✅ [DEBUG] Profile updated successfully for userId: {0}", userId);
            response = new ApiResponse(true, "Profile updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] updateProfile error: " + e.getMessage(), e);
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }



    // Get profile (token-based)
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile() {
        ApiResponse response;
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "👤 [DEBUG] getProfile called for userId: {0}", userId);
            UserDtos.ProfileResponse profile = userService.getProfile(userId);
            logger.log(Level.INFO, "✅ [DEBUG] Profile fetched successfully for userId: {0}", userId);
            response = new ApiResponse(true, "Profile fetched successfully", profile);
            // You might want to add the profile data to the ApiResponse if needed
            // response.setData(profile); // Assuming ApiResponse has a setData method
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] getProfile error: " + e.getMessage(), e);
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get wallet (token-based)
    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse> getWallet() {
        ApiResponse response;
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "💰 [DEBUG] getWallet called for userId: {0}", userId);
            UserDtos.WalletResponse wallet = userService.getWallet(userId);
            logger.log(Level.INFO, "✅ [DEBUG] Wallet fetched successfully for userId: {0}", userId);
            response = new ApiResponse(true, "Wallet fetched successfully", wallet);
            // You might want to add the wallet data to the ApiResponse if needed
            // response.setData(wallet); // Assuming ApiResponse has a setData method
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] getWallet error: " + e.getMessage(), e);
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get children (token-based)
    @GetMapping("/children")
    public ResponseEntity<ApiResponse> getChildren() {
        ApiResponse response;
        try {
            String userId = SecurityUtils.getCurrentUserId();
            logger.log(Level.INFO, "👨‍👩‍👧‍👦 [DEBUG] getChildren called for userId: {0}", userId);
            UserDtos.ChildrenResponse children = userService.getChildren(userId);
            logger.log(Level.INFO, "✅ [DEBUG] Children fetched successfully for userId: {0}", userId);
            response = new ApiResponse(true, "Children fetched successfully", children);
            // You might want to add the children data to the ApiResponse if needed
            // response.setData(children); // Assuming ApiResponse has a setData method
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "⚠️ [DEBUG] getChildren error: " + e.getMessage(), e);
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
