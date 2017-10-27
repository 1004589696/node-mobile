/**
 * 管理员 administrators 信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../mongoose/db');

var Admin = new Schema({
    username: {type: String},
    password: {type: String},
    createdate: {type: Date}
});

// 编译模型
module.exports = db.nodeMobile.model('Admin', Admin);