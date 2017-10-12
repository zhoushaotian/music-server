import axios from 'axios';

export const UPDATE_DETAIL = 'UPDATE_DETAIL';
export const CLEAN_DETAIL = 'CLEAN_DETAIL';
export const UPDATE_LOADING = 'UPDATE_LOADING';

export function updateLoading(data) {
    return {
        type: UPDATE_LOADING,
        data
    };
}
export function updateDetail(data) {
    return {
        type: UPDATE_DETAIL,
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
            dispatch(updateDetail(res.data));    
        });
    };
}