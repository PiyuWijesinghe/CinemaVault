// src/utils/constants.js
export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
  BACKDROP_SIZE: 'w1280',
  POSTER_SIZE: 'w500',
  PROFILE_SIZE: 'w185'
};

export const GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export const MOVIE_CATEGORIES = {
  POPULAR: 'popular',
  TOP_RATED: 'top_rated',
  NOW_PLAYING: 'now_playing',
  UPCOMING: 'upcoming'
};

export const SORT_OPTIONS = {
  RELEVANCE: 'relevance',
  RATING: 'vote_average.desc',
  RELEASE_DATE: 'release_date.desc',
  TITLE: 'title.asc',
  POPULARITY: 'popularity.desc'
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const LOCAL_STORAGE_KEYS = {
  FAVORITES: 'cinemavault-favorites',
  RECENT_SEARCHES: 'cinemavault-recent-searches',
  USER_PREFERENCES: 'cinemavault-user-preferences'
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};