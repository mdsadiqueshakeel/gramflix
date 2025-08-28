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
    private final MSG91Service msg91Service;
    private final EmailService emailService;

    @Value("${otp.default-channel:whatsapp}")
    private String defaultChannel;

    @Value("${otp.dev-echo:false}")
    private boolean devEcho;

    // Hash the OTP using SHA-256
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

    // Send OTP via WhatsApp or Email
    public OtpDtos.OtpSendResponse sendOtp(OtpDtos.OtpSendRequest req) {
        String to = req.getTo();
        String channel = (req.getChannel() == null || req.getChannel().isBlank())
                ? defaultChannel : req.getChannel().toLowerCase();


        // No need for phone number validation here, MSG91 handles it internally
        // if (("whatsapp".equals(channel) || "sms".equals(channel))) {
        //     if (!to.startsWith("+")) {
        //         to = "+" + to;
        //     }
        //     if (!isValidPhoneNumber(to)) {
        //         throw new IllegalArgumentException("Invalid phone number for " + channel + ": " + req.getTo());
        //     }
        // }

        String code = tokenGenerator.numericOtp(6);
        Optional<Otp> existingOtp = otpRepository.findByTo(Long.parseLong(req.getTo()));
        Otp otp = existingOtp.orElse(new Otp());
        otp.setTo(req.getTo());
        otp.setCodeHash(hash(code));
        otp.setExpiresAt(Date.from(Instant.now().plus(5, ChronoUnit.MINUTES)));
        otp.setAttempts(0);
        otpRepository.save(otp);

        log.info("OTP saved for: {}, codeHash: {}, Expires at: {}", req.getTo(), otp.getCodeHash(), otp.getExpiresAt());

        String msg = "Your OTP is " + code + ". It expires in 5 minutes.";

        switch (channel) {
            case "whatsapp":
            case "sms":
                msg91Service.sendOtp(to, code, channel);
                break;
            case "email":
                emailService.sendSimple(req.getTo(), "Your OTP Code", msg);
                break;
            default:
                log.warn("Unknown channel '{}', falling back to SMS", channel);
                msg91Service.sendOtp(to, code, channel);
        }

        OtpDtos.OtpSendResponse resp = new OtpDtos.OtpSendResponse();
        resp.setMessage("OTP sent via " + channel);
        if (devEcho) resp.setDevEchoOtp(code);

        return resp;
    }

    // Verify OTP
    public OtpDtos.OtpVerifyResponse verifyOtp(OtpDtos.OtpVerifyRequest req) {
        log.info("Verifying OTP for: {}, code: {}", req.getTo(), req.getCode());
        Optional<Otp> o = otpRepository.findByTo(Long.parseLong(req.getTo()));
        OtpDtos.OtpVerifyResponse resp = new OtpDtos.OtpVerifyResponse();

        if (o.isEmpty()) {
            resp.setVerified(false);
            resp.setMessage("No OTP found");
            return resp;
        }

        Otp otp = o.get();
        if (otp.getExpiresAt().before(new Date())) {
            otpRepository.deleteByTo(Long.parseLong(req.getTo()));
            resp.setVerified(false);
            resp.setMessage("OTP expired");
            return resp;
        }

        if (otp.getCodeHash().equals(hash(req.getCode()))) {
            otpRepository.deleteByTo(Long.parseLong(req.getTo()));
            resp.setVerified(true);
            resp.setMessage("OTP verified");
            return resp;
        } else {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            resp.setVerified(false);
            resp.setMessage("Invalid OTP");
            return resp;
        }
    }


}
