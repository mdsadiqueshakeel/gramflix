package com.example.referralwallet.repository;

import com.example.referralwallet.model.PremiumRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PremiumRequestRepository extends MongoRepository<PremiumRequest, String> {
    List<PremiumRequest> findByStatus(String status);
}
