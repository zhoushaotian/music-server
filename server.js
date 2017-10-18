'use strict';
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.config.js');
const proxyConfig = require('./proxy');

const app = express();
const compiler = webpack(webpackConfig);

//devmiddleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});
//hotmiddleware
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => { }
});

//当html-webpack-plugin template改变的时候强制reload
compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});
//HTTP请求代理
Object.keys(proxyConfig).forEach(function (context) {
    var options = proxyConfig[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});
app.use(devMiddleware);
app.use(hotMiddleware);
//设置静态目录
app.use('./dist', express.static(path.join(__dirname, '/dist')));
app.listen('8080');