import axios from 'axios';
import { message } from 'antd';

import {getSongList} from './user';

export const UPDATE_CURRRENT_LIST = 'UPDATE_CURRRENT_LIST';
export const UPDATE_LIST_DETAIL_LOADING = 'UPDATE_LIST_DETAIL_LOADING';
export const UPDATE_CURRENT_LIST_INFO = 'UPDATE_CURRENT_LIST_INFO';
export const UPDATE_SUGGEST_LIST = 'UPDATE_SUGGEST_LIST';

export function updateListDetail(data) {
    return {
        type: UPDATE_CURRENT_LIST_INFO,
        data
    };
}
export function updateLoading(data) {
    return {
        type: UPDATE_LIST_DETAIL_LOADING,
        data
    };
}
export function updateCurrentList(data) {
    return {
        type: UPDATE_CURRRENT_LIST,
        data
    };
}
export function updateSuggestList(data) {
    return {
        type: UPDATE_SUGGEST_LIST,
        data
    };
}
export function markList(id) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/marksonglist/add', {
            id
        }).then(function(res) {
            dispatch(updateLoading(false));
            if(!res.data.data.success) {
                return message.error('收藏歌单失败');
            }
            dispatch(getListDetail(id));
            dispatch(getSongList());
        });
    };
}
export function getSuggestList() {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/songlist/list').then(function(res) {
            dispatch(updateLoading(false));
            dispatch(updateSuggestList(res.data.data.data));
        });
    };
}

export function getListDetail(id, cb) {
    return function (dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/songlist/detail', {
            params: {
                id
            }
        }).then(function (res) {
            let data = res.data.data;
            dispatch(updateLoading(false));
            if (!data.success) {
                return message.error('获取歌单详情失败');
            }
            dispatch(updateListDetail({
                time: data.result.time,
                listName: data.result.listName,
                img: data.result.img,
                listBio: data.result.listBio,
                createdBy: data.result.name,
                avatar: data.result.avatar,
                songListId: data.result.songListId,
                marked: data.result.marked ? data.result.marked : false,
                own: data.result.own ? data.result.own : false
            }));
            dispatch(updateCurrentList(data.result.songList));
            if(cb) {
                cb();
            }
        });
    };
}
export function deleteSong(songId, songListId) {
    return function (dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/delete/song', {
            songId,
            songListId
        }).then(function(res) {
            dispatch(updateLoading(false));
            let data = res.data.data;
            if(!data.success) {
                return message.error(res.data.msg);
            }
            dispatch(getListDetail(songListId));
        });
    };
}