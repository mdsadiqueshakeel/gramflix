// Backend configuration
export const BACKEND_CONFIG = {
  // Base URL for the Spring Boot backend
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
  
  // API endpoints
  ENDPOINTS: {
    NEWS: '/api/news'
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${BACKEND_CONFIG.BASE_URL}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};
