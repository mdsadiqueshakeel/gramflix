package com.example.referralwallet.controller;

import com.example.referralwallet.model.User;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.service.UserService;
import com.example.referralwallet.util.SecurityUtils;
import com.example.referralwallet.model.WithdrawRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

     // Get all users
     @GetMapping
     public ResponseEntity<List<User>> getAllUsers() {
         List<User> users = userRepository.findAll();
         return ResponseEntity.ok(users);
     }

     // Get user by ID
     @GetMapping("/{id}")
     public ResponseEntity<User> getUserById(@PathVariable String id) {
         Optional<User> user = userRepository.findById(id);
         return user.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

    @PatchMapping("/premium-request")
    public ResponseEntity<?> requestPremium(@RequestParam String mobile) {
        String userId = SecurityUtils.getCurrentUserId();
        userService.applyPremiumRequest(userId, mobile);
        return ResponseEntity.ok(Map.of("message", "Premium request submitted successfully"));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> requestWithdraw(@RequestBody Map<String, Double> body) {
        Double amount = body.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid amount is required"));
        }
        String userId = SecurityUtils.getCurrentUserId();
        System.out.println("?? [DEBUG] Inside requestWithdraw - userId: " + userId);
        System.out.println("?? [DEBUG] Inside requestWithdraw - Authentication: " + SecurityContextHolder.getContext().getAuthentication());
        userService.requestWithdraw(userId, amount);
        return ResponseEntity.ok(Map.of("message", "Withdraw request submitted successfully"));
    }


     // Update user details
     @PutMapping("/{id}")
     public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
         Optional<User> optionalUser = userRepository.findById(id);

         if (optionalUser.isEmpty()) {
             return ResponseEntity.notFound().build();
         }

         User user = optionalUser.get();
         user.setName(updatedUser.getName());
         user.setEmail(updatedUser.getEmail());
         user.setMobile(updatedUser.getMobile());
         user.setUserType(updatedUser.getUserType());
         user.setStatus(updatedUser.getStatus());
         // Only update premium status if provided
         user.setPremiumRequestStatus(updatedUser.getPremiumRequestStatus());

         userRepository.save(user);
         return ResponseEntity.ok(user);
     }

     // Delete user
     @DeleteMapping("/users/{id}")
     public ResponseEntity<Void> deleteUser(@PathVariable String id) {
         if (!userRepository.existsById(id)) {
             return ResponseEntity.notFound().build();
         }

         userRepository.deleteById(id);
         return ResponseEntity.noContent().build();
     }

    @PostMapping("/admin/premium/approve/{userId}")
    public ResponseEntity<?> approvePremiumRequest(@PathVariable String userId) {
        userService.approvePremiumRequest(userId);
        return ResponseEntity.ok(Map.of("message", "Premium request approved successfully"));
    }

    @PostMapping("/admin/premium/reject/{userId}")
    public ResponseEntity<?> rejectPremiumRequest(@PathVariable String userId) {
        userService.rejectPremiumRequest(userId);
        return ResponseEntity.ok(Map.of("message", "Premium request rejected successfully"));
    }

    @PostMapping("/admin/withdraw/approve/{requestId}")
    public ResponseEntity<?> approveWithdrawRequest(@PathVariable String requestId) {
        // Fetch the WithdrawRequest by ID
        WithdrawRequest withdrawRequest = userService.getWithdrawRequestById(requestId);
        userService.approveWithdraw(withdrawRequest);
        return ResponseEntity.ok(Map.of("message", "Withdraw request approved successfully"));
    }

    @PostMapping("/admin/withdraw/reject/{requestId}")
    public ResponseEntity<?> rejectWithdrawRequest(@PathVariable String requestId) {
        // Fetch the WithdrawRequest by ID
        WithdrawRequest withdrawRequest = userService.getWithdrawRequestById(requestId);
        userService.rejectWithdraw(withdrawRequest);
        return ResponseEntity.ok(Map.of("message", "Withdraw request rejected successfully"));
    }
}
