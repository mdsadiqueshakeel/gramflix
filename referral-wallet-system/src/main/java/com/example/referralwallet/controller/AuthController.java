package com.example.referralwallet.controller;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.dto.UserDtos;
import com.example.referralwallet.service.AuthService;
import com.example.referralwallet.service.OtpService;
import com.example.referralwallet.service.UserService;
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

    @PostMapping("/init-register")
    public ResponseEntity<?> initRegister(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            authService.tempRegister(request);

            OtpDtos.OtpSendRequest otpReq = new OtpDtos.OtpSendRequest();
            otpReq.setTo(Long.parseLong(request.getMobile().replace("+91", "")));
            return ResponseEntity.ok(otpService.sendOtp(otpReq));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/complete-register")
    public ResponseEntity<?> completeRegistration(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            AuthDtos.RegisterResponse regResp = authService.registerAfterOtp(request.getMobile(), request);
            return ResponseEntity.ok(regResp);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.LoginResponse> login(@RequestBody AuthDtos.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDtos.ProfileUpdateRequest request) {
        try {
            userService.updateProfile(request.getUserId(), request);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId) {
        try {
            UserDtos.ProfileResponse profile = userService.getProfile(userId);
            return ResponseEntity.ok(Map.of("data", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/wallet/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable String userId) {
        try {
            UserDtos.WalletResponse wallet = userService.getWallet(userId);
            return ResponseEntity.ok(Map.of("data", wallet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/children/{userId}")
    public ResponseEntity<?> getChildren(@PathVariable String userId) {
        try {
            UserDtos.ChildrenResponse children = userService.getChildren(userId);
            return ResponseEntity.ok(Map.of("data", children));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}