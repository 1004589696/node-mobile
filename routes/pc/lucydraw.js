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
                    result: result
                });
            }
        })
    });

    /**
     * 抽奖列表
     */
    router.get('/lucydrawlist', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var page = req.query.page || 0;
        var size = req.query.size || 10;
        var query = LucyDraw.find({});
        query.limit(parseInt(page));
        query.skip(parseInt(page) * parseInt(size));
        query.sort({createTime: 1});
        query.exec(function (err, result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error: 服务器错误"
                });
            } else {
                res.json({
                    code: '0',
                    result: result
                });
            }
        });
    });

    /**
     * 抽奖查询
     */
    router.get('/lucydraw', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var id = req.query.id;
        LucyDraw.findOne({_id:id},function (err,result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error: 服务器错误"
                });
            } else {
                res.json({
                    code: '0',
                    result: result
                });
            }
        });
    });

    /**
     * 抽奖编辑
     */
    router.put('/lucydraw', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var id = req.query.id;
        var data = req.body;
        LucyDraw.update({_id:id},data,function (err,result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error: 服务器错误"
                });
            } else {
                res.json({
                    code: '0',
                    result: result
                });
            }
        });
    });

    /**
     * 抽奖上下架
     */
    router.put('/lucydraw_effect', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var id = req.query.id;
        var effect = req.query.effect;
        LucyDraw.update({_id:id},{effect:effect},function (err,result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error: 服务器错误"
                });
            } else {
                res.json({
                    code: '0',
                    result: result
                });
            }
        });
    });

};