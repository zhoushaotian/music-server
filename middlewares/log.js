'use strict';
exports.preLog = function(req, res, next) {
    console.info('请求时间:', new Date().toString());
    console.info('请求地址:', req.ip);
    console.info('请求路径:', req.path);
    next();
};
