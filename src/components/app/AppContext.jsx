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
            value.setStateApp('containerDisplayMode', {
                loading: true,
                error: false,
                emptyAnswer: false
            });
        }
        const badRequest = () => {
            value.setStateApp('containerDisplayMode', {
                loading: false,
                error: true,
                emptyAnswer: false
            });
        }

        const emptyRequest = () => {
            value.setStateApp('containerDisplayMode', {
                loading: false,
                error: true,
                emptyAnswer: true
            });
        }

        const okRequest = (updatedMovieSearchData) => {
            value.setStateApp('movieSearchData', updatedMovieSearchData);
            value.setStateApp('containerDisplayMode', {
                loading: false,
                error: false,
                emptyAnswer: false
            });
        }

        const findMoviesByKeyword = (keyword, page) => {
            init();
            value.movieDbService.getMoviesByKeyword(keyword, page, value.getStateApp('movieGenres')).then(updatedMovieSearchData => {
                switch (updatedMovieSearchData.requestStatus) {
                    case 'error':
                        badRequest();
                        break;
                    case 'emptyAnswer':
                        emptyRequest();
                        break;
                    default:
                        okRequest(updatedMovieSearchData);
                }
            });
        }

        const addRatingForMovie = (id, rate) => {
            value.movieDbService.addRatingForMovie(id, rate).then();
        }

        const baseValue = {
            findMoviesByKeyword: debounce(findMoviesByKeyword, 400),
            addRatingForMovie: addRatingForMovie
        }

        return (
            <BaseProvider value={{...baseValue, ...value}}>
                {children}
            </BaseProvider>
        );
    }
}

export { AppProvider, AppConsumer };