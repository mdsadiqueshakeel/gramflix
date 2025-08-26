package com.example.referralwallet.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TwilioService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.whatsapp-from-number}")
    private String whatsappFromNumber;

    public void sendWhatsApp(String to, String message) {
        Twilio.init(accountSid, authToken);
        log.info("Sending WhatsApp to: {}", to);
        Message messageObj = Message.creator(
            new PhoneNumber(to),
            new PhoneNumber(whatsappFromNumber),
            message
        ).create();
        log.info("Twilio response: status={}, sid={}", messageObj.getStatus(), messageObj.getSid());
    }
}