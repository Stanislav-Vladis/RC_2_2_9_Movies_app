import React, { Component } from 'react';
import { Card, Row, Col, Typography, Rate } from 'antd';
import PropTypes from 'prop-types';
import assets from '../../assets/assets';
import { GenreConsumer } from '../../services/GenreContext';

const { Title, Text } = Typography;

export default class CardFilmDesktop extends Component {
  static propTypes = {
    film: PropTypes.object,
    ratingColor: PropTypes.string,
    formattedDate: PropTypes.string,
    truncatedTitle: PropTypes.string,
    truncatedOverview: PropTypes.string,
    roundedRating: PropTypes.number,
    handleRateFilm: PropTypes.func
  };

  render() {
    const { ratingColor, formattedDate, truncatedTitle, truncatedOverview, roundedRating, handleRateFilm } = this.props;
    const { posterPath, genreIds, rating } = this.props.film;

    return (
      <Card
        style={{
          position: 'relative',
          borderRadius: '0',
          minWidth: '345px',
          maxWidth: '480px',
          width: '100%',
          height: '280px',
          paddingRight: '10px',
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
          marginBottom: '40px'
        }}
        bordered={false}
      >
        <div className="rating" style={{ borderColor: ratingColor }}>
          <span>{roundedRating}</span>
        </div>
        <Row style={{ height: '100%' }} gutter={16}>
          <Col style={{ height: '100%' }} span={10}>
            <img
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : assets.noImage} // Подставьте реальный путь к изображению заглушке
              alt="фото"
            />
          </Col>
          <Col style={{ display: 'flex', flexDirection: 'column' }} span={14}>
            <Row>
              <Title style={{ width: '88%', marginTop: '12px' }} level={3}>
                {truncatedTitle}
              </Title>
            </Row>
            <Text style={{ color: '#827E7E' }}>{formattedDate}</Text>
            <Col style={{ padding: '0', paddingTop: '10px', paddingBottom: '10px' }}>
              <GenreConsumer>
                {(context) => {
                  const { genres } = context;
                  if (genres) {
                    const movieGenres = genres.genres.filter((genre) => genreIds.includes(genre.id));
                    return (
                      <div className="filters-container">
                        {movieGenres.map(({ name, id }, index) => {
                          return index < 3 ? (
                            <span className="filters" key={id}>
                              {name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              </GenreConsumer>
            </Col>
            <Text className="card-film-text">{truncatedOverview}</Text>
            <Rate style={{ marginTop: 'auto' }} value={rating} onChange={handleRateFilm} count={10} allowHalf />
          </Col>
        </Row>
      </Card>
    );
  }
}
