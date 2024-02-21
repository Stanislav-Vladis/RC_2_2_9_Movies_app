export default class Utils {

  static transformMovie(data, key = 'movies') {

    const transform = (movie) => {
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
        voteAverage: movie.vote_average,
        genreIds: movie.genre_ids,
        rating: movie.rating,
      }
    }

    if (data && data.results) {
      const movies = data.results.map(transform);
      return {
        [key]: movies,
        totalPages: data.total_pages,
      }
    }
    return {
      [key]: [],
      totalPages: 0,
    }
  }
}
