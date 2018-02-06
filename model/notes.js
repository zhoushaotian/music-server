'use strict';

const mysql = require('mysql');

const mysqlOptions = require('../config/server').mysqlOption;
const pool = mysql.createPool(mysqlOptions);
const STATUS_CODE = require('../enums/status');

module.exports.queryNoteTotal = function() {
    return new Promise(function(resolve, reject) {
        pool.query('select count(*) from notes', function(err, result) {
            if(err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports.checkNote = function(id) {
    return new Promise(function(resolve, reject) {
        if(!id) {
            let err = new Error('缺少验证ID');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('select userId from notes where id = ?', [id], function(err, results) {
            if(err) {
                return reject(err);
            }
            if(results.length === 0) {
                let err = new Error('评论id不存在');
                err.status = STATUS_CODE.API_ERROR;
                return reject(err);
            }
            return resolve(results[0].userId);
        });
    });
};

module.exports.getNotes = function(currentPage, pages) {
    return new Promise(function(resolve, reject) {
        if(!currentPage || !pages) {
            let err = new Error('参数不正确');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        if(typeof pages !== 'number') {
            let err = new Error('参数错误');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        let total = (currentPage - 1) * pages;
        pool.query('select id,msg,name,notes.time,avatar,notes.userId from notes,user where notes.userId = user.userId order by id desc limit ?,?', [total, pages], function (err, result) {
            if(err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports.deleteNote = function(id) {
    return new Promise(function(resolve, reject) {
        if(!id) {
            let err = new Error('参数不正确');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('delete from notes where id = ?', [id], function(err, result) {
            if(err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports.addNote = function(userId, note) {
    return new Promise(function(resolve, reject) {
        if(!userId) {
            let err = new Error('缺少用户信息');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        if(!note.msg || !note.time) {
            let err = new Error('评论信息不完整');
            err.status = STATUS_CODE.API_ERROR;
            return reject(err);
        }
        pool.query('insert into notes (userId, msg, time) values (?,?,?)', [userId, note.msg, note.time], function(err, result) {
            if(err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};