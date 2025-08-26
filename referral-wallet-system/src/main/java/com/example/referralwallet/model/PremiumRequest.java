package com.example.referralwallet.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
public class PremiumRequest {
    @Id
    private String id;
    private String userId;
    private String status = "PENDING"; // PENDING|APPROVED|REJECTED
    private Date createdAt = new Date();
    private Date updatedAt = new Date();
}
