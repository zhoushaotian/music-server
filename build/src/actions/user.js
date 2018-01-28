import axios from 'axios';
import {message} from 'antd';
import {browserHistory} from 'react-router';

export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'GET_USER';
export const CLEAN_USER = 'CLEAN_USER';
export const UPDATE_USER_LOADING = 'UPDATE_USER_LOADING';
export const UPDATE_SHOWLOGIN = 'UPDATE_SHOWLOGIN';
export const UPDATE_SHOWSIGNUP = 'UPDATE_SHOWSIGNUP';
export const UPDATE_SONGLIST = 'UPDATE_SONGLIST';
export const UPDATE_SHOWPLAYER = 'UPDATE_SHOWPLAYER';
export const ADD_SONG_NO_SAVE = 'ADD_SONG_NO_SAVE';
export const DELETE_SONG = 'DELETE_SONG';

export function deleteSong(data) {
    return {
        type: DELETE_SONG,
        data
    };
}
export function addSongNoSave(data) {
    return {
        type: ADD_SONG_NO_SAVE,
        data
    };
}

export function updateShowPlayer(data) {
    return {
        type: UPDATE_SHOWPLAYER,
        data
    };
}
export function updateSongList(data) {
    return {
        type: UPDATE_SONGLIST,
        data
    };
}
export function updateShowSignUp(data) {
    return {
        type: UPDATE_SHOWSIGNUP,
        data
    };
}
export function updateShowLogin(data) {
    return {
        type: UPDATE_SHOWLOGIN,
        data
    };
}
export function updateLoading(data) {
    return {
        type: UPDATE_USER_LOADING,
        data
    };
}
export function updateUser(data) {
    return {
        type: UPDATE_USER,
        data
    };
}

export function cleanUser() {
    return {
        type: CLEAN_USER
    };
}

export function cancelUser() {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/cancel').then(function(res) {
            let data = res.data.data;
            if(data.success) {
                message.success('注销成功');
                dispatch(updateLoading(false));
                return dispatch(cleanUser());
            }
            dispatch(updateLoading(false));
            return message.error('注销失败');
        });
    };
}
export function getUser() {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/user').then(function(res) {
            dispatch(updateUser(res.data.data));
            if(res.data.data.login) {
                dispatch(getSongList());
            }
            dispatch(updateLoading(false));
        });
    };
}

export function login(user) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/login', {
            userName: user.userName,
            passwd: user.passwd
        }).then(function(res) {
            let data = res.data.data;
            if(data.success) {
                dispatch(updateLoading(false));
                dispatch(updateShowLogin(false));
                dispatch(getSongList());
                message.success(res.data.msg);
                dispatch(updateUser({
                    name: data.name,
                    avatar: data.avatar,
                    login: true
                }));
                return browserHistory.push('/');
            }
            dispatch(updateLoading(false));
            message.error(res.data.msg);
        });
    };
}

export function signUp(values) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/signup', values).then(function(res) {
            let data = res.data.data;
            if(data.success) {
                message.success('注册成功');
                dispatch(updateLoading(false));
                dispatch(updateShowSignUp(false));
                dispatch(getSongList());
                dispatch(updateUser({
                    name: data.name,
                    avatar: data.avatar,
                    login: true
                }));
                return browserHistory.push('/');
            }
            message.error(res.data.msg);
            dispatch(updateLoading(false));
        });
    };
}
export function getSongList() {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/songlist').then(function(res) {
            let data = res.data.data;
            if(!data.success) {
                dispatch(updateLoading(false));
                return message.error('查询个人歌单失败');
            }
            dispatch(updateSongList(data.songList));
            dispatch(updateLoading(false));
        });
    };
}

export function addSong(song) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/add/song', {
            songId: song.id,
            songName: song.name,
            serverName: song.server,
            artist: song.artist,
            img: song.img
        }).then(function(res) {
            let data = res.data.data;
            if(!data.success) {
                dispatch(updateLoading(false));
                return message.error('添加歌曲失败');
            }
            dispatch(getSongList());
            dispatch(updateLoading(false));
        });
    };
}

export function deleteSongLogin(songId) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/delete/song', {
            songId
        }).then(function(res) {
            let data = res.data.data;
            if(data.success) {
                dispatch(updateLoading(false));
                return dispatch(getSongList());
            }
            message.error('删除歌曲失败');
            return dispatch(updateLoading(false));
        });
    };
}
