package com.example.referralwallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse {
    private Pagination pagination;
    private List<NewsArticleDto> data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pagination {
        private Integer limit;
        private Integer offset;
        private Integer count;
        private Integer total;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NewsArticleDto {
        private String author;
        private String title;
        private String description;
        private String url;
        private String source;
        private String image;
        private String category;
        private String language;
        private String country;
        private String published_at;
    }
}
