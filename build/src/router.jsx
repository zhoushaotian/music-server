import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import Demo from './pages/index';
import store from './store';
import LoginPage from './pages/login';

export default (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Demo}/>
            <Route path='/login' component={LoginPage}/>
        </Router>
    </Provider>
);