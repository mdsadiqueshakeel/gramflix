package com.example.referralwallet.controller;

import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<OtpDtos.OtpSendResponse> send(@RequestBody OtpDtos.OtpSendRequest request) {
        return ResponseEntity.ok(otpService.sendOtp(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<OtpDtos.OtpVerifyResponse> verify(@RequestBody OtpDtos.OtpVerifyRequest request) {
        return ResponseEntity.ok(otpService.verifyOtp(request));
    }
}
