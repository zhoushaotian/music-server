import { actionsType } from '../actions';

export default function list(state = [], action) {
    switch (action.type) {
    case actionsType.GET_LIST:
        return [...action.list];
    default:
        return state;
    }
}