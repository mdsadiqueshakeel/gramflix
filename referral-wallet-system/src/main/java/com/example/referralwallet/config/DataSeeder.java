//package com.example.referralwallet.config;

package com.example.referralwallet.config;

import com.example.referralwallet.model.User;
import com.example.referralwallet.model.Wallet;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WalletRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@Component
public class DataSeeder implements CommandLineRunner {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Suman");
            admin.setEmail("qurksuman@gmail.com");
            admin.setMobile("7859086070");
            admin.setPassword(passwordEncoder.encode("Admin@Suman")); // Hash the password
            admin.setReferralId("GRAM8609");
            admin.setReferralLink(frontendUrl + "/signup?referralId=GRAM8609");
            admin.setUserType("NORMAL");
            admin.setStatus("ACTIVE");
            admin = userRepository.save(admin);
            admin.getCreatedAt();
            Wallet adminWallet = new Wallet();
            adminWallet.setUserId(admin.getId());
            adminWallet.setWalletBalance(0.0);
            adminWallet.setTodaysEarning(0.0);
            adminWallet.setThisWeekEarning(0.0);
            adminWallet.setTotalEarning(0.0);
            adminWallet.setTotalWithdrawal(0.0);
            walletRepository.save(adminWallet);

            System.out.println("Root admin user and wallet seeded successfully.");
        }
    }
}