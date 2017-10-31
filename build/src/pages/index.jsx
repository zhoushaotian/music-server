import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchSong } from '../actions/list';
import {Row, Col, Select, Input, Layout, Table, Button, message, Modal} from 'antd';
import MUSIC_SERVER from '../../../enums/music_server';
import axios from 'axios';

import {getUser, login, updateShowLogin, cancelUser, updateShowSignUp, signUp, updateShowPlayer} from '../actions/user.js';
import TopBar from '../compoents/top_bar';
import Login from '../compoents/login';
import MusicPlayer from '../compoents/music_player';
import SignUp from '../compoents/signup';

const Option = Select.Option;
const Search = Input.Search;
const {Header, Footer, Content} = Layout;
function mapProps(state) {
    return {
        loading: state.list.loading,
        list: state.list.list,
        currentPage: state.list.currentPage,
        total: state.list.total,
        user: state.user
    };
}
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            searchKey: '',
            server: 'netease'
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleServerChange = this.handleServerChange.bind(this);
        this.handleGetSong = this.handleGetSong.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this);
        this.handleCancelLogin = this.handleCancelLogin.bind(this);
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleClickEsc = this.handleClickEsc.bind(this);
        this.handleCancelSign = this.handleCancelSign.bind(this);
        this.handleClickSignUp = this.handleClickSignUp.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleClickShowPlayer = this.handleClickShowPlayer.bind(this);
    }
    handleClickShowPlayer() {
        const {dispatch} = this.props;
        dispatch(updateShowPlayer(true));
    }
    handleSignUp(values) {
        const {dispatch} = this.props;
        dispatch(signUp(values));
    }
    handleClickSignUp() {
        const {dispatch} = this.props;
        dispatch(updateShowSignUp(true));
    }
    handleCancelSign() {
        const {dispatch} = this.props;
        dispatch(updateShowSignUp(false));
    }
    handleClickEsc() {
        const {dispatch} = this.props;
        dispatch(cancelUser());
    }
    handleClickLogin() {
        const {dispatch} = this.props;
        dispatch(updateShowLogin(true));
    }
    handleLogin(values) {
        const {dispatch} = this.props;
        dispatch(login(values));
    }
    handleCancelLogin() {
        const {dispatch} = this.props;
        dispatch(updateShowLogin(false));
    }
    handleAlertClose() {
        const {dispatch} = this.props;
        dispatch(updateShowPlayer(false));
    }
    handleGetSong(id, songName, artist, imgSrc) {
        const {server} = this.state;
        axios.get('api/get/song', {
            params: {
                id,
                server
            }
        }).then((res) => {
            this.setState({
                currentUrl: res.data.url,
                songName,
                artist,
                imgSrc,
                showPlayer: true
            });
        }).catch(function() {
            message.error('获取歌曲详情失败');
        });
    }
    handleServerChange(value) {
        const {searchKey} = this.state;
        const {dispatch} = this.props;
        this.setState({
            server: value
        }, function() {
            if(!searchKey) {
                return;
            }
            dispatch(searchSong({
                key: searchKey,
                server: value,
                page: 1
            }));
        });
    }
    handlePageChange(page) {
        const {dispatch} = this.props;
        const {searchKey} = this.state;
        dispatch(searchSong({
            key: searchKey,
            server: 'netease',
            page
        }));
    }
    handleSearchChange(value) {
        const {dispatch} = this.props;
        const {server} = this.state;
        this.setState({
            searchKey: value
        });
        dispatch(searchSong({
            key: value,
            server,
            page: 1
        }));
    }
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getUser());
    }
    render() {
        const colums = [
            {
                title: '歌名',
                dataIndex: 'name',
            },
            {
                title: '专辑',
                dataIndex: 'album.name',
            },
            {
                title: '歌手',
                dataIndex: 'artists[0].name',
            },
            {
                title: '操作',
                render: (song) => {
                    return (
                        <Button icon="play-circle" onClick={() => {this.handleGetSong(song.id, song.name, song.artists[0].name, song.album.cover);}}>查看</Button>
                    );
                }
            }
        ];
        const {loading, list, total, currentPage, user} = this.props;
        const {server} = this.state;
        return (
            <div className="index-wrapper">
                <Layout>
                    <Header style={{backgroundColor: 'white'}}>
                        <TopBar name={user.name} login={user.login} handleClickLogin = {this.handleClickLogin} handleClickEsc={this.handleClickEsc} handleClickSignUp={this.handleClickSignUp} handleClickShowPlayer={this.handleClickShowPlayer}/>
                    </Header>
                    <Content>
                        <Row type="flex" justify="center">
                            <Col lg={5}>
                                <Select defaultValue={server} style={{width: '100%'}} onChange={this.handleServerChange}>
                                    {Object.keys(MUSIC_SERVER).map(function(server, index) {
                                        return (
                                            <Option key={index} value={server}>{MUSIC_SERVER[server]}</Option>
                                        );
                                    })}
                                </Select>
                            </Col>
                            <Col lg={10}>
                                <Search
                                    placeholder="请输入要查询的关键字"
                                    style={{width: '100%'}}
                                    defaultValue={''}
                                    onSearch={this.handleSearchChange}
                                />    
                            </Col>
                        </Row>
                        <Row type="flex" justify="center">
                            <Col lg={15}>
                                <Table loading={loading} columns={colums} dataSource={list} pagination={{
                                    current: currentPage,
                                    total,
                                    pageSize: 10,
                                    onChange: (page) => {this.handlePageChange(page);}
                                }} locale={{
                                    emptyText: '输入你的关键词搜索歌曲'
                                }}/>
                            </Col>
                        </Row>
                    </Content>
                    <Footer>
                        <Modal
                            visible={user.showPlayer}
                            title="音乐详情"
                            footer={null}
                            onCancel={this.handleAlertClose}
                            maskClosable={false}

                        >
                            <MusicPlayer songList={user.songList}/>
                        </Modal>
                        <Login showLogin={user.showLogin} handleCancel={this.handleCancelLogin} handleLogin={this.handleLogin} logining={user.loading}/>
                        <SignUp showSignUp={user.showSignUp} handleCancel={this.handleCancelSign} handleSignUp = {this.handleSignUp} loading={user.loading}/>
                    </Footer>
                </Layout>
            </div>
        );
    }
}
Demo.propTypes = {
    list: propTypes.array,
    loading: propTypes.bool,
    currentPage: propTypes.number,
    total: propTypes.number,
    dispatch: propTypes.func,
    getState: propTypes.func,
    user: propTypes.object
};
export default connect(mapProps)(Demo);