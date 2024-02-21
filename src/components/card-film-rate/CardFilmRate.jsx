import React from 'react'
import { Rate as AntdRate } from 'antd'
import PropTypes from "prop-types";
import MoviesService from '../../services/MoviesService'

class CardFilmRate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userRating: null,
      hasRated: false,
    }
    this.movieService = new MoviesService()
  }

  static propTypes = {
    film: PropTypes.object
  };

  handleRateFilm = async (value) => {
    try {
      if (this.state.hasRated) {
        return
      }
      const { film } = this.props
      await this.movieService.addRating(film.id, value)
      this.setState({ userRating: value, hasRated: true })
    } catch (error) {
      console.error('Ошибка при установке оценки фильма:', error)
    }
  }

  render() {
    const { userRating } = this.state
    return (
      <AntdRate value={userRating} onChange={this.handleRateFilm} count={10} allowHalf style={{ marginTop: '12px' }} />
    )
  }
}

export default CardFilmRate
