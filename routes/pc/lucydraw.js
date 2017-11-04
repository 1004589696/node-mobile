var passport = require('passport');

var LucyDraw = require("../../schema/lucydraw");

exports.pcRouter = function (router) {
    /**
     * 新建抽奖
     */
    router.post('/addlucydraw', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var data = req.body;
        var lucyDrawObj = new LucyDraw(data);
        lucyDrawObj.save(function (err, result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error:" + err
                });
            } else {
                res.json({
                    code: '0',
                    data: result
                });
            }
        })
    });

    /**
     * 抽奖
     */
    function getDraw(drawList) {
        var num = 0;
        var arr = [];
        for (var i = 0; i < drawList.length; i++) {
            num += drawList[i].drawProbability;
            arr.push(num);
        }
        var curNum = Math.floor(Math.random() * arr[arr.length-1] + 1);
        for (var j = 0; j < arr.length; j++) {
            if (curNum < arr[j]) {
                if(drawList[j].drawCount>0){
                    return drawList[j]._id;
                }else{
                    return '400';
                }
            }
        }
        return '400';
    }

    function getFun(lucydrawid, callback) {
        LucyDraw.findOne({_id: lucydrawid}, function (err, result) {
            if (err) {
                callback('500')
            } else {
                if (result) {
                    if (Date.now() < result.startTime.getTime()) {
                        callback('200')
                    } else if (Date.now() > result.endTime.getTime()) {
                        callback('300')
                    } else {
                        var draw = getDraw(result.drawList);
                        if (draw == '400') {
                            callback('400');
                        } else {
                            callback(draw);
                        }
                    }
                } else {
                    callback('100')
                }
            }
        });
    }

    router.post('/lucydraw/:lucydrawid', function (req, res, next) {
        var lucydrawid = req.params.lucydrawid;
        getFun(lucydrawid, function (code) {
            switch (code) {
                case '500':
                    res.json({
                        code: '500',
                        msg: "Error: 服务器错误"
                    });
                    break;
                case '100':
                    res.json({
                        code: '100',
                        msg: "数据库未查询到奖品信息"
                    });
                    break;
                case '200':
                    res.json({
                        code: '200',
                        msg: "活动未开始"
                    });
                    break;
                case '300':
                    res.json({
                        code: '300',
                        msg: "活动已结束"
                    });
                    break;
                case '400':
                    res.json({
                        code: '400',
                        msg: "谢谢惠顾"
                    });
                    break;
                default:
                    res.json({
                        code: '0',
                        msg: code
                    });
            }
        });
    });

};


function drawReduce(lucydrawId, drawId) {
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

            } else {
                if (updateData.ok == '1') {

                }else{

                }
            }
        });
}

function drawReduce(lucydrawId, drawId) {
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

            } else {
                if (updateData.ok == '1') {

                }else{

                }
            }
        });
}


function drawRecord(lucydrawId, drawId) {
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

            } else {
                if (updateData.ok == '1') {

                }else{

                }
            }
        });
}




























