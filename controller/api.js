'use strict';
const express = require('express');
const router = express.Router();
const music = require('music-api');
const bodyParser = require('body-parser');
const sha1 = require('sha1');
const uuidv1 = require('uuid/v1');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('public', 'img'));
    },
    filename: function (req, file, cb) {
        cb(null, uuidv1() + '.' + 'jpg');
    }
});
const upload = multer({ storage }).single('avatar');
const path = require('path');



const MUSIC_SERVER = require('../enums/music_server').server;
const STATUS_CODE = require('../enums/status');
const tool = require('../modules/tool');
const checkLoginMid = require('../middlewares/check').checkLogin;
const user = require('../model/user');
const notes = require('../model/notes');
const songList = require('../model/songList');
exports.rootPath = '/api';

/**
 * 查询歌曲
 */
router.get('/search/song', function (req, res, next) {
    if (!req.query.key) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (Object.keys(MUSIC_SERVER).indexOf(req.query.server) === -1) {
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
    }).then(function (data) {
        res.send(tool.buildResSongData(data, vendor));
    }).catch(next);
});
/**
 * 根据songId获取歌曲地址
 */
router.get('/get/song', function (req, res, next) {
    if (!req.query.id) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (Object.keys(MUSIC_SERVER).indexOf(req.query.server) === -1) {
        let err = new Error('缺少必要参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let id = req.query.id;
    let vendor = req.query.server;
    music.getSong(vendor, {
        id,
        raw: false
    }).then(function (data) {
        res.send(tool.buildResSongData(data));
    }).catch(next);
});
/**
 * 获取登录信息
 */
router.get('/user', function (req, res) {
    if (req.session.userId) {
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
router.post('/login', bodyParser.json(), function (req, res, next) {
    function login() {
        let userName = req.body.userName;
        let passwd = sha1(req.body.passwd);
        user.queryUser(userName).then(function (result) {
            if (result.length === 0) {
                return res.send(tool.buildResData({
                    success: false
                }, '用户名不存在'));
            }
            if (result[0].passwd === passwd) {
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
    }
    if (req.session.userId) {
        // 先清空之前的登录状态
        req.session.regenerate(function(err) {
            if(err) {
                return res.send(tool.buildResData({
                    success: false
                }, '登录失败'));
            }
            login();
        });
    }else {
        login();
    }

});
/**
 * 用户注销
 */
router.get('/cancel', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
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
router.post('/signup', bodyParser.json(), function (req, res, next) {
    if (!req.body.userName) {
        let err = new Error('缺少用户名');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (!req.body.passwd) {
        let err = new Error('缺少密码');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (!req.body.name) {
        let err = new Error('缺少昵称');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let userName = req.body.userName;
    let passwd = sha1(req.body.passwd);
    let name = req.body.name;
    let avatar = req.body.avatar ? req.body.avatar : '/img/default.png';
    user.queryUser(userName).then(function (result) {
        if (result.length > 0) {
            return res.send(tool.buildResData({
                success: false
            }, '用户已存在'));
        }
        user.creatUser(userName, passwd, name, avatar).then(function (result) {
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
        }).catch(next);
    }).catch(next);
});

/**
 * 添加歌曲到歌单
 */
router.post('/add/song', checkLoginMid, bodyParser.json(), function (req, res, next) {
    if (!req.body.songId) {
        let err = new Error('缺少歌曲ID');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.searchSong(req.session.userId, req.body.songId).then(function (result) {
        if (result.length > 0) {
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
        }).then(function () {
            return res.send(tool.buildResData({
                success: true
            }, '添加成功'));
        }).catch(next);
    }).catch(next);
});

/**
 * 删除歌曲
 */
router.post('/delete/song', checkLoginMid, bodyParser.json(), function (req, res, next) {
    if (!req.body.songId) {
        let err = new Error('缺少歌曲ID');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    user.delSong(req.session.userId, req.body.songId).then(function (result) {
        console.log(result);
        if (result.affectedRows === 0) {
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
router.get('/songlist', checkLoginMid, function (req, res, next) {
    let queryListOper = Promise.all([songList.querySongList(req.session.userId), songList.queryMarkedSongList(req.session.userId)]);
    queryListOper.then(function(results) {
        let favoriteList;
        let songList = [];
        let markedSongList = [];
        results[0].forEach(function(list) {
            if(list.id === list.favoriteList) {
                favoriteList = list;
            }else {
                songList.push(list);
            }
            delete list.favoriteList;
        });
        markedSongList = results[1];
        res.send(tool.buildResData({
            success: true,
            songList,
            favoriteList,
            markedSongList
        }));
    }).catch(next);
});
router.post('/songlist/delete', checkLoginMid, bodyParser.json(), function(req, res, next) {
    // 删除用户创建的歌单
    if(!req.body.id) {
        let err = new Error('缺少歌单ID');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    songList.deleteSongList(req.session.userId, req.body.id).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '删除成功'));
    }).catch(next);
});
router.post('/songlist/add', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.name) {
        let err = new Error('缺少歌单名称');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    songList.createSongList({
        name: req.body.name,
        time: new Date().getTime(),
        userId: req.session.userId
    }).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '创建成功'));
    }).catch(next);
});
/**
 * 收藏歌单操作
 */
router.post('/marksonglist/add', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.id || Number.isNaN(req.body.id)) {
        let err = new Error('歌单ID不正确');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    songList.markSongList(req.body.id, req.session.userId).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '收藏歌单成功'));
    }).catch(next);
});

router.post('/marksonglist/delete', checkLoginMid, bodyParser.json(), function(req, res, next) {
    if(!req.body.id || Number.isNaN(req.body.id)) {
        let err = new Error('歌单ID不正确');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    songList.delMarkedSongList(req.body.id, req.session.userId).then(function() {
        res.send(tool.buildResData({
            success: true
        }, '取消收藏歌单成功'));
    }).catch(next);
});
/**
 * 上传用户头像
 */
router.post('/upload/avatar', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return next(err);
        }
        res.send(tool.buildResData({
            path: `/img/${req.file.filename}`,
            success: true
        }));
    });
});
/**
 * 添加评论
 */
router.post('/add/note', checkLoginMid, bodyParser.json(), function (req, res, next) {
    if (!req.body.msg) {
        let err = new Error('缺少评论信息');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    let time = new Date().getTime();
    notes.addNote(req.session.userId, {
        time,
        msg: req.body.msg
    }).then(function () {
        return res.send(tool.buildResData({
            success: true
        }, '评论成功'));
    }).catch(next);
});
/**
 * 查看评论
 */
router.get('/get/note', function (req, res, next) {
    if (!req.query.currentPage) {
        let err = new Error('缺少分页参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (!req.query.pages) {
        let err = new Error('缺少分页参数');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    if (Number.isNaN(parseInt(req.query.currentPage)) || Number.isNaN(parseInt(req.query.pages))) {
        let err = new Error('参数错误');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    Promise.all([notes.queryNoteTotal(), notes.getNotes(parseInt(req.query.currentPage), parseInt(req.query.pages))])
        .then(function (result) {
            console.log(result[1]);
            for (let note of result[1]) {
                if (parseInt(note.userId) === req.session.userId) {
                    note.own = true;
                } else {
                    note.own = false;
                }
            }
            res.send(tool.buildResData({
                success: true,
                data: result[1],
                total: result[0][0]['count(*)']
            }));
        }).catch(next);
});
/**
 * 删除评论
 */
router.post('/delete/note', checkLoginMid, bodyParser.json(), function (req, res, next) {
    if (!req.body.id) {
        let err = new Error('缺少评论ID');
        err.status = STATUS_CODE.API_ERROR;
        return next(err);
    }
    notes.checkNote(req.body.id).then(function (userId) {
        if (Number.isNaN(parseInt(req.body.id))) {
            let err = new Error('参数错误');
            err.status = STATUS_CODE.API_ERROR;
            return next(err);
        }
        if (parseInt(userId) !== req.session.userId) {
            let err = new Error('非该评论用户');
            err.status = STATUS_CODE.API_ERROR;
            return next(err);
        }
        notes.deleteNote(req.body.id).then(function () {
            res.send(tool.buildResData({
                success: true
            }, '删除成功'));
        }).catch(next);
    }).catch(next);
});
// 获取推荐歌曲
router.get('/suggest/song', function (req, res) {
    music.getSuggestSongs('qq', {
        limit: 10
    }).then(function (result) {
        res.send(result);
    });
});
exports.router = router;

