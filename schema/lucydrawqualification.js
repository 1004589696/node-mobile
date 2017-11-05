/**
 * 抽奖资格变动
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('./mongoose/db');

//活动
var LucyDrawQualification = new Schema({
    userId: {type: String},
    lucydrawId: {type: String},
    reason:{type: String},
    count:{type:Number,default: 0},
    createTime: {type: Date, default: Date.now}
});


module.exports = db.nodeMobile.model('LucyDrawQualification', LucyDrawQualification);