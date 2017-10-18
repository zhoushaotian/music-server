'use strict';
const STATUS_CODE = require('../enums/status');
/**
 * 错误处理中间件
 * 
 * @param {any} err 错误对象 
 * @param {any} req 请求对象
 * @param {any} res 响应对象
 * @param {any} next 
 */
function handleErrorMid(err, req, res, next) {
    switch (err.status) {
    case STATUS_CODE.API_ERROR:
        res.status(err.status).send({
            msg: err.message
        });
        break;
    default:
        res.status(500).send({
            msg: '系统错误'
        });
        break;
    }
}

module.exports = handleErrorMid;