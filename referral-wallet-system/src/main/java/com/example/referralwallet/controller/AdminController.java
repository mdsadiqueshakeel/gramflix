package com.example.referralwallet.controller;


import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/premium/approve/{userId}")
    public ResponseEntity<ApiResponse> approvePremium(@PathVariable String userId){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Approving premium for userId: {0}", userId);
            adminService.approvePremium(userId);
            logger.log(Level.INFO, "Premium approved for userId: {0}", userId);
            response = new ApiResponse(true, "Premium approved");
            return ResponseEntity.ok(response);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            logger.log(Level.WARNING, "Error approving premium (Mail Authentication Failed): {0}", e.getMessage());
            response = new ApiResponse(false, "Email sending failed due to authentication issues. Please check email configuration.");
            return ResponseEntity.status(500).body(response); // Internal Server Error for email issues
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error approving premium: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/premium/reject/{userId}")
    public ResponseEntity<ApiResponse> rejectPremium(@PathVariable String userId){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Rejecting premium for userId: {0}", userId);
            adminService.rejectPremium(userId);
            logger.log(Level.INFO, "Premium rejected for userId: {0}", userId);
            response = new ApiResponse(true, "Premium rejected");
            return ResponseEntity.ok(response);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            logger.log(Level.WARNING, "Error rejecting premium (Mail Authentication Failed): {0}", e.getMessage());
            response = new ApiResponse(false, "Email sending failed due to authentication issues. Please check email configuration.");
            return ResponseEntity.status(500).body(response); // Internal Server Error for email issues
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error rejecting premium: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/withdraw/approve/{withdrawRequestId}")
    public ResponseEntity<ApiResponse> approveWithdraw(@PathVariable String withdrawRequestId){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Approving withdrawal for withdrawRequestId: {0}", withdrawRequestId);
            adminService.approveWithdraw(withdrawRequestId);
            logger.log(Level.INFO, "Withdrawal approved for withdrawRequestId: {0}", withdrawRequestId);
            response = new ApiResponse(true, "Withdraw approved");
            return ResponseEntity.ok(response);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            logger.log(Level.WARNING, "Error approving withdrawal (Mail Authentication Failed): {0}", e.getMessage());
            response = new ApiResponse(false, "Email sending failed due to authentication issues. Please check email configuration.");
            return ResponseEntity.status(500).body(response); // Internal Server Error for email issues
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error approving withdrawal: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/withdraw/reject/{withdrawRequestId}")
    public ResponseEntity<ApiResponse> rejectWithdraw(@PathVariable String withdrawRequestId){
        ApiResponse response;
        try {
            logger.log(Level.INFO, "Rejecting withdrawal for withdrawRequestId: {0}", withdrawRequestId);
            adminService.rejectWithdraw(withdrawRequestId);
            logger.log(Level.INFO, "Withdrawal rejected for withdrawRequestId: {0}", withdrawRequestId);
            response = new ApiResponse(true, "Withdraw rejected");
            return ResponseEntity.ok(response);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            logger.log(Level.WARNING, "Error rejecting withdrawal (Mail Authentication Failed): {0}", e.getMessage());
            response = new ApiResponse(false, "Email sending failed due to authentication issues. Please check email configuration.");
            return ResponseEntity.status(500).body(response); // Internal Server Error for email issues
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error rejecting withdrawal: {0}", e.getMessage());
            response = new ApiResponse(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
