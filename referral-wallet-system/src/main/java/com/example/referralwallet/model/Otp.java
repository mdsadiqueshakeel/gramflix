package com.example.referralwallet.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "otps")
public class Otp {
    @Id
    private String id;
    private long to; // 10-digit phone number (e.g., 9156549575)
    private String codeHash;
    private Date expiresAt;
    private int attempts = 0;
    private Date createdAt = new Date();
}