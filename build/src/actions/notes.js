import axios from 'axios';
import {message} from 'antd';
export const UPDATE_NOTES = 'UPDATE_NOTES';
export const GET_NOTES = 'GET_NOTES';
export const ADD_NOTES = 'ADD_NOTES';
export const DELETE_NOTES = 'DELETE_NOTES';
export const UPDATE_NOTE_LOADING = 'UPDATE_NOTE_LOADING';

export function updateLoading(data) {
    return {
        type: UPDATE_NOTE_LOADING,
        data
    };
}

export function updateNotes(data) {
    return {
        type: UPDATE_NOTES,
        data: {
            notes: data.data,
            total: data.total
        }
    };
}
export function commit(comment, currentPage, pages) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.post('/api/add/note', {
            msg: comment
        }).then(function(res) {
            let data = res.data.data;
            dispatch(updateLoading(false));
            if(!data.success) {
                return message.error('添加评论失败');
            }
            dispatch(getNotes(currentPage, pages));
            return message.success('添加评论成功');        
        }).catch(function() {
            message.error('系统错误');
        });
    };
}

export function getNotes(currentPage, pages) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/get/note', {
            params: {
                currentPage,
                pages
            }
        }).then(function(res) {
            let data = res.data.data;
            if(!data.success) {
                dispatch(updateLoading(false));
                return message.error('获取评论失败');
            }
            dispatch(updateLoading(false));
            return dispatch(updateNotes(data));
        }).catch(function() {
            dispatch(updateLoading(false));
            message.error('获取评论失败');
        });
    };
}

export function deleteNotes(id, currentPage, pages) {
    return function(dispatch) {
        if(!id) {
            return message.error('未选中任何评论');
        }
        dispatch(updateLoading(true));
        axios.post('/api/delete/note', {
            id
        }).then(function(res) {
            let data = res.data.data;
            dispatch(updateLoading(false));
            if(!data.success) {
                return message.error(res.data.msg);
            }
            dispatch(getNotes(currentPage, pages));
            return message.success('删除评论成功');
        }).catch(function() {
            dispatch(updateLoading(false));
            message.error('删除评论失败');
        });
    };
}