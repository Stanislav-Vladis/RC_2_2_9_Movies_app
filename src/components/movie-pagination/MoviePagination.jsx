import React from 'react';
import { ConfigProvider, Pagination } from 'antd';
import PropTypes from "prop-types";
import {AppConsumer} from "../app/AppContext.jsx";

export default class MoviePagination extends React.Component {
  static propTypes = {
    movieSearchData: PropTypes.object,
    onFindMoviesByKeyword: PropTypes.func
  };

  render() {
    const { movieSearchData } = this.props;
    const {keyword, totalPages = 0} = movieSearchData;

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
            {
              (appValue) => (
                  <Pagination style={{marginBottom: 15}} defaultCurrent={1} total={totalPages} showSizeChanger={false}
                              onChange={(page) => appValue.findMoviesByKeyword(keyword, page)}/>
              )
            }
          </AppConsumer>
        </ConfigProvider>
    );
  }
}
