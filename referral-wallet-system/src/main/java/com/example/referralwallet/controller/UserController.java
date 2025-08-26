package com.example.referralwallet.controller;

import com.example.referralwallet.service.AuthService;
import com.example.referralwallet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    /** Withdraw request */
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        double amount = Double.parseDouble(body.get("amount").toString());
        userService.requestWithdraw(userId, amount);
        return ResponseEntity.ok(Map.of("message", "Withdraw request created"));
    }

    /** Premium upgrade request */
    @PostMapping("/premium/request")
    public ResponseEntity<?> premiumRequest(@RequestBody Map<String, String> body) {
        userService.applyPremiumRequest(body.get("userId"));
        return ResponseEntity.ok(Map.of("message", "Premium request sent"));
    }

    /** List all users (admin/debug) */
    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}
