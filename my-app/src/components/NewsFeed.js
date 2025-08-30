"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BACKEND_CONFIG, buildApiUrl } from "../config/backend";

const NewsFeed = ({ isPremiumUser = false }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategories, setShowCategories] = useState(false);
  
  const observer = useRef();
  const lastArticleRef = useRef();

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNews();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const fetchNews = useCallback(async (page = 1, append = false) => {
    try {
      setLoading(page === 1);
      setLoadingMore(page > 1);
      setError(null);
      const params = { page, limit: 10 };
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const response = await fetch(buildApiUrl(BACKEND_CONFIG.ENDPOINTS.NEWS, params), {
        method: 'GET',
        headers: BACKEND_CONFIG.REQUEST_CONFIG.headers,
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Backend service unavailable. Please try again later.');
        } else if (response.status === 404) {
          throw new Error('News service not found. Please check backend configuration.');
        } else {
          throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (append) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
      
      setHasMore(data.hasNext);
      setCurrentPage(page);
      
      if (page === 1) {
        setLastRefresh(Date.now());
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      
      // Provide user-friendly error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to news service. Please check if the backend is running.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory]);

  const refreshNews = useCallback(() => {
    fetchNews(1, false);
  }, [fetchNews]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchNews(currentPage + 1, true);
    }
  }, [loadingMore, hasMore, currentPage, fetchNews]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading) return;

    const lastArticle = lastArticleRef.current;
    if (lastArticle) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      observer.current.observe(lastArticle);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  // Initial load
  useEffect(() => {
    fetchNews(1, false);
  }, [fetchNews]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'sports': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'politics': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'business': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'entertainment': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'science': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'health': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'general': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    
    return colors[category?.toLowerCase()] || colors.general;
  };

  const categories = [
    { id: 'all', name: 'All News', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
    { id: 'general', name: 'General', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
    { id: 'technology', name: 'Technology', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'sports', name: 'Sports', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { id: 'politics', name: 'Politics', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { id: 'business', name: 'Business', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { id: 'entertainment', name: 'Entertainment', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
    { id: 'science', name: 'Science', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
    { id: 'health', name: 'Health', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
    setCurrentPage(1);
    setHasMore(true);
    fetchNews(1, false);
  };

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategories && !event.target.closest('.category-dropdown')) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategories]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-24 h-24 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              News Service Unavailable
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            
            {error.includes('Cannot connect') && (
              <div className="text-sm text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded border border-red-200 dark:border-red-700">
                <p className="font-medium mb-2">To fix this:</p>
                <ol className="text-left space-y-1">
                  <li>1. Start the Spring Boot backend</li>
                  <li>2. Ensure it's running on {BACKEND_CONFIG.BASE_URL}</li>
                  <li>3. Check the backend logs for errors</li>
                </ol>
              </div>
            )}
          </div>
          
          <Button onClick={refreshNews} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${
            isPremiumUser ? 'text-yellow-600' : 'text-foreground'
          }`}>
            Latest News
          </h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {formatTimeAgo(lastRefresh)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Category Filter */}
          <div className="relative">
            <Button 
              onClick={() => setShowCategories(!showCategories)} 
              variant="outline" 
              size="sm"
              className="min-w-[140px]"
            >
              <span className="mr-2">
                {categories.find(cat => cat.id === selectedCategory)?.name || 'All News'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            {showCategories && (
              <div className="category-dropdown absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedCategory === category.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <Button 
            onClick={refreshNews} 
            variant="outline" 
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Scroll to Top Button - Fixed Position */}
      <Button
        onClick={scrollToTop}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </Button>

      {/* News Articles */}
      {articles.map((article, index) => (
        <Card
          key={article.id || index}
          ref={index === articles.length - 1 ? lastArticleRef : null}
          className="overflow-hidden border-border hover:border-newzia-primary/30 transition-all duration-300 hover:shadow-strong group cursor-pointer bg-card/50 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
              <ImageWithFallback
                src={article.image || 'https://plus.unsplash.com/premium_photo-1691223733678-095fee90a0a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D'}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                fallbackSrc="https://plus.unsplash.com/premium_photo-1691223733678-095fee90a0a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}
                  >
                    {article.category || 'General'}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime || 3} min read</span>
                  </div>
                </div>

                <h3 className={`text-lg md:text-xl font-bold leading-tight transition-colors duration-200 line-clamp-2 ${
                  isPremiumUser
                    ? "text-foreground group-hover:text-yellow-600"
                    : "text-foreground group-hover:text-newzia-primary"
                }`}>
                  {article.title}
                </h3>

                {article.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground space-x-2 md:space-x-3">
                    {article.author && (
                      <>
                        <span className="font-medium">{article.author}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                  {/* See Details Button */}
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        See Details
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Load More Indicator */}
      {loadingMore && (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">Loading more news...</p>
        </div>
      )}

      {/* No More News */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You've reached the end of the news feed!</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No news available at the moment.</p>
          <Button onClick={refreshNews} variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
