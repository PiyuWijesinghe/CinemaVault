// src/hooks/useFavorites.js
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cinemavault-favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('cinemavault-favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, loading]);

  const addToFavorites = (movie) => {
    if (!movie || !movie.id) return false;
    
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === movie.id);
      if (exists) return prev;
      
      const favoriteMovie = {
        id: movie.id,
        title: movie.title || 'Unknown',
        overview: movie.overview || '',
        poster_path: movie.poster_path || null,
        backdrop_path: movie.backdrop_path || null,
        release_date: movie.release_date || null,
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        genre_ids: movie.genre_ids || [],
        addedDate: new Date().toISOString(),
        addedTimestamp: Date.now()
      };
      
      return [...prev, favoriteMovie];
    });
    
    return true;
  };

  const removeFromFavorites = (movieId) => {
    if (!movieId) return false;
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    return true;
  };

  const isFavorite = (movieId) => {
    if (!movieId) return false;
    return favorites.some(movie => movie.id === movieId);
  };

  const toggleFavorite = (movie) => {
    if (!movie || !movie.id) return false;
    
    if (isFavorite(movie.id)) {
      return removeFromFavorites(movie.id);
    } else {
      return addToFavorites(movie);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const searchFavorites = (query) => {
    if (!query) return favorites;
    const searchTerm = query.toLowerCase();
    return favorites.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
    );
  };

  const sortFavorites = (sortBy = 'addedDate') => {
    const sorted = [...favorites];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'releaseDate':
        return sorted.sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA;
        });
      default:
        return sorted.sort((a, b) => (b.addedTimestamp || 0) - (a.addedTimestamp || 0));
    }
  };

  const getFavoritesStats = () => {
    const totalCount = favorites.length;
    
    if (totalCount === 0) {
      return {
        totalCount: 0,
        uniqueGenres: 0,
        averageRating: 0,
        recentMovies: 0
      };
    }

    const uniqueGenres = new Set();
    let ratingSum = 0;
    let ratingCount = 0;
    
    favorites.forEach(movie => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach(id => uniqueGenres.add(id));
      }
      if (movie.vote_average > 0) {
        ratingSum += movie.vote_average;
        ratingCount++;
      }
    });
    
    const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;
    const currentYear = new Date().getFullYear();
    const recentMovies = favorites.filter(movie => {
      if (!movie.release_date) return false;
      const year = new Date(movie.release_date).getFullYear();
      return year >= currentYear - 3;
    }).length;

    return {
      totalCount,
      uniqueGenres: uniqueGenres.size,
      averageRating: Math.round(averageRating * 10) / 10,
      recentMovies
    };
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    toggleFavorite,
    searchFavorites,
    sortFavorites,
    getFavoritesStats,
    favoritesCount: favorites.length
  };
};