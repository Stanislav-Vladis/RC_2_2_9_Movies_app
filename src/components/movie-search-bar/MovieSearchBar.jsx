import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { AppConsumer } from '../app/AppContext.jsx';

export default class MovieSearchBar extends React.Component {
  static propTypes = {
    searchBarWidth: PropTypes.number
  };

  render() {
    const { searchBarWidth } = this.props;
    const searchBarStyle = {
      width: searchBarWidth
    };

    return (
      <AppConsumer>
        {(appValue) => (
          <Input
            style={searchBarStyle}
            placeholder="Type of search..."
            onChange={(event) => appValue.findMoviesByKeyword(event.target.value)}
          />
        )}
      </AppConsumer>
    );
  }
}
