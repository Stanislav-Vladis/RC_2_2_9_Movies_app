import React from 'react';
import {Menu} from 'antd';


export default class MovieMenu extends React.Component {
    render() {
        const items = [
            {
                label: 'Search',
                key: 'searchKey'
            },
            {
                label: 'Rated',
                key: 'ratedKey'
            }
        ];

        return (
            <Menu mode="horizontal" items={items} defaultSelectedKeys={["searchKey"]} />
        );
    }
}
