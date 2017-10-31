var Admin = require("../../schema/pc/admin");

var passport = require('passport');
var jwt = require("jsonwebtoken");

exports.pcRouter = function (router) {
    /**
     * 管理员注册
     */
    router.post('/adminRegister', function (req, res, next) {
        var data = req.body;
        var adminObj = new Admin(data);
        adminObj.save(function (err, result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error:" + err
                });
            } else {
                var secretOrPrivateKey = "dingcunkuan";
                var token = jwt.sign(data, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24 // 24小时过期
                });
                res.json({
                    code: '0',
                    data: token
                });
            }
        })
    });

    /**
     * 管理员登录
     */
    router.post('/adminLogin', passport.authenticate('local', { failureRedirect: '/login' }),function(err, user, info){
        console.log(err, user, info);
        if(err) {
            res.json({
                code: '500',
                msg: "Error:" + err
            });
        }
        if(!user) {
            var secretOrPrivateKey = "dingcunkuan";
            var token = jwt.sign(data, secretOrPrivateKey, {
                expiresIn: 60 * 60 * 24 // 24小时过期
            });
            res.json({
                code: '0',
                data: token
            });
        }
    });
};