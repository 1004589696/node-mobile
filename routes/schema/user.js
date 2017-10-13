/**
 * Created by cunkuan on 2017/10/13.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../mongoose/db');

var User = new Schema({
    username: {type: String},
    password: {type: String},
    createTime: {type: Date, default: Date.now}
});

// 编译模型
module.exports = db.nodeMobile.model('User', User);