package com.example.referralwallet.repository;

import com.example.referralwallet.model.WithdrawRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import org.springframework.data.domain.Sort;

public interface WithdrawRequestRepository extends MongoRepository<WithdrawRequest, String> {
    List<WithdrawRequest> findByStatus(String status);
    List<WithdrawRequest> findByUserId(String userId);
    List<WithdrawRequest> findByUserIdAndAmount(String userId, double amount, Sort sort);
}
