package com.example.referralwallet.controller;

import com.example.referralwallet.dto.NewsPageResponse;
import com.example.referralwallet.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@Slf4j
public class NewsController {

    private final NewsService newsService;

    /**
     * Get paginated news articles - PUBLIC ENDPOINT
     */
    @GetMapping
    public ResponseEntity<NewsPageResponse> getNews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String category) {
        log.info("Fetching news: page={}, limit={}, category={}", page, limit, category);
        try {
            NewsPageResponse response = newsService.getNewsArticles(
                    page, limit,
                    (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) ? category : null,
                    null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching news", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
