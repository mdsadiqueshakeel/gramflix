package com.example.referralwallet.controller;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.dto.OtpDtos; // Added import for OtpDtos
import com.example.referralwallet.service.AuthService;
import com.example.referralwallet.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    /** Step 1: Register temp user & send OTP (triggers temp storage) */
    @PostMapping("/init-register")
    public ResponseEntity<?> initRegister(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            authService.tempRegister(request);

            OtpDtos.OtpSendRequest otpReq = new OtpDtos.OtpSendRequest();
            String mobile = request.getMobile();
            if (!mobile.startsWith("+")) {
                mobile = "+91" + mobile; // Prepend +91
            }
            otpReq.setTo(Long.parseLong(mobile.replace("+91", ""))); // Convert to 10-digit long

            return ResponseEntity.ok(otpService.sendOtp(otpReq));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during registration: " + e.getMessage());
        }
    }

    /** Step 3: Complete user registration after OTP verification */
    @PostMapping("/complete-register")
    public ResponseEntity<?> completeRegistration(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            String mobile = request.getMobile();
            if (!mobile.startsWith("+")) {
                mobile = "+91" + mobile; // Prepend +91
            }
            long to = Long.parseLong(mobile.replace("+91", ""));
            AuthDtos.RegisterResponse regResp = authService.registerAfterOtp(String.valueOf(to));
            return ResponseEntity.ok(regResp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during registration: " + e.getMessage());
        }
    }

    /** Login */
    @PostMapping("/login")
    public ResponseEntity<AuthDtos.LoginResponse> login(@RequestBody AuthDtos.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}