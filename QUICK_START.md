# 🚀 News Feed Feature - Quick Start Guide

## Prerequisites
- Java 17+ installed
- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Mediastack API key (already configured)

## 🏃‍♂️ Quick Start

### 1. Start the Backend (Spring Boot)

```bash
cd referral-wallet-system

# Build the project
mvn clean install

# Start the application
mvn spring-boot:run
```

**Expected Output:**
```
Started ReferralWalletApplication in X.XXX seconds
Starting scheduled news fetch from Mediastack API
Successfully fetched and saved X news articles
```

### 2. Start the Frontend (Next.js)

```bash
cd my-app

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
Ready - started server on 0.0.0.0:3000
```

### 3. Test the Feature

1. Open your browser and navigate to `http://localhost:3000`
2. Log in to your account
3. You should see the news feed on the home page
4. Scroll down to test infinite scroll
5. Wait 5 minutes to see auto-refresh

## 🧪 Testing the Backend

### Option 1: Use the Test Script
```bash
cd referral-wallet-system
chmod +x test-news-api.sh
./test-news-api.sh
```

### Option 2: Manual Testing with curl

```bash
# Health check
curl http://localhost:8080/api/news/health

# Get latest news
curl http://localhost:8080/api/news/latest

# Get paginated news
curl "http://localhost:8080/api/news?page=1&limit=5"

# Get news by category
curl http://localhost:8080/api/news/category/technology

# Manually trigger news fetch (consumes 1 API call)
curl -X POST http://localhost:8080/api/news/fetch

# Clear cache
curl -X POST http://localhost:8080/api/news/cache/clear

# Get API usage statistics
curl http://localhost:8080/api/news/stats
```

## 📱 Frontend Testing

### Test Infinite Scroll
1. Scroll to the bottom of the news feed
2. You should see "Loading more news..." indicator
3. New articles should appear automatically

### Test Auto-refresh
1. Note the "Last updated" time
2. Wait 5 minutes
3. The feed should refresh automatically
4. Time should update to "Just now"

### Test Manual Refresh
1. Click the "Refresh" button
2. Loading skeleton should appear
3. Fresh news should load

## 🔧 Troubleshooting

### Backend Issues

**Application won't start:**
```bash
# Check MongoDB connection
# Verify application.properties
# Check Java version (should be 17+)
```

**No news being fetched:**
```bash
# Check Mediastack API key
# Verify network connectivity
# Check application logs for errors
```

### Frontend Issues

**News not loading:**
```bash
# Check if backend is running on port 8080
# Check browser console for errors
# Verify API route is working
```

**Infinite scroll not working:**
```bash
# Check browser console for JavaScript errors
# Verify Intersection Observer support
# Check if articles have refs properly set
```

## 📊 Monitoring

### Backend Logs
```bash
# Watch application logs
tail -f logs/spring.log

# Check cache statistics
curl http://localhost:8080/actuator/caches
```

### Frontend Monitoring
- Open browser DevTools
- Check Network tab for API calls
- Monitor Console for errors
- Check Performance tab for scroll performance

## 🎯 Next Steps

1. **Customize Categories**: Update category filters in `NewsFeed.js`
2. **Add Premium Content**: Set `isPremium` flag in backend
3. **Implement Search**: Add search functionality to news feed
4. **Add Analytics**: Track user engagement with news
5. **Optimize Images**: Implement image optimization and lazy loading
6. **Monitor API Usage**: Use `/api/news/stats` to track quota consumption
7. **Adjust Cleanup Period**: Modify retention days in `application.properties`

## 📚 Additional Resources

- [Spring Boot Caching Guide](https://spring.io/guides/gs/caching/)
- [Caffeine Cache Documentation](https://github.com/ben-manes/caffeine)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Support

If you encounter issues:

1. Check the application logs
2. Verify all prerequisites are met
3. Test individual components separately
4. Review the detailed README in `referral-wallet-system/NEWS_FEED_README.md`

---

**Happy coding! 🎉**
