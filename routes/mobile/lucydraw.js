var passport = require('passport');
var LucyDraw = require("../../schema/lucydraw");
var LucyDrawRecord = require("../../schema/lucydrawrecord");
var LucyDrawQualification = require("../../schema/lucydrawqualification");

exports.mobileRouter = function (router) {
    /**
     * 抽奖算法
     */
    function getDraw(drawList) {
        var num = 0;
        var arr = [];
        for (var i = 0; i < drawList.length; i++) {
            num += drawList[i].drawProbability;
            arr.push(num);
        }
        var curNum = Math.floor(Math.random() * arr[arr.length - 1] + 1);
        for (var j = 0; j < arr.length; j++) {
            if (curNum < arr[j]) {
                if (drawList[j].drawCount > 0) {
                    return drawList[j];//抽到奖品
                } else {
                    return false;//为抽到奖品
                }
            }
        }
        return false;//为抽到奖品
    }

    /**
     * 是否可以抽奖
     */
    function isLucyDraw(lucydrawId, userId, countType, count, callback) {
        LucyDrawQualification.findOne({lucydrawId: lucydrawId, userId: userId}, function (err, qualificationResult) {
            if (err) {
                callback(500);
            } else {
                qualificationResult && (count += qualificationResult.count);
                var condition = {
                    lucydrawId: lucydrawId,
                    userId: userId
                };
                if (countType == '2') {
                    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0));
                    var startTime = new Date(timeStamp);
                    var endTime = new Date(timeStamp);
                    endTime = new Date(endTime.setDate(endTime.getDate() + 1));
                    condition.createTime = {
                        $gte: startTime,
                        $lte: endTime
                    };
                }
                LucyDrawRecord.find(condition, function (err, result) {
                    if (err) {
                        callback(500)
                    } else if (result.length < count) {
                        callback(true)
                    } else {
                        callback(false)
                    }
                })
            }
        });
    }

    /**
     * 抽奖
     */
    function getFun(lucydrawId, userId, callback) {
        LucyDraw.findOne({_id: lucydrawId}, function (err, result) {
            if (err) {
                callback(500);
            } else {
                if (result) {
                    if (Date.now() < result.startTime.getTime()) {
                        callback(2);//未开始
                    } else if (Date.now() > result.endTime.getTime()) {
                        callback(3);//已结束
                    } else {
                        isLucyDraw(lucydrawId, userId, result.countType, result.count, function (code) {
                            if (code === 500) {
                                callback(500);
                            } else if (code) {
                                var draw = getDraw(result.drawList);
                                if (draw) {
                                    callback(draw);
                                } else {
                                    callback(5);//没有抽到奖品
                                }
                            } else {
                                callback(4);//没有抽奖次数
                            }
                        });
                    }
                } else {
                    callback(1);//没有此活动
                }
            }
        });
    }

    /**
     * 抽奖记录 更新奖品
     */
    function drawReduce(userId, lucydrawId, draw, callback) {
        LucyDraw.update({
                _id: lucydrawId,
                'drawList._id': drawId
            },
            {
                $inc: {
                    "drawList.$.drawCount": -1
                }
            }, function (err, updateData) {
                if (error) {
                    callback(500);
                } else {
                    if (updateData.ok == '1') {
                        var data = {};
                        data.userId = userId;
                        data.lucydrawId = lucydrawId;
                        data.draw = draw;
                        LucyDrawRecord.save(function (err, result) {
                            if (err) {
                                callback(500);
                            } else {
                                callback(true);
                            }
                        })
                    } else {
                        callback(false);
                    }
                }
            });
    }

    router.post('/lucydraw/:lucydrawId', passport.authenticate('bearer', {session: false}), function (req, res, next) {
        var lucydrawId = req.params.lucydrawId;
        var userId = req.body.userId;

        getFun(lucydrawId, userId, function (code) {
            switch (code) {
                case 500:
                    res.json({
                        code: '500',
                        msg: "Error: 服务器错误"
                    });
                    break;
                case 1:
                    res.json({
                        code: '100100',
                        msg: "数据库未查询此活动"
                    });
                    break;
                case 2:
                    res.json({
                        code: '100200',
                        msg: "活动未开始"
                    });
                    break;
                case 3:
                    res.json({
                        code: '100300',
                        msg: "活动已结束"
                    });
                    break;
                case 4:
                    res.json({
                        code: '100400',
                        msg: "没有抽奖次数"
                    });
                    break;
                case 5:
                    res.json({
                        code: '100500',
                        msg: "没有抽到奖品"
                    });
                    break;
                default:
                    drawReduce(userId, lucydrawId, code, function (code) {
                        if (code == 500) {
                            res.json({
                                code: '500',
                                msg: "Error: 服务器错误"
                            });
                        } else if (code) {
                            res.json({
                                code: '0',
                                msg: code
                            });
                        } else {
                            res.json({
                                code: '100600',
                                msg: 'Error: 服务器错误'
                            });
                        }
                    });

            }
        });
    });
};


