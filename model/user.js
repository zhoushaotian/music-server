'use strict';

const mysql = require('mysql');

const mysqlOptions = require('../config/server').mysqlOption;
const pool = mysql.createPool(mysqlOptions);
const STATUS_CODE = require('../enums/status');



module.exports.creatUser = function(userName, passwd, name) {
    return new Promise(function(resolve, reject) {
        pool.query('insert into user (userName,passwd,name) values (?,?,?)', [userName, passwd, name], function(err, results) {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports.queryUser = function(userName) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from user where userName = ?', [userName], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.searchSong = function(userId, songId) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from song_map where songId= ? and userId = ?', [songId, userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.addSong = function(userId, song) {
    return new Promise(function(resolve, reject) {
        if(!song.songId || !song.songName || !song.serverName) {
            let err = new Error('参数不正确');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('insert into song_map (userId, songId, songName, serverName, artist, img) values(?,?,?,?,?,?)', [
            userId, song.songId, song.songName, song.serverName, song.artist, song.img
        ], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.delSong = function(userId, songId) {
    return new Promise(function(resolve, reject) {
        if(!songId) {
            let err = new Error('参数不正确');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        if(!userId) {
            let err = new Error('参数不正确');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('delete from song_map where userId = ? and songId = ?', [userId, songId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.querySongList = function(userId) {
    return new Promise(function(resolve, reject) {
        if(!userId) {
            let err = new Error('缺少用户ID');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('select * from song_map where userId = ?', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};