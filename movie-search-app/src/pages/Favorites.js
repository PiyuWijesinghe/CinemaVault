// src/pages/Favorites/Favorites.js
import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Play, Search } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample favorite movies data
  const sampleFavorites = [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      genre: "Sci-Fi",
      rating: 8.8,
      poster: "https://via.placeholder.com/300x450/1f2937/ffffff?text=Inception",
      description: "A thief who steals corporate secrets through dream-sharing technology...",
      addedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      genre: "Action",
      rating: 9.0,
      poster: "https://via.placeholder.com/300x450/1f2937/ffffff?text=Dark+Knight",
      description: "Batman faces the Joker in this thrilling superhero epic...",
      addedDate: "2024-01-10"
    },
    {
      id: 3,
      title: "Parasite",
      year: 2019,
      genre: "Drama",
      rating: 8.5,
      poster: "https://via.placeholder.com/300x450/1f2937/ffffff?text=Parasite",
      description: "A poor family infiltrates a wealthy household...",
      addedDate: "2024-01-20"
    }
  ];

  useEffect(() => {
    // Simulate loading favorites from localStorage or API
    setTimeout(() => {
      setFavorites(sampleFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromFavorites = (movieId) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      setFavorites([]);
    }
  };

  const filteredFavorites = favorites.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-12 h-12 text-red-500 fill-current" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              My Favorites
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your personally curated collection of amazing movies
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : favorites.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-4">No favorites yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start exploring movies and add them to your favorites to see them here
            </p>
            <a
              href="/discover"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              <span>Discover Movies</span>
            </a>
          </div>
        ) : (
          <>
            {/* Search and Actions Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm">
                    {filteredFavorites.length} of {favorites.length} movies
                  </span>
                  
                  {favorites.length > 0 && (
                    <button
                      onClick={clearAllFavorites}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No matches found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map(movie => (
                  <div key={movie.id} className="relative group">
                    <MovieCard movie={movie} />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromFavorites(movie.id)}
                      className="absolute top-2 left-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Added Date */}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs">
                        Added {new Date(movie.addedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statistics */}
            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{favorites.length}</div>
                  <div className="text-gray-400 text-sm">Total Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {new Set(favorites.map(m => m.genre)).size}
                  </div>
                  <div className="text-gray-400 text-sm">Genres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {(favorites.reduce((sum, m) => sum + m.rating, 0) / favorites.length || 0).toFixed(1)}
                  </div>
                  <div className="text-gray-400 text-sm">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {favorites.filter(m => m.year >= 2020).length}
                  </div>
                  <div className="text-gray-400 text-sm">Recent Movies</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;