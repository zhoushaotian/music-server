import {CLEAN_USER, UPDATE_USER, UPDATE_LOADING, UPDATE_SHOWLOGIN, UPDATE_SHOWSIGNUP, UPDATE_SONGLIST, UPDATE_SHOWPLAYER} from '../actions/user';

const INIT_STATE = {
    name: '',
    login: false,
    loading: false,
    showLogin: false,
    showSignUp: false,
    showPlayer: false,
    songList: []
};

export default function user(state = INIT_STATE, action) {
    switch (action.type) {
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
    case UPDATE_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case UPDATE_USER:
        return Object.assign({}, state, action.data);
    case CLEAN_USER:
        return {
            name: '',
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