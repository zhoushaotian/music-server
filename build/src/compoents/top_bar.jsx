import React from 'react';
import propTypes from 'prop-types';
import {Row, Col, Button, Spin, Avatar} from 'antd';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {name, login, handleClickLogin, handleClickEsc, handleClickSignUp, handleClickShowPlayer, loading, avatar} = this.props;
        return (
            <Spin spinning={loading}>
                <Row type="flex" justify="space-around">
                    <Col md={8} xs={6} sm={4}>
                        <div>
                            <Avatar src={avatar}/>
                            <span>{login ? name : '未登陆'}</span>
                        </div>
                    </Col>
                    <Col md={4} xs={6} sm={4}>
                        <Button type="primary" size='small' ghost onClick={() => {handleClickShowPlayer();}}>打开音乐盒</Button>
                    </Col>
                    <Col md={4} xs={6} sm={6}>
                        {login ? <Button type="primary" size='small' ghost onClick={() => {handleClickEsc();}}>注销</Button> : <Button type="primary" ghost onClick={() => {handleClickLogin();}}>登录</Button>}
                    </Col>
                    <Col md={4} xs={6} sm={6}>
                        <Button type="primary" size='small' ghost onClick={() => {handleClickSignUp();}}>注册</Button>
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
    avatar: propTypes.string
};


export default TopBar;