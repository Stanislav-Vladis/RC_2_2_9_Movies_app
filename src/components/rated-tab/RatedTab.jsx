import React from 'react'
import { Pagination } from 'antd'
import PropTypes from "prop-types";
import CardFilmContainer from '../card-film-container/CardFilmContainer.jsx'

const RatedTab = (props) => {
  const { ratedMovies, currentPage = 1, guestSessionId, ratedTotalPages = 100, handlePageChange } = props

  return (
    <>
      <CardFilmContainer guestSessionId={guestSessionId} movies={ratedMovies} />
      {ratedTotalPages > 1 && (
        <Pagination
          itemActiveBg={'#000'}
          style={{ margin: '17px auto 36px auto' }}
          defaultCurrent={1}
          current={currentPage}
          total={ratedTotalPages * 10}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      )}
    </>
  )
}

RatedTab.propTypes = {
  ratedMovies: PropTypes.array,
  currentPage: PropTypes.number,
  guestSessionId: PropTypes.string,
  ratedTotalPages: PropTypes.number,
  handlePageChange: PropTypes.func,
};

export default RatedTab
