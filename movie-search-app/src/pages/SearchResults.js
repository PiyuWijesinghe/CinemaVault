// src/pages/SearchResults/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, Grid, List, X, ArrowLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { movieService } from '../services/movieService';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterGenre, setFilterGenre] = useState('all');
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';

  // Available genres for filtering
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
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' }
  ];

  // Search movies when query changes
  useEffect(() => {
    if (query.trim()) {
      searchMovies(query);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const searchMovies = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const searchResults = await movieService.searchMovies(searchQuery);
      setResults(searchResults);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setResults([]);
    setFilterGenre('all');
    setSortBy('relevance');
  };

  const goBack = () => {
    navigate(-1);
  };

  // Sort results
  const sortResults = (results) => {
    const sortedResults = [...results];
    
    switch (sortBy) {
      case 'rating':
        return sortedResults.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'year':
        return sortedResults.sort((a, b) => {
          const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
          const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
          return yearB - yearA;
        });
      case 'title':
        return sortedResults.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'popularity':
        return sortedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      default:
        return sortedResults;
    }
  };

  // Filter results by genre
  const filterResults = (results) => {
    if (filterGenre === 'all') return results;
    
    return results.filter(movie => 
      movie.genre_ids && movie.genre_ids.includes(parseInt(filterGenre))
    );
  };

  const processedResults = sortResults(filterResults(results));

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={goBack}
              className="mr-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-xl text-gray-300">
              Results for "<span className="text-cyan-400 font-semibold">{query}</span>"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <SearchBar 
              onSearch={handleNewSearch}
              placeholder="Search for movies, series, or actors..."
              defaultValue={query}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
            <p className="text-gray-400">Searching movies...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-red-400 mb-2">Search Error</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button 
                onClick={() => query && searchMovies(query)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : !query ? (
          /* No Query State */
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Start Your Search</h3>
            <p className="text-gray-500">
              Enter a movie title, actor name, or genre to find your next favorite film
            </p>
          </div>
        ) : (
          <>
            {/* Controls Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Results Count */}
                <div className="text-gray-300">
                  Found <span className="text-cyan-400 font-bold">{processedResults.length}</span> results
                  {results.length !== processedResults.length && (
                    <span className="text-gray-500"> (filtered from {results.length})</span>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Genre Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                      value={filterGenre} 
                      onChange={(e) => setFilterGenre(e.target.value)}
                      className="bg-white/10 border border-cyan-400/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                    >
                      {genres.map(genre => (
                        <option key={genre.id} value={genre.id} className="bg-gray-800">
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-400" />
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/10 border border-cyan-400/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                    >
                      <option value="relevance" className="bg-gray-800">Relevance</option>
                      <option value="rating" className="bg-gray-800">Rating</option>
                      <option value="year" className="bg-gray-800">Year</option>
                      <option value="title" className="bg-gray-800">Title</option>
                      <option value="popularity" className="bg-gray-800">Popularity</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-white/10 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Grid view"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {processedResults.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  Try searching with different keywords, check your spelling, or adjust your filters
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={clearSearch}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                  >
                    Clear Search
                  </button>
                  <button 
                    onClick={() => {
                      setFilterGenre('all');
                      setSortBy('relevance');
                    }}
                    className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Results Grid/List */}
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {processedResults.map(movie => (
                    viewMode === 'grid' ? (
                      <MovieCard key={movie.id} movie={movie} />
                    ) : (
                      <div key={movie.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 transition-all overflow-hidden">
                        <div className="flex space-x-4 p-6">
                          <img 
                            src={movieService.getMoviePosterUrl(movie, 'w185')}
                            alt={movie.title}
                            className="w-20 h-28 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/185x278/1f2937/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                              {movie.title}
                            </h3>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {movie.overview || 'No description available.'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>
                                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                                </span>
                                {movie.vote_average > 0 && (
                                  <span className="flex items-center space-x-1">
                                    <span className="text-yellow-400">★</span>
                                    <span>{movie.vote_average.toFixed(1)}</span>
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => navigate(`/movie/${movie.id}`)}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Search Tips */}
                <div className="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Search Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div>
                      <strong className="text-cyan-400">Movie Titles:</strong> Try partial matches like "dark knight" or "inception"
                    </div>
                    <div>
                      <strong className="text-purple-400">Actors:</strong> Search by actor names like "leonardo dicaprio"
                    </div>
                    <div>
                      <strong className="text-green-400">Genres:</strong> Use filters to narrow down by specific genres
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;