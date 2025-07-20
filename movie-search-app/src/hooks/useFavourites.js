// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cinemavault-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem(STORAGE_KEY);
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites);
          } else {
            console.warn('Invalid favorites format in localStorage');
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, loading]);

  const addToFavorites = useCallback((movie) => {
    if (!movie || !movie.id) {
      console.warn('Invalid movie object for favorites');
      return false;
    }
    
    setFavorites(prev => {
      // Check if movie is already in favorites
      const isAlreadyFavorite = prev.some(fav => fav.id === movie.id);
      if (isAlreadyFavorite) {
        console.log('Movie already in favorites');
        return prev;
      }
      
      // Add movie with additional metadata
      const favoriteMovie = {
        id: movie.id,
        title: movie.title || 'Unknown Title',
        overview: movie.overview || '',
        poster_path: movie.poster_path || null,
        backdrop_path: movie.backdrop_path || null,
        release_date: movie.release_date || null,
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        genre_ids: movie.genre_ids || [],
        popularity: movie.popularity || 0,
        adult: movie.adult || false,
        addedDate: new Date().toISOString(),
        addedTimestamp: Date.now()
      };
      
      const newFavorites = [...prev, favoriteMovie];
      console.log('Added to favorites:', favoriteMovie.title);
      return newFavorites;
    });
    
    return true;
  }, []);

  const removeFromFavorites = useCallback((movieId) => {
    if (!movieId) {
      console.warn('Invalid movie ID for removal');
      return false;
    }
    
    setFavorites(prev => {
      const newFavorites = prev.filter(movie => movie.id !== movieId);
      if (newFavorites.length < prev.length) {
        console.log('Removed from favorites:', movieId);
        return newFavorites;
      } else {
        console.log('Movie not found in favorites:', movieId);
        return prev;
      }
    });
    
    return true;
  }, []);

  const isFavorite = useCallback((movieId) => {
    if (!movieId) return false;
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    console.log('All favorites cleared');
  }, []);

  const toggleFavorite = useCallback((movie) => {
    if (!movie || !movie.id) {
      console.warn('Invalid movie object for toggle');
      return false;
    }
    
    const isCurrentlyFavorite = isFavorite(movie.id);
    
    if (isCurrentlyFavorite) {
      return removeFromFavorites(movie.id);
    } else {
      return addToFavorites(movie);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const getFavoriteById = useCallback((movieId) => {
    if (!movieId) return null;
    return favorites.find(movie => movie.id === movieId) || null;
  }, [favorites]);

  const getFavoritesByGenre = useCallback((genreId) => {
    if (!genreId) return favorites;
    return favorites.filter(movie => 
      movie.genre_ids && movie.genre_ids.includes(parseInt(genreId))
    );
  }, [favorites]);

  const getRecentFavorites = useCallback((limit = 5) => {
    return [...favorites]
      .sort((a, b) => (b.addedTimestamp || 0) - (a.addedTimestamp || 0))
      .slice(0, limit);
  }, [favorites]);

  const getFavoritesByRating = useCallback((minRating = 7) => {
    return favorites.filter(movie => 
      movie.vote_average && movie.vote_average >= minRating
    );
  }, [favorites]);

  const searchFavorites = useCallback((query) => {
    if (!query || !query.trim()) return favorites;
    
    const searchTerm = query.toLowerCase().trim();
    return favorites.filter(movie =>
      (movie.title && movie.title.toLowerCase().includes(searchTerm)) ||
      (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
    );
  }, [favorites]);

  const sortFavorites = useCallback((sortBy = 'addedDate') => {
    const sortedFavorites = [...favorites];
    
    switch (sortBy) {
      case 'title':
        return sortedFavorites.sort((a, b) => 
          (a.title || '').localeCompare(b.title || '')
        );
      case 'rating':
        return sortedFavorites.sort((a, b) => 
          (b.vote_average || 0) - (a.vote_average || 0)
        );
      case 'releaseDate':
        return sortedFavorites.sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA;
        });
      case 'addedDate':
      default:
        return sortedFavorites.sort((a, b) => 
          (b.addedTimestamp || 0) - (a.addedTimestamp || 0)
        );
    }
  }, [favorites]);

  const getFavoritesStats = useCallback(() => {
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
      // Count unique genres
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach(id => uniqueGenres.add(id));
      }
      
      // Sum ratings
      if (movie.vote_average && movie.vote_average > 0) {
        ratingSum += movie.vote_average;
        ratingCount++;
      }
    });
    
    const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;
    const currentYear = new Date().getFullYear();
    
    const recentMovies = favorites.filter(movie => {
      if (!movie.release_date) return false;
      const releaseYear = new Date(movie.release_date).getFullYear();
      return releaseYear >= currentYear - 3;
    }).length;

    return {
      totalCount,
      uniqueGenres: uniqueGenres.size,
      averageRating: Math.round(averageRating * 10) / 10,
      recentMovies
    };
  }, [favorites]);

  const exportFavorites = useCallback(() => {
    try {
      const dataStr = JSON.stringify(favorites, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `cinemavault-favorites-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Favorites exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting favorites:', error);
      return false;
    }
  }, [favorites]);

  const importFavorites = useCallback((jsonData) => {
    try {
      const importedFavorites = JSON.parse(jsonData);
      
      if (!Array.isArray(importedFavorites)) {
        throw new Error('Invalid data format: Expected an array');
      }
      
      // Validate and clean imported data
      const validFavorites = importedFavorites.filter(movie => 
        movie && 
        typeof movie === 'object' && 
        movie.id && 
        typeof movie.id === 'number'
      );
      
      if (validFavorites.length === 0) {
        throw new Error('No valid movie data found in import');
      }
      
      // Merge with existing favorites, avoiding duplicates
      const existingIds = favorites.map(movie => movie.id);
      const newFavorites = validFavorites.filter(
        movie => !existingIds.includes(movie.id)
      );
      
      if (newFavorites.length > 0) {
        setFavorites(prev => [...prev, ...newFavorites]);
        console.log(`Imported ${newFavorites.length} new favorites`);
      }
      
      return newFavorites.length;
    } catch (error) {
      console.error('Error importing favorites:', error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }, [favorites]);

  return {
    // State
    favorites,
    loading,
    
    // Basic operations
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    toggleFavorite,
    
    // Getters
    getFavoriteById,
    getFavoritesByGenre,
    getRecentFavorites,
    getFavoritesByRating,
    
    // Search and filter
    searchFavorites,
    sortFavorites,
    
    // Statistics
    getFavoritesStats,
    favoritesCount: favorites.length,
    
    // Import/Export
    exportFavorites,
    importFavorites
  };
};