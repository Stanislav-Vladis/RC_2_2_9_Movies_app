import React from 'react'
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'
import PropTypes from "prop-types";
import './card-film.scss'
import MoviesService from '../../services/MoviesService'
import CardFilmMobile from "./CardFilmMobile.jsx";
import CardFilmDesktop from "./CardFilmDesktop.jsx";

export default class CardFilm extends React.Component {
  movieService = new MoviesService()

  static propTypes = {
    windowWidth: PropTypes.number,
    film: PropTypes.object,
    ratedMovies: PropTypes.object,
    onRateFilm: PropTypes.func
  };

  truncateText(text, maxCharacters) {
    if (text.length <= maxCharacters) return text

    const words = text.split(' ')
    const truncatedText = words.slice(0, maxCharacters).join(' ')
    return `${truncatedText  }...`
  }

  getRatingColor(rating) {
    if (rating > 0 && rating < 3) return '#E9000'
    if (rating >= 3 && rating < 5) return '#E97E00'
    if (rating >= 5 && rating < 7) return '#E9D100'
    return '#66E900'
  }

  handleRateFilm = async (value) => {
    try {
      const { film } = this.props
      await this.movieService.addRating(film.id, value)
      const { ratedMovies } = this.props
      if (ratedMovies && ratedMovies.length > 0) {
        const movieIndex = ratedMovies.findIndex((movie) => movie.id === film.id)

        if (movieIndex !== -1) {
          ratedMovies[movieIndex].userRating = value
        }
      }
    } catch (error) {
      console.error('Ошибка при установке оценки фильма:', error)
    }
  }

  render() {
    const { windowWidth } = this.props;
    const { title, overview, releaseDate, voteAverage } = this.props.film
    const roundedRating = parseFloat(voteAverage.toFixed(1))
    const ratingColor = this.getRatingColor(roundedRating)
    const formattedDate = releaseDate
      ? format(parseISO(releaseDate), 'MMMM dd, yyyy', { locale: enGB })
      : 'Дата не указана'
    const truncatedTitle = this.truncateText(title, 3);
    const truncatedOverview = this.truncateText(overview, 15);

    return windowWidth < 768 ?
        <CardFilmMobile
            film={this.props.film}
            ratingColor={ratingColor}
            formattedDate={formattedDate}
            truncatedTitle={truncatedTitle}
            truncatedOverview={truncatedOverview}
            roundedRating={roundedRating}
            handleRateFilm={this.handleRateFilm}
        />
        : <CardFilmDesktop
            film={this.props.film}
            ratingColor={ratingColor}
            formattedDate={formattedDate}
            truncatedTitle={truncatedTitle}
            truncatedOverview={truncatedOverview}
            roundedRating={roundedRating}
            handleRateFilm={this.handleRateFilm}
        />;
  }
}
