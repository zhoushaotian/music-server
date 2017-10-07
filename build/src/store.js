import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import rootReducer from './reducers';

// 加入redux-devtools
const composeEnhancers = composeWithDevTools({});
const  loggerMid = createLogger();

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(
        thunkMiddleware,
        loggerMid
    ))
);

export default store;
