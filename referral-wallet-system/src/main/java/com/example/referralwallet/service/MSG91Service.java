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

    public void sendOtp(String mobileNumber, String otp, String channel, String customOtp) {
        String selectedTemplateId;
        if ("whatsapp".equals(channel)) {
            selectedTemplateId = whatsappTemplateId;
        } else if ("sms".equals(channel)) {
            selectedTemplateId = smsTemplateId;
        } else {
            // Fallback or error handling if channel is neither whatsapp nor sms
            selectedTemplateId = smsTemplateId; // Default to SMS template if channel is unknown
        }
        
        // Format the mobile number correctly (ensure it has country code)
        if (!mobileNumber.startsWith("+")) {
            // Add India country code if not present
            if (!mobileNumber.startsWith("91")) {
                mobileNumber = "91" + mobileNumber;
            }
        } else {
            // Remove the + if present and ensure it has country code
            mobileNumber = mobileNumber.substring(1);
            if (!mobileNumber.startsWith("91")) {
                mobileNumber = "91" + mobileNumber;
            }
        }
        
        // Construct the URL with all required parameters
        // MSG91 API requires specific parameter order and format
        // The OTP placeholder in the template should be ##OTP## according to MSG91 docs
        String url = "otp?authkey=" + authKey + 
                     "&mobile=" + mobileNumber + 
                     "&otp=" + (customOtp != null && !customOtp.isEmpty() ? customOtp : otp) + 
                     "&template_id=" + selectedTemplateId + 
                     "&invisible=1" + 
                     "&otp_length=6";

        System.out.println("Sending OTP to: " + mobileNumber + " with template ID: " + selectedTemplateId);
        
        webClient.post()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(response -> System.out.println("MSG91 OTP Response: " + response),
                           error -> System.err.println("Error sending OTP via MSG91: " + error.getMessage()));
    }
}
