package com.example.referralwallet.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class TwilioService {

    private static final Logger logger = Logger.getLogger(TwilioService.class.getName());

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.whatsapp-from-number}")
    private String whatsappFromNumber;

    public void sendWhatsApp(String to, String message) {
        Twilio.init(accountSid, authToken);
        logger.log(Level.INFO, "Sending WhatsApp to: {0}", to);

        Message messageObj = Message.creator(
            new PhoneNumber(to),
            new PhoneNumber(whatsappFromNumber),
            message
        ).create();

        logger.log(Level.INFO, "Twilio response: status={0}, sid={1}", 
                new Object[]{messageObj.getStatus(), messageObj.getSid()});
    }
}
