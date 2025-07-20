// src/pages/Discover/Discover.js
import React, { useState, useEffect } from 'react';
import { Film, Star, Calendar, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';

const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const categories = [
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'now_playing', label: 'Now Playing' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];

  // Sample genres - you can replace this with actual API call
  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 14, name: 'Fantasy' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' }
  ];

  useEffect(() => {
    loadMovies();
  }, [selectedCategory]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const movieData = await movieService.getMovies(selectedCategory);
      setMovies(movieData);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie => {
    const genreMatch = selectedGenre === 'all' || 
      (movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre)));
    
    const yearMatch = selectedYear === 'all' || 
      (movie.release_date && new Date(movie.release_date).getFullYear().toString() === selectedYear);
    
    return genreMatch && yearMatch;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Discover Movies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our vast collection of movies from around the world
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Filters:</span>
            </div>
            
            {/* Genre Filter */}
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-white/10 border border-cyan-400/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              >
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id} className="bg-gray-800">
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white/10 border border-cyan-400/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              >
                {years.map(year => (
                  <option key={year} value={year} className="bg-gray-800">
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-400 ml-auto">
              Showing {filteredMovies.length} results
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl h-96 animate-pulse">
                <div className="h-72 bg-gray-700 rounded-t-xl mb-4"></div>
                <div className="px-4 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
                <button 
                  onClick={() => {
                    setSelectedGenre('all');
                    setSelectedYear('all');
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {!loading && filteredMovies.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={loadMovies}
              className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/20 font-medium"
            >
              Load More Movies
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Movie Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{movies.length}</div>
              <div className="text-gray-400">Total Movies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {movies.filter(m => m.vote_average >= 8).length}
              </div>
              <div className="text-gray-400">Highly Rated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {movies.filter(m => new Date(m.release_date).getFullYear() >= 2020).length}
              </div>
              <div className="text-gray-400">Recent Movies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {movies.length > 0 ? (movies.reduce((sum, m) => sum + m.vote_average, 0) / movies.length).toFixed(1) : '0'}
              </div>
              <div className="text-gray-400">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;