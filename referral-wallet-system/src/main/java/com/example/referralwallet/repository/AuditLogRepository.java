package com.example.referralwallet.repository;

import com.example.referralwallet.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {}
