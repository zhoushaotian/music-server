import React from 'react';
import propTypes from 'prop-types';
import {Row, Col, Button, Spin, Avatar, Input, Select} from 'antd';

import {server} from '../../../enums/music_server';
const {Search} = Input;
const {Option} = Select;
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.servers = [];
        this.state = {
            server: 'netease'
        };
        for(let item in server) {
            this.servers.push({
                key: item,
                value: server[item]
            });
        }
        this.handleServerChange = this.handleServerChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    handleServerChange(value) {
        this.setState({
            server: value
        });
    }
    handleSearch(value) {
        const {server} = this.state;
        const {handleSearchSong} = this.props;
        handleSearchSong(value, server);
    }
    render() {
        const {name, login, loading, avatar} = this.props;
        return (
            <Spin spinning={loading}>
                <Row type="flex" justify="start">
                    <Col md={4} xs={6} sm={4} offset={1}>
                        <div>
                            <Avatar src={avatar}/>
                            <span>{login ? name : '未登陆'}</span>
                        </div>
                    </Col>
                    <Col md={3} xs={6} sm={6}>
                        <Select style={{width: '100%'}} onChange={this.handleServerChange} defaultValue="netease">
                            {this.servers.map((item) => {
                                return (
                                    <Option key={item.key}>{item.value}</Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col md={8} xs={6} sm={4}>
                        <Search
                            placeholder="搜索你要的音乐"
                            onSearch={this.handleSearch}
                        />
                    </Col>
                    <Col md={4} xs={6} sm={6} offset={1}>
                        <Button type="primary" size='small' ghost><a href="/login">注册/切换账号</a></Button>
                    </Col>
                </Row>
            </Spin>
        );
    }
}

TopBar.propTypes = {
    name: propTypes.string,
    login: propTypes.bool,
    handleClickLogin: propTypes.func,
    handleClickEsc: propTypes.func,
    handleClickSignUp: propTypes.func,
    handleClickShowPlayer: propTypes.func,
    loading: propTypes.bool,
    avatar: propTypes.string,
    handleSearchSong: propTypes.func
};


export default TopBar;