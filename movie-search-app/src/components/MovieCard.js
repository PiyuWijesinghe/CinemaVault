// src/components/MovieCard/MovieCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Play, Calendar, Eye } from 'lucide-react';
import { movieService } from '../services/movieService';
import { useFavorites } from '../hooks/useFavourites';

const MovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Get proper image URLs
  const posterUrl = imageError 
    ? `https://via.placeholder.com/500x750/1f2937/ffffff?text=${encodeURIComponent(movie.title || 'No Title')}`
    : movieService.getMoviePosterUrl(movie, 'w500');

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const isMovieFavorite = isFavorite(movie.id);

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        {/* Movie Poster */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-500" />
            </div>
          )}
          
          <img
            src={posterUrl}
            alt={movie.title || 'Movie poster'}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-medium">View Details</p>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10 ${
              isMovieFavorite 
                ? 'bg-red-500 text-white scale-110 shadow-lg' 
                : 'bg-black/50 text-white hover:bg-red-500 hover:scale-110'
            }`}
            title={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 transition-all ${isMovieFavorite ? 'fill-current scale-110' : ''}`} />
          </button>

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 border border-yellow-400/30">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-bold">{rating}</span>
            </div>
          )}

          {/* Release Year Badge */}
          <div className="absolute bottom-3 left-3 bg-cyan-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-white text-xs font-bold">{year}</span>
          </div>

          {/* Popularity Indicator */}
          {movie.popularity && movie.popularity > 100 && (
            <div className="absolute bottom-3 right-3 bg-purple-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-white text-xs font-bold">🔥 Hot</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-5">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors leading-tight">
            {movie.title || 'Unknown Title'}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{year}</span>
            </div>
            
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-xs font-medium">
                {movie.genre_ids.length} Genre{movie.genre_ids.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Overview */}
          {movie.overview && (
            <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed mb-3">
              {movie.overview}
            </p>
          )}

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              {movie.vote_count && (
                <span>{(movie.vote_count / 1000).toFixed(1)}K votes</span>
              )}
              {movie.adult && (
                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">18+</span>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Details</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Progress Bar for Rating */}
          {movie.vote_average > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Rating</span>
                <span>{rating}/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(movie.vote_average / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;