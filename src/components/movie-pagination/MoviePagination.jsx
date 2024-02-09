import React from 'react';
import { ConfigProvider, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { AppConsumer } from '../app/AppContext.jsx';

export default class MoviePagination extends React.Component {
  static propTypes = {
    activeTab: PropTypes.string,
    movieSearchData: PropTypes.object
  };

  render() {
    const { activeTab, movieSearchData } = this.props;
    const { keyword, totalPages } = movieSearchData;

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
        <AppConsumer>
          {(appValue) => (
            <Pagination
              style={{ marginBottom: 15 }}
              defaultCurrent={1}
              total={totalPages}
              showSizeChanger={false}
              onChange={(page) => {
                if (activeTab === 'search') appValue.findMoviesByKeyword(keyword, page);
                if (activeTab === 'rated') appValue.findRatingMovies(keyword, page);
              }}
            />
          )}
        </AppConsumer>
      </ConfigProvider>
    );
  }
}
