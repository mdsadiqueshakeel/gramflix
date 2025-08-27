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
    private String to;       // recipient (phone or email)
    private String codeHash; // hashed OTP
    private Date expiresAt;
    private int attempts = 0;
}
