import React from 'react';
import { Flex } from 'antd';
import PropTypes from 'prop-types';
import MoviePagination from '../movie-pagination/MoviePagination.jsx';
import MovieCard from '../movie-card/MovieCard.jsx';
import MovieMenu from '../movie-menu/MovieMenu.jsx';
import MovieSearchBar from '../movie-search-bar/MovieSearchBar.jsx';
import MovieDbService from '../../service/MovieDbService';
import { AppProvider } from './AppContext.jsx';
import Utils from '../../utils/Utils';
import SpinLoading from '../spin/SpinLoading.jsx';
import MovieSearchErrorAlert from '../alert/MovieSearchErrorAlert.jsx';
import MovieSearchWarningAlert from '../alert/MovieSearchWarningAlert.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.movieDbService = new MovieDbService();
  }

  state = {
    activeTab: 'search',
    movieSearchData: {},
    movieGenres: {},
    containerDisplayMode: {
      loading: false,
      error: false,
      emptyAnswer: false
    }
  };

  componentDidMount() {
    //Сессия перестает быть рабочий если 30 минут не было никаких обращений (настройки сервера)
    const getExpiresAt = () => new Date(new Date(localStorage.getItem('lastRequestTime')).getTime() + 25 * 60000);

    if (!localStorage.getItem('guestSessionId') || new Date() > getExpiresAt()) {
      this.movieDbService.createGuestSession().then((response) => {
        localStorage.setItem('guestSessionId', response.guest_session_id);
      });
    }

    if (localStorage.getItem('guestSessionId') && !sessionStorage.getItem('ratingData'))
      this.movieDbService.getAllRatingMovies().then();

    if (!Object.keys(this.state.movieGenres) <= 0) {
      this.movieDbService.getMovieGenres().then((movieGenres) => {
        this.setState(() => ({
          movieGenres: movieGenres
        }));
      });
    }
  }

  render() {
    const appValue = {
      getStateApp: (key) => this.state[key],
      setStateApp: (key, value) => {
        this.setState(() => ({
          [key]: value
        }));
      },
      movieDbService: this.movieDbService
    };
    const dimensions = {
      movieBoxGap: Utils.isDesktop() ? 20 : 10,
      movieCardWidth: Utils.isDesktop() ? 480 : 388
    };
    dimensions.boxWidth = Utils.getBoxWidth(dimensions.movieCardWidth, dimensions.movieBoxGap);
    const { activeTab, movieSearchData, containerDisplayMode } = this.state;

    return (
      <div className="App">
        <AppProvider value={appValue}>
          <Flex style={{ minWidth: dimensions.movieCardWidth }} gap="middle" align="center" vertical>
            <MovieMenu movieSearchData={movieSearchData} />
            <MovieSearchBar searchBarWidth={dimensions.boxWidth} />
            <ContentDisplayTool
              dimensions={dimensions}
              movieSearchData={movieSearchData}
              containerDisplayMode={containerDisplayMode}
            />
            <MoviePagination activeTab={activeTab} movieSearchData={movieSearchData} />
          </Flex>
        </AppProvider>
      </div>
    );
  }
}

class ContentDisplayTool extends React.Component {
  static propTypes = {
    dimensions: PropTypes.object,
    movieSearchData: PropTypes.object,
    containerDisplayMode: PropTypes.object
  };

  render() {
    const { dimensions, movieSearchData, containerDisplayMode } = this.props;

    const boxStyle = {
      width: dimensions.boxWidth,
      minWidth: dimensions.movieCardWidth,
      height: '100%'
    };

    const defineContentToDisplay = () => {
      if (containerDisplayMode.error && !containerDisplayMode.emptyAnswer) return <MovieSearchErrorAlert boxWidth={dimensions.boxWidth} />;
      if (containerDisplayMode.error && containerDisplayMode.emptyAnswer) return <MovieSearchWarningAlert boxWidth={dimensions.boxWidth} />;
      if (containerDisplayMode.loading) return <SpinLoading boxWidth={dimensions.boxWidth} />;
      if (Object.keys(movieSearchData).length <= 0 || Object.keys(movieSearchData.movies).length <= 0) return null;
      return (
        <>
          <Flex style={boxStyle} gap={dimensions.movieBoxGap} wrap="wrap" align="flex-start" justify="flex-start">
            <MovieCard cardWidth={dimensions.movieCardWidth} movieSearchData={movieSearchData} />
          </Flex>
        </>
      );
    };

    return <>{defineContentToDisplay()}</>;
  }
}
