import React from 'react'
import { Pagination } from 'antd'
import PropTypes from "prop-types";
import CardFilmContainer from '../card-film-container/CardFilmContainer.jsx'

const RatedTab = (props) => {
  const { ratedMovies, currentPage = 1, ratedTotalPages = 1, handlePageChange } = props

  return (
    <>
      <CardFilmContainer error={props.error} movies={ratedMovies} />
      {ratedTotalPages >= 1 && (
        <Pagination
          itemActiveBg={'#000'}
          style={{ margin: '17px auto 36px auto', textAlign: 'center' }}
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
  error: PropTypes.bool,
  ratedMovies: PropTypes.array,
  currentPage: PropTypes.number,
  ratedTotalPages: PropTypes.number,
  handlePageChange: PropTypes.func,
};

export default RatedTab
