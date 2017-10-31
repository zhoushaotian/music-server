'use strict';
const STATUS_CODE = require('../enums/status');
/**
 * 构建歌曲数据
 * 
 * @param {object} data 歌曲数据
 * @param {string} server 服务类型 
 * @returns 
 */
exports.buildResSongData = function (data, server) {
    if(server) {
        data.songList.forEach(function (song) {
            song.server = server;
        });
    }
    console.log('发送数据:');
    console.log(JSON.stringify(data));
    return data;
};

exports.buildResData = function(data, msg) {
    let res = Object.create(null);
    res.status = STATUS_CODE.SUCCESS;
    res.msg = msg;
    res.data = data;
    console.log('发送数据:', JSON.stringify(res));
    return res;
};

