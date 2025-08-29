package com.example.referralwallet.repository;

import com.example.referralwallet.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    Optional<User> findByReferralId(String referralId);
    

    // Utility method to find by email OR mobile
    default Optional<User> findByEmailOrMobile(String email, String mobile) {
        Optional<User> byEmail = findByEmail(email);
        if (byEmail.isPresent()) return byEmail;
        return findByMobile(mobile);
    }
}
