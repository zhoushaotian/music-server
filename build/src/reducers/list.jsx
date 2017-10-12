import {UPDATE_LIST, UPDATE_LOADING, CLEAN_LIST} from '../actions/list';

const INIT_SATE = {
    list: [],
    loading: false
};
export default function list(state = INIT_SATE, action) {
    switch (action.type) {
    case UPDATE_LIST:
        return Object.assign({}, state, {
            list: action.data
        });
    case UPDATE_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case CLEAN_LIST:
        return {
            list: [],
            loading: false
        };
    default:
        return state;
    }
}