import React from 'react';
import { Alert, Flex } from 'antd';
import PropTypes from 'prop-types';

export default class MovieSearchWarningAlert extends React.Component {
  static propTypes = {
    boxWidth: PropTypes.number
  };

  render() {
    const { boxWidth } = this.props;

    return (
      <Flex style={{ width: boxWidth }} vertical>
        <Alert type="warning" message="Контент отсутствует" description="По вашему запросу не удалось ничего найти" />
      </Flex>
    );
  }
}
