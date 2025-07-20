// src/pages/MovieDetails/MovieDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Play, Calendar, Clock, Globe, ArrowLeft, Share, Users, DollarSign } from 'lucide-react';
import { movieService } from '../services/movieService';
import { useFavorites } from '../hooks/useFavourites';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadMovieDetails = async () => {
      console.log('Loading movie details for ID:', id);
      setLoading(true);
      
      try {
        const movieData = await movieService.getMovieById(id);
        console.log('Movie data loaded:', movieData);
        setMovie(movieData);
      } catch (error) {
        console.error('Error loading movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovieDetails();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (movie) {
      const success = toggleFavorite(movie);
      if (success) {
        console.log('Favorite toggled for:', movie.title);
      }
    }
  };

  const shareMovie = async () => {
    if (!movie) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.overview || movie.tagline || 'Check out this amazing movie!',
          url: window.location.href
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes || minutes === 0) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}min`;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist or couldn't be loaded.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all"
            >
              Go Back
            </button>
            <Link 
              to="/discover" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get image URLs
  const posterUrl = movieService.getMoviePosterUrl(movie, 'w500');
  const backdropUrl = movieService.getMovieBackdropUrl(movie, 'w1280');
  
  // Extract data with fallbacks
  const title = movie.title || 'Unknown Title';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = formatRuntime(movie.runtime);
  const genres = movie.genres || [];
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const crew = movie.credits?.crew || [];
  const director = crew.find(person => person.job === 'Director')?.name || 'Unknown';
  const isMovieFavorite = isFavorite(movie.id);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          {!backdropLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
          )}
          <img
            src={backdropUrl}
            alt={`${title} backdrop`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              backdropLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setBackdropLoaded(true)}
            onError={() => setBackdropLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-black/40 to-transparent"></div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-10 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-black/80 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-end space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {!imageLoaded && (
                    <div className="w-64 h-96 bg-gray-700 rounded-xl animate-pulse"></div>
                  )}
                  <img 
                    src={posterUrl}
                    alt={title}
                    className={`w-64 h-96 rounded-xl shadow-2xl object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                  />
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  {title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-xl text-cyan-300 italic mb-4">"{movie.tagline}"</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-xl font-semibold">{rating}</span>
                      <span className="text-gray-300">/10</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{year}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{runtime}</span>
                    </div>
                  )}
                  
                  {movie.production_countries?.length > 0 && (
                    <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span>{movie.production_countries[0].name}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {genres.map((genre) => (
                      <span key={genre.id} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <p className="text-lg text-gray-200 mb-8 max-w-4xl leading-relaxed">
                  {movie.overview || 'No description available for this movie.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-medium">
                    <Play className="w-5 h-5 fill-current" />
                    <span>Watch Trailer</span>
                  </button>
                  
                  <button 
                    onClick={handleFavoriteToggle}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-medium transform hover:scale-105 ${
                      isMovieFavorite
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
                        : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isMovieFavorite ? 'fill-current' : ''}`} />
                    <span>{isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                  
                  <button 
                    onClick={shareMovie}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all font-medium"
                  >
                    <Share className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="py-16 bg-gradient-to-b from-purple-900/50 to-gray-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Synopsis */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.overview || 'No detailed synopsis available for this movie.'}
                </p>
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Users className="w-6 h-6" />
                    <span>Cast</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {cast.map((actor, index) => (
                      <div key={index} className="text-center group">
                        {actor.profile_path ? (
                          <img
                            src={movieService.getImageUrl(actor.profile_path, 'w185')}
                            alt={actor.name}
                            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-lg">
                              {actor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        <p className="text-white font-medium text-sm mb-1">{actor.name}</p>
                        <p className="text-gray-400 text-xs">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Production Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Director</h3>
                    <p className="text-gray-300">{director}</p>
                  </div>
                  
                  {movie.production_companies?.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Production Companies</h3>
                      <p className="text-gray-300">
                        {movie.production_companies.slice(0, 3).map(company => company.name).join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {movie.spoken_languages?.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Languages</h3>
                      <p className="text-gray-300">
                        {movie.spoken_languages.map(lang => lang.english_name || lang.name).join(', ')}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">Status</h3>
                    <p className="text-gray-300">{movie.status || 'Released'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Movie Facts */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Movie Facts</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Release Date</span>
                    <p className="text-white font-medium">{formatDate(movie.release_date)}</p>
                  </div>
                  
                  {movie.budget > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Budget</span>
                      </span>
                      <p className="text-white font-medium">{formatCurrency(movie.budget)}</p>
                    </div>
                  )}
                  
                  {movie.revenue > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Box Office</span>
                      </span>
                      <p className="text-white font-medium">{formatCurrency(movie.revenue)}</p>
                    </div>
                  )}
                  
                  {movie.vote_count > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm">Vote Count</span>
                      <p className="text-white font-medium">{movie.vote_count.toLocaleString()} votes</p>
                    </div>
                  )}
                  
                  {movie.popularity && (
                    <div>
                      <span className="text-gray-400 text-sm">Popularity Score</span>
                      <p className="text-white font-medium">{Math.round(movie.popularity)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Movies */}
              {movie.similar?.results?.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Similar Movies</h3>
                  <div className="space-y-4">
                    {movie.similar.results.slice(0, 3).map((similarMovie) => (
                      <Link
                        key={similarMovie.id}
                        to={`/movie/${similarMovie.id}`}
                        className="flex space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <img 
                          src={movieService.getMoviePosterUrl(similarMovie, 'w92')}
                          alt={similarMovie.title}
                          className="w-12 h-18 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                            {similarMovie.title}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{similarMovie.vote_average?.toFixed(1)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;