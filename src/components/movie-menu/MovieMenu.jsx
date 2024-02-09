import React from 'react';
import {Menu} from 'antd';
import PropTypes from "prop-types";
import {AppConsumer} from "../app/AppContext.jsx";


export default class MovieMenu extends React.Component {
    static propTypes = {
        movieSearchData: PropTypes.object,
        onFindMoviesByKeyword: PropTypes.func
    };

    render() {
        const { movieSearchData } = this.props;
        const {keyword} = movieSearchData;
        const items = [
            {
                label: 'Search',
                key: 'searchKey'
            },
            {
                label: 'Rated',
                key: 'ratedKey'
            }
        ];

        const handleMenuSelect = (selectedKeys, appValue) => {
            const selectedKey = selectedKeys.key;

            if (selectedKey === 'searchKey') {
                const page = sessionStorage.getItem('ratingPage') ? sessionStorage.getItem('ratingPage') : 1;
                sessionStorage.setItem('moviesPage', appValue.getStateApp('movieSearchData').page);
                appValue.setStateApp('activeTab', 'search');
                appValue.findMoviesByKeyword(keyword || '', parseInt(page, 10));
            } else if (selectedKey === 'ratedKey') {
                const page = sessionStorage.getItem('moviesPage') ? sessionStorage.getItem('moviesPage') : 1;
                sessionStorage.setItem('ratingPage', appValue.getStateApp('movieSearchData').page);
                appValue.setStateApp('activeTab', 'rated');
                appValue.findRatingMovies(keyword, parseInt(page, 10));
            }
        };

        return (
            <AppConsumer>
                {
                    (appValue) => (
                        <Menu mode="horizontal" items={items} defaultSelectedKeys={["searchKey"]} onSelect={(selectedKeys) => handleMenuSelect(selectedKeys, appValue)} />
                    )
                }
            </AppConsumer>
        );
    }
}
