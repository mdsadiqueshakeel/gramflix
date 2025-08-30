package com.example.referralwallet.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000) // Maximum number of entries
                .expireAfterWrite(30, TimeUnit.MINUTES) // Cache expires after 30 minutes
                .expireAfterAccess(15, TimeUnit.MINUTES) // Cache expires after 15 minutes of no access
                .recordStats()); // Enable statistics

        return cacheManager;
    }
}
