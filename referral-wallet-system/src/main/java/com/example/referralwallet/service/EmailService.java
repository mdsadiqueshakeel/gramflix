package com.example.referralwallet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendSimple(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("mlmproject1010@gmail.com");
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
        System.out.println("Email sent to " + to + " subject=" + subject);
    }
}
