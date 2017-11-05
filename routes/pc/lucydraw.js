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

};