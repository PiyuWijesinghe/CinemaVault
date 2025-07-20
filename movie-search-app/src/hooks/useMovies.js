// src/hooks/useMovies.js
import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

export const useMovies = (category = 'popular') => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getMovies(category);
        setMovies(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  return { movies, loading, error };
};

export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getMovieById(movieId);
        setMovie(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return { movie, loading, error };
};