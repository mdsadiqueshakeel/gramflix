package com.example.referralwallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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