# Backend Configuration

## Setting Backend URL

The NewsFeed component now connects directly to the Spring Boot backend. To configure the backend URL:

### Option 1: Environment Variable (Recommended)

Create a `.env.local` file in the `my-app` directory:

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Option 2: Modify Configuration File

Edit `src/config/backend.js` and change the default URL:

```javascript
BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
```

## Backend Endpoints

The following endpoints are available:

- `GET /api/news` - Get paginated news articles
- `GET /api/news/category/{category}` - Get news by category
- `GET /api/news/latest` - Get latest news
- `POST /api/news/fetch` - Manually trigger news fetch
- `POST /api/news/cache/clear` - Clear cache
- `GET /api/news/stats` - Get API usage statistics
- `GET /api/news/health` - Health check

## Troubleshooting

If you see "Cannot connect to news service":

1. **Start the Spring Boot backend:**
   ```bash
   cd referral-wallet-system
   mvn spring-boot:run
   ```

2. **Verify backend is running:**
   ```bash
   curl http://localhost:8080/api/news/health
   ```

3. **Check backend logs** for any errors

4. **Verify the backend URL** in your configuration matches where the backend is running

## Production Deployment

For production, set the environment variable to your production backend URL:

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```
