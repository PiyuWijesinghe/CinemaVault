// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'demo_key';

// Check if we have a valid API key
const hasValidApiKey = () => {
  return API_KEY && API_KEY !== 'demo_key' && API_KEY !== 'your_api_key_here';
};

// Base API configuration
const api = {
  async get(endpoint, params = {}) {
    // If no valid API key, return empty result to trigger fallback
    if (!hasValidApiKey()) {
      console.warn('No valid TMDB API key found. Using sample data.');
      throw new Error('No API key configured');
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add API key and other default params
    const searchParams = {
      api_key: API_KEY,
      language: 'en-US',
      ...params
    };

    // Add parameters to URL
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key];
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      console.log('Fetching:', url.toString());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
      
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check your internet connection');
      }
      
      if (error.message.includes('401')) {
        throw new Error('Invalid API key: Please check your TMDB API configuration');
      }
      
      if (error.message.includes('404')) {
        throw new Error('Resource not found');
      }
      
      throw error;
    }
  },

  async post(endpoint, data = {}) {
    if (!hasValidApiKey()) {
      console.warn('No valid TMDB API key found.');
      throw new Error('No API key configured');
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API POST Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('API POST Request failed:', error);
      throw error;
    }
  },

  // Helper method to check API status
  async checkApiStatus() {
    try {
      await this.get('/configuration');
      return { success: true, message: 'API connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'API connection failed'
      };
    }
  }
};

export default api;