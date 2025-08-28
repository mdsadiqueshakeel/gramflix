package com.example.referralwallet.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MSG91Service {

    @Value("${msg91.authKey}")
    private String authKey;

    @Value("${msg91.templateId}")
    private String templateId;

    private final WebClient webClient;

    public MSG91Service(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.msg91.com/api/v5/").build();
    }

    public void sendOtp(String mobileNumber, String otp) {
        String url = "otp?template_id=" + templateId + "&mobile=" + mobileNumber + "&authkey=" + authKey + "&VAR1=" + otp;

        webClient.post()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(response -> System.out.println("MSG91 OTP Response: " + response),
                           error -> System.err.println("Error sending OTP via MSG91: " + error.getMessage()));
    }
}