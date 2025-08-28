package com.example.referralwallet.controller;

import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.referralwallet.dto.ApiResponse;
import com.example.referralwallet.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private static final Logger logger = Logger.getLogger(AdminController.class.getName());
    private final AdminService adminService;

    @PostMapping("/premium/approve")
    public ResponseEntity<ApiResponse> approvePremium(@RequestBody Map<String,String> body){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Approving premium for userId: {0}", body.get("userId"));
            adminService.approvePremium(body.get("userId"));
            logger.log(Level.INFO, "Premium approved for userId: {0}", body.get("userId"));
            response = new ApiResponse(true, "Premium approved");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error approving premium: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/premium/reject")
    public ResponseEntity<ApiResponse> rejectPremium(@RequestBody Map<String,String> body){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Rejecting premium for userId: {0}", body.get("userId"));
            adminService.rejectPremium(body.get("userId"));
            logger.log(Level.INFO, "Premium rejected for userId: {0}", body.get("userId"));
            response = new ApiResponse(true, "Premium rejected");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error rejecting premium: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/withdraw/approve")
    public ResponseEntity<ApiResponse> approveWithdraw(@RequestBody Map<String,String> body){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Approving withdrawal for withdrawRequestId: {0}", body.get("withdrawRequestId"));
            adminService.approveWithdraw(body.get("withdrawRequestId"));
            logger.log(Level.INFO, "Withdrawal approved for withdrawRequestId: {0}", body.get("withdrawRequestId"));
            response = new ApiResponse(true, "Withdraw approved");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error approving withdrawal: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/withdraw/reject")
    public ResponseEntity<ApiResponse> rejectWithdraw(@RequestBody Map<String,String> body){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Rejecting withdrawal for withdrawRequestId: {0}", body.get("withdrawRequestId"));
            adminService.rejectWithdraw(body.get("withdrawRequestId"));
            logger.log(Level.INFO, "Withdrawal rejected for withdrawRequestId: {0}", body.get("withdrawRequestId"));
            response = new ApiResponse(true, "Withdraw rejected");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error rejecting withdrawal: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
