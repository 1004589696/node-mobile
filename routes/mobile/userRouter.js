var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var passport = require('passport');

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

    router.post('/public/newuser', function (req, res, next) {
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
                var secretOrPrivateKey = "dingcunkuan The NO.1";
                data.refresh_token = jwt.sign(data, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24 * 30  // 24*30小时过期
                });
                data.access_token = jwt.sign({password: req.body.password}, secretOrPrivateKey, {
                    expiresIn: 60  // 24小时过期
                });
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
                            data: {
                                refresh_token:data.refresh_token,
                                access_token:data.access_token
                            }
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

    router.post('/public/login', function (req, res, next) {
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
                            var reqData = {phone: req.body.phone, password: req.body.password};
                            var updateData = {};
                            var secretOrPrivateKey = "dingcunkuan The NO.1";
                            updateData.refresh_token = jwt.sign(reqData, secretOrPrivateKey, {
                                expiresIn: 60 * 60 * 24 * 30  // 24*30小时过期
                            });
                            updateData.access_token = jwt.sign({password: req.body.password}, secretOrPrivateKey, {
                                // expiresIn: 60 * 60 * 24  // 24小时过期
                                expiresIn: 60  // 24小时过期
                            });
                            User.update(reqData, updateData, function (error, updateResult) {
                                if (error) {
                                    res.json({
                                        code: '500',
                                        msg: "Error: The Server Error"
                                    });
                                } else {
                                    console.log(updateResult);
                                    if(updateResult.ok == '1'){
                                        res.json({
                                            code: '0',
                                            data: updateData
                                        });
                                    }
                                }
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

    router.get('/draw',passport.authenticate('bearer', { session: false }),function (req, res, next) {
        res.json({
            code: '1',
            msg: "用户名或密码错误"
        });
    });

};
