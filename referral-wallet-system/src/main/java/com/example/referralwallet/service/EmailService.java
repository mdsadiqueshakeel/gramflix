package com.example.referralwallet.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendSimple(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("projecttesting897@gmail.com");
        msg.setSubject(subject);
        msg.setText(body);
        try {
            mailSender.send(msg);
            System.out.println("Email sent to " + to + " subject=" + subject);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            System.err.println("ERROR: Mail Authentication Failed for " + to + ": " + e.getMessage());
            // Optionally re-throw a custom exception or handle it based on business logic
        } catch (Exception e) {
            System.err.println("ERROR: Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
