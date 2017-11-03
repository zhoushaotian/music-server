import {UPDATE_DETAIL, CLEAN_DETAIL, UPDATE_DETAIL_LOADING, UPDATE_FIST_SHOW, UPDATE_CURRENT} from '../actions/detail';

const INIT_STATE = {
    url: '',
    songName: '',
    artist: '',
    img: '',
    loading: false,
    fistShow: true,
    currentSong: 0
};

export default function detail(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_CURRENT:
        return Object.assign({}, state, {
            currentSong: action.data
        });
    case UPDATE_DETAIL:
        return Object.assign({}, state, {
            url: action.data.url,
            songName: action.data.songName,
            artist: action.data.artist,
            img: action.data.img
        });
    case UPDATE_FIST_SHOW:
        return Object.assign({}, state, {
            fistShow: action.data
        });
    case UPDATE_DETAIL_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case CLEAN_DETAIL:
        return {
            url: '',
            songName: '',
            artist: '',
            img: '',
            loading: false,
            fistShow: true
        };
    default:
        return state;
    }
}