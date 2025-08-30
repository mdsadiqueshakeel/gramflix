package com.example.referralwallet.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawRequestResponse {
    private String userId;
    private double amount;
    private String status;
    private Date createdAt;
    private Date updatedAt;
}