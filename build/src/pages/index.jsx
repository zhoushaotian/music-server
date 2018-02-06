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
import SongDetail from '../compoents/song_detail';
import FooterBar from '../compoents/footer_bar';


import {getListDetail, deleteSong} from '../actions/song_list';
import {updatePlayList, updateSongInfo, updatePlayStatus} from '../actions/play_list';

import {optsConvert, fetchSongUrl} from '../tool/tool';

const { SubMenu, Item } = Menu;
const { Header, Sider, Content, Footer } = Layout;
const {Option} = Select;
function mapProps(state) {
    return {
        list: state.list,
        user: state.user,
        detail: state.detail,
        songList: state.songList,
        playList: state.playList
    };
}
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            curMenuItem: 'findSong',
            loading: false,
            curList: 0,
            songDetail: {}
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleSearchSong = this.handleSearchSong.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleLoveSong = this.handleLoveSong.bind(this);
        this.handleAddSong = this.handleAddSong.bind(this);
        this.handleDeleteSong = this.handleDeleteSong.bind(this);
        this.handleSongPlay = this.handleSongPlay.bind(this);
        this.handleSongClick = this.handleSongClick.bind(this);
        this.handleSongEnd = this.handleSongEnd.bind(this);
        this.handleClickPause = this.handleClickPause.bind(this);
    }
    handleClickPause() {
        const {dispatch, playList} = this.props;
        if(!playList.url) {
            return;
        }
        playList.isPlay ? dispatch(updatePlayStatus(false)) : dispatch(updatePlayStatus(true));
    }
    handleSongClick(song) {
        if(song.suggest) {
            song = {
                songName: song.name,
                artist: song.artists[0].name,
                serverName: 'xiami',
                url: song.file,
                img: song.album.cover,
                songId: song.id
            };
        }
        this.setState({
            songDetail: optsConvert(song)
        }, () => {
            this.setState({
                curMenuItem: 'songDetail'
            });
        });
    }
    handleSongEnd(song) {
        const {dispatch} = this.props;
        fetchSongUrl(song.songId, song.serverName).then((url) => {
            song.url = url;
            dispatch(updateSongInfo(song));
        }).catch((err) => {
            message.error(err.message);
        });
    }
    handleSongPlay(song) {
        // 当点击歌曲详情播放的时候将store中的songlist赋给playlist 播放结束后随机歌单里的歌曲
        const {dispatch, songList, user} = this.props;
        let reqOpts = optsConvert(song);
        if(songList.songList.length !== 0) {
            dispatch(updatePlayList(songList.songList));
        }else {
            axios.get('/api/songlist/detail', {
                params: {
                    id: user.favoriteList
                }
            }).then((res) => {
                dispatch(updatePlayList(res.data.data.result.songList));
            });
        }
        dispatch(updatePlayStatus(true));
        if(!song.url) {
            return fetchSongUrl(reqOpts.songId, reqOpts.serverName).then((url) => {
                reqOpts.url = url;
                dispatch(updateSongInfo(reqOpts));
            }).catch((err) => {
                message.error(err.message);
            });
        }
        return dispatch(updateSongInfo(reqOpts));
    }
    handleDeleteSong(song) {
        const {dispatch, songList} = this.props;
        dispatch(deleteSong(song.songId, songList.songListId));
    }
    handleAddSong(song) {
        const {user} = this.props;
        this.selectList = user.favoriteList;
        let opts = optsConvert(song);
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
                        opts.songListId = this.selectList;
                        axios.post('/api/add/song', opts).then(function(res) {
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
        let opts = {};
        if(!user.favoriteList) {
            return message.error('还未登录');
        }
        opts = optsConvert(song);
        opts.songListId = user.favoriteList;
        axios.post('/api/add/song', opts).then(function(res) {
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
        const {dispatch, user} = this.props;
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
        let key = obj.key.slice(obj.key.indexOf('-') + 1);
        if(!isNaN(key)) {
            return this.setState({
                curMenuItem: obj.key,
                curList: parseInt(key)
            }, () => {
                dispatch(getListDetail(parseInt(key)));
            });
        }
        if(obj.key === 'loveSong') {
            return this.setState({
                curMenuItem: obj.key,
                curList: user.favoriteList
            }, () => {
                dispatch(getListDetail(user.favoriteList));
            });
        }
        this.setState({
            curMenuItem: obj.key
        });

    }
    render() {
        const { user, list, songList, playList } = this.props;
        const {curMenuItem, songDetail} = this.state;
        const siderMenu = navigation;
        const contentMap = {
            myInfo: <MyInfo/>,
            myNote: <Notes/>,
            findSong: <SuggestSong handleSongClick={this.handleSongClick}/>,
            searchSong: <SearchSongList songList={list} handleClickRow={this.handleClickRow} handlePageChange={this.handlePageChange} handleLoveSong={this.handleLoveSong} handleAddSong={this.handleAddSong}
                handleSongClick={this.handleSongClick}/>,
            songListDetail: <SongListDetail listDetail={songList} handleDeleteSong={this.handleDeleteSong} handleClickPlus={this.handleAddSong} handleClickHeart={this.handleLoveSong} handleSongClick={this.handleSongClick}/>,
            songDetail: <SongDetail handleSongPlay={this.handleSongPlay} song={songDetail} handleHeartSong={this.handleLoveSong} handlePlusSong={this.handleAddSong}/>
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
                        <Menu mode="vertical" defaultSelectedKeys={['findSong']} onClick={this.handleMenuClick}>
                            {
                                siderMenu.map((item) => {
                                    if (item.dynamic) {
                                        return (
                                            <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                                                {
                                                    item.children.map((list) => {
                                                        return (
                                                            <Item key={item.key + '-' + list.id}>
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
                            {contentMap[curMenuItem] ? contentMap[curMenuItem] : contentMap.songListDetail}
                        </Content>
                    </Layout>
                </Layout>
                <Footer style={{ backgroundColor: 'white', padding: '0', height: '50px', lineHeight: '50px'}}>
                    <FooterBar url={playList.url} isPlay={playList.isPlay} currentName={playList.songName} currentArtist={playList.artist} playList={playList.playList} handleSongEnd={this.handleSongEnd} handleClickPause={this.handleClickPause}/>
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
    detail: propTypes.object,
    songList: propTypes.object,
    playList: propTypes.object
};
export default connect(mapProps)(Demo);