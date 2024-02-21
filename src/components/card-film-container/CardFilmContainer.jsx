import { Col, Row, Spin, Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import React from 'react';
import PropTypes from 'prop-types';
import CardFilm from '../card-film/CardFilm.jsx';
import MoviesService from '../../services/MoviesService';
import Utils from '../../utils/Utils';

export default class CardFilmContainer extends React.Component {
  movieService = new MoviesService();

  static propTypes = {
    error: PropTypes.bool,
    movies: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      windowWidth: window.innerWidth
    };

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    const { windowWidth } = this.state;

    if (
      (window.innerWidth < 768 && windowWidth > window.innerWidth) ||
      (window.innerWidth > 768 && windowWidth < window.innerWidth)
    ) {
      this.setState({
        windowWidth: window.innerWidth
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.updateMovies();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
      error: false
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false
    });
  };

  updateMovies() {
    this.setState({
      loading: true
    });

    this.movieService.getAllMovies().then(Utils.transformMovie).then(this.onMoviesLoaded).catch(this.onError);
  }

  render() {
    const { movies } = this.props;
    const error = this.props.error ? this.props.error : this.state.error;

    const { loading, windowWidth } = this.state;
    const hasResults = movies && movies.length > 0;
    const pairsOfFilms = hasResults
      ? movies.reduce((pairs, film, index) => {
          if (index % 2 === 0) {
            pairs.push([film]);
          } else {
            pairs[pairs.length - 1].push(film);
          }
          return pairs;
        }, [])
      : [];
    let mobileStyle = {};
    if (windowWidth < 768) {
      mobileStyle = {
        maxWidth: '490px',
        marginLeft: 'auto',
        marginRight: 'auto'
      };
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
                alignItems: 'center'
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
        </Online>

        {!loading &&
          !error &&
          hasResults &&
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
                    <CardFilm windowWidth={windowWidth} film={film} />
                  </Col>
                ))}
              </Row>
            </div>
          ))}

        {!error && !hasResults && (
          <Alert message="Нет результатов" description="Попробуйте изменить запрос для поиска фильмов." type="info" />
        )}

        <Offline>
          <Alert
            message="Отсутствует подключение к интернету"
            description="Пожалуйста, проверьте ваше соединение и попробуйте снова."
            type="error"
          />
        </Offline>
      </>
    );
  }
}
