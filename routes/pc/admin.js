var Admin = require("../../schema/pc/admin");

var passport = require('passport');
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.pcRouter = function (router) {
    /**
     * 管理员注册
     */
    function IsOldUser(username,callback) {
        Admin.findOne({username:username},function (err,oldUserData) {
            if(err){
                callback(500)
            }else if(oldUserData){
                callback(true)
            }else{
                callback(false)
            }
        })
    }
    router.post('/adminRegister', function (req, res, next) {
        var data = req.body;
        if(!data.username&&!data.password){
            res.json({
                code: '100200',
                msg: "用户名或密码不能为空"
            });
        }
        IsOldUser(data.username,function (code) {
            if(code===500){
                res.json({
                    code: '500',
                    msg: "Error: 服务器有脾气"
                });
            }else if(code){
                res.json({
                    code: '100100',
                    msg: "已经是老用户"
                });
            }else{
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
            }
        });
    });

    /**
     * 管理员登录
     */
    function IsUser(password, hash, callback) {
        bcrypt.compare(password, hash, function (err, checkData) {
            if (err) {
                callback('500')
            } else {
                if (checkData) {
                    callback(true)
                } else {
                    callback(false)
                }
            }
        });
    }
    router.post('/adminLogin', function(req, res, next){
        var username = req.body.username;
        var password = req.body.password;
        if(!username&&!password){
            res.json({
                code: '100100',
                msg: "用户名或密码不能为空"
            });
        }
        Admin.findOne({username:username},function (err,userData) {
            if(err){
                res.json({
                    code: '500',
                    msg: "Error:" + err
                });
            }
            if(userData){
                IsUser(password,userData.password,function (code) {
                    if (code === '500') {
                        res.json({
                            code: '500',
                            msg: "Error: 服务器有脾气"
                        });
                    } else if (code) {
                        var secretOrPrivateKey = "dingcunkuan";
                        var token = jwt.sign({username:username,password:password}, secretOrPrivateKey, {
                            expiresIn: 60 * 60 * 24 // 24小时过期
                        });
                        res.json({
                            code: '0',
                            data: token
                        });
                    } else {
                        res.json({
                            code: '100200',
                            msg: "密码有误"
                        });
                    }
                });
            }else{
                res.json({
                    code: '100300',
                    msg: "没有此账户"
                });
            }
        })
    });





    // router.post('/adminLogin', passport.authenticate('bearerPC', {session: false}), function(req, res, next){
    //     res.json({
    //         code: '500',
    //         msg: "Error:" + err
    //     });
    // });
};