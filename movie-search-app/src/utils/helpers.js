// src/utils/helpers.js
import { GENRES, API_CONFIG } from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
};

export const formatYear = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatCurrency = (amount) => {
  if (!amount) return 'Unknown';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

export const getGenreNames = (genreIds) => {
  if (!genreIds || !Array.isArray(genreIds)) return [];
  
  return genreIds.map(id => GENRES[id]).filter(Boolean);
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-image.jpg';
  return `${API_CONFIG.IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${API_CONFIG.IMAGE_BASE_URL}${size}${path}`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const sortByProperty = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterByProperty = (array, property, value) => {
  if (!value || value === 'all') return array;
  
  return array.filter(item => {
    const itemValue = item[property];
    
    if (Array.isArray(itemValue)) {
      return itemValue.includes(value);
    }
    
    return itemValue === value;
  });
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    behavior
  });
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};

// Additional movie-specific helper functions
export const getMovieYear = (movie) => {
  return formatYear(movie.release_date);
};

export const getMovieGenres = (movie) => {
  if (movie.genres && Array.isArray(movie.genres)) {
    return movie.genres.map(g => g.name);
  }
  if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
    return getGenreNames(movie.genre_ids);
  }
  return [];
};

export const getMovieRating = (movie) => {
  if (!movie.vote_average) return 0;
  return Math.round(movie.vote_average * 10) / 10;
};

export const getMoviePopularity = (movie) => {
  if (!movie.popularity) return 0;
  return Math.round(movie.popularity);
};

export const isRecentMovie = (movie, yearsBack = 3) => {
  const movieYear = getMovieYear(movie);
  const currentYear = new Date().getFullYear();
  return movieYear >= (currentYear - yearsBack);
};

export const getAgeRating = (movie) => {
  if (movie.adult) return 'R';
  return 'PG-13'; // Default assumption
};

export const formatVoteCount = (count) => {
  return formatNumber(count) + ' votes';
};

export const getMovieStatus = (movie) => {
  const releaseDate = new Date(movie.release_date);
  const today = new Date();
  
  if (releaseDate > today) {
    return 'upcoming';
  } else if (isRecentMovie(movie, 1)) {
    return 'recent';
  } else {
    return 'released';
  }
};

export const searchMovies = (movies, query) => {
  if (!query) return movies;
  
  const searchTerm = query.toLowerCase();
  
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) ||
    movie.overview.toLowerCase().includes(searchTerm) ||
    getMovieGenres(movie).some(genre => 
      genre.toLowerCase().includes(searchTerm)
    )
  );
};

export const sortMovies = (movies, sortBy) => {
  switch (sortBy) {
    case 'title':
      return sortByProperty(movies, 'title', 'asc');
    case 'rating':
      return sortByProperty(movies, 'vote_average', 'desc');
    case 'release_date':
      return sortByProperty(movies, 'release_date', 'desc');
    case 'popularity':
      return sortByProperty(movies, 'popularity', 'desc');
    default:
      return movies;
  }
};

export const filterMoviesByGenre = (movies, genreId) => {
  if (!genreId || genreId === 'all') return movies;
  
  return movies.filter(movie => {
    if (movie.genre_ids) {
      return movie.genre_ids.includes(parseInt(genreId));
    }
    if (movie.genres) {
      return movie.genres.some(g => g.id === parseInt(genreId));
    }
    return false;
  });
};

export const filterMoviesByYear = (movies, year) => {
  if (!year || year === 'all') return movies;
  
  return movies.filter(movie => getMovieYear(movie) === parseInt(year));
};

export const filterMoviesByRating = (movies, minRating) => {
  if (!minRating) return movies;
  
  return movies.filter(movie => getMovieRating(movie) >= parseFloat(minRating));
};