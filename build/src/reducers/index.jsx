import {combineReducers } from 'redux';

import list from './list';
import post from './post';

const appReducer = combineReducers({
    list,
    currentPost: post
});

export default appReducer;