# News Feed Feature Implementation

This document describes the implementation of a news feed feature that fetches news from Mediastack API and displays it in an Instagram/Facebook-style infinite feed.

## Architecture Overview

### Backend (Spring Boot)
- **Scheduled Job**: Fetches news from Mediastack API every 8 hours
- **Caching**: Uses Spring Caffeine Cache for in-memory caching
- **Database**: MongoDB for persistent storage
- **API Endpoints**: RESTful endpoints for news retrieval

### Frontend (Next.js)
- **NewsFeed Component**: Infinite scroll news feed with loading states
- **Auto-refresh**: Refreshes news every 5 minutes
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Backend Setup

### 1. Dependencies Added
The following dependencies have been added to `pom.xml`:
- `spring-boot-starter-cache` - For caching support
- `caffeine` - In-memory cache implementation
- `spring-boot-starter-webflux` - For WebClient HTTP requests

### 2. New Classes Created

#### Models
- `NewsArticle.java` - MongoDB document model for news articles

#### DTOs
- `NewsResponse.java` - Response structure from Mediastack API
- `NewsPageResponse.java` - Paginated response for frontend

#### Repository
- `NewsArticleRepository.java` - MongoDB repository with custom queries

#### Service
- `NewsService.java` - Business logic for news fetching and caching

#### Controller
- `NewsController.java` - REST API endpoints

#### Configuration
- `CacheConfig.java` - Caffeine cache configuration
- `WebClientConfig.java` - WebClient configuration

### 3. Configuration Updates

#### application.properties
```properties
# Mediastack API Configuration
mediastack.api.key=b7f231b520c3be77a65d7e8bf864a1e4
mediastack.api.base-url=https://api.mediastack.com/v1

# Cache Configuration
spring.cache.type=caffeine
spring.cache.cache-names=newsCache,newsCategoryCache,latestNewsCache
```

#### Main Application Class
- Added `@EnableScheduling` annotation for scheduled jobs

## Frontend Setup

### 1. New Components Created

#### NewsFeed.js
- Infinite scroll implementation using Intersection Observer
- Loading skeletons and error handling
- Auto-refresh every 5 minutes
- Responsive design with Tailwind CSS

#### API Route
- `src/app/api/news/route.js` - Proxies requests to Spring Boot backend

### 2. Integration
- Updated `HomePage.js` to use `NewsFeed` component
- Replaced mock articles with real news feed

## API Endpoints

### Backend Endpoints (Spring Boot)

#### GET /api/news
- **Parameters**: `page`, `limit`, `category`, `country`
- **Response**: Paginated news articles with metadata
- **Example**: `GET /api/news?page=1&limit=10&category=technology`

#### GET /api/news/category/{category}
- **Response**: News articles filtered by category

#### GET /api/news/latest
- **Response**: Latest 10 news articles

#### POST /api/news/fetch
- **Purpose**: Manually trigger news fetch (for testing)

#### POST /api/news/cache/clear
- **Purpose**: Clear all news caches

#### GET /api/news/health
- **Purpose**: Health check endpoint

#### GET /api/news/stats
- **Purpose**: Get API usage statistics and database info
- **Response**: Total articles, last fetch time, estimated API calls, remaining quota

### Frontend Endpoints (Next.js)

#### GET /api/news
- **Purpose**: Proxy to Spring Boot backend
- **Fallback**: Returns mock data if backend is unavailable

## Features

### 1. Scheduled News Fetching
- Runs every 8 hours automatically (3 times per day)
- **Smart fetching**: Skips fetch if recent news exists (within 6 hours)
- Fetches 100 latest news articles from Mediastack
- Stores in MongoDB for persistence
- **API optimization**: Ensures we stay within 100 calls/month limit

### 2. Caching Strategy
- **newsCache**: Caches paginated news responses
- **newsCategoryCache**: Caches category-specific news
- **latestNewsCache**: Caches latest news
- Cache expires after 30 minutes (write) / 15 minutes (access)

### 3. Infinite Scroll
- Automatically loads more news when user scrolls to bottom
- Smooth loading experience with loading indicators
- Prevents duplicate requests

### 4. Auto-refresh
- Refreshes news every 5 minutes
- Shows last refresh time
- Manual refresh button available

### 5. Error Handling
- Graceful fallback when backend is unavailable
- User-friendly error messages
- Retry mechanisms

### 6. Database Storage Management
- **Automatic cleanup**: Removes news older than 2 days
- **Dual cleanup strategy**: After each fetch + independent 12-hour schedule
- **Storage optimization**: Prevents database bloat
- **Configurable retention**: Easy to adjust cleanup period

## Usage

### Starting the Backend
1. Ensure MongoDB is running
2. Start the Spring Boot application
3. The scheduled job will automatically start fetching news

### Starting the Frontend
1. Start the Next.js development server
2. Navigate to the home page
3. News feed will automatically load

### Testing
1. **Manual News Fetch**: `POST /api/news/fetch`
2. **Cache Management**: `POST /api/news/cache/clear`
3. **Health Check**: `GET /api/news/health`

## Configuration Options

### Cache Settings
- **Maximum Size**: 1000 entries
- **Write Expiry**: 30 minutes
- **Access Expiry**: 15 minutes

### News Fetching
- **Schedule**: Every 8 hours (3 times per day)
- **Smart Fetching**: Skips if recent news exists (within 6 hours)
- **API Limit**: 100 articles per fetch
- **Monthly API Usage**: ~90 calls (leaving 10 for manual testing)
- **Countries**: India (configurable)
- **Languages**: English (configurable)

### Frontend Settings
- **Auto-refresh**: Every 5 minutes
- **Page Size**: 10 articles per page
- **Infinite Scroll**: Enabled

### Database Management
- **Cleanup Schedule**: Every 12 hours + after each fetch
- **Retention Period**: 2 days (configurable)
- **Storage Optimization**: Automatic removal of old articles

## Extensibility

### Adding New Categories
1. Update category filter in `NewsFeed.js`
2. Add category-specific styling
3. Backend automatically handles new categories

### Adding New Countries
1. Update `application.properties` with new country codes
2. Backend will fetch news for new countries

### Adding Premium Content
1. Set `isPremium` flag in `NewsArticle`
2. Frontend can filter and display premium content differently

### Performance Optimization
1. Implement Redis for distributed caching
2. Add CDN for image optimization
3. Implement news search functionality

## Monitoring and Logging

### Logs
- News fetch operations are logged
- Cache operations are logged
- Error scenarios are logged with stack traces
- Cleanup operations are logged with counts

### API Usage Monitoring
- **Real-time stats**: `/api/news/stats` endpoint
- **Monthly quota tracking**: Automatic calculation of remaining API calls
- **Database monitoring**: Article counts and cleanup statistics
- **Smart fetch logging**: Shows when fetches are skipped due to recent data

### Metrics
- Cache hit/miss statistics
- API response times
- News fetch success/failure rates

## Security Considerations

### API Rate Limiting
- Mediastack API has 100 requests/month limit
- Backend respects this limit with scheduled fetching
- No direct API calls from frontend

### CORS Configuration
- Backend allows all origins (`@CrossOrigin(origins = "*")`)
- Frontend proxies requests to avoid CORS issues

### Data Validation
- Input parameters are validated
- API responses are sanitized
- Error handling prevents data leakage

## Troubleshooting

### Common Issues

#### Backend Not Starting
- Check MongoDB connection
- Verify Mediastack API key
- Check application logs

#### News Not Loading
- Verify backend is running on port 8080
- Check network connectivity
- Review browser console for errors

#### Cache Issues
- Clear cache using `/api/news/cache/clear`
- Restart application to reset cache
- Check cache configuration

### Debug Mode
Enable debug logging in `application.properties`:
```properties
logging.level.com.example=DEBUG
logging.level.org.springframework.cache=DEBUG
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live news
2. **User Preferences**: Personalized news feeds
3. **Offline Support**: Service worker for offline reading
4. **Analytics**: User engagement tracking
5. **Social Features**: Share and comment on articles
6. **Multi-language**: Support for multiple languages
7. **Push Notifications**: Breaking news alerts
