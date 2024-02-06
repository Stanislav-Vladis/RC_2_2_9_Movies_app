import React from 'react';
import {Flex, Spin} from 'antd';
import './spin-loading.scss';
import PropTypes from "prop-types";

export default class SpinLoading extends React.Component {
    static propTypes = {
        boxWidth: PropTypes.number
    };

    render() {
        const { boxWidth } = this.props;

        return (
            <Flex style={{width: boxWidth}} vertical>
                <Spin tip="Loading" size="large">
                    <div className="loading__content" />
                </Spin>
            </Flex>
        );
    }
}
