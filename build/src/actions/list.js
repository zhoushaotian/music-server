import axios from 'axios';

export const UPDATE_LIST = 'UPDATE_LIST';
export const CLEAN_LIST = 'CLEAN_LIST';
export const UPDATE_LOADING = 'UPDATE_LOADING';

export function updateLoading(data) {
    return {
        type: UPDATE_LOADING,
        data
    };
}
export function updateList(data) {
    return {
        type: UPDATE_LIST,
        data
    };
}
export function searchSong(data) {
    return function(dispatch) {
        dispatch(updateLoading(true));
        axios.get('/api/search/song', {
            params: {
                key: data.key,
                server: data.server
            }
        }).then(function(res) {
            dispatch(updateList(res.data.songList));
        });
    };
}

export function cleanList() {
    return {
        type: CLEAN_LIST
    };
}

