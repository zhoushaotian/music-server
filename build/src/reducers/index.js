import {combineReducers } from 'redux';

import list from './list.js';
import detail from './detail.js';
import user from './user.js';
import notes from './notes.js';
import songList from './song_list.js';
import playList from './play_list.js';

const appReducer = combineReducers({
    list,
    detail,
    user,
    notes,
    songList,
    playList
});

export default appReducer;