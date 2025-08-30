package com.example.referralwallet.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "news_articles")
public class NewsArticle {

    @Id
    private String id;

    private String title;
    private String description;
    private String url;
    private String source;
    private String image;
    private String category;
    private String language;
    private String country;
    private String author;
    private LocalDateTime publishedAt;
    private LocalDateTime fetchedAt;

    // Additional fields for better categorization
    private String[] tags;
    private String content;
    private Integer readTime; // in minutes
    private Boolean isPremium; // for premium content
}
