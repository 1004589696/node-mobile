/**
 * 管理员 administrators 信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../mongoose/db');


var bcrypt = require('bcrypt');
const saltRounds = 10;


var Admin = new Schema({
    username: {type: String},
    password: {type: String},
    createTime: {type: Date,default:Date.now}
});

Admin.pre('save', function (next) {
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
module.exports = db.nodeMobile.model('Admin', Admin);