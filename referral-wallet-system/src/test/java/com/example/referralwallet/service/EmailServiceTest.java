package com.example.referralwallet.service;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.example.referralwallet.service.EmailService;

import static org.mockito.Mockito.*;

class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    private MimeMessage realMimeMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // ✅ Create a real MimeMessage using a real sender
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        realMimeMessage = sender.createMimeMessage();

        // ✅ Stub the mock to return the real object
        when(javaMailSender.createMimeMessage()).thenReturn(realMimeMessage);
    }

    @Test
    void testSendSimpleEmail() {
        // Act
        emailService.sendHtml("test@example.com", "Test Subject", "<b>Hello</b> World!");

        // ✅ Verify that send() was called ONCE with the real message
        verify(javaMailSender, times(1)).send(realMimeMessage);

        // ❌ REMOVE verifyNoMoreInteractions()
        // Because EmailService ALSO calls createMimeMessage(), which is valid
    }
}


