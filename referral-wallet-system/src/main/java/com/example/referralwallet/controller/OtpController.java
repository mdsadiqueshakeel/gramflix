package com.example.referralwallet.controller;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.referralwallet.dto.ApiResponse;
import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.service.OtpService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse> send(@RequestBody OtpDtos.OtpSendRequest request) {
        Logger logger = Logger.getLogger(OtpController.class.getName());
        try {
            OtpDtos.OtpSendResponse response = otpService.sendOtp(request);
            return ResponseEntity.ok(new ApiResponse(true, "OTP sent successfully", response.getDevEchoOtp()));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error sending OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to send OTP", null));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verify(@RequestBody OtpDtos.OtpVerifyRequest request) {
        Logger logger = Logger.getLogger(OtpController.class.getName());
        try {
            OtpDtos.OtpVerifyResponse response = otpService.verifyOtp(request);
            return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully", response));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error verifying OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to verify OTP", null));
        }
    }
}
