import React from 'react';
import {Flex} from 'antd';
import MoviePagination from './movie-pagination/MoviePagination.jsx';
import MovieCard from "./movie-card/MovieCard.jsx";
import MovieMenu from "./movie-menu/MovieMenu.jsx";
import MovieSearchBar from "./movie-search-bar/MovieSearchBar.jsx";
import MovieDbService from "../service/MovieDbService";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.movieDbService = new MovieDbService();
  }

  state = {
    movieSearchData: {}
  };

  render() {
    const isDesktop = () => window.innerWidth >= 1200
    const movieBoxGap = isDesktop() ? 20 : 10;
    const movieCardWidth = isDesktop() ? 480 : 388;
    const { movieSearchData } = this.state;

    const calcBoxWidth = () => {
      const countMovieBox = Math.max(1, Math.floor(window.innerWidth / movieCardWidth));
      const totalWidthOfMovieBox = countMovieBox * movieCardWidth + (countMovieBox - 1) * movieBoxGap;
      return Math.floor(totalWidthOfMovieBox);
    }

    const findMoviesByKeyword = (keyword, page) => {
      this.movieDbService.getMoviesByKeyword(keyword, page).then(newMovieSearchData => {
        console.log(newMovieSearchData);
        this.setState(() => ({
          movieSearchData: newMovieSearchData
        }));
      });
    }

    const boxStyle = {
      width: calcBoxWidth(),
      minWidth: movieCardWidth,
      height: '100%',
      borderRadius: 6,
      border: '1px solid #40a9ff'
    };

    return (
        <div className="App">
          <Flex style={{minWidth: movieCardWidth}} gap="middle" align="center" vertical>
            <MovieMenu />
            <MovieSearchBar calcBoxWidth={calcBoxWidth()} onFindMoviesByKeyword={findMoviesByKeyword} />
            <Flex style={boxStyle} gap={movieBoxGap} wrap="wrap" align="flex-start" justify="flex-start">
              <MovieCard cardWidth={movieCardWidth} movieSearchData={movieSearchData} isDesktop={isDesktop()}/>
            </Flex>
            <MoviePagination movieSearchData={movieSearchData} onFindMoviesByKeyword={findMoviesByKeyword} />
          </Flex>
        </div>
    );
  }
}
