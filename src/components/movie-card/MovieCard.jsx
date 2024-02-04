import React from 'react';
import {Card, Flex, Rate, Typography} from 'antd';
import PropTypes from "prop-types";
import {truncate} from "lodash";

export default class MovieCard extends React.Component {
    static propTypes = {
        cardWidth: PropTypes.number,
        movieSearchData: PropTypes.object,
        isDesktop: PropTypes.bool
    };

    render() {
        const { Title, Text } = Typography;
        const { cardWidth, isDesktop, movieSearchData } = this.props;
        const cardStyle = {
            width: cardWidth,
            height: 245
        };
        const cardBodyStyle = {
            height: '100%',
            padding: isDesktop ? 2 : 10
        }
        const popularityBlockStyle = {
            width: 30,
            height: 30,
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: '2px solid #E9D100',
            borderRadius: '50%',
            fontSize: 12
        }

        const buildCardsForMobile = () => {
            const imgStyle = {
                display: 'block',
                width: 60,
                height: 90
            };

            const cards = [];
            movieSearchData?.movies?.forEach((movie, index) => {
                cards.push(
                    <Card key={index} style={cardStyle} bodyStyle={cardBodyStyle} hoverable>
                        <Flex style={{height: '100%'}} gap="10px" vertical>
                            <Flex gap="10px">
                                <img
                                    alt="poster"
                                    src={movie.posterImg}
                                    style={imgStyle}
                                />
                                <Flex vertical>
                                    <Title style={{maxWidth: 255, marginTop: 0, marginBottom: 10}} level={5}>{truncate(movie.movieName, { length: 30, separator: /\s/, })}</Title>
                                    <Text style={{marginBottom: 5}} type="secondary">{movie.releaseDate}</Text>
                                    <Text style={{marginLeft: -2.5}} keyboard>{movie.movieGenres}</Text>
                                </Flex>
                                <Text style={popularityBlockStyle}>{movie.voteAverage.toFixed(1)}</Text>
                            </Flex>
                            <div>
                                {truncate(movie.description, { length: 200, separator: /\s/, })}
                            </div>
                            <Rate style={{marginLeft: 'auto', marginTop: 'auto'}} count={10} defaultValue={movie.voteAverage} allowHalf />
                        </Flex>
                    </Card>
                );
            });
            return cards;
        }

        const buildCardsForDesktop = () => {
            const imgStyle = {
                display: 'block',
                width: 180,
                height: cardStyle.height - 5
            };

            const cards = [];
            movieSearchData?.movies?.forEach((movie, index) => {
                cards.push(
                    <Card key={index} style={cardStyle} bodyStyle={cardBodyStyle} hoverable>
                        <Flex style={{height: '100%'}} gap="10px" vertical>
                            <Flex gap="10px">
                                <img
                                    alt="poster"
                                    src={movie.posterImg}
                                    style={imgStyle}
                                />
                                <Flex vertical>
                                    <Flex>
                                        <Title style={{width: 235, marginTop: 10, marginBottom: 10}} level={5}>{truncate(movie.movieName, { length: 25, separator: /\s/, })}</Title>
                                        <Text style={{...popularityBlockStyle, marginTop: 10, marginRight: 10}}>{movie.voteAverage.toFixed(1)}</Text>
                                    </Flex>
                                    <Text style={{marginBottom: 5}} type="secondary">{movie.releaseDate}</Text>
                                    <Text style={{marginLeft: -2.5, marginBottom: 10}} keyboard>{movie.movieGenres}</Text>
                                    <Text style={{maxWidth: 210}}>{truncate(movie.description, { length: 100, separator: /\s/, })}</Text>
                                    <Rate style={{marginLeft: 'auto', marginRight: 10, marginTop: 'auto', marginBottom: 10}} count={10} defaultValue={movie.voteAverage} allowHalf />
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
                {isDesktop ? buildCardsForDesktop() : buildCardsForMobile()}
            </>
        );
    }
}
