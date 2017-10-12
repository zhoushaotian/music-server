// todo: 做一个musicAPIServer
'use strict';
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./controller/routes');
const handleErrorMid = require('./middlewares/handleError');

// 设置模板目录  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// 静态文件
app.use(express.static(path.join(__dirname, '/public')));

routes(app);

// 错误处理
app.use(handleErrorMid);

app.listen('3000', function() {
    console.log('music server is running at 3000');
});


