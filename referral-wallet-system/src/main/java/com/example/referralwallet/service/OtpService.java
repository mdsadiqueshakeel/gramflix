package com.example.referralwallet.service;

import com.example.referralwallet.dto.OtpDtos;
import com.example.referralwallet.model.Otp;
import com.example.referralwallet.repository.OtpRepository;
import com.example.referralwallet.util.TokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final TokenGenerator tokenGenerator;
    private final TwilioService twilioService;
    private final EmailService emailService;

    @Value("${otp.default-channel:whatsapp}")
    private String defaultChannel;

    @Value("${otp.dev-echo:false}")
    private boolean devEcho;

    // SHA-256
    private String hash(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(bytes.length * 2);
            for (byte b : bytes) sb.append(String.format("%02X", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public OtpDtos.OtpSendResponse sendOtp(OtpDtos.OtpSendRequest req) {
        String channel = (req.getChannel() == null || req.getChannel().isBlank())
                ? defaultChannel : req.getChannel().toLowerCase();

        // Validate to parameter for whatsapp
        if ("whatsapp".equals(channel) && !isValidPhoneNumber(req.getTo())) {
            throw new IllegalArgumentException("Invalid phone number for WhatsApp: " + req.getTo());
        }

        // 1) generate & store
        String code = tokenGenerator.numericOtp(6);
        Otp otp = otpRepository.findByTo(req.getTo()).orElse(new Otp());
        otp.setTo(req.getTo());
        otp.setCodeHash(hash(code));
        otp.setExpiresAt(Date.from(Instant.now().plus(5, ChronoUnit.MINUTES)));
        otp.setAttempts(0);
        otpRepository.save(otp);
        log.info("OTP saved for to: {}, codeHash: {}, Current time: {}, Expires at: {}", 
                 req.getTo(), otp.getCodeHash(), Instant.now(), otp.getExpiresAt());

        // 2) deliver
        String msg = "Your OTP is " + code + ". It expires in 5 minutes.";
        String to = "whatsapp:+91" + req.getTo(); // Ensure E.164 format
        log.info("Sending WhatsApp to: {}", to);
        switch (channel) {
            case "whatsapp":
                twilioService.sendWhatsApp(to, msg);
                break;
            case "email":
                emailService.sendSimple(String.valueOf(req.getTo()), "Your OTP Code", msg);
                break;
            default:
                log.warn("Unknown channel '{}', falling back to WhatsApp", channel);
                twilioService.sendWhatsApp(to, msg);
        }

        OtpDtos.OtpSendResponse resp = new OtpDtos.OtpSendResponse();
        resp.setMessage("OTP sent via " + channel);
        if (devEcho) resp.setDevEchoOtp(code);
        return resp;
    }

    public OtpDtos.OtpVerifyResponse verifyOtp(OtpDtos.OtpVerifyRequest req) {
        log.info("Verifying OTP for to: {}, code: {}", req.getTo(), req.getCode());
        Optional<Otp> o = otpRepository.findByTo(req.getTo());
        OtpDtos.OtpVerifyResponse resp = new OtpDtos.OtpVerifyResponse();
        if (o.isEmpty()) {
            log.warn("No OTP found for to: {}", req.getTo());
            resp.setVerified(false);
            resp.setMessage("No OTP found");
            return resp;
        }
        Otp otp = o.get();
        log.info("Found OTP: expiresAt: {}, codeHash: {}", otp.getExpiresAt(), otp.getCodeHash());
        if (otp.getExpiresAt().before(new Date())) {
            otpRepository.deleteByTo(req.getTo());
            log.warn("OTP expired for to: {}", req.getTo());
            resp.setVerified(false);
            resp.setMessage("OTP expired");
            return resp;
        }
        if (otp.getCodeHash().equals(hash(req.getCode()))) {
            otpRepository.deleteByTo(req.getTo());
            log.info("OTP verified for to: {}", req.getTo());
            resp.setVerified(true);
            resp.setMessage("OTP verified");
            return resp;
        } else {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            log.warn("Invalid OTP for to: {}, attempts: {}", req.getTo(), otp.getAttempts());
            resp.setVerified(false);
            resp.setMessage("Invalid OTP");
            return resp;
        }
    }

    private boolean isValidPhoneNumber(long number) {
        String numStr = String.valueOf(number);
        return numStr.length() == 10 && numStr.matches("\\d{10}"); // Validate 10-digit number
    }
}