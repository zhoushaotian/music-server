import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {Card, Tag} from 'antd';

import SignUpForm from '../compoents/form/signup_form';
import LoginForm from '../compoents/form/login_form';
import Particle from '../compoents/particle';
import {login, signUp} from '../actions/user';
function mapProps(state) {
    return {
        user: state.user
    };
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curTabKey: 'login'
        };
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }
    render() {
        const tabContent = {
            login: <LoginForm logining={false} handleLogin={this.handleLogin}/>,
            signUp: <SignUpForm loading={false} handleSignUp={this.handleSignUp}/>
        };
        const tabList = [
            {
                key: 'login',
                tab: '登录'
            },
            {
                key: 'signUp',
                tab: '注册'
            }
        ];
        return (
            <div className="login-page">
                <Particle/>
                <div className="login-dig">
                    <Card tabList={tabList} onTabChange={this.handleTabChange}>
                        {tabContent[this.state.curTabKey]}
                    </Card>
                    <Tag color="red">本系统的音乐数据来自网易云音乐与QQ音乐，仅供学习交流使用，请勿用于商业用途！</Tag><br/>
                    <Tag color="gold"><a href="https://github.com/zhoushaotian/music-server">点击查看源代码</a></Tag>
                </div>
            </div>
        );
    }
    handleTabChange(key) {
        this.setState({
            curTabKey: key 
        });
    }
    handleLogin(user) {
        const {dispatch} = this.props;
        dispatch(login(user));
    }
    handleSignUp(user) {
        const {dispatch} = this.props;
        dispatch(signUp(user));
    }
}
LoginPage.propTypes = {
    user: propTypes.object,
    dispatch: propTypes.func
};
export default connect(mapProps)(LoginPage);



