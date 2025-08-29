package com.example.referralwallet.service;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

class EmailServiceTest {

    @InjectMocks
    private EmailService emailService;

    @Mock
    private JavaMailSender javaMailSender;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendSimpleEmail() {
        String to = "projecttesting897@gmail.com";
        String subject = "Test Subject";
        String body = "Test Body";

        emailService.sendSimple(to, subject, body);

        verify(javaMailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}