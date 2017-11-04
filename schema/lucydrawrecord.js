/**
 * 奖品记录信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('./mongoose/db');


var LucyDrawRecord = new Schema({
    userId: {type: String},
    lucydrawId: {type: String},
    draw: {type: Object},
    createTime: {type: Date, default: Date.now},
});

module.exports = db.nodeMobile.model('LucyDrawRecord', LucyDrawRecord);