import {UPDATE_URL, CLEAN_DETAIL, UPDATE_LOADING} from '../actions/detail';

const INIT_STATE = {
    url: '',
    loading: false
};

export default function detail(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_URL:
        return Object.assign({}, state, {
            url: action.data
        });
    case UPDATE_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case CLEAN_DETAIL:
        return {
            detail: {},
            loading: false
        };
    default:
        return state;
    }
}