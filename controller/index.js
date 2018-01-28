'use strict';
const express = require('express');
const router = express.Router();
exports.rootPath = '/';

router.get('/', function(req, res) {
    if(!req.session.userId) {
        return res.redirect('/login');
    }
    return res.render('index');
});
router.get('/login', function(req, res) {
    return res.render('index');
});
exports.router = router;