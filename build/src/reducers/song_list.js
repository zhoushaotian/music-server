import { UPDATE_CURRRENT_LIST, UPDATE_LIST_DETAIL_LOADING, UPDATE_CURRENT_LIST_INFO } from '../actions/song_list';

const INIT_STATE = {
    loading: false,
    songList: [],
    listName: '',
    time: '',
    img: '',
    listBio: '',
    createdBy: '',
    avatar: '',
    songListId: 0
};

export default function songList(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_CURRENT_LIST_INFO:
        return Object.assign({}, state, action.data);
    case UPDATE_CURRRENT_LIST:
        return Object.assign({}, state, {
            songList: action.data
        });
    case UPDATE_LIST_DETAIL_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    default:
        return state;
    }
}