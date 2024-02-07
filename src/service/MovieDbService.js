import {format, parse} from "date-fns";
import MovieDbClient from "../client/MovieDbClient";

const MovieDbService = (() => {
    const movieDbClient = new MovieDbClient();
    const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/original';
    const DEFAULT_POSTER_URL = 'https://www.meme-arsenal.com/memes/abf20c10fa78d5417f6cc65f2e3d5c28.jpg';

    const getFormattedDate = (releaseDate) => {
        if (releaseDate.trim().length <= 0) return '';
        const parsedDate = parse(releaseDate, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'MMMM d, yyyy');
    }

    const getPosterPath = (posterPath) => {
        if (posterPath == null || posterPath.trim().length <= 0) return DEFAULT_POSTER_URL;
        return BASE_POSTER_URL + posterPath;
    }

    class Service {
        async getMoviesByKeyword(keyword, page) {
            return movieDbClient.getMoviesByKeyword(keyword, page)
                .then(response => response.json())
                .then(response => {
                    let movies = response.results;
                    movies = movies.map(movie => {
                        const formattedDate = getFormattedDate(movie.release_date);
                        const posterPath = getPosterPath(movie.poster_path);

                        return {
                            movieName: movie.title,
                            posterImg: posterPath,
                            releaseDate: formattedDate,
                            movieGenres: ['Action', 'Drama'],
                            description: movie.overview,
                            voteAverage: movie.vote_average
                        }
                    })

                    return {
                        keyword: keyword,
                        page: response.page,
                        totalPages: response.total_pages,
                        TotalResults: response.total_results,
                        movies: movies
                    }
                })
                .catch(e => {
                    if (e instanceof TypeError && e.message.includes('response.json is not a function')) {
                        return {
                            keyword: keyword,
                            page: 0,
                            totalPages: 0,
                            TotalResults: 0,
                            movies: []
                        };
                    }
                    return {
                        error: e
                    }
                });
        }
    }
    return Service;
})();

export default MovieDbService;