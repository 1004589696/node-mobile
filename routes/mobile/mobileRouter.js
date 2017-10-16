var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var User = require("../../schema/mobile/user.js");          //schema User

exports.mobileRouter = function (router) {

    /**
     * 插入用户信息
     */
    function IsOldUser(phone, callback) {
        User.findOne({phone: phone}, function (err, checkData) {
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

    router.post('/mobile/api/public/newuser', function (req, res, next) {
        console.log(111);
        if (!req.body.phone && !req.body.password) {
            res.json({
                code: '2',
                msg: "Error: 用户名或密码不能为空！"
            });
        }
        IsOldUser(req.body.phone, function (is_old) {
            if (is_old === '500') {
                res.json({
                    code: '500',
                    msg: "Error: The Server Error"
                });
            } else if (is_old) {
                res.json({
                    code: '1',
                    msg: req.body.phone + " 已注册过"
                });
            } else {
                var data = {
                    password: req.body.password,
                    phone: req.body.phone
                };
                var user = new User(data);
                user.save(function (err, result) {
                    if (err) {
                        res.json({
                            code: '500',
                            msg: "Error: The Server Error " + err
                        });
                    } else {
                        res.json({
                            code: '0',
                            data: result
                        });
                    }
                });
            }
        });
    });

    /**
     * 登录用户信息
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

    router.post('/mobile/api/public/login', function (req, res, next) {
        if (!req.body.phone && !req.body.password) {
            res.json({
                code: '2',
                msg: "Error: 用户名或密码不能为空！"
            });
        }
        User.findOne({phone: req.body.phone}, function (err, result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error: The Server Error " + err
                });
            } else {
                if (result) {
                    IsUser(req.body.password, result.password, function (code) {
                        if (code === '500') {
                            res.json({
                                code: '500',
                                msg: "Error: The Server Error"
                            });
                        } else if (code) {
                            res.json({
                                code: '0',
                                data: result
                            });
                        } else {
                            res.json({
                                code: '1',
                                msg: "用户名或密码错误"
                            });
                        }
                    });
                } else {
                    res.json({
                        code: '1',
                        msg: "用户名或密码错误"
                    });
                }
            }
        });
    });

};
