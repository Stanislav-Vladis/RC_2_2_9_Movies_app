import React from 'react';
import {Input} from 'antd';
import { debounce } from 'lodash';
import PropTypes from "prop-types";

export default class MovieSearchBar extends React.Component {
    static propTypes = {
        calcBoxWidth: PropTypes.number,
        onFindMoviesByKeyword: PropTypes.func
    };

    render() {
        const { calcBoxWidth, onFindMoviesByKeyword } = this.props;
        const searchInputStyle = {
            width: calcBoxWidth
        };
        const handleInputChange = debounce(onFindMoviesByKeyword, 400);

        return (
            <Input style={searchInputStyle} placeholder="Type of search..." onChange={(event) => handleInputChange(event.target.value)} />
        );
    }
}
