import {CLEAN_USER, UPDATE_USER, UPDATE_USER_LOADING, UPDATE_SHOWLOGIN, UPDATE_SHOWSIGNUP, UPDATE_SONGLIST, UPDATE_SHOWPLAYER, ADD_SONG_NO_SAVE, DELETE_SONG} from '../actions/user';

const INIT_STATE = {
    name: '',
    avatar: '',
    login: false,
    loading: false,
    showLogin: false,
    showSignUp: false,
    showPlayer: false,
    songList: []
};

export default function user(state = INIT_STATE, action) {
    switch (action.type) {
    case DELETE_SONG:
        state.songList.splice(action.data, 1);
        return Object.assign({}, state, {
            songList: state.songList
        });
    case ADD_SONG_NO_SAVE:
        return Object.assign({}, state, {
            songList: [].concat(state.songList, [action.data])
        });
    case UPDATE_SHOWPLAYER:
        return Object.assign({}, state, {
            showPlayer: action.data
        });
    case UPDATE_SONGLIST:
        return Object.assign({}, state, {
            songList: action.data
        });
    case UPDATE_SHOWSIGNUP:
        return Object.assign({}, state, {
            showSignUp: action.data
        });
    case UPDATE_SHOWLOGIN:
        return Object.assign({}, state, {
            showLogin: action.data
        });
    case UPDATE_USER_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case UPDATE_USER:
        return Object.assign({}, state, action.data);
    case CLEAN_USER:
        return {
            name: '',
            avatar: '',
            login: false,
            loading: false,
            showLogin: false,
            showSignUp: false,
            showPlayer: false,
            songList: []
        };
    default:
        return state;
    }
}