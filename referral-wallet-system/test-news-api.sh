#!/bin/bash

# Test script for News API endpoints
# Note: News endpoints are PUBLIC and don't require authentication
# This script tests all news functionality

BASE_URL="http://localhost:8080"

echo "🧪 Testing News API Endpoints"
echo "================================"

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/api/news/health"
echo -e "\n"

# Test latest news
echo "2. Testing latest news endpoint..."
curl -s "$BASE_URL/api/news/latest" | jq '. | length' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/api/news/latest")"
echo -e "\n"

# Test paginated news
echo "3. Testing paginated news endpoint..."
curl -s "$BASE_URL/api/news?page=1&limit=5" | jq '.articles | length' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/api/news?page=1&limit=5")"
echo -e "\n"

# Test category filter
echo "4. Testing category filter..."
curl -s "$BASE_URL/api/news/category/technology" | jq '. | length' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/api/news/category/technology")"
echo -e "\n"

# Test manual news fetch (this will consume 1 API call)
echo "5. Testing manual news fetch..."
echo "⚠️  This will consume 1 Mediastack API call"
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    curl -s -X POST "$BASE_URL/api/news/fetch"
    echo -e "\n"
else
    echo "Skipped manual fetch"
fi

# Test cache clear
echo "6. Testing cache clear..."
curl -s -X POST "$BASE_URL/api/news/cache/clear"
echo -e "\n"

# Test API stats
echo "7. Testing API stats endpoint..."
curl -s "$BASE_URL/api/news/stats" | jq '.' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/api/news/stats")"
echo -e "\n"

echo "✅ API testing completed!"
echo "Check the application logs for any errors."
