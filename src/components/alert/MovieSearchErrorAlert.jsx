import React from 'react';
import { Alert, Flex } from 'antd';
import PropTypes from 'prop-types';

export default class MovieSearchErrorAlert extends React.Component {
  static propTypes = {
    boxWidth: PropTypes.number
  };

  render() {
    const { boxWidth } = this.props;

    return (
      <Flex style={{ width: boxWidth }} vertical>
        <Alert type="error" message="Ошибка!" description="Не удалось получить данные, попробуйте позднее..." />
      </Flex>
    );
  }
}
