'use strict';
// 网易云音乐新歌推荐
const REQUEST_URL = 'http://music.163.com/api/playlist/detail';
const SONGLIST_ID = '3779629';
const superAgent = require('superagent');

/**
 * 返回数据格式: 
 * [
 *  {
 *      artist: xxx,
 *      img: xxx,
 *      serverName: netease,
 *      songId: xxx,
 *      songName: xxx，
 *      url: xxx
 *  }
 * ]
 */
function suggestSong() {
    return new Promise(function(resolve, reject) {
        superAgent.get(REQUEST_URL)
            .query({id: SONGLIST_ID})
            .then(function(res) {
                let data = res.body.result.tracks;
                let listData = data.map(function(song) {
                    return {
                        artist: song.artists[0].name,
                        img: song.album.picUrl + '?param=250y250',
                        serverName: 'netease',
                        songId: song.id,
                        songName: song.name
                    };
                });
                resolve(listData);
            }).catch(function(err) {
                reject(err);
            });
    });
}

module.exports = suggestSong;
