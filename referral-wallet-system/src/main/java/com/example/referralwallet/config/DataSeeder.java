// //package com.example.referralwallet.config;

// // package com.example.referralwallet.config;
// // import com.example.referralwallet.model.User;
// // import com.example.referralwallet.repository.UserRepository;
// // import org.springframework.boot.CommandLineRunner;
// // import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// // import org.springframework.stereotype.Component;
// // import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;

// // @Component
// // public class DataSeeder implements CommandLineRunner {

//     // @Value("${app.frontend.url}")
//     // private String frontendUrl;

// //     @Autowired
// //     private UserRepository userRepository;

// //     private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

// //     @Override
// //     public void run(String... args) {
// //         if (userRepository.count() == 0) {
// //             User admin = new User();
// //             admin.setName("Root user");
// //             admin.setEmail("test@ac.in");
// //             admin.setMobile("1234567890");
// //             admin.setPassword(passwordEncoder.encode("test123")); // Hash the password
// //             admin.setReferralId("ROOT123");
// //             admin.setReferralLink(frontendUrl + "/signup?refferalId=ROOT123");
// //             admin.setUserType("ADMIN");
// //             admin.setStatus("ACTIVE");
// //             userRepository.save(admin);

// //             System.out.println("Root admin user seeded successfully.");
// //         }
// //     }
// // }
