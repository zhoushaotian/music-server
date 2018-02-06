import {UPDATE_SONG_INFO, UPDATE_PLAY_LIST, UPDATE_PLAY_STATUS} from '../actions/play_list';

const INIT_STATE = {
    img: '',
    songName: '',
    artist: '',
    url: '',
    serverName: '',
    playList: [],
    isPlay: false
};

export default function playList(state = INIT_STATE, action) {
    switch(action.type) {
    case UPDATE_SONG_INFO:
        return Object.assign({}, state, action.data);
    case UPDATE_PLAY_LIST:
        return Object.assign({}, state, {
            playList: action.data
        });
    case UPDATE_PLAY_STATUS:
        return Object.assign({}, state, {
            isPlay: action.data
        });
    default: 
        return state;
    }
} 