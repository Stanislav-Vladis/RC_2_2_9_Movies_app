import React from 'react';
import {Flex} from 'antd';
import PropTypes from "prop-types";
import MoviePagination from '../movie-pagination/MoviePagination.jsx';
import MovieCard from "../movie-card/MovieCard.jsx";
import MovieMenu from "../movie-menu/MovieMenu.jsx";
import MovieSearchBar from "../movie-search-bar/MovieSearchBar.jsx";
import MovieDbService from "../../service/MovieDbService";
import {AppProvider} from "./AppContext.jsx";
import Utils from "../../utils/Utils";
import SpinLoading from "../spin/SpinLoading.jsx";
import MovieSearchErrorAlert from "../alert/MovieSearchErrorAlert.jsx";
import MovieSearchWarningAlert from "../alert/MovieSearchWarningAlert.jsx";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.movieDbService = new MovieDbService();
  }

  state = {
    movieSearchData: {},
    loading: false,
    error: false,
    emptyAnswer: false
  };

  render() {
    const appValue = {
      setStateApp: (key, value) => {
        this.setState(() => ({
          [key]: value
        }));
      },
      movieDbService: this.movieDbService,
    }
    const movieBoxGap = Utils.isDesktop() ? 20 : 10;
    const movieCardWidth = Utils.isDesktop() ? 480 : 388;
    const boxWidth = Utils.getBoxWidth(movieCardWidth, movieBoxGap);
    const { movieSearchData, loading, error, emptyAnswer} = this.state;

    const boxStyle = {
      width: boxWidth,
      minWidth: movieCardWidth,
      height: '100%',
      borderRadius: 6,
      border: '1px solid #40a9ff'
    };

    const defineContentToDisplay = () => {
      if (error && !emptyAnswer) return <MovieSearchErrorAlert boxWidth={boxWidth} />;
      if (error && emptyAnswer) return <MovieSearchWarningAlert boxWidth={boxWidth} />;
      if (loading) return <SpinLoading boxWidth={boxWidth} />;
      if (Object.keys(movieSearchData).length <= 0 || movieSearchData.movies.length <= 0) return null;
      return <BoxView
          movieBoxGap={movieBoxGap}
          movieCardWidth={movieCardWidth}
          boxStyle={boxStyle}
          movieSearchData={movieSearchData} />
    }

    return (
        <div className="App">
          <AppProvider value={appValue}>
            <Flex style={{minWidth: movieCardWidth}} gap="middle" align="center" vertical>
              <MovieMenu />
              <MovieSearchBar searchBarWidth={boxWidth} />
              {defineContentToDisplay()}
            </Flex>
          </AppProvider>
        </div>
    );
  }
}

class BoxView extends React.Component {
  static propTypes = {
    movieBoxGap: PropTypes.number,
    movieCardWidth: PropTypes.number,
    boxStyle: PropTypes.object,
    movieSearchData: PropTypes.object
  };

  render() {
    const { movieBoxGap, movieCardWidth, boxStyle, movieSearchData} = this.props;

    return (
        <>
          <Flex style={boxStyle} gap={movieBoxGap} wrap="wrap" align="flex-start" justify="flex-start">
            <MovieCard cardWidth={movieCardWidth} movieSearchData={movieSearchData}/>
          </Flex>
          <MoviePagination movieSearchData={movieSearchData} />
        </>
    );
  }
}
