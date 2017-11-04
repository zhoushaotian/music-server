'use strict';
const express = require('express');
const router = express.Router();
const music = require('music-api');
const bodyParser = require('body-parser');
const sha1 = require('sha1');
const uuidv1 = require('uuid/v1');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve('public', 'img'));
    },
    filename: function(req, file, cb) {
        cb(null, uuidv1() + '.' + 'jpg');
    }
});
const upload = multer({storage}).single('avatar');
const path = require('path');



const MUSIC_SERVER = require('../enums/music_server');
const STATUS_CODE = require('../enums/status');
const tool = require('../modules/tool');
const checkLoginMid = require('../middlewares/check').checkLogin;
const user = require('../model/user');
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
    if(Object.keys(MUSIC_SERVER).indexOf(req.query.server) === -1) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let key = req.query.key;
    let vendor = req.query.server;
    let page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    music.searchSong(vendor, {
        key,
        limit: 10,
        page,
        raw: false
    }).then(function(data) {
        res.send(tool.buildResSongData(data, vendor));
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
    if(Object.keys(MUSIC_SERVER).indexOf(req.query.server) === -1) {
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
        res.send(tool.buildResSongData(data));
    }).catch(next);
});
/**
 * 获取登录信息
 */
router.get('/user', function(req, res) {
    if(req.session.userId) {
        return res.send(tool.buildResData({
            name: req.session.name,
            avatar: req.session.avatar,
            login: true
        }, '获取登录状态成功'));
    }
    return res.send(tool.buildResData({
        name: '',
        login: false
    }, '获取登录状态成功'));
});
/**
 * 登录
 */
router.post('/login', bodyParser.json(), function(req, res, next) {
    if(req.session.userId) {
        return res.send(tool.buildResData({
            login: true
        }, '已经登录'));
    }
    console.log(req.body);
    let userName = req.body.userName;
    let passwd = sha1(req.body.passwd);
    user.queryUser(userName).then(function(result) {
        if(result.length === 0) {
            return res.send(tool.buildResData({
                success: false
            }, '用户名不存在'));
        }
        console.log(result);
        if(result[0].passwd === passwd) {
            req.session.userId = result[0].userId;
            req.session.name = result[0].name;
            req.session.avatar = result[0].avatar;
            return res.send(tool.buildResData({
                success: true,
                name: result[0].name,
                avatar: result[0].avatar
            }, '登录成功'));
        }
        return res.send(tool.buildResData({
            success: false
        }, '密码错误'));
    }).catch(next);
});
/**
 * 用户注销
 */
router.get('/cancel', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            return res.send(tool.buildResData({
                succcess: false
            }, '注销失败'));
        }
        return res.send(tool.buildResData({
            success: true
        }, '注销成功'));
    });
});
/**
 * 注册用户
 */
router.post('/signup', bodyParser.json(), function(req, res, next) {
    if(!req.body.userName) {
        let err = new Error('缺少用户名');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.passwd) {
        let err = new Error('缺少密码');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if(!req.body.name) {
        let err = new Error('缺少昵称');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let userName = req.body.userName;
    let passwd = sha1(req.body.passwd);
    let name = req.body.name;
    let avatar = req.body.avatar ? req.body.avatar : '/img/default.png';
    user.queryUser(userName).then(function(result) {
        if(result.length > 0) {
            return res.send(tool.buildResData({
                success: false
            }, '用户已存在'));
        }
        user.creatUser(userName, passwd, name, avatar).then(function(result) {
            // 写session
            req.session.name = name;
            req.session.userId = result.insertId;
            req.session.avatar = avatar;
            console.log('新用户注册-userId:', req.session.userId);
            return res.send(tool.buildResData({
                success: true,
                name: name,
                avatar: avatar
            }, '创建用户成功'));
        });
    }).catch(next);
});

/**
 * 添加歌曲到歌单
 */
router.post('/add/song', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.songId) {
        let err = new Error('缺少歌曲ID');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.searchSong(req.session.userId, req.body.songId).then(function(result) {
        if(result.length > 0) {
            return res.send(tool.buildResData({
                success: false
            }, '歌曲已经存在'));
        }
        user.addSong(req.session.userId, {
            songId: req.body.songId,
            songName: req.body.songName,
            serverName: req.body.serverName,
            artist: req.body.artist,
            img: req.body.img
        }).then(function() {
            return res.send(tool.buildResData({
                success: true
            }, '添加成功'));
        }).catch(next);
    }).catch(next);
});

/**
 * 删除歌曲
 */
router.post('/delete/song', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.songId) {
        let err = new Error('缺少歌曲ID');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.delSong(req.session.userId, req.body.songId).then(function(result) {
        console.log(result);
        if(result.affectedRows === 0) {
            return res.send(tool.buildResData({
                success: false
            }, '歌曲不存在'));
        }
        return res.send(tool.buildResData({
            success: true
        }, '删除成功'));
    }).catch(next);
});
/**
 * 查询用户的歌单
 */
router.get('/songlist', checkLoginMid, function(req, res, next) {
    user.querySongList(req.session.userId).then(function(result) {
        console.log(result);
        res.send(tool.buildResData({
            success: true,
            songList: result
        }, '查询成功'));
    }).catch(next);
});
/**
 * 上传用户头像
 */
router.post('/upload/avatar', function(req, res, next) {
    upload(req, res, function(err) {
        if(err) {
            return next(err);
        }
        res.send(tool.buildResData({
            path: `/img/${req.file.filename}`,
            success: true
        }));
    });
});
exports.router = router;

