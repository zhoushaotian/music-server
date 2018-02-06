import axios from 'axios';
export const timeCovert = function(time) {
    if(!time) {
        return '';
    }
    if(isNaN(time)) {
        return '';
    }
    if(typeof time === 'string') {
        time = parseInt(time);
    }
    let timeObj = new Date(time);
    let year = timeObj.getFullYear();
    let month = timeObj.getMonth() + 1;
    let day = timeObj.getDate();
    let hour = timeObj.getHours();
    let min = timeObj.getMinutes();
    let sec = timeObj.getSeconds();
    return `${year}年${month}月${day}日${hour}:${min < 10 ? 0 : ''}${min}:${sec < 10 ? 0 : ''}${sec}`;
};
/**
 * 请求参数转换
 * @param {*object} song 歌曲参数对象
 */
export const optsConvert = function(song) {
    if(song.artists) {
        // 服务器端返回的歌曲数据 
        return {
            songId: song.id,
            songName: song.name,
            serverName: song.server,
            artist: song.artists[0].name,
            img: song.album.cover
        };
    }
    return song;
};
/**
 * 获得歌曲url
 * @param {*int} id 歌曲id
 * @param {*string} server 来源
 */
export const fetchSongUrl = function(id, server) {
    return axios.get('api/get/song', {
        params: {
            id,
            server
        }
    }).then(function(res) {
        if(!res.data.success) {
            let err = new Error('请求歌曲失败');
            return Promise.reject(err);
        }
        return Promise.resolve(res.data.url);
    });
};