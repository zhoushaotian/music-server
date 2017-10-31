import {combineReducers } from 'redux';

import list from './list.js';
import detail from './detail.js';
import user from './user.js';

const appReducer = combineReducers({
    list,
    detail,
    user
});

export default appReducer;