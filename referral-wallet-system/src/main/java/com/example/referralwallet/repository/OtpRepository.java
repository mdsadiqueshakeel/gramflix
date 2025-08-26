package com.example.referralwallet.repository;

import com.example.referralwallet.model.Otp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OtpRepository extends MongoRepository<Otp, String> {
    Optional<Otp> findByTo(long to);
    void deleteByTo(long to);
}