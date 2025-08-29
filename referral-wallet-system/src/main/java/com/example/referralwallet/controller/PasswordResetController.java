package com.example.referralwallet.controller;

import com.example.referralwallet.dto.PasswordResetRequest;
import com.example.referralwallet.dto.PasswordResetTokenVerificationRequest;
import com.example.referralwallet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final UserService userService;

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        userService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email if an account exists.");
    }

    @PostMapping("/verify-token")
    public ResponseEntity<Boolean> verifyPasswordResetToken(@RequestBody PasswordResetTokenVerificationRequest request) {
        boolean isValid = userService.verifyPasswordResetToken(request.getToken());
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully.");
    }
}