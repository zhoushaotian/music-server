'use strict';

const mysql = require('mysql');

const mysqlOptions = require('../config/server').mysqlOption;
const pool = mysql.createPool(mysqlOptions);
const STATUS_CODE = require('../enums/status');

const songList = require('./songList');


module.exports.creatUser = function(userName, passwd, name, avatar, time) {
    let newUser = new Promise(function(resolve, reject) {
        pool.query('insert into user (userName,passwd,name,avatar,time) values (?,?,?,?,?)', [userName, passwd, name, avatar, time], function(err, results) {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
    let newUserId;
    return newUser.then(function(result) {
        if(!result.insertId) {
            return new Promise.reject('新增用户失败');
        }
        newUserId = result.insertId;
        // 拿到新增用户的ID，创建默认歌单
        return songList.creatFavoriteList(result.insertId);
    }).then(function(newSongList) {
        return new Promise(function(resolve, reject) {
            pool.query(`update user set favoriteList = ? where userId = ${newUserId}`, [newSongList.insertId], function(err) {
                if(err) {
                    return reject(err);
                }
                return resolve({
                    insertId: newUserId
                });
            });
        });
    });
};
module.exports.queryUserById = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('select * from user where userId = ? ', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
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

module.exports.modifyInfo = function(userId, bio) {
    return new Promise(function(resolve, reject) {
        if(!bio) {
            let err = new Error('请输入更改的bio');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        if(!userId) {
            let err = new Error('缺少用户ID');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('update user set bio = ? where userId = ?', [bio, userId], function(err) {
            if(err) {
                return reject(err);
            }
            return resolve();
        });
    });
};