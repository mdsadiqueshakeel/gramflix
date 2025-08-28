package com.example.referralwallet.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MSG91Service {

    @Value("${msg91.authKey}")
    private String authKey;

    @Value("${msg91.whatsappTemplateId}")
    private String whatsappTemplateId;

    @Value("${msg91.smsTemplateId}")
    private String smsTemplateId;

    private final WebClient webClient;

    public MSG91Service(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.msg91.com/api/v5/").build();
    }

    public void sendOtp(String mobileNumber, String otp, String channel) {
        String selectedTemplateId;
        if ("whatsapp".equals(channel)) {
            selectedTemplateId = whatsappTemplateId;
        } else if ("sms".equals(channel)) {
            selectedTemplateId = smsTemplateId;
        } else {
            // Fallback or error handling if channel is neither whatsapp nor sms
            selectedTemplateId = smsTemplateId; // Default to SMS template if channel is unknown
        }
        String url = "otp?template_id=" + selectedTemplateId + "&mobile=" + mobileNumber + "&authkey=" + authKey + "&VAR1=" + otp;

        webClient.post()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(response -> System.out.println("MSG91 OTP Response: " + response),
                           error -> System.err.println("Error sending OTP via MSG91: " + error.getMessage()));
    }
}