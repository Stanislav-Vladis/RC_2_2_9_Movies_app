import { format, parse } from 'date-fns';
import MovieDbClient from '../client/MovieDbClient';

const MovieDbService = (() => {
  const movieDbClient = new MovieDbClient();
  const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/original';
  const DEFAULT_POSTER_URL = 'https://www.meme-arsenal.com/memes/abf20c10fa78d5417f6cc65f2e3d5c28.jpg';

  const getFormattedDate = (releaseDate) => {
    if (releaseDate.trim().length <= 0) return '';
    const parsedDate = parse(releaseDate, 'yyyy-MM-dd', new Date());
    return format(parsedDate, 'MMMM d, yyyy');
  };

  const getPosterPath = (posterPath) => {
    if (posterPath == null || posterPath.trim().length <= 0) return DEFAULT_POSTER_URL;
    return BASE_POSTER_URL + posterPath;
  };

  const buildMovieRatingData = (streaming) => {
    const data = sessionStorage.getItem('ratingData') ? JSON.parse(sessionStorage.getItem('ratingData')) : {};

    streaming.forEach((rating) => {
      data[rating.id] = rating.rating;
    });

    sessionStorage.setItem('ratingData', JSON.stringify(data));
  };

  const buildMoviesData = (keyword, promiseData, movieGenres) => {
    return promiseData
      .then((response) => {
        const buildMovies = {};
        response.results.forEach((movie) => {
          const formattedDate = getFormattedDate(movie.release_date);
          const posterPath = getPosterPath(movie.poster_path);
          const ratingData = sessionStorage.getItem('ratingData')
            ? JSON.parse(sessionStorage.getItem('ratingData')) : {};
          const buildGenres = movie.genre_ids.map((id) => movieGenres[id]);

          buildMovies[movie.id] = {
            id: movie.id,
            movieName: movie.title,
            posterImg: posterPath,
            releaseDate: formattedDate,
            movieGenres: buildGenres,
            description: movie.overview,
            voteAverage: movie.vote_average,
            myRate: ratingData[movie.id] ? ratingData[movie.id] : 0
          };
        });
        const requestStatus = Object.keys(buildMovies).length <= 0 && keyword ? 'emptyAnswer' : 'ok';

        return {
          keyword: keyword,
          page: response.page,
          totalPages: response.total_pages,
          TotalResults: response.total_results,
          movies: buildMovies,
          requestStatus: requestStatus
        };
      })
      .catch((e) => {
        console.error(e);
        if (e instanceof TypeError && e.message.includes('response.json is not a function')) {
          return {
            keyword: keyword,
            page: 0,
            totalPages: 0,
            TotalResults: 0,
            movies: {},
            requestStatus: 'ok'
          };
        }
        return {
          requestStatus: 'error'
        };
      });
  };

  class Service {
    async createGuestSession() {
      return movieDbClient
        .createGuestSession()
        .then((response) => response.json())
        .then((response) => {
          if (!response.success) throw new Error('Ошибка создания гостевой сессии');
          return response;
        })
        .catch((e) => {
          console.error('Не смогли получить гостевую сессию', e);
          return {};
        });
    }

    async getMoviesByKeyword(keyword, page, movieGenres = {}) {
      const promiseData = movieDbClient.getMoviesByKeyword(keyword, page).then((response) => response.json());
      return buildMoviesData(keyword, promiseData, movieGenres);
    }

    async addRatingForMovie(id, rate) {
      return movieDbClient
        .addRatingForMovie(id, rate)
        .then((response) => response.json())
        .then((response) => {
          if (!response.success) throw new Error('Ошибка выставления рейтинга');
          buildMovieRatingData([{ id: id, rating: rate }]);
          return response;
        })
        .catch((e) => {
          console.error('Не смогли выставить рейтинг', e);
          return {};
        });
    }

    async getAllRatingMovies(page = 1) {
      await movieDbClient
        .getRatingMovies(page)
        .then((response) => response.json())
        .then(async (response) => {
          if (response.total_pages > page) await this.getAllRatingMovies(page + 1);
          buildMovieRatingData(response.results);
        })
        .catch((e) => {
          console.error('Не смогли получить фильмы с рейтингом', e);
          return {};
        });
      return JSON.parse(sessionStorage.getItem('ratingData'));
    }

    async getRatingMovies(keyword, page = 1, movieGenres = {}) {
      const promiseData = movieDbClient.getRatingMovies(page).then((response) => response.json());
      return buildMoviesData(keyword, promiseData, movieGenres);
    }

    async getMovieGenres() {
      return movieDbClient
        .getMovieGenres()
        .then((response) => response.json())
        .then((response) => {
          const buildGenres = {};
          response.genres.forEach((genre) => {
            buildGenres[genre.id] = genre.name;
          });
          return buildGenres;
        })
        .catch((e) => {
          console.error('Не смогли получить жанры', e);
          return {};
        });
    }
  }
  return Service;
})();

export default MovieDbService;
