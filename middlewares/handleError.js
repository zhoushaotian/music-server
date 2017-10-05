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
function handleErrorMid(err, req, res) {
    switch (err.status) {
    case STATUS_CODE.API_ERROR:
        res.status(500).send({
            msg: err.message
        });
        break;
    case STATUS_CODE.NOT_FOUND:
        res.render('not_found');
        break;
    default:
        res.status(500).send({
            msg: err.message
        });
        break;
    }
}

module.exports = handleErrorMid;