package com.example.referralwallet.repository;

import com.example.referralwallet.model.NewsArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsArticleRepository extends MongoRepository<NewsArticle, String> {

    @Query("{'publishedAt': {$gte: ?0}}")
    Page<NewsArticle> findByPublishedAtAfterOrderByPublishedAtDesc(LocalDateTime date, Pageable pageable);

    @Query("{'category': ?0}")
    Page<NewsArticle> findByCategoryOrderByPublishedAtDesc(String category, Pageable pageable);

    @Query("{'country': ?0}")
    Page<NewsArticle> findByCountryOrderByPublishedAtDesc(String country, Pageable pageable);

    @Query("{'language': ?0}")
    Page<NewsArticle> findByLanguageOrderByPublishedAtDesc(String language, Pageable pageable);

    @Query("{'isPremium': ?0}")
    Page<NewsArticle> findByIsPremiumOrderByPublishedAtDesc(Boolean isPremium, Pageable pageable);

    @Query("{'fetchedAt': {$gte: ?0}}")
    List<NewsArticle> findByFetchedAtAfter(LocalDateTime date);

    @Query("{'publishedAt': {$lt: ?0}}")
    List<NewsArticle> findByPublishedAtBefore(LocalDateTime date);

    @Query(value = "{}", sort = "{'publishedAt': -1}")
    Page<NewsArticle> findAllOrderByPublishedAtDesc(Pageable pageable);
}
