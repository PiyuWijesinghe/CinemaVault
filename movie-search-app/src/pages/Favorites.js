// src/pages/Favorites/Favorites.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Play, Search, Star, Calendar } from 'lucide-react';
import { useFavorites } from '../hooks/useFavourites';
import { movieService } from '../services/movieService';

const Favorites = () => {
  const { 
    favorites, 
    loading, 
    removeFromFavorites, 
    clearFavorites, 
    searchFavorites, 
    sortFavorites,
    getFavoritesStats 
  } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('addedDate');

  // Get processed favorites
  const filteredFavorites = searchQuery ? searchFavorites(searchQuery) : favorites;
  const sortedFavorites = sortFavorites(sortBy);
  const displayFavorites = searchQuery ? 
    sortFavorites(sortBy).filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (movie.overview && movie.overview.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : sortedFavorites;

  const stats = getFavoritesStats();

  const handleRemoveFavorite = (movieId, movieTitle) => {
    if (window.confirm(`Remove "${movieTitle}" from favorites?`)) {
      removeFromFavorites(movieId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(`Are you sure you want to remove all ${favorites.length} favorites?`)) {
      clearFavorites();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-12 h-12 text-red-500 fill-current animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              My Favorites
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your personally curated collection of amazing movies
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-4">No favorites yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start exploring movies and add them to your favorites to see them here
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Discover Movies</span>
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
              >
                <span>Browse All Movies</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-red-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/10 border border-red-400/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-400"
                  >
                    <option value="addedDate" className="bg-gray-800">Recently Added</option>
                    <option value="title" className="bg-gray-800">Title A-Z</option>
                    <option value="rating" className="bg-gray-800">Highest Rated</option>
                    <option value="releaseDate" className="bg-gray-800">Release Date</option>
                  </select>

                  {favorites.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Results Info */}
              <div className="mt-4 text-gray-300 text-sm">
                {searchQuery ? (
                  <span>
                    Found {displayFavorites.length} of {favorites.length} favorites
                    {searchQuery && ` matching "${searchQuery}"`}
                  </span>
                ) : (
                  <span>{favorites.length} movies in your favorites</span>
                )}
              </div>
            </div>

            {/* Favorites Grid */}
            {displayFavorites.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No matches found</h3>
                <p className="text-gray-500 mb-6">Try a different search term</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {displayFavorites.map(movie => (
                  <div key={movie.id} className="relative group">
                    {/* Movie Card */}
                    <Link to={`/movie/${movie.id}`} className="block">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                        {/* Movie Poster */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                          <img
                            src={movieService.getMoviePosterUrl(movie, 'w500')}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/500x750/1f2937/ffffff?text=${encodeURIComponent(movie.title)}`;
                            }}
                          />
                          
                          {/* Rating Badge */}
                          {movie.vote_average > 0 && (
                            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}

                          {/* Added Date Badge */}
                          <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <span className="text-white text-xs font-bold">
                              {movie.addedDate ? new Date(movie.addedDate).toLocaleDateString() : 'Favorite'}
                            </span>
                          </div>
                        </div>

                        {/* Movie Info */}
                        <div className="p-5">
                          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
                            {movie.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
                            </div>
                            
                            {movie.genre_ids && movie.genre_ids.length > 0 && (
                              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-xs font-medium">
                                {movie.genre_ids.length} Genre{movie.genre_ids.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>

                          {movie.overview && (
                            <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                              {movie.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFavorite(movie.id, movie.title);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 z-10"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Favorites Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">{stats.totalCount}</div>
                  <div className="text-gray-400">Total Movies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.uniqueGenres}</div>
                  <div className="text-gray-400">Unique Genres</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averageRating}</div>
                  <div className="text-gray-400">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{stats.recentMovies}</div>
                  <div className="text-gray-400">Recent Movies</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 text-center">
              <div className="flex gap-4 justify-center">
                <Link
                  to="/discover"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span>Discover More Movies</span>
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
                >
                  <Heart className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;