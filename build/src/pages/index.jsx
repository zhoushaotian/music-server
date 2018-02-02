import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, message, Modal, Select} from 'antd';
import axios from 'axios';

import { getUser } from '../actions/user.js';
import {createSongList} from '../actions/user';
import TopBar from '../compoents/top_bar';
import { navigation } from '../../../enums/music_server';

import SuggestSong from '../compoents/suggest_song';
import Notes from '../compoents/notes';
import MyInfo from '../compoents/myinfo';
import SongListDetail from '../compoents/songlist_detail';
import SearchSongList from '../compoents/song_list';
import {searchSong, updateSearch} from '../actions/list';
import SongListForm from '../compoents/form/songlist_form';

const { SubMenu, Item } = Menu;
const { Header, Sider, Content, Footer } = Layout;
const {Option} = Select;
function mapProps(state) {
    return {
        list: state.list,
        user: state.user,
        detail: state.detail,
    };
}
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            curMenuItem: 'loveSong',
            loading: false
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleSearchSong = this.handleSearchSong.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleLoveSong = this.handleLoveSong.bind(this);
        this.handleAddSong = this.handleAddSong.bind(this);
    }
    handleAddSong(song) {
        const {user} = this.props;
        this.selectList = user.favoriteList;
        Modal.confirm(
            {
                content: (
                    <Select style={{width: '200px'}} defaultValue='我最喜爱的音乐' onChange={(value) => {
                        this.selectList = value;
                    }}>
                        <Option key={user.favoriteList}>我最喜爱的音乐</Option>
                        {user.songList.map(function(list) {
                            return (
                                <Option key={list.id}>{list.name}</Option>
                            );
                        })}
                    </Select>
                ),
                title: '选择要添加的歌单',
                maskClosable: true,
                onOk: () => {
                    if(this.selectList) {
                        axios.post('/api/add/song', {
                            songId: song.id,
                            songName: song.name,
                            serverName: song.server,
                            artist: song.artists[0].name,
                            img: song.album.cover,
                            songListId: this.selectList
                        }).then(function(res) {
                            if(res.data.data.success) {
                                return message.success(res.data.msg);
                            }
                            message.error(res.data.msg);
                        }).catch(function(err) {
                            message.error(err.message);
                        });
                    }
                }
            }
        );
    }
    handleLoveSong(song) {
        const {user} = this.props;
        if(!user.favoriteList) {
            return message.error('还未登录');
        }
        axios.post('/api/add/song', {
            songId: song.id,
            songName: song.name,
            serverName: song.server,
            artist: song.artists[0].name,
            img: song.album.cover,
            songListId: user.favoriteList
        }).then(function(res) {
            if(res.data.data.success) {
                return message.success(res.data.msg);
            }
            message.error(res.data.msg);
        }).catch(function(err) {
            message.error(err.message);
        });
    }
    handlePageChange(page) {
        const {list, dispatch} = this.props;
        dispatch(searchSong({
            key: list.key,
            server: list.server,
            page
        }));
    }
    handleSearchSong(key, server) {
        const {dispatch} = this.props;
        this.setState({
            curMenuItem: 'searchSong'
        }, () => {
            dispatch(updateSearch({
                key,
                server
            }));
            dispatch(searchSong({
                key,
                server,
                page: 1
            }));
        });
    }
    handleMenuClick(obj) {
        const {loading} = this.state;
        const {dispatch} = this.props;
        if(obj.key === 'addSonglist') {
            Modal.confirm({
                content: (
                    <SongListForm loading={loading} wrappedComponentRef={(listForm) => {this.listFormRef = listForm;}}/>
                ),
                title: '创建歌单',
                onOk: (close) => {
                    if(this.listFormRef) {
                        this.listFormRef.props.form.validateFields((err, values) => {
                            if(err) {
                                return;
                            }
                            console.log(values);
                            dispatch(createSongList(values));
                            return close();
                        });
                    }
                }
            });
            return;
        }
        this.setState({
            curMenuItem: obj.key
        });
    }
    render() {
        const { user, list } = this.props;
        const {curMenuItem} = this.state;
        const siderMenu = navigation;
        const contentMap = {
            myInfo: <MyInfo/>,
            myNote: <Notes/>,
            findSong: <SuggestSong/>,
            searchSong: <SearchSongList songList={list} handleClickRow={this.handleClickRow} handlePageChange={this.handlePageChange} handleLoveSong={this.handleLoveSong} handleAddSong={this.handleAddSong}
            />
        };
        siderMenu.forEach(function(item) {
            if(item.title === '我收藏的歌单') {
                item.children = user.markedSongList;
            }
            if(item.title === '我的歌单') {
                item.children = user.songList;
            }
        });
        return (
            <Layout style={{ height: '100vh' }}>
                <Header style={{ backgroundColor: 'white', padding: '0' }}>
                    <TopBar avatar={user.avatar} name={user.name} handleSearchSong={this.handleSearchSong} loading={user.loading} login={user.login}/>
                </Header>
                <Layout style={{ paddingTop: '5px' }}>
                    <Sider collapsible={false} breakpoint="lg" style={{overflow: 'auto', top: 0, left: 0}}>
                        <Menu mode="vertical" defaultSelectedKeys={['loveSong']} onClick={this.handleMenuClick}>
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
                            {contentMap[curMenuItem] ? contentMap[curMenuItem] : <SongListDetail />}
                        </Content>
                    </Layout>
                </Layout>
                <Footer>
                </Footer>
            </Layout>
        );
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUser());
    }
}
Demo.propTypes = {
    list: propTypes.object,
    dispatch: propTypes.func,
    getState: propTypes.func,
    user: propTypes.object,
    detail: propTypes.object
};
export default connect(mapProps)(Demo);