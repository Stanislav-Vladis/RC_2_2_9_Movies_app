import React from 'react';
import { Card, Flex, Rate, Typography } from 'antd';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import Utils from '../../utils/Utils';
import './movie-card.scss';
import { AppConsumer } from '../app/AppContext.jsx';

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
    };

    const truncateText = (text, length) => truncate(text, { length: length, separator: /\s/ });
    const getRoundedRating = (rating) => rating.toFixed(1);
    const getPopularityColor = (voteAverage) => {
      if (voteAverage < 3) return '#E90000';
      if (voteAverage >= 3 && voteAverage < 5) return '#E97E00';
      if (voteAverage >= 5 && voteAverage < 7) return '#E9D100';
      return '#66E900';
    };

    const buildGenres = (movieGenres) => {
      const genres = [];
      movieGenres.forEach((genre) => {
        genres.push(
          <Text key={genre} className="movieCard__movieInfo-genres" keyboard>{genre}</Text>
        );
      });
      return genres.slice(0, 3);
    };

    const buildCardsForMobile = (appValue) => {
      const cards = [];
      Object.keys(movieSearchData?.movies)?.forEach((key) => {
        const movie = movieSearchData?.movies[key];
        const rating = getRoundedRating(movie.voteAverage);
        const colorRating = getPopularityColor(rating);

        cards.push(
          <Card key={movie.id} className="mobile movieCard" style={cardStyle} bodyStyle={cardBodyStyle} hoverable>
            <Flex className="movieCard__wrapper" vertical>
              <Flex className="movieCard__poster">
                <img alt="poster" src={movie.posterImg} />
                <Flex className="movieCard__movieInfo" vertical>
                  <Title className="movieCard__movieInfo-title" level={5}>{truncateText(movie.movieName, 30)}</Title>
                  <Text className="movieCard__movieInfo-releaseDate" type="secondary">{movie.releaseDate}</Text>
                  <Flex>{buildGenres(movie.movieGenres)}</Flex>
                </Flex>
                <Text className="movieCard__popularity" style={{ borderColor: colorRating }}>{rating}</Text>
              </Flex>
              <Text className="movieCard__description">{truncateText(movie.description, 200)}</Text>
              <Rate
                rootClassName="movieCard__rate"
                count={10}
                defaultValue={movie.myRate}
                onChange={(newRating) => appValue.addRatingForMovie(movie.id, newRating)}
                allowHalf
              />
            </Flex>
          </Card>
        );
      });
      return cards;
    };

    const buildCardsForDesktop = (appValue) => {
      const cards = [];
      Object.keys(movieSearchData?.movies)?.forEach((key) => {
        const movie = movieSearchData?.movies[key];
        const rating = getRoundedRating(movie.voteAverage);
        const colorRating = getPopularityColor(rating);

        cards.push(
          <Card key={movie.id} className="desktop movieCard" style={cardStyle} bodyStyle={cardBodyStyle} hoverable>
            <Flex className="movieCard__wrapper" vertical>
              <Flex className="movieCard__poster">
                <img alt="poster" src={movie.posterImg} />
                <Flex className="movieCard__movieInfo" vertical>
                  <Flex>
                    <Title className="movieCard__movieInfo-title" level={5}>{truncateText(movie.movieName, 25)}</Title>
                    <Text className="movieCard__movieInfo-popularity" style={{ borderColor: colorRating }}>{rating}</Text>
                  </Flex>
                  <Text className="movieCard__movieInfo-releaseDate" type="secondary">{movie.releaseDate}</Text>
                  <Flex>{buildGenres(movie.movieGenres)}</Flex>
                  <Text className="movieCard__movieInfo-description">{truncateText(movie.description, 100)}</Text>
                  <Rate
                    className="movieCard__movieInfo-rate"
                    count={10}
                    defaultValue={movie.myRate}
                    onChange={(newRating) => appValue.addRatingForMovie(movie.id, newRating)}
                    allowHalf
                  />
                </Flex>
              </Flex>
            </Flex>
          </Card>
        );
      });
      return cards;
    };

    return (
      <>
        <AppConsumer>
          {(appValue) => (Utils.isDesktop() ? buildCardsForDesktop(appValue) : buildCardsForMobile(appValue))}
        </AppConsumer>
      </>
    );
  }
}
