import axios from 'axios';

export const UPDATE_URL = 'UPDATE_URL';
export const CLEAN_DETAIL = 'CLEAN_DETAIL';
export const UPDATE_LOADING = 'UPDATE_LOADING';

export function updateLoading(data) {
    return {
        type: UPDATE_LOADING,
        data
    };
}
export function updateUrl(data) {
    return {
        type: UPDATE_URL,
        data
    };
}
export function getSongdetail(data) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/get/song', {
            params: data.id,
            server: data.server
        }).then(function(res) {
            dispatch(updateUrl(res.data.url));    
        });
    };
}