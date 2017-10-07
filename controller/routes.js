'use strict';
const api = require('./api');
const index = require('./index');

module.exports = function(app) {
    app.use(index.rootPath, index.router);
    app.use(api.rootPath, api.router);
    app.use(function(req, res) {
        res.render('not_found');
    });
}; 

