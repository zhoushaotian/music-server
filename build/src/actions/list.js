import axios from 'axios';

export const UPDATE_LIST = 'UPDATE_LIST';
export const CLEAN_LIST = 'CLEAN_LIST';
export const UPDATE_LIST_LOADING = 'UPDATE_LIST_LOADING';
export const UPDATE_TOTAL = 'UPDATE_TOTAL'; 
export const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE';
export const UPDATE_SERACH = 'UPDATE_SERACH';

export function updateSearch(data) {
    return {
        type: UPDATE_SERACH,
        data
    };
}
export function updateTotal(data) {
    return {
        type: UPDATE_TOTAL,
        data
    };
}

export function updateCurrentPage(data) {
    return {
        type: UPDATE_CURRENT_PAGE,
        data
    };
}

export function updateLoading(data) {
    return {
        type: UPDATE_LIST_LOADING,
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
                server: data.server,
                page: data.page
            }
        }).then(function(res) {
            //处理接受的数据加上key
            dispatch(updateLoading(false));
            res.data.songList.map(function(song, index) {
                song.key = index;
            });
            dispatch(updateList(res.data.songList));
            dispatch(updateCurrentPage(data.page));
            dispatch(updateTotal(res.data.total));
        });
    };
}

export function cleanList() {
    return {
        type: CLEAN_LIST
    };
}

