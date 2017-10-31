import React from 'react';
import propTypes from 'prop-types';
import {Row, Col, Button} from 'antd';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {name, login, handleClickLogin, handleClickEsc, handleClickSignUp, handleClickShowPlayer} = this.props;
        return (
            <Row type="flex" justify="space-around">
                <Col md={8} xs={6} sm={4}>
                    <div>
                        <span>{login ? name : '未登陆'}</span>
                    </div>
                </Col>
                <Col md={4} xs={3} sm={4}>
                    <Button type="primary" icon="bars" ></Button>
                </Col>
                <Col md={4} xs={3} sm={4}>
                    <Button type="primary" icon="inbox" onClick={() => {handleClickShowPlayer();}}></Button>
                </Col>
                <Col md={4} xs={6} sm={6}>
                    {login ? <Button type="primary" ghost onClick={() => {handleClickEsc();}}>注销</Button> : <Button type="primary" ghost onClick={() => {handleClickLogin();}}>登录</Button>}
                </Col>
                <Col md={4} xs={6} sm={6}>
                    <Button type="primary" ghost onClick={() => {handleClickSignUp();}}>注册</Button>
                </Col>
            </Row>
        );
    }
}

TopBar.propTypes = {
    name: propTypes.string,
    login: propTypes.bool,
    handleClickLogin: propTypes.func,
    handleClickEsc: propTypes.func,
    handleClickSignUp: propTypes.func,
    handleClickShowPlayer: propTypes.func
};


export default TopBar;