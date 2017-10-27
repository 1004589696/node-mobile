/**
 * 奖品信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../mongoose/db');

//奖品
var drawList = new Schema({
    drawName: {type: String},//名称
    drawGrade: {type: Number},//奖品等级
    drawCount: {type: Number},//奖品数量
    drawProbability: {type: Number},//奖品概率
});

//活动
var LucyDraw = new Schema({
    name: {type: String},
    startTime: {type: Date, default: Date.now},
    endTime: {type: Date, default: Date.now},
    desc:{type: String},
    countType:{type: String},
    count:{type: Number},
    effect:{type: Boolean},
    drawList: [drawList],
});


module.exports = db.nodeMobile.model('LucyDraw', LucyDraw);