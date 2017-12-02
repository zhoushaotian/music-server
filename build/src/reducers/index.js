import {combineReducers } from 'redux';

import list from './list.js';
import detail from './detail.js';
import user from './user.js';
import notes from './notes.js';

const appReducer = combineReducers({
    list,
    detail,
    user,
    notes
});

export default appReducer;