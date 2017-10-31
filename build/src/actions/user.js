import axios from 'axios';
import {message} from 'antd';

export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'GET_USER';
export const CLEAN_USER = 'CLEAN_USER';
export const UPDATE_LOADING = 'UPDATE_LOADING';
export const UPDATE_SHOWLOGIN = 'UPDATE_SHOWLOGIN';
export const UPDATE_SHOWSIGNUP = 'UPDATE_SHOWSIGNUP';
export const UPDATE_SONGLIST = 'UPDATE_SONGLIST';
export const UPDATE_SHOWPLAYER = 'UPDATE_SHOWPLAYER';

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
        type: UPDATE_LOADING,
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
        axios.get('/api/cancel').then(function(res) {
            let data = res.data.data;
            if(data.success) {
                message.success('注销成功');
                return dispatch(cleanUser());
            }
            return message.error('注销失败');
        });
    };
}
export function getUser() {
    return function(dispatch) {
        axios.get('/api/user').then(function(res) {
            dispatch(updateUser(res.data.data));
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
                console.log(data);
                message.success(res.data.msg);
                return dispatch(updateUser({
                    name: data.name,
                    login: true
                }));
            }
            console.log(res.data);
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
                return dispatch(updateUser({
                    name: data.name,
                    login: true
                }));
            }
            message.error('注册失败');
            dispatch(updateLoading(false));
        });
    };
}
export function getSongList() {
    return function(dispatch) {
        axios.get('/api/songlist').then(function(res) {
            let data = res.data.data;
            if(!data.success) {
                return message.error('查询个人歌单失败');
            }
            dispatch(updateSongList(data.songList));
        });
    };
}
