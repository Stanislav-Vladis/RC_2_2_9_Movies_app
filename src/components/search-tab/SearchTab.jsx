import React from 'react'
import { Input, Pagination } from 'antd'
import PropTypes from "prop-types";
import CardFilmContainer from '../card-film-container/CardFilmContainer.jsx'

const SearchTab = (props) => {
  const {
      searchValue,
      movies,
      currentPage,
      totalItems,
      handleInputChange,
      handlePageChange
  } = props

  return (
    <>
      <Input
        value={searchValue}
        placeholder="Type to search..."
        style={{ width: '100%', margin: '0 auto', marginBottom: '20px' }}
        onChange={handleInputChange}
      />
      <CardFilmContainer movies={movies} />
      <Pagination
        itemActiveBg={'#000'}
        style={{ margin: '17px auto 36px auto', textAlign: 'center' }}
        defaultCurrent={1}
        current={currentPage}
        total={totalItems * 10}
        showSizeChanger={false}
        onChange={handlePageChange}
      />
    </>
  )
}

SearchTab.propTypes = {
    searchValue: PropTypes.string,
    movies: PropTypes.array,
    currentPage: PropTypes.number,
    totalItems: PropTypes.number,
    handleInputChange: PropTypes.func,
    handlePageChange: PropTypes.func,
};

export default SearchTab
