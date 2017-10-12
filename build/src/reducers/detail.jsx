import {UPDATE_DETAIL, CLEAN_DETAIL, UPDATE_LOADING} from '../actions/detail';

const INIT_STATE = {
    detail: {},
    loading: false
};

export default function detail(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_DETAIL:
        return Object.assign({}, state, {
            detail: action.data
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