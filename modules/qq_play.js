'use strict';
const superAgent = require('superagent');
// const targetUrl = 'http://i.y.qq.com/s.music/fcgi-bin/search_for_qq_cp';
const targetGetSongUrl = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

// function getSearchQuery(keyword, curPage) {
//     return {
//         g_tk: 938407465,
//         uin: 0,
//         format: 'jsonp',
//         inCharset: 'utf-8',
//         outCharset: 'utf-8',
//         notice: 0,
//         platform: 'h5',
//         needNewCode: 1,
//         w: keyword,
//         zhidaqu: 1,
//         catZhidaL: 1,
//         t: 0,
//         flag: 1,
//         ie: 'utf-8',
//         sem: 1,
//         aggr: 0,
//         perpage: 20,
//         n: 20,
//         p: curPage,
//         remoteplace: 'txt.mqq.all',
//         _: 1459991037831
//     };
// }


// function searchSong(keyword, curPage) {
//     return new Promise(function (resolve, reject) {
//         superAgent.get(targetUrl)
//             .query(getSearchQuery(keyword, curPage))
//             .buffer(true)
//             .end(function (err, res) {
//                 if(err) {
//                     return reject(err);
//                 }
//                 let resultStr = res.text.slice(res.text.indexOf('{'), res.text.length - 1);
//                 let resultList = JSON.parse(resultStr).data.song.list.map(function (song) {
//                     return {
//                         id: 'qqtrack_' + song.songmid,
//                         name: song.songname,
//                         artist: song.singer[0].name
//                     };
//                 });
//                 resolve(resultList);
//             });
//     });
// }

function getSongUrl(id) {
    return new Promise(function(resolve, reject) {
        superAgent.get(targetGetSongUrl)
            .query({
                g_tk: 195219765,
                jsonpCallback: 'MusicJsonCallback004680169373158849',
                loginUin: 1297716249,
                hostUin: 0,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0,
                cid: 205361747,
                callback: 'MusicJsonCallback004680169373158849',
                uin: 1297716249,
                songmid: id,
                filename: 'C400' + id + '.m4a',
                guid: 7332953645
            }).buffer(true).end(function(err, res) {
                if(err) {
                    return reject(err);
                }
                let bufferStr = res.body.toString('utf-8');
                let data = JSON.parse(bufferStr.slice(bufferStr.indexOf('(') + 1, bufferStr.length - 1));
                let token = data.data.items[0].vkey;
                let url = 'http://dl.stream.qqmusic.qq.com/C400' +
                id  +
                '.m4a?vkey=' + token +
                '&uin=1297716249&fromtag=0&guid=7332953645';
                resolve({
                    success: true,
                    url
                });
            });
    });
}

module.exports = getSongUrl;

