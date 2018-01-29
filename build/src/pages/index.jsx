import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchSong } from '../actions/list';
import { Layout, Menu, Icon } from 'antd';

import { getUser, login, updateShowLogin, cancelUser, updateShowSignUp, signUp, updateShowPlayer, addSongNoSave, addSong, deleteSong, updateLoading, deleteSongLogin } from '../actions/user.js';
import { getSongdetail } from '../actions/detail';
import TopBar from '../compoents/top_bar';
import { navigation } from '../../../enums/music_server';

const { SubMenu, Item } = Menu;
const { Header, Sider, Content, Footer } = Layout;
function mapProps(state) {
    return {
        loading: state.list.loading,
        list: state.list.list,
        currentPage: state.list.currentPage,
        total: state.list.total,
        user: state.user,
        detail: state.detail,
    };
}
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            searchKey: '',
            server: 'netease',
            showNotes: true
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
        this.handleClickRow = this.handleClickRow.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleListen = this.handleListen.bind(this);
    }
    handleListen(id, name, artist, img) {
        const { dispatch } = this.props;
        const { server } = this.state;
        dispatch(updateShowPlayer(true));
        dispatch(getSongdetail({
            id,
            server,
            songName: name,
            artist,
            img,
            currentSong: -1
        }));
    }
    handleDeleteClick(record, index) {
        const { dispatch, user } = this.props;
        if (user.login) {
            return dispatch(deleteSongLogin(record.songId));
        }
        dispatch(deleteSong(index));
    }
    handleClickRow(song, index) {
        const { dispatch } = this.props;
        dispatch(updateLoading(true));
        dispatch(updateShowPlayer(true));
        dispatch(getSongdetail({
            id: song.songId,
            server: song.serverName,
            songName: song.songName,
            artist: song.artist,
            img: song.img,
            currentSong: index
        }));
        dispatch(updateLoading(false));
    }
    handleClickShowPlayer() {
        const { dispatch, detail, user } = this.props;
        let lastAddSongIndex = user.songList.length - 1;
        // 第一次打开播放器时初始化
        if (!detail.url && user.songList.length !== 0 && detail.fistShow) {
            dispatch(getSongdetail({
                id: user.songList[lastAddSongIndex].songId,
                server: user.songList[lastAddSongIndex].serverName,
                songName: user.songList[lastAddSongIndex].songName,
                artist: user.songList[lastAddSongIndex].artist,
                img: user.songList[lastAddSongIndex].img,
                currentSong: lastAddSongIndex
            }));
        }
        dispatch(updateShowPlayer(true));
    }
    handleSignUp(values) {
        const { dispatch } = this.props;
        dispatch(signUp(values));
    }
    handleClickSignUp() {
        const { dispatch } = this.props;
        dispatch(updateShowSignUp(true));
    }
    handleCancelSign() {
        const { dispatch } = this.props;
        dispatch(updateShowSignUp(false));
    }
    handleClickEsc() {
        const { dispatch } = this.props;
        dispatch(cancelUser());
    }
    handleClickLogin() {
        const { dispatch } = this.props;
        dispatch(updateShowLogin(true));
    }
    handleLogin(values) {
        const { dispatch } = this.props;
        dispatch(login(values));
    }
    handleCancelLogin() {
        const { dispatch } = this.props;
        dispatch(updateShowLogin(false));
    }
    handleAlertClose() {
        const { dispatch } = this.props;
        dispatch(updateShowPlayer(false));
    }
    handleGetSong(id, songName, artist, imgSrc) {
        const { server } = this.state;
        const { user, dispatch } = this.props;
        if (user.login) { //处于登录状态则发送请求
            return dispatch(addSong({
                id,
                name: songName,
                artist,
                img: imgSrc,
                server
            }));
        }
        return dispatch(addSongNoSave({
            songId: id,
            songName,
            serverName: server,
            artist,
            img: imgSrc
        }));
    }
    handleServerChange(value) {
        const { searchKey } = this.state;
        const { dispatch } = this.props;
        this.setState({
            server: value
        }, function () {
            if (!searchKey) {
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
        const { dispatch } = this.props;
        const { searchKey } = this.state;
        dispatch(searchSong({
            key: searchKey,
            server: 'netease',
            page
        }));
    }
    handleSearchChange(value) {
        const { dispatch } = this.props;
        const { server } = this.state;
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
        const { dispatch } = this.props;
        dispatch(getUser());
    }
    render() {
        const { user } = this.props;
        const siderMenu = navigation;
        siderMenu.forEach(function(item) {
            if(item.title === '我收藏的歌单') {
                item.children = user.markedSongList;
            }
            if(item.title === '我的歌单') {
                item.children = user.songList;
            }
        });
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ backgroundColor: 'white', padding: '0' }}>
                    <TopBar avatar={user.avatar} name={user.name} login={user.login} handleClickLogin={this.handleClickLogin} handleClickEsc={this.handleClickEsc} handleClickSignUp={this.handleClickSignUp} handleClickShowPlayer={this.handleClickShowPlayer} loading={user.loading} />
                </Header>
                <Layout style={{ paddingTop: '5px' }}>
                    <Sider collapsible={false} breakpoint="lg" style={{overflow: 'auto', top: 0, left: 0}}>
                        <Menu mode="vertical">
                            {
                                siderMenu.map((item) => {
                                    if (item.dynamic) {
                                        return (
                                            <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                                                {
                                                    item.children.map((list) => {
                                                        return (
                                                            <Item key={item.key + list.id}>
                                                                {<span><Icon type="cloud-o" /><span>{list.name}</span></span>}
                                                            </Item>
                                                        );
                                                    })
                                                }
                                            </SubMenu>
                                        );
                                    }
                                    return (
                                        <Item key={item.key}>
                                            {<span><Icon type={item.icon} /><span>{item.title}</span></span>}
                                        </Item>
                                    );
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content>
                        </Content>
                    </Layout>
                </Layout>
                <Footer>
                </Footer>
            </Layout>
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
    user: propTypes.object,
    detail: propTypes.object
};
export default connect(mapProps)(Demo);