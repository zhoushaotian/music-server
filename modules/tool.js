'use strict';
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

