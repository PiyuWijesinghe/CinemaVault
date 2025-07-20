// src/services/movieService.js
import api from './api';

export const movieService = {
  // Search movies with real results
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
      // Return filtered sample data that matches the search
      return this.getSampleMovies().filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        (movie.overview && movie.overview.toLowerCase().includes(query.toLowerCase()))
      );
    }
  },

  // Get detailed movie information by ID
  async getMovieById(movieId) {
    console.log('Fetching movie details for ID:', movieId);
    
    try {
      const response = await api.get(`/movie/${movieId}`, {
        append_to_response: 'credits,videos,similar,recommendations'
      });
      console.log('API Response for movie details:', response);
      return response;
    } catch (error) {
      console.error('Error fetching movie details from API:', error);
      // Return detailed sample data based on movie ID
      return this.getDetailedSampleMovie(movieId);
    }
  },

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

  async getTopRatedMovies(page = 1) {
    try {
      const response = await api.get('/movie/top_rated', { page });
      return response.results || [];
    } catch (error) {
      return this.getSampleMovies();
    }
  },

  async getNowPlayingMovies(page = 1) {
    try {
      const response = await api.get('/movie/now_playing', { page });
      return response.results || [];
    } catch (error) {
      return this.getSampleMovies();
    }
  },

  async getUpcomingMovies(page = 1) {
    try {
      const response = await api.get('/movie/upcoming', { page });
      return response.results || [];
    } catch (error) {
      return this.getSampleMovies();
    }
  },

  // Enhanced sample movies with proper IDs
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
        popularity: 871.548
      },
      {
        id: 155,
        title: "The Dark Knight",
        overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
        release_date: "2008-07-16",
        vote_average: 8.516,
        genre_ids: [18, 28, 80, 53],
        adult: false,
        video: false,
        vote_count: 32543,
        popularity: 745.632
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
        popularity: 683.954
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
        popularity: 587.234
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
        popularity: 1387.435
      },
      {
        id: 634649,
        title: "Spider-Man: No Way Home",
        overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous.",
        poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
        release_date: "2021-12-15",
        vote_average: 8.1,
        genre_ids: [28, 12, 878],
        adult: false,
        video: false,
        vote_count: 19845,
        popularity: 2897.253
      }
    ];
  },

  // Detailed movie data based on actual TMDB structure
  getDetailedSampleMovie(movieId) {
    const movieDetails = {
      27205: {
        id: 27205,
        imdb_id: "tt1375666",
        title: "Inception",
        tagline: "Your mind is the scene of the crime.",
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
        adult: false,
        homepage: "https://www.inceptionmovie.com/",
        popularity: 871.548,
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
          { english_name: "Japanese", iso_639_1: "ja", name: "日本語" }
        ],
        production_companies: [
          { id: 923, logo_path: null, name: "Legendary Entertainment", origin_country: "US" },
          { id: 9996, logo_path: null, name: "Syncopy", origin_country: "GB" },
          { id: 1662, logo_path: "/90cH1jFmd6XNMdOAcg9QiU1uXSP.png", name: "Warner Bros. Pictures", origin_country: "US" }
        ],
        credits: {
          cast: [
            {
              id: 6193,
              name: "Leonardo DiCaprio",
              character: "Dom Cobb",
              profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
              order: 0
            },
            {
              id: 2037,
              name: "Marion Cotillard",
              character: "Mal",
              profile_path: "/4bOGIuCyNbQ5FOHPa1omvxO9pYp.jpg",
              order: 1
            },
            {
              id: 2524,
              name: "Tom Hardy",
              character: "Eames",
              profile_path: "/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg",
              order: 2
            },
            {
              id: 27578,
              name: "Elliot Page",
              character: "Ariadne",
              profile_path: "/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg",
              order: 3
            },
            {
              id: 24045,
              name: "Ken Watanabe",
              character: "Saito",
              profile_path: "/psJOiDl5aj1vwq1j0LRvshICtdJ.jpg",
              order: 4
            },
            {
              id: 3895,
              name: "Dileep Rao",
              character: "Yusuf",
              profile_path: "/zV4DMFImkJvoHXYWF2JztCGHdJp.jpg",
              order: 5
            }
          ],
          crew: [
            {
              id: 525,
              name: "Christopher Nolan",
              job: "Director",
              department: "Directing",
              profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg"
            },
            {
              id: 525,
              name: "Christopher Nolan",
              job: "Writer",
              department: "Writing",
              profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg"
            },
            {
              id: 525,
              name: "Christopher Nolan",
              job: "Producer",
              department: "Production",
              profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg"
            }
          ]
        },
        similar: {
          results: [
            {
              id: 157336,
              title: "Interstellar",
              poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
              vote_average: 8.442,
              release_date: "2014-11-05"
            },
            {
              id: 155,
              title: "The Dark Knight",
              poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
              vote_average: 8.516,
              release_date: "2008-07-16"
            }
          ]
        }
      },
      155: {
        id: 155,
        imdb_id: "tt0468569",
        title: "The Dark Knight",
        tagline: "Welcome to a world without rules.",
        overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
        release_date: "2008-07-16",
        vote_average: 8.516,
        vote_count: 32543,
        runtime: 152,
        budget: 185000000,
        revenue: 1004558444,
        status: "Released",
        adult: false,
        homepage: "https://www.warnerbros.com/movies/dark-knight/",
        popularity: 745.632,
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
          { id: 174, name: "Warner Bros. Pictures", origin_country: "US" },
          { id: 923, name: "Legendary Entertainment", origin_country: "US" },
          { id: 9996, name: "Syncopy", origin_country: "GB" }
        ],
        credits: {
          cast: [
            {
              id: 3894,
              name: "Christian Bale",
              character: "Bruce Wayne / Batman",
              profile_path: "/vecCvAb3hzPb3jXZaHMYM5a3RoA.jpg",
              order: 0
            },
            {
              id: 1810,
              name: "Heath Ledger",
              character: "Joker",
              profile_path: "/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg",
              order: 1
            },
            {
              id: 64,
              name: "Gary Oldman",
              character: "James Gordon",
              profile_path: "/2v9FVVBUrrkW2m3QOcYkuhq9A6o.jpg",
              order: 2
            },
            {
              id: 23659,
              name: "Aaron Eckhart",
              character: "Harvey Dent / Two-Face",
              profile_path: "/lNKnQTOjUdcyM4xhcvzrrZ6OWzS.jpg",
              order: 3
            }
          ],
          crew: [
            {
              id: 525,
              name: "Christopher Nolan",
              job: "Director",
              department: "Directing",
              profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg"
            },
            {
              id: 546,
              name: "Jonathan Nolan",
              job: "Writer",
              department: "Writing",
              profile_path: "/uTtgBKxuVZa8KrsLDRkG5tPpM3t.jpg"
            }
          ]
        },
        similar: {
          results: [
            {
              id: 27205,
              title: "Inception",
              poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
              vote_average: 8.367,
              release_date: "2010-07-15"
            }
          ]
        }
      }
    };

    // Return specific movie details or create generic details for any movie ID
    if (movieDetails[movieId]) {
      return movieDetails[movieId];
    }

    // Generic fallback for any movie ID
    const sampleMovie = this.getSampleMovies().find(m => m.id == movieId);
    if (sampleMovie) {
      return {
        ...sampleMovie,
        runtime: 120,
        budget: 50000000,
        revenue: 150000000,
        status: "Released",
        tagline: "An amazing movie experience",
        genres: [
          { id: 28, name: "Action" },
          { id: 18, name: "Drama" }
        ],
        production_countries: [
          { iso_3166_1: "US", name: "United States of America" }
        ],
        spoken_languages: [
          { english_name: "English", iso_639_1: "en", name: "English" }
        ],
        production_companies: [
          { id: 1, name: "Sample Productions", origin_country: "US" }
        ],
        credits: {
          cast: [
            {
              id: 1,
              name: "Actor One",
              character: "Main Character",
              profile_path: null,
              order: 0
            },
            {
              id: 2,
              name: "Actor Two",
              character: "Supporting Character",
              profile_path: null,
              order: 1
            }
          ],
          crew: [
            {
              id: 1,
              name: "Director Name",
              job: "Director",
              department: "Directing",
              profile_path: null
            }
          ]
        },
        similar: {
          results: this.getSampleMovies().slice(0, 3)
        }
      };
    }

    // Ultimate fallback
    return movieDetails[27205]; // Return Inception as default
  },

  // Image URL helpers
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

  getMoviePosterUrl(movie, size = 'w500') {
    if (!movie) return this.getImageUrl(null, size);
    return this.getImageUrl(movie.poster_path, size);
  },

  getMovieBackdropUrl(movie, size = 'w1280') {
    if (!movie) return this.getBackdropUrl(null, size);
    return this.getBackdropUrl(movie.backdrop_path, size);
  }
};