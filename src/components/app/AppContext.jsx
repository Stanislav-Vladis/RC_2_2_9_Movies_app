import React, { Component } from 'react';
import PropTypes from "prop-types";
import {debounce} from "lodash";

const {
    Provider: BaseProvider,
    Consumer: AppConsumer
} = React.createContext();

class AppProvider extends Component {
    static propTypes = {
        children: PropTypes.object,
        value: PropTypes.object
    };

    render() {
        const { children, value } = this.props;

        const init = () => {
            value.setStateApp('loading', true);
            value.setStateApp('error', false);
        }
        const badRequest = () => {
            value.setStateApp('loading', false);
            value.setStateApp('error', true);
        }

        const findMoviesByKeyword = (keyword, page) => {
            init();
            value.movieDbService.getMoviesByKeyword(keyword, page).then(newMovieSearchData => {
                if (newMovieSearchData.error) {
                    badRequest();
                    return;
                }
                value.setStateApp('movieSearchData', newMovieSearchData);
                value.setStateApp('loading', false);
            });
        }

        const baseValue = {
            findMoviesByKeyword: debounce(findMoviesByKeyword, 400)
        }

        return (
            <BaseProvider value={{...baseValue, ...value}}>
                {children}
            </BaseProvider>
        );
    }
}

export { AppProvider, AppConsumer };