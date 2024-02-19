import React, { Component } from 'react'
import { Tabs, Layout } from 'antd'
import debounce from 'lodash/debounce'
import './app.scss'
import MoviesService from '../../services/MoviesService'
import { GenreProvider } from '../../services/GenreContext'
import RatedTab from '../rated-tab/RatedTab.jsx'
import SearchTab from '../search-tab/SearchTab.jsx'

class App extends Component {
  state = {
    searchValue: '',
    movies: [],
    currentPage: 1,
    totalPages: null,
    guestSessionId: null,
    activeTab: 'search',
    ratedMovies: [],
  }

  moviesService = new MoviesService()

  handleTabChange = async () => {
    const { activeTab } = this.state

    if (activeTab === 'search') {
      this.setState({ activeTab: 'rated', ratedMovies: [] }, () => {
        this.loadRatedMovies(this.state.ratedCurrentPage)
      })
    } else {
      this.setState({ activeTab: 'search', ratedMovies: [] })
    }
  }

  async loadRatedMovies(page) {
    const { guestSessionId, movies } = this.state

    try {
      const ratedMoviesResponse = await this.moviesService.getRatedMovies(guestSessionId, page)
      const ratedMovies = ratedMoviesResponse.ratedMovies || []

      const updatedMovies = movies.map((movie) => {
        const ratedMovie = ratedMovies.find((ratedMovie) => ratedMovie.id === movie.id)
        if (ratedMovie) {
          return {
            ...movie,
            rating: ratedMovie.rating,
          }
        }
        return movie
      })

      const ratedTotalPages = ratedMoviesResponse.totalPages
      this.setState({ ratedMovies, ratedTotalPages, ratedCurrentPage: page, movies: updatedMovies })
    } catch (error) {
      console.error('Ошибка загрузки рейтинговых фильмов:', error)
    }
  }

  async loadMovies(searchValue, page) {
    try {
      const data = await this.moviesService.getAllMovies(searchValue, page)
      const { movies, totalPages } = data
      this.setState({ movies, totalPages })
    } catch (error) {
      console.error(error)
    }
  }

  handleInputChange = async (e) => {
    const searchValue = e.target.value
    this.setState({ searchValue, currentPage: 1 })

    if (!searchValue) {
      await this.loadMovies('return', 1)
    } else {
      this.debounceSearchMovies(searchValue, 1)
    }
  }

  handlePageChange = async (page) => {
    const { searchValue, activeTab } = this.state
    this.setState({ currentPage: page })

    if (activeTab === 'search') {
      await this.loadMovies(searchValue, page)
    } else if (activeTab === 'rated') {
      await this.loadRatedMovies(page)
    }
  }

  debounceSearchMovies = debounce(this.loadMovies, 400)

  async componentDidMount() {
    const guestSessionId = await this.moviesService.createGuestSession()
    this.setState({ guestSessionId })
  }

  render() {
    const {
      currentPage,
      searchValue,
      movies,
      activeTab,
      guestSessionId,
      ratedMovies,
      ratedTotalPages,
      totalPages,
      ratedCurrentPage,
    } = this.state

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
                  guestSessionId={guestSessionId}
                  totalItems={totalPages}
                  handleInputChange={this.handleInputChange}
                  handlePageChange={this.handlePageChange}
                />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Rated" key="2">
              {activeTab === 'rated' && (
                <RatedTab
                  ratedMovies={ratedMovies}
                  currentPage={ratedCurrentPage}
                  guestSessionId={guestSessionId}
                  ratedTotalPages={ratedTotalPages}
                  handlePageChange={this.handlePageChange}
                />
              )}
            </Tabs.TabPane>
          </Tabs>
        </Layout>
      </GenreProvider>
    )
  }
}

export default App
