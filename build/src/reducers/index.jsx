import {combineReducers } from 'redux';

import list from './list';
import detail from './detail';

const appReducer = combineReducers({
    list,
    detail
});

export default appReducer;