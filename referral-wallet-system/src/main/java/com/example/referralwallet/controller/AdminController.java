package com.example.referralwallet.controller;

import com.example.referralwallet.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/premium/approve")
    public ResponseEntity<?> approvePremium(@RequestBody Map<String,String> body){
        adminService.approvePremium(body.get("userId"));
        return ResponseEntity.ok(Map.of("message","Premium approved"));
    }

    @PostMapping("/premium/reject")
    public ResponseEntity<?> rejectPremium(@RequestBody Map<String,String> body){
        adminService.rejectPremium(body.get("userId"));
        return ResponseEntity.ok(Map.of("message","Premium rejected"));
    }

    @PostMapping("/withdraw/approve")
    public ResponseEntity<?> approveWithdraw(@RequestBody Map<String,String> body){
        adminService.approveWithdraw(body.get("withdrawRequestId"));
        return ResponseEntity.ok(Map.of("message","Withdraw approved"));
    }

    @PostMapping("/withdraw/reject")
    public ResponseEntity<?> rejectWithdraw(@RequestBody Map<String,String> body){
        adminService.rejectWithdraw(body.get("withdrawRequestId"));
        return ResponseEntity.ok(Map.of("message","Withdraw rejected"));
    }
}
