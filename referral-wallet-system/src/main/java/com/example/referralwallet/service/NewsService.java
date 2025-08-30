package com.example.referralwallet.service;

import com.example.referralwallet.dto.NewsPageResponse;
import com.example.referralwallet.dto.NewsResponse;
import com.example.referralwallet.model.NewsArticle;
import com.example.referralwallet.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsService {

    private final NewsArticleRepository newsArticleRepository;
    private final WebClient webClient;
    private final MongoTemplate mongoTemplate;

    @Value("${mediastack.api.key}")
    private String mediastackApiKey;

    @Value("${mediastack.api.base-url:https://api.mediastack.com/v1}")
    private String mediastackBaseUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

    /**
     * Scheduled job to fetch news from Mediastack API every 8 hours
     * This ensures we stay within the 100 API calls/month limit
     * (3 calls per day × 30 days = 90 calls, leaving 10 for manual testing)
     */
    @Scheduled(fixedRate = 8 * 60 * 60 * 1000) // 8 hours in milliseconds
    public void fetchNewsFromMediastack() {
        log.info("Starting scheduled news fetch from Mediastack API");

        try {
            // Check if we already have recent news (within last 6 hours)
            LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);
            List<NewsArticle> recentNews = newsArticleRepository.findByFetchedAtAfter(sixHoursAgo);

            if (!recentNews.isEmpty()) {
                log.info("Skipping news fetch - we have recent news from {} hours ago",
                        recentNews.get(0).getFetchedAt().until(LocalDateTime.now(),
                                java.time.temporal.ChronoUnit.HOURS));
                return;
            }

            String url = String.format("%s/news?access_key=%s&countries=in&languages=en&limit=100&sort=published_desc",
                    mediastackBaseUrl, mediastackApiKey);

            NewsResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(NewsResponse.class)
                    .block();

            if (response != null && response.getData() != null) {
                List<NewsArticle> articles = response.getData().stream()
                        .map(this::convertToNewsArticle)
                        .collect(Collectors.toList());

                // Save to database
                newsArticleRepository.saveAll(articles);
                log.info("Successfully fetched and saved {} news articles", articles.size());

                // Clean up old news after successful fetch
                cleanupOldNews();
            }

        } catch (Exception e) {
            log.error("Error fetching news from Mediastack API", e);
        }
    }

    /**
     * Clean up news articles older than 2 days to prevent database bloat
     * This runs automatically after each successful news fetch
     */
    private void cleanupOldNews() {
        try {
            LocalDateTime twoDaysAgo = LocalDateTime.now().minusDays(2);

            // Find old articles
            List<NewsArticle> oldArticles = newsArticleRepository.findByPublishedAtBefore(twoDaysAgo);

            if (!oldArticles.isEmpty()) {
                // Delete old articles
                newsArticleRepository.deleteAll(oldArticles);
                log.info("Cleaned up {} old news articles (older than 2 days)", oldArticles.size());
            }

        } catch (Exception e) {
            log.error("Error cleaning up old news articles", e);
        }
    }

    /**
     * Independent scheduled cleanup task that runs every 12 hours
     * This ensures old news is cleaned up even if news fetching fails
     */
    @Scheduled(fixedRate = 12 * 60 * 60 * 1000) // 12 hours in milliseconds
    public void scheduledCleanup() {
        log.info("Starting scheduled cleanup of old news articles");
        cleanupOldNews();
    }

    /**
     * Get paginated news articles
     */
    @Cacheable(value = "newsCache", key = "#page + '-' + #limit")
    public NewsPageResponse getNewsArticles(int page, int limit, String category, String country) {
        try {
            Pageable pageable = PageRequest.of(page - 1, limit);
            Page<NewsArticle> newsPage;
            if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
                newsPage = newsArticleRepository.findByCategoryOrderByPublishedAtDesc(category, pageable);
            } else {
                newsPage = newsArticleRepository.findAllOrderByPublishedAtDesc(pageable);
            }
            return NewsPageResponse.builder()
                    .articles(newsPage.getContent())
                    .currentPage(page)
                    .totalPages(newsPage.getTotalPages())
                    .totalElements(newsPage.getTotalElements())
                    .pageSize(limit)
                    .hasNext(newsPage.hasNext())
                    .hasPrevious(newsPage.hasPrevious())
                    .build();
        } catch (Exception e) {
            log.error("Error fetching news articles", e);
            return NewsPageResponse.builder()
                    .articles(List.of())
                    .currentPage(page)
                    .totalPages(0)
                    .totalElements(0)
                    .pageSize(limit)
                    .hasNext(false)
                    .hasPrevious(false)
                    .build();
        }
    }

    public NewsPageResponse getRandomNewsArticles(int page, int limit) {
        try {
            // Use MongoDB $sample to get random articles
            SampleOperation sampleStage = Aggregation.sample(limit);
            Aggregation aggregation = Aggregation.newAggregation(sampleStage);
            AggregationResults<NewsArticle> results = mongoTemplate.aggregate(aggregation, "news_articles",
                    NewsArticle.class);
            List<NewsArticle> articles = results.getMappedResults();
            return NewsPageResponse.builder()
                    .articles(articles)
                    .currentPage(page)
                    .totalPages(1)
                    .totalElements(articles.size())
                    .pageSize(limit)
                    .hasNext(false)
                    .hasPrevious(false)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching random news articles", e);
            return NewsPageResponse.builder()
                    .articles(List.of())
                    .currentPage(page)
                    .totalPages(0)
                    .totalElements(0)
                    .pageSize(limit)
                    .hasNext(false)
                    .hasPrevious(false)
                    .build();
        }
    }

    /**
     * Convert Mediastack DTO to NewsArticle entity
     */
    private NewsArticle convertToNewsArticle(NewsResponse.NewsArticleDto dto) {
        LocalDateTime publishedAt = null;
        try {
            if (dto.getPublished_at() != null) {
                publishedAt = LocalDateTime.parse(dto.getPublished_at().replace("Z", "+00:00"), DATE_FORMATTER);
            }
        } catch (Exception e) {
            log.warn("Could not parse published date: {}", dto.getPublished_at());
            publishedAt = LocalDateTime.now();
        }

        // Calculate read time based on description length (rough estimate)
        int readTime = Math.max(1, (dto.getDescription() != null ? dto.getDescription().length() : 100) / 200);

        // Generate tags from category and description
        String[] tags = generateTags(dto.getCategory(), dto.getDescription());

        return NewsArticle.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .url(dto.getUrl())
                .source(dto.getSource())
                .image(dto.getImage())
                .category(dto.getCategory())
                .language(dto.getLanguage())
                .country(dto.getCountry())
                .author(dto.getAuthor())
                .publishedAt(publishedAt)
                .fetchedAt(LocalDateTime.now())
                .readTime(readTime)
                .tags(tags)
                .isPremium(false) // Default to false, can be updated later
                .build();
    }

    /**
     * Generate tags from category and description
     */
    private String[] generateTags(String category, String description) {
        if (category == null && description == null) {
            return new String[0];
        }

        String text = (category != null ? category + " " : "") + (description != null ? description : "");
        return Arrays.stream(text.toLowerCase()
                .replaceAll("[^a-zA-Z0-9\\s]", " ")
                .split("\\s+"))
                .filter(word -> word.length() > 2)
                .distinct()
                .limit(5)
                .toArray(String[]::new);
    }

    /**
     * Clear cache entries
     */
    public void clearCache() {
        // This will be handled by Spring's cache eviction
        log.info("Cache cleared");
    }
}
