'use strict';
module.exports.server = {
    'netease': '网易云音乐',
    'qq': 'QQ音乐'
};

module.exports.navigation = [
    {
        key: 'findSong',
        title: '发现音乐',
        icon: 'bulb'
    },
    {
        key: 'findList',
        title: '发现歌单',
        icon: 'bars'
    },
    {
        key: 'myInfo',
        title: '我的信息',
        icon: 'idcard'
    },
    {
        key: 'loveSong',
        title: '我喜欢的歌曲',
        icon: 'heart'
    },
    {
        key: 'addSonglist',
        title: '创建歌单',
        icon: 'plus'
    },
    {
        key: 'myList',
        title: '我的歌单',
        icon: 'profile',
        dynamic: true,
        children: []
    },
    {
        key: 'songList',
        title: '我收藏的歌单',
        dynamic: true,
        icon: 'database',
        children: []
    },
    {
        key: 'myNote',
        title: '所有留言',
        icon: 'message'
    }
];