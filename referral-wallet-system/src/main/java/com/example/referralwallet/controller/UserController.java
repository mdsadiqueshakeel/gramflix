package com.example.referralwallet.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.referralwallet.dto.ApiResponse;
import com.example.referralwallet.dto.WithdrawRequestResponse;
import com.example.referralwallet.model.User;
import com.example.referralwallet.model.WithdrawRequest;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.service.UserService;
import com.example.referralwallet.util.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    private final UserRepository userRepository;
    private final UserService userService;

     // Get all users
     @GetMapping
     public ResponseEntity<ApiResponse> getAllUsers() {
         try {
             List<User> users = userRepository.findAll();
             logger.log(Level.INFO, "Fetched all users successfully");
             return ResponseEntity.ok(new ApiResponse(true, "Users fetched successfully", users));
         } catch (Exception e) {
             logger.log(Level.SEVERE, "Error fetching all users", e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to fetch users", null));
         }
     }

     // Get user by ID
     @GetMapping("/{id}")
     public ResponseEntity<ApiResponse> getUserById(@PathVariable String id) {
         try {
             Optional<User> user = userRepository.findById(id);
             if (user.isPresent()) {
                 logger.log(Level.INFO, "Fetched user by ID: {0} successfully", id);
                 return ResponseEntity.ok(new ApiResponse(true, "User fetched successfully", user.get()));
             } else {
                 logger.log(Level.WARNING, "User with ID: {0} not found", id);
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "User not found", null));
             }
         } catch (Exception e) {
             logger.log(Level.SEVERE, "Error fetching user by ID: {0}", new Object[]{id, e});
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to fetch user", null));
         }
     }

    @PatchMapping("/premium-request")
    public ResponseEntity<ApiResponse> requestPremium(@RequestParam String mobile) {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                logger.log(Level.WARNING, "Unauthorized premium request: Invalid or expired token. User ID not found.");
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Unauthorized: Invalid or expired token", null));
            }
            logger.log(Level.INFO, "Premium request for userId: {0}, mobile: {1}", new Object[]{userId, mobile});
            userService.applyPremiumRequest(userId, mobile);
            logger.log(Level.INFO, "Premium request submitted successfully for userId: {0}", userId);
            return ResponseEntity.ok(new ApiResponse(true, "Premium request submitted successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error submitting premium request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to submit premium request", null));
        }
    }

    // @GetMapping("/withdraw-requests")
    // public ResponseEntity<ApiResponse> getUserWithdrawRequests() {
    //     try {
    //         String userId = SecurityUtils.getCurrentUserId();
    //         if (userId == null) {
    //             logger.log(Level.WARNING, "Unauthorized request: User ID not found in security context.");
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Unauthorized: Invalid or expired token", null));
    //         }
    //         List<WithdrawRequestResponse> requests = userService.getUserWithdrawRequests(userId);
    //         logger.log(Level.INFO, "Fetched withdrawal requests for userId: {0}", userId);
    //         return ResponseEntity.ok(new ApiResponse(true, "Withdrawal requests fetched successfully", requests));
    //     } catch (Exception e) {
    //         logger.log(Level.SEVERE, "Error fetching withdrawal requests", e);
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to fetch withdrawal requests", null));
    //     }
    // }

    @PostMapping("/withdraw/{amount}")
    public ResponseEntity<ApiResponse> requestWithdraw(@PathVariable Double amount) {
        try {
            if (amount == null || amount <= 0) {
                logger.log(Level.WARNING, "Invalid amount provided for withdrawal: {0}", amount);
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Valid amount is required", null));
            }
            String userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                logger.log(Level.WARNING, "Unauthorized withdraw request: Invalid or expired token. User ID not found.");
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Unauthorized: Invalid or expired token", null));
            }
            logger.log(Level.INFO, "Withdrawal request for userId: {0}, amount: {1}", new Object[]{userId, amount});
            userService.requestWithdraw(userId, amount);
            logger.log(Level.INFO, "Withdraw request submitted successfully for userId: {0}", userId);
            return ResponseEntity.ok(new ApiResponse(true, "Withdraw request submitted successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error submitting withdrawal request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Your 100 rupees limit is already withdrawn", null));
        }
    }


     // Update user details
     @PutMapping("/{id}")
     public ResponseEntity<ApiResponse> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
         try {
             Optional<User> optionalUser = userRepository.findById(id);

             if (optionalUser.isEmpty()) {
                 logger.log(Level.WARNING, "User with ID: {0} not found for update", id);
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "User not found", null));
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
             logger.log(Level.INFO, "User with ID: {0} updated successfully", id);
             return ResponseEntity.ok(new ApiResponse(true, "User updated successfully", user));
         } catch (Exception e) {
             logger.log(Level.SEVERE, "Error updating user with ID: {0}", new Object[]{id, e});
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to update user", null));
         }
     }

     // Delete user
     @DeleteMapping("/users/{id}")
     public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) {
         try {
             if (!userRepository.existsById(id)) {
                 logger.log(Level.WARNING, "User with ID: {0} not found for deletion", id);
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "User not found", null));
             }

             userRepository.deleteById(id);
             logger.log(Level.INFO, "User with ID: {0} deleted successfully", id);
             return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
         } catch (Exception e) {
             logger.log(Level.SEVERE, "Error deleting user with ID: {0}", new Object[]{id, e});
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to delete user", null));
         }
     }

    @PostMapping("/admin/premium/approve/{userId}")
    public ResponseEntity<ApiResponse> approvePremiumRequest(@PathVariable String userId) {
        try {
            logger.log(Level.INFO, "Approving premium request for userId: {0}", userId);
            User user = userService.getUserById(userId);
            if (!"PENDING".equals(user.getPremiumRequestStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "Premium request already processed", null));
            }
            userService.approvePremiumRequest(userId);
            logger.log(Level.INFO, "Premium request approved successfully for userId: {0}", userId);
            return ResponseEntity.ok(new ApiResponse(true, "Premium request approved successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error approving premium request for userId: {0}", new Object[]{userId, e});
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to approve premium request", null));
        }
    }

    @PostMapping("/admin/premium/reject/{userId}")
    public ResponseEntity<ApiResponse> rejectPremiumRequest(@PathVariable String userId) {
        try {
            logger.log(Level.INFO, "Rejecting premium request for userId: {0}", userId);
            User user = userService.getUserById(userId);
            if (!"PENDING".equals(user.getPremiumRequestStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "Premium request already processed", null));
            }
            userService.rejectPremiumRequest(userId);
            logger.log(Level.INFO, "Premium request rejected successfully for userId: {0}", userId);
            return ResponseEntity.ok(new ApiResponse(true, "Premium request rejected successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error rejecting premium request for userId: {0}", new Object[]{userId, e});
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to reject premium request", null));
        }
    }

    @PostMapping("/admin/withdraw/approve/{requestId}")
    public ResponseEntity<ApiResponse> approveWithdrawRequest(@PathVariable String requestId) {
        try {
            logger.log(Level.INFO, "Approving withdrawal request for requestId: {0}", requestId);
            WithdrawRequest withdrawRequest = userService.getWithdrawRequestById(requestId);
            if (!"PENDING".equals(withdrawRequest.getStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "Withdrawal request already processed", null));
            }
            userService.approveWithdraw(withdrawRequest);
            logger.log(Level.INFO, "Withdraw request approved successfully for requestId: {0}", requestId);
            return ResponseEntity.ok(new ApiResponse(true, "Withdraw request approved successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error approving withdrawal request for requestId: {0}", new Object[]{requestId, e});
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to approve withdraw request", null));
        }
    }

    @PostMapping("/admin/withdraw/reject/{requestId}")
    public ResponseEntity<ApiResponse> rejectWithdrawRequest(@PathVariable String requestId) {
        try {
            logger.log(Level.INFO, "Rejecting withdrawal request for requestId: {0}", requestId);
            WithdrawRequest withdrawRequest = userService.getWithdrawRequestById(requestId);
            if (!"PENDING".equals(withdrawRequest.getStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "Withdrawal request already processed", null));
            }
            userService.rejectWithdraw(withdrawRequest);
            logger.log(Level.INFO, "Withdraw request rejected successfully for requestId: {0}", requestId);
            return ResponseEntity.ok(new ApiResponse(true, "Withdraw request rejected successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error rejecting withdrawal request for requestId: {0}", new Object[]{requestId, e});
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to reject withdraw request", null));
        }
    }
}
