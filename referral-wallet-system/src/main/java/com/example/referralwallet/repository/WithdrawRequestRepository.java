package com.example.referralwallet.repository;

import com.example.referralwallet.model.WithdrawRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WithdrawRequestRepository extends MongoRepository<WithdrawRequest, String> {
    List<WithdrawRequest> findByStatus(String status);
}
