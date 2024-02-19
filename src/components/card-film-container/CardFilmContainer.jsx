import { Col, Row, Spin, Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import React from 'react'
import PropTypes from "prop-types";
import CardFilm from '../card-film/CardFilm.jsx'
import MoviesService from '../../services/MoviesService'

export default class CardFilmContainer extends React.Component {
  movieService = new MoviesService()

  static propTypes = {
    movies: PropTypes.array,
    guestSessionId: PropTypes.string,
  };

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      windowWidth: window.innerWidth
    }

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    const { windowWidth } = this.state;

    if (window.innerWidth < 768 && windowWidth > window.innerWidth ||
        window.innerWidth > 768 && windowWidth < window.innerWidth) {
      this.setState({
        windowWidth: window.innerWidth,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.updateMovies()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
      error: false,
    })
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  updateMovies() {
    this.setState({
      loading: true,
    })

    this.movieService
        .getAllMovies()
        .then(this.onMoviesLoaded)
        .catch(this.onError);
  }

  render() {
    const { movies, guestSessionId } = this.props
    const { loading, error, windowWidth } = this.state
    const hasResults = movies && movies.length > 0
    const pairsOfFilms = hasResults
      ? movies.reduce((pairs, film, index) => {
          if (index % 2 === 0) {
            pairs.push([film])
          } else {
            pairs[pairs.length - 1].push(film)
          }
          return pairs
        }, [])
      : [];
    let mobileStyle = {}
    if (windowWidth < 768) {
      mobileStyle = {
        maxWidth: '490px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }

    return (
      <>
        <Online>
          {loading && (
            <Spin
              style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
          {error && (
            <Alert
              message="Ошибка при загрузке данных"
              description="Пожалуйста, попробуйте снова позже."
              type="error"
            />
          )}
          {hasResults ? (
            pairsOfFilms.map((pair, index) => (
              <div key={index}>
                <Row
                  style={{
                    paddingTop: '20px',
                    justifyContent: 'space-between',
                    paddingBottom: '20px',
                    display: 'flex',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                    ...mobileStyle
                  }}
                  gutter={36}
                >
                  {pair.map((film, filmIndex) => (
                    <Col key={filmIndex} xs={24} sm={24} md={12}>
                      <CardFilm guestSessionId={guestSessionId} windowWidth={windowWidth} film={film} />
                    </Col>
                  ))}
                </Row>
              </div>
            ))
          ) : (
            <Alert message="Нет результатов" description="Попробуйте изменить запрос для поиска фильмов." type="info" />
          )}
        </Online>
        <Offline>
          <Alert
            message="Отсутствует подключение к интернету"
            description="Пожалуйста, проверьте ваше соединение и попробуйте снова."
            type="error"
          />
        </Offline>
      </>
    )
  }
}
