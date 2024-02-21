import React, { Component } from 'react';
import { Card, Row, Col, Typography, Rate } from 'antd';
import PropTypes from 'prop-types';
import assets from '../../assets/assets';
import { GenreConsumer } from '../../services/GenreContext';

const { Title, Text } = Typography;

export default class CardFilmMobile extends Component {
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
          borderRadius: '0',
          minWidth: '345px',
          maxWidth: '480px',
          width: '100%',
          height: '245px',
          paddingRight: '10px',
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
          marginBottom: '40px',
          paddingLeft: '10px'
        }}
        bodyStyle={{ display: 'flex', flexDirection: 'column' }}
        bordered={false}
      >
        <Row>
          <Col span={24} style={{ paddingBottom: '20px' }}>
            <Row>
              <Col span={4} style={{ paddingTop: '10px' }}>
                <img
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : assets.noImage} // Подставьте реальный путь к изображению заглушке
                  alt="фото"
                />
              </Col>
              <Col span={20} style={{ paddingLeft: '10px' }}>
                <Row>
                  <Col span={20}>
                    <Title style={{ width: '88%', marginTop: '12px' }} level={3}>
                      {truncatedTitle}
                    </Title>
                  </Col>
                  <Col span={4}>
                    <div className="rating" style={{ borderColor: ratingColor }}>
                      <span>{roundedRating}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ paddingBottom: '10px' }}>
                    <Text style={{ color: '#827E7E' }}>{formattedDate}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
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
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text className="card-film-text">{truncatedOverview}</Text>
          </Col>
        </Row>
        <Row style={{ marginTop: 'auto', marginLeft: 'auto', marginRight: '5px' }}>
          <Col span={24}>
            <Rate value={rating} onChange={handleRateFilm} count={10} allowHalf />
          </Col>
        </Row>
      </Card>
    );
  }
}
