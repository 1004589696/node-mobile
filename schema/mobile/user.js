/**
 * Created by cunkuan on 2017/10/13.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../mongoose/db');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var User = new Schema({
    phone: {type: String},
    password: {type: String},
    createTime: {type: Date, default: Date.now}
});


// 使用pre中间件在用户信息存储前进行密码加密
User.pre('save', function (next) {
    const that = this;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(that.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            that.password = hash;
            next();
        });
    });
});


// 编译模型
module.exports = db.nodeMobile.model('User', User);