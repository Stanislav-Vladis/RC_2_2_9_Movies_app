import React, { Component } from 'react';
import { Tabs, Layout } from 'antd';
import debounce from 'lodash/debounce';
import './app.scss';
import MoviesService from '../../services/MoviesService';
import { GenreProvider } from '../../services/GenreContext';
import RatedTab from '../rated-tab/RatedTab.jsx';
import SearchTab from '../search-tab/SearchTab.jsx';
import Utils from '../../utils/Utils';

class App extends Component {
  state = {
    searchValue: '',
    movies: [],
    currentPage: 1,
    totalPages: null,
    activeTab: 'search',
    ratedMovies: [],
    error: false
  };

  moviesService = new MoviesService();

  componentDidMount() {
    const getExpiresAt = () => new Date(new Date(localStorage.getItem('lastRequestTime')).getTime() + 25 * 60000);

    if (!localStorage.getItem('guestSessionId') || new Date() > getExpiresAt()) {
      this.moviesService.createGuestSession().then((guestSessionId) => {
        localStorage.setItem('guestSessionId', guestSessionId);
        this.setState({ guestSessionId });
      });
    }
  }

  handleTabChange = async () => {
    const { activeTab } = this.state;

    if (activeTab === 'search') {
      this.setState({ activeTab: 'rated', ratedMovies: [] }, () => {
        this.loadRatedMovies(this.state.ratedCurrentPage);
      });
    } else {
      this.setState({ activeTab: 'search', ratedMovies: [] });
    }
  };

  async loadRatedMovies(page) {
    const { movies } = this.state;

    try {
      const ratedMoviesResponse = Utils.transformMovie(await this.moviesService.getRatedMovies(page), 'ratedMovies');
      const ratedMovies = ratedMoviesResponse.ratedMovies || [];

      const updatedMovies = movies.map((movie) => {
        const ratedMovie = ratedMovies.find((ratedMovie) => ratedMovie.id === movie.id);
        if (ratedMovie) {
          return {
            ...movie,
            rating: ratedMovie.rating
          };
        }
        return movie;
      });

      const ratedTotalPages = ratedMoviesResponse.totalPages;
      this.setState({
        error: false,
        ratedMovies: ratedMovies,
        ratedTotalPages: ratedTotalPages,
        ratedCurrentPage: page,
        movies: updatedMovies
      });
    } catch (error) {
      this.setState({
        error: true
      });
    }
  }

  async loadMovies(searchValue, page) {
    try {
      const data = await this.moviesService.getAllMovies(searchValue, page);
      const { movies, totalPages } = Utils.transformMovie(data);
      this.setState({
        error: false,
        movies: movies,
        totalPages: totalPages
      });
    } catch (error) {
      this.setState({
        error: true
      });
    }
  }

  handleInputChange = async (e) => {
    const searchValue = e.target.value;
    this.setState({ searchValue, currentPage: 1 });

    if (!searchValue) {
      await this.loadMovies('return', 1);
    } else {
      this.debounceSearchMovies(searchValue, 1);
    }
  };

  handlePageChange = async (page) => {
    const { searchValue, activeTab } = this.state;
    this.setState({ currentPage: page });

    if (activeTab === 'search') {
      await this.loadMovies(searchValue, page);
    } else if (activeTab === 'rated') {
      await this.loadRatedMovies(page);
    }
  };

  debounceSearchMovies = debounce(this.loadMovies, 400);

  render() {
    const { currentPage, searchValue, movies, activeTab, ratedMovies, ratedTotalPages, totalPages, ratedCurrentPage } =
      this.state;

    return (
      <GenreProvider>
        <Layout className="app">
          <Tabs
            destroyInactiveTabPane={true}
            centered
            style={{ width: '95%', minWidth: '345px', margin: '0 auto' }}
            defaultActiveKey="1"
            onChange={this.handleTabChange}
          >
            <Tabs.TabPane tab="Search" key="1">
              {activeTab === 'search' && (
                <SearchTab
                  searchValue={searchValue}
                  movies={movies}
                  currentPage={currentPage}
                  totalItems={totalPages}
                  handleInputChange={this.handleInputChange}
                  handlePageChange={this.handlePageChange}
                />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Rated" key="2">
              {activeTab === 'rated' && (
                <RatedTab
                  error={this.state.error}
                  ratedMovies={ratedMovies}
                  currentPage={ratedCurrentPage}
                  ratedTotalPages={ratedTotalPages}
                  handlePageChange={this.handlePageChange}
                />
              )}
            </Tabs.TabPane>
          </Tabs>
        </Layout>
      </GenreProvider>
    );
  }
}

export default App;
