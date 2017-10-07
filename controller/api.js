'use strict';
const express = require('express');
const router = express.Router();
const music = require('music-api');
const MUSIC_SERVER = require('../enums/music_server');
const STATUS_CODE = require('../enums/status');

exports.rootPath = '/api';
/**
 * 查询歌曲
 */
router.get('/search/song', function(req, res, next) {
    if(!req.query.key) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(MUSIC_SERVER.indexOf(req.query.server) === -1) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let key = req.query.key;
    let vendor = req.query.server;
    music.searchSong(vendor, {
        key,
        limit: 10,
        page: 1,
        raw: false
    }).then(function(data) {
        res.send(data);
    }).catch(next);
});
/**
 * 根据songId获取歌曲地址
 */
router.get('/get/song', function(req, res, next) {
    if(!req.query.id) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(MUSIC_SERVER.indexOf(req.query.server) === -1) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let id = req.query.id;
    let vendor = req.query.server;
    music.getSong(vendor, {
        id,
        raw: false
    }).then(function(data) {
        res.send(data);
    }).catch(next);
});

exports.router = router;

