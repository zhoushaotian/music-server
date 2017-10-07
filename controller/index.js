'use strict';
const express = require('express');
const router = express.Router();
exports.rootPath = '/';

router.get('/', function(req, res) {
    return res.render('index');
});

exports.router = router;