package com.example.referralwallet.service;

import com.example.referralwallet.dto.AuthDtos;
import com.example.referralwallet.model.User;
import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import com.example.referralwallet.security.JwtProvider;
import com.example.referralwallet.util.TokenGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class AuthService {

    private static final Logger logger = Logger.getLogger(AuthService.class.getName());

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferralService referralService;
    private final JwtProvider jwtProvider;
    private final TokenGenerator tokenGenerator;

    private final ConcurrentHashMap<String, AuthDtos.RegisterRequest> tempUsers = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository,
                       WalletRepository walletRepository,
                       PasswordEncoder passwordEncoder,
                       ReferralService referralService,
                       JwtProvider jwtProvider,
                       TokenGenerator tokenGenerator) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.referralService = referralService;
        this.jwtProvider = jwtProvider;
        this.tokenGenerator = tokenGenerator;
    }

    public void tempRegister(AuthDtos.RegisterRequest request) {
        logger.log(Level.INFO, "Temp registering user with email: {0}", request.getEmail());
        Optional<User> existingUser = userRepository.findByEmailOrMobile(request.getEmail(), request.getMobile());
        if (existingUser.isPresent()) {
            logger.log(Level.WARNING, "User already exists with email: {0}", request.getEmail());
            throw new RuntimeException("User already exists");
        }
        tempUsers.put(request.getEmail(), request);
        logger.log(Level.INFO, "Temp user stored for email: {0}", request.getEmail());
    }

    public AuthDtos.RegisterResponse registerAfterOtp(String mobile, AuthDtos.RegisterRequest request) {
        logger.log(Level.INFO, "Registering user after OTP for mobile: {0}, email: {1}", new Object[]{mobile, request.getEmail()});
        AuthDtos.RegisterRequest storedRequest = tempUsers.get(request.getEmail());
        if (storedRequest == null) {
            logger.log(Level.WARNING, "No pending registration found for email: {0}", request.getEmail());
            throw new RuntimeException("No pending registration found for " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType("NORMAL");
        user.setStatus("ACTIVE");
        user.setPremiumRequestStatus("NONE");
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());

        String referralId = tokenGenerator.randomToken(8).toUpperCase();
        user.setReferralId(referralId);
        user.setReferralLink("http://localhost:3000/signup?referralId=" + referralId);

        if (request.getReferralId() != null && !request.getReferralId().isEmpty()) {
            Optional<User> parentUser = userRepository.findByReferralId(request.getReferralId());
            final User finalUser = user; // Declare user as effectively final
            parentUser.ifPresent(parent -> {
                finalUser.setReferredBy(parent.getId());
            });
        }

        user = userRepository.save(user);
        logger.log(Level.INFO, "User saved with ID: {0}", user.getId());

        Wallet wallet = new Wallet();
        wallet.setUserId(user.getId());
        wallet.setWalletBalance(0.0);
        wallet.setTodaysEarning(0.0);
        wallet.setThisWeekEarning(0.0);
        wallet.setTotalEarning(0.0);
        wallet.setTotalWithdrawal(0.0);
        wallet = walletRepository.save(wallet);
        logger.log(Level.INFO, "Wallet saved with ID: {0}", wallet.getId());

        user.setWalletId(wallet.getId());
        userRepository.save(user);
        logger.log(Level.INFO, "User updated with wallet ID: {0}", wallet.getId());

        if (request.getReferralId() != null && !request.getReferralId().isEmpty()) {
            final User finalUser = user;
            Optional<User> parentOpt = userRepository.findByReferralId(request.getReferralId());
            parentOpt.ifPresent(parent -> {
                parent.getChildren().add(finalUser.getId());
                userRepository.save(parent);
                logger.log(Level.INFO, "Parent updated with child ID: {0}", finalUser.getId());
            });
            referralService.creditReferralBonus(request.getReferralId(), user.getId());
            logger.log(Level.INFO, "Parent bonus credited for referral ID: {0}", request.getReferralId());
        }

        tempUsers.remove(request.getEmail());
        logger.log(Level.INFO, "Temp user removed for email: {0}", request.getEmail());

        AuthDtos.RegisterResponse response = new AuthDtos.RegisterResponse();
        response.setMessage("User registered successfully after OTP verification");
        response.setUserId(user.getId());
        logger.log(Level.INFO, "Registration response prepared with user ID: {0}", user.getId());
        return response;
    }

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        logger.log(Level.INFO, "Login attempt for email/mobile: {0}", request.getEmailOrMobile());
        User user = userRepository.findByEmailOrMobile(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> {
                    logger.log(Level.WARNING, "User not found for email/mobile: {0}", request.getEmailOrMobile());
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.log(Level.WARNING, "Invalid password for user ID: {0}", user.getId());
            throw new RuntimeException("Invalid password");
        }

        AuthDtos.LoginResponse response = new AuthDtos.LoginResponse();
        response.setUserId(user.getId());
        response.setToken(jwtProvider.generateToken(user.getId()));
        logger.log(Level.INFO, "Login successful, token generated for user ID: {0}", user.getId());
        return response;
    }
}
