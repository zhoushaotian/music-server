import axios from 'axios';

export const UPDATE_DETAIL = 'UPDATE_DETAIL';
export const CLEAN_DETAIL = 'CLEAN_DETAIL';
export const UPDATE_DETIAL_LOADING = 'UPDATE_DETIAL_LOADING';
export const UPDATE_FIST_SHOW = 'UPDATE_FIST_SHOW';
export const UPDATE_CURRENT = 'UPDATE_CURRENT';

export function updateCurrent(data) {
    return {
        type: UPDATE_CURRENT,
        data
    };
}
export function cleanDetail() {
    return {
        type: CLEAN_DETAIL
    };
}
export function updateFistShow(data) {
    return {
        type: UPDATE_FIST_SHOW,
        data
    };
}
export function updateDetail(data) {
    return {
        type: UPDATE_DETAIL,
        data
    };
}
export function updateLoading(data) {
    return {
        type: UPDATE_DETIAL_LOADING,
        data
    };
}
export function getSongdetail(data) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/get/song', {
            params: {
                id: data.id,
                server: data.server
            }
        }).then(function(res) {
            dispatch(updateCurrent(data.currentSong));
            dispatch(updateDetail({
                songName: data.songName,
                artist: data.artist,
                img: data.img,
                url: res.data.url
            }));
            dispatch(updateLoading(false));
        });
    };
}