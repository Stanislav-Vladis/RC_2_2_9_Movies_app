import React from 'react';
import {Card, Flex, Rate, Typography} from 'antd';
import PropTypes from "prop-types";
import {truncate} from "lodash";
import Utils from "../../utils/Utils";
import './movie-card.scss';

export default class MovieCard extends React.Component {
    static propTypes = {
        cardWidth: PropTypes.number,
        movieSearchData: PropTypes.object
    };

    render() {
        const { Title, Text } = Typography;
        const { cardWidth, movieSearchData } = this.props;
        const cardStyle = {
            width: cardWidth,
            height: 245
        };
        const cardBodyStyle = {
            height: '100%',
            padding: Utils.isDesktop() ? 2 : 10
        }

        const truncateText = (text, length) => truncate(text, { length: length, separator: /\s/, })

        const buildCardsForMobile = () => {
            const cards = [];
            movieSearchData?.movies?.forEach((movie, index) => {
                cards.push(
                    <Card key={index} className="mobile movieCard" style={cardStyle} bodyStyle={cardBodyStyle} hoverable>
                        <Flex className="movieCard__wrapper" vertical>
                            <Flex className="movieCard__poster">
                                <img alt="poster" src={movie.posterImg} />
                                <Flex className="movieCard__movieInfo" vertical>
                                    <Title className="movieCard__movieInfo-title" level={5}>{truncateText(movie.movieName, 30)}</Title>
                                    <Text className="movieCard__movieInfo-releaseDate" type="secondary">{movie.releaseDate}</Text>
                                    <Text className="movieCard__movieInfo-genres" keyboard>{movie.movieGenres}</Text>
                                </Flex>
                                <Text className="movieCard__popularity">{movie.voteAverage.toFixed(1)}</Text>
                            </Flex>
                            <Text className="movieCard__description">{truncateText(movie.description, 200)}</Text>
                            <Rate rootClassName="movieCard__rate" count={10} defaultValue={movie.voteAverage} allowHalf />
                        </Flex>
                    </Card>
                );
            });
            return cards;
        }

        const buildCardsForDesktop = () => {
            const cards = [];
            movieSearchData?.movies?.forEach((movie, index) => {
                cards.push(
                    <Card key={index} className="desktop movieCard" style={cardStyle} bodyStyle={cardBodyStyle} hoverable>
                        <Flex className="movieCard__wrapper" vertical>
                            <Flex className="movieCard__poster">
                                <img alt="poster" src={movie.posterImg} />
                                <Flex className="movieCard__movieInfo" vertical>
                                    <Flex>
                                        <Title className="movieCard__movieInfo-title" level={5}>{truncateText(movie.movieName, 25)}</Title>
                                        <Text className="movieCard__movieInfo-popularity">{movie.voteAverage.toFixed(1)}</Text>
                                    </Flex>
                                    <Text className="movieCard__movieInfo-releaseDate" type="secondary">{movie.releaseDate}</Text>
                                    <Text className="movieCard__movieInfo-genres" keyboard>{movie.movieGenres}</Text>
                                    <Text className="movieCard__movieInfo-description">{truncateText(movie.description, 100)}</Text>
                                    <Rate className="movieCard__movieInfo-rate" count={10} defaultValue={movie.voteAverage} allowHalf />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Card>
                );
            });
            return cards;
        }

        return (
            <>
                {Utils.isDesktop() ? buildCardsForDesktop() : buildCardsForMobile()}
            </>
        );
    }
}
