package com.example.referralwallet.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import java.util.Date;
import java.util.Map;

@Data
public class AuditLog {
    @Id
    private String id;
    private String action;
    private String userId;
    private Date timestamp = new Date();
    private Map<String,Object> meta;
}
