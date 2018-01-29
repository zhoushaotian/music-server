'use strict';

const mysql = require('mysql');

const mysqlOptions = require('../config/server').mysqlOption;
const pool = mysql.createPool(mysqlOptions);
const STATUS_CODES = require('../enums/status');

module.exports.creatFavoriteList = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('insert into songList (name, time, createdBy) values (?,?,?)', ['我最喜欢的音乐', new Date().getTime(), userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};
/**
 * 创建歌单
 * @param {obj} opts 歌单配置
 */
module.exports.createSongList = function(opts) {
    return new Promise(function(resolve, reject) {
        pool.query('insert into songList (name, time, createdBy) values (?,?,?)', [opts.name, opts.time, opts.userId], function(err) {
            if(err) {
                return reject(err);
            }
            resolve();
        });
    });
};
/**
 * 删除歌单 删除之前确认创建者ID是否相符
 * @param {int} userId 用户ID
 * @param {int} songListId 歌单ID
 */
module.exports.deleteSongList = function(userId, songListId) {
    return new Promise(function(resolve, reject) {
        pool.query('select createdBy from songList where id = ?', [songListId], function(err, result) {
            if(err) {
                return reject(err);
            }
            if(result.length === 0) {
                let err = new Error('歌单不存在');
                err.status = STATUS_CODES.API_ERROR;
                return reject(err);
            }
            if(result[0].createdBy !== userId) {
                let err = new Error('非该歌单创建者');
                err.status = STATUS_CODES.API_ERROR;
                return reject(err);
            }
            return resolve();
        });
    }).then(function() {
        pool.query('delete from songList where id = ?', [songListId], function(err) {
            if(err) {
                return Promise.reject(err);
            }
            return Promise.resolve();
        });
    });
};
/**
 * 查询某个用户的最喜欢音乐歌单和创建歌单，包括最喜欢音乐歌单以及创建的歌单
 * 联songList/user两张表查询
 * @param {int} userId 用户ID
 */
module.exports.querySongList = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('select songList.id,songList.name,user.favoriteList from user,songList where user.userId = ?', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
/**
 * 查询用户收藏的歌单
 * @param {int} userId 用户ID
 */
module.exports.queryMarkedSongList = function(userId) {
    return new Promise(function(resolve, reject) {
        pool.query('select songList.name, songList.id from markSongListMap,songList where markSongListMap.userId=? and markSongListMap.songListId=songList.id', [userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
/**
 * 收藏歌单 确认歌单ID是否存在
 * @param {*int} songListId 歌单ID
 * @param {*int} userId 用户ID
 */
module.exports.markSongList = function(songListId, userId) {
    return new Promise(function(resolve, reject) {
        // 查是否有该歌单ID
        pool.query('select count(*) from songList where id = ?', [songListId], function(err, result) {
            if(result[0]['count(*)'] === 0) {
                let err = new Error('歌单不存在');
                err.status = STATUS_CODES.API_ERROR;
                return reject(err);
            }
            resolve();
        });
    }).then(function() {
        return new Promise(function(resolve, reject) {
            pool.query('select count(*) from markSongListMap where userId = ? and songListId = ?', [userId, songListId], function(err, result) {
                if(err) {
                    return reject(err);
                }
                return resolve(result[0]['count(*)']);
            });
        });
    }).then(function(count) {
        if(count !== 0) {
            let err = new Error('该歌单已经收藏');
            err.status = STATUS_CODES.API_ERROR;
            return Promise.reject(err);
        }
        return new Promise(function(resolve, reject) {
            pool.query('insert into markSongListMap (songListId, userId) values (?,?)', [songListId, userId], function(err) {
                if(err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};
/**
 * 取消收藏歌单
 * @param {*int} songListId 歌单ID
 * @param {*int} userId 用户ID
 */
module.exports.delMarkedSongList = function(songListId, userId) {
    return new Promise(function(resolve, reject) {
        pool.query('delete from markSongListMap where songListId = ? and userId = ?', [songListId, userId], function(err, result) {
            if(err) {
                return reject(err);
            }
            if(result.affectedRows === 0) {
                let err = new Error('未收藏该歌单');
                err.status = STATUS_CODES.API_ERROR;
                return reject(err);
            }
            resolve();
        });
    });
};