package com.example.referralwallet.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    // Send HTML email
    public void sendHtml(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // <-- true enables HTML rendering

            mailSender.send(message);
            System.out.println("📧 HTML Email sent to " + to + " subject=" + subject);
        } catch (MessagingException e) {
            throw new RuntimeException("❌ Failed to send email", e);
        }
    }
}
