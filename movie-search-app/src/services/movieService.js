// src/services/movieService.js
import api from './api';

export const movieService = {
  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const response = await api.get('/movie/popular', { page });
      return response.results || [];
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return this.getSampleMovies();
    }
  },

  // Get top rated movies
  async getTopRatedMovies(page = 1) {
    try {
      const response = await api.get('/movie/top_rated', { page });
      return response.results || [];
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return this.getSampleMovies();
    }
  },

  // Get now playing movies
  async getNowPlayingMovies(page = 1) {
    try {
      const response = await api.get('/movie/now_playing', { page });
      return response.results || [];
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return this.getSampleMovies();
    }
  },

  // Get upcoming movies
  async getUpcomingMovies(page = 1) {
    try {
      const response = await api.get('/movie/upcoming', { page });
      return response.results || [];
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return this.getSampleMovies();
    }
  },

  // Get movies by category
  async getMovies(category = 'popular', page = 1) {
    const categoryMap = {
      popular: this.getPopularMovies,
      top_rated: this.getTopRatedMovies,
      now_playing: this.getNowPlayingMovies,
      upcoming: this.getUpcomingMovies
    };

    const fetchFunction = categoryMap[category] || this.getPopularMovies;
    return await fetchFunction.call(this, page);
  },

  // Get movie details by ID
  async getMovieById(movieId) {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        append_to_response: 'credits,videos,similar'
      });
      return response;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return this.getSampleMovieDetails(movieId);
    }
  },

  // Search movies
  async searchMovies(query, page = 1) {
    if (!query || !query.trim()) {
      return [];
    }

    try {
      const response = await api.get('/search/movie', { 
        query: query.trim(),
        page 
      });
      return response.results || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      // Return filtered sample data if API fails
      return this.getSampleMovies().filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        (movie.overview && movie.overview.toLowerCase().includes(query.toLowerCase()))
      );
    }
  },

  // Get movies by genre
  async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await api.get('/discover/movie', {
        with_genres: genreId,
        page
      });
      return response.results || [];
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return this.getSampleMovies();
    }
  },

  // Get movie genres
  async getGenres() {
    try {
      const response = await api.get('/genre/movie/list');
      return response.genres || [];
    } catch (error) {
      console.error('Error fetching genres:', error);
      return this.getSampleGenres();
    }
  },

  // Sample data with REAL movie images from TMDB
  getSampleMovies() {
    return [
      {
        id: 27205,
        title: "Inception",
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        release_date: "2010-07-15",
        vote_average: 8.367,
        genre_ids: [28, 878, 53],
        adult: false,
        video: false,
        vote_count: 35428,
        popularity: 71.548
      },
      {
        id: 155,
        title: "The Dark Knight",
        overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
        release_date: "2008-07-16",
        vote_average: 8.516,
        genre_ids: [18, 28, 80, 53],
        adult: false,
        video: false,
        vote_count: 32543,
        popularity: 145.632
      },
      {
        id: 157336,
        title: "Interstellar",
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
        release_date: "2014-11-05",
        vote_average: 8.442,
        genre_ids: [12, 18, 878],
        adult: false,
        video: false,
        vote_count: 35021,
        popularity: 183.954
      },
      {
        id: 496243,
        title: "Parasite",
        overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        backdrop_path: "/TU9NIjwzjoKPwQHoHshkBcQZzr.jpg",
        release_date: "2019-05-30",
        vote_average: 8.506,
        genre_ids: [35, 53, 18],
        adult: false,
        video: false,
        vote_count: 17695,
        popularity: 87.234
      },
      {
        id: 438631,
        title: "Dune",
        overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
        poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
        backdrop_path: "/iopYFx1ifwWBTzCMy3nWLdZqfKc.jpg",
        release_date: "2021-09-15",
        vote_average: 7.787,
        genre_ids: [878, 12],
        adult: false,
        video: false,
        vote_count: 11859,
        popularity: 387.435
      },
      {
        id: 634649,
        title: "Spider-Man: No Way Home",
        overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
        poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
        release_date: "2021-12-15",
        vote_average: 8.1,
        genre_ids: [28, 12, 878],
        adult: false,
        video: false,
        vote_count: 19845,
        popularity: 1897.253
      },
      {
        id: 76600,
        title: "Avatar: The Way of Water",
        overview: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
        poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        backdrop_path: "/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
        release_date: "2022-12-14",
        vote_average: 7.619,
        genre_ids: [878, 12, 14],
        adult: false,
        video: false,
        vote_count: 11639,
        popularity: 2587.963
      },
      {
        id: 361743,
        title: "Top Gun: Maverick",
        overview: "After more than thirty years of service as one of the Navy's top aviators, and dodging the advancement in rank that would ground him, Pete 'Maverick' Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
        poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
        backdrop_path: "/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
        release_date: "2022-05-24",
        vote_average: 8.318,
        genre_ids: [28, 18],
        adult: false,
        video: false,
        vote_count: 8954,
        popularity: 567.834
      }
    ];
  },

  getSampleMovieDetails(movieId) {
    const movies = {
      27205: {
        id: 27205,
        title: "Inception",
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        release_date: "2010-07-15",
        vote_average: 8.367,
        vote_count: 35428,
        runtime: 148,
        budget: 160000000,
        revenue: 836836967,
        status: "Released",
        tagline: "Your mind is the scene of the crime.",
        genres: [
          { id: 28, name: "Action" },
          { id: 878, name: "Science Fiction" },
          { id: 53, name: "Thriller" }
        ],
        production_countries: [
          { iso_3166_1: "GB", name: "United Kingdom" },
          { iso_3166_1: "US", name: "United States of America" }
        ],
        spoken_languages: [
          { english_name: "English", iso_639_1: "en", name: "English" },
          { english_name: "Japanese", iso_639_1: "ja", name: "日本語" },
          { english_name: "French", iso_639_1: "fr", name: "Français" }
        ],
        production_companies: [
          { id: 923, name: "Legendary Entertainment" },
          { id: 9996, name: "Syncopy" },
          { id: 1662, name: "Warner Bros. Pictures" }
        ],
        credits: {
          cast: [
            { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
            { id: 2037, name: "Marion Cotillard", character: "Mal", profile_path: "/4bOGIuCyNbQ5FOHPa1omvxO9pYp.jpg" },
            { id: 2524, name: "Tom Hardy", character: "Eames", profile_path: "/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg" },
            { id: 27578, name: "Elliot Page", character: "Ariadne", profile_path: "/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg" }
          ],
          crew: [
            { id: 525, name: "Christopher Nolan", job: "Director", department: "Directing" },
            { id: 525, name: "Christopher Nolan", job: "Writer", department: "Writing" }
          ]
        },
        similar: {
          results: [
            {
              id: 157336,
              title: "Interstellar",
              poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
              vote_average: 8.442
            },
            {
              id: 155,
              title: "The Dark Knight",
              poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
              vote_average: 8.516
            }
          ]
        }
      },
      155: {
        id: 155,
        title: "The Dark Knight",
        overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
        release_date: "2008-07-16",
        vote_average: 8.516,
        vote_count: 32543,
        runtime: 152,
        budget: 185000000,
        revenue: 1004558444,
        status: "Released",
        tagline: "Welcome to a world without rules.",
        genres: [
          { id: 18, name: "Drama" },
          { id: 28, name: "Action" },
          { id: 80, name: "Crime" },
          { id: 53, name: "Thriller" }
        ],
        production_countries: [
          { iso_3166_1: "US", name: "United States of America" },
          { iso_3166_1: "GB", name: "United Kingdom" }
        ],
        spoken_languages: [
          { english_name: "English", iso_639_1: "en", name: "English" }
        ],
        production_companies: [
          { id: 174, name: "Warner Bros. Pictures" },
          { id: 923, name: "Legendary Entertainment" },
          { id: 9996, name: "Syncopy" }
        ],
        credits: {
          cast: [
            { id: 3894, name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "/vecCvAb3hzPb3jXZaHMYM5a3RoA.jpg" },
            { id: 1810, name: "Heath Ledger", character: "Joker", profile_path: "/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg" },
            { id: 64, name: "Gary Oldman", character: "James Gordon", profile_path: "/2v9FVVBUrrkW2m3QOcYkuhq9A6o.jpg" },
            { id: 23659, name: "Aaron Eckhart", character: "Harvey Dent / Two-Face", profile_path: "/lNKnQTOjUdcyM4xhcvzrrZ6OWzS.jpg" }
          ],
          crew: [
            { id: 525, name: "Christopher Nolan", job: "Director", department: "Directing" },
            { id: 546, name: "Jonathan Nolan", job: "Writer", department: "Writing" }
          ]
        },
        similar: {
          results: [
            {
              id: 27205,
              title: "Inception",
              poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
              vote_average: 8.367
            }
          ]
        }
      }
    };

    // Return specific movie details or fallback to first movie
    return movies[movieId] || movies[27205];
  },

  getSampleGenres() {
    return [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 10770, name: 'TV Movie' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' }
    ];
  },

  // Image URL helpers - REAL IMAGES from TMDB
  getImageUrl(path, size = 'w500') {
    if (!path) {
      return `https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image`;
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  getBackdropUrl(path, size = 'w1280') {
    if (!path) {
      return `https://via.placeholder.com/1280x720/1f2937/ffffff?text=No+Backdrop`;
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Get full image URL for any movie object
  getMoviePosterUrl(movie, size = 'w500') {
    if (!movie) return this.getImageUrl(null, size);
    return this.getImageUrl(movie.poster_path, size);
  },

  getMovieBackdropUrl(movie, size = 'w1280') {
    if (!movie) return this.getBackdropUrl(null, size);
    return this.getBackdropUrl(movie.backdrop_path, size);
  },

  // Format helpers
  formatCurrency(amount) {
    if (!amount || amount === 0) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  formatRuntime(minutes) {
    if (!minutes || minutes === 0) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}min`;
    return `${hours}h ${remainingMinutes}min`;
  },

  formatDate(dateString) {
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
  }
};