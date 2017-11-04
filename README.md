# 一个逐渐增强的web音乐播放器
## todo: 用react写一个musicserver  
已经完成基本功能: [线上地址](www.besttian.top:3001)
- 选择不同音乐源查询歌曲
- 点击查看按钮可弹出播放页面
- 点击下载按钮在PC端会下载该音乐文件
## todo: 增加登录账号功能,存储歌单，播放组件可传入一个歌单循环播放歌单中的音乐 
- created at 2017年10月26日
1. 登录功能使用redis做session的存储
2. 歌单保存功能用MySql或者mongodb  
- 歌单数据库  
user表: userId username passwd lastlogin
songList: songId songName songArtist serverName
songMap: userId songId

- 已经完成后台数据库全部接口
- 2017年10月31日 完成  前台登录注册以及session的界面 & store的重构 开始写播放列表
- 2017年11月3日 完成前台页面 发现store设计有问题  开始重构store  主要是detail与songList的耦合问题 
- react中阻止事件的冒泡:  合成事件   原生事件  
- 2017年11月4日 完成version2.0的基本功能