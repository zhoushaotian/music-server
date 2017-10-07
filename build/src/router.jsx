import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Demo from './pages/demo';
import store from './store';

export default (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Demo} />
        </Router>
    </Provider>
);