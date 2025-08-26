package com.example.referralwallet.util;

import org.springframework.http.ResponseEntity;
import java.util.Map;

public class ResponseUtil {
    public static ResponseEntity<?> ok(String message) {
        return ResponseEntity.ok(Map.of("message", message));
    }

    public static ResponseEntity<?> ok(Object data) {
        return ResponseEntity.ok(Map.of("data", data));
    }

    public static ResponseEntity<?> error(int status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
 