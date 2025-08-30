package com.example.referralwallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReferralWalletApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReferralWalletApplication.class, args);
    }
}
