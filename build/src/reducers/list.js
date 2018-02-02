import {UPDATE_LIST, UPDATE_LIST_LOADING, CLEAN_LIST, UPDATE_CURRENT_PAGE, UPDATE_TOTAL, UPDATE_SERACH} from '../actions/list';

const INIT_SATE = {
    list: [],
    loading: false,
    total: 0,
    currentPage: 1,
    key: '',
    server: ''
};
export default function list(state = INIT_SATE, action) {
    switch (action.type) {
    case UPDATE_SERACH:
        return Object.assign({}, state, {
            key: action.data.key,
            server: action.data.server
        });
    case UPDATE_LIST:
        return Object.assign({}, state, {
            list: action.data
        });
    case UPDATE_LIST_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case CLEAN_LIST:
        return {
            list: [],
            loading: false
        };
    case UPDATE_CURRENT_PAGE: 
        return Object.assign({}, state, {
            currentPage: action.data
        });
    case UPDATE_TOTAL: 
        return Object.assign({}, state, {
            total: action.data
        });
    default:
        return state;
    }
}