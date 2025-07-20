// src/pages/Home/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, Globe, MonitorPlay, TrendingUp, Star, Play, Zap } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions] = useState([
    'Inception', 'Avengers', 'Dark Knight', 'Interstellar', 'Matrix', 'Dune'
  ]);

  useEffect(() => {
    // Load featured movies on component mount
    const loadFeaturedMovies = async () => {
      try {
        const movies = await movieService.getMovies('popular');
        setFeaturedMovies(movies.slice(0, 6)); // Show only first 6 movies
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      // Navigate to search results page with the query
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickSearch = (suggestion) => {
    handleSearch(suggestion);
  };

  const statsData = [
    {
      icon: <Film className="w-8 h-8" />,
      number: "50M+",
      label: "Movies & Shows",
      color: "text-cyan-400"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "200+",
      label: "Countries",
      color: "text-green-400"
    },
    {
      icon: <MonitorPlay className="w-8 h-8" />,
      number: "4K",
      label: "Ultra HD Quality",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo Circle */}
        <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-12 shadow-2xl shadow-cyan-500/30 animate-pulse">
          <Film className="w-16 h-16 text-white" />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent text-center">
          CinemaVault
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl">
          Discover extraordinary films from around the universe
        </p>

        {/* Search Section */}
        <div className="w-full max-w-2xl mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for any movie, series, or actor..."
            autoFocus={false}
          />
        </div>

        {/* Quick Search Suggestions */}
        <div className="mb-16">
          <p className="text-gray-400 text-center mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(suggestion)}
                className="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm transition-all transform hover:scale-105 border border-white/20 hover:border-cyan-400/50"
              >
                <Zap className="w-3 h-3 inline mr-1" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className={`flex items-center justify-center space-x-2 text-4xl font-bold ${stat.color} mb-2`}>
                <span>{stat.number}</span>
                {stat.icon}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Movies Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Featured Movies
              </h2>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover the most popular and trending movies right now
            </p>
          </div>

          {/* Featured Movies Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* View More Button */}
              <div className="text-center">
                <button
                  onClick={() => navigate('/discover')}
                  className="group inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Discover More Movies</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Features Section */}
      <div className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Search Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Find exactly what you're looking for with our advanced search capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Search</h3>
              <p className="text-gray-300">
                Find any movie instantly with our intelligent search that understands what you're looking for.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Personal Favorites</h3>
              <p className="text-gray-300">
                Create your personalized watchlist and keep track of movies you love or want to watch.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MonitorPlay className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">HD Quality</h3>
              <p className="text-gray-300">
                Experience movies in stunning 4K quality with detailed information and high-resolution posters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Start your cinematic journey today and discover movies that will captivate your imagination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 font-medium"
              >
                Browse All Movies
              </button>
              <button
                onClick={() => handleSearch('action')}
                className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all font-medium"
              >
                Search Action Movies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-80 animate-ping"></div>
    </div>
  );
};

export default Home;