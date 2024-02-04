import React from 'react';
import { ConfigProvider, Pagination } from 'antd';
import PropTypes from "prop-types";

export default class MoviePagination extends React.Component {
  static propTypes = {
    movieSearchData: PropTypes.object,
    onFindMoviesByKeyword: PropTypes.func
  };

  render() {
    const { movieSearchData, onFindMoviesByKeyword } = this.props;
    const {keyword, totalPages = 0} = movieSearchData;
    const paginationStyle = {
      marginBottom: 15
    }

    const handlePageChange = (page) => {
      if (keyword) {
        onFindMoviesByKeyword(keyword, page);
      }
    };

    return (
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: '#1990ff',
              colorPrimary: '#ffffff',
              colorPrimaryHover: '#ffffff'
            }
          }
        }}
      >
        <Pagination style={paginationStyle} defaultCurrent={1} total={totalPages} showSizeChanger={false} onChange={handlePageChange} />
      </ConfigProvider>
    );
  }
}
