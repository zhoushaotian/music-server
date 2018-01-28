# 一个逐渐增强的web音乐播放器
## todo: 用react写一个musicserver  
已经完成基本功能: [线上地址] (www.besttian.top:3001)
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
## todo: 增加一个留言模块 created at 2017.11.27  
功能:  
- 留言  
- 评论  
完成接口 finished at 2017.11.30
完成功能 finished at 2017.12.2  
## todo: 项目已作为毕业设计，开始重构代码 created at 2018.1.25 
### 功能点  
1. 界面全部重写，仿照网易云音乐，左侧sider固定，顶部为登录信息，底部为播放控制器，右侧为内容展示。
2. 重构数据库，增加用户歌单。个人信息页增加字段，参照netease。
3. 增加登录页。未登录用户进入直接跳转登录注册页。 
### daily
完成登录页面 之后还需完善按需加载 finished at 2018.1.27
### 数据库重构
#### user  
字段|含义|类型
-|-|-|
userName|用户名|var
passwd|密码(已加密)|var
name|昵称|var
avatar|头像路径|var
userId|用户ID(自增)|int
time|创建时间|int
bio|个人签名|var
sex|性别|int
favoriteList|用户最喜欢歌曲表id|int
#### 歌单表
歌单表:
字段|含义|类型
-|-|-|
name|歌单名|var|
id|歌单ID|int|
time|创建时间|var|
img|歌单封面|var|
by|创建者Id|int|
#### songmap
字段|含义|类型
-|-|-|
songId|歌曲ID|var|
songName|歌曲名|var|
serverName|服务源|var|
artist|作者|var|
img|歌曲封面|var|
songListId|所属歌单Id|int|
### notice  
1. 发现之前写的devserver缺少html5history路由,查了一下vue-cli，已经换成webpack的devserver。see https://github.com/vuejs-templates/webpack/blob/develop/template/build/webpack.dev.conf.js#L24
2. antd组件库更新至 3.x.x
