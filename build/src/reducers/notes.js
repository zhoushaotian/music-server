import {UPDATE_NOTE_LOADING, UPDATE_NOTES} from '../actions/notes';


const INIT_STATES = {
    loading: false,
    notes: [],
    total: 0
};

export default function  notes(state = INIT_STATES, action) {
    switch(action.type) {
    case UPDATE_NOTE_LOADING:
        return Object.assign({}, state, {
            loading: action.data
        });
    case UPDATE_NOTES:
        return Object.assign({}, state, {
            notes: action.data.notes,
            total: action.data.total
        });
    default:
        return state;
    }
}