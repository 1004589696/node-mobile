var Admin = require("../../schema/admin");

var passport = require('passport');
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

exports.pcRouter = function (router) {
    /**
     * 管理员注册
     */
    function IsOldUser(username, callback) {
        Admin.findOne({username: username}, function (err, oldUserData) {
            if (err) {
                callback(500)
            } else if (oldUserData) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }

    router.post('/adminRegister', function (req, res, next) {
        var data = req.body;
        if (!data.username && !data.password) {
            res.json({
                code: '100200',
                msg: "用户名或密码不能为空"
            });
        }
        IsOldUser(data.username, function (code) {
            if (code === 500) {
                res.json({
                    code: '500',
                    msg: "Error: 服务器有脾气"
                });
            } else if (code) {
                res.json({
                    code: '100100',
                    msg: "已经是老用户"
                });
            } else {
                var adminObj = new Admin(data);
                adminObj.save(function (err, result) {
                    if (err) {
                        res.json({
                            code: '500',
                            msg: "Error:" + err
                        });
                    } else {
                        res.json({
                            code: '0',
                            msg: "请联系管理员激活"
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

    router.post('/adminLogin', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        if (!username && !password) {
            res.json({
                code: '100100',
                msg: "用户名或密码不能为空"
            });
        }
        Admin.findOne({username: username}, function (err, userData) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error:" + err
                });
            }
            if (userData) {
                if (!userData.status) {
                    res.json({
                        code: '100400',
                        msg: "该用户未被激活"
                    });
                }else{
                    IsUser(password, userData.password, function (code) {
                        if (code === '500') {
                            res.json({
                                code: '500',
                                msg: "Error: 服务器有脾气"
                            });
                        } else if (code) {
                            var secretOrPrivateKey = "dingcunkuan";
                            var token = jwt.sign({username: username, password: password}, secretOrPrivateKey, {
                                expiresIn: 60 * 60 * 24 // 24小时过期
                            });
                            res.json({
                                code: '0',
                                result: token
                            });
                        } else {
                            res.json({
                                code: '100200',
                                msg: "密码有误"
                            });
                        }
                    });
                }
            } else {
                res.json({
                    code: '100300',
                    msg: "没有此账户"
                });
            }
        })
    });

    /**
     * 管理员激活禁用
     */
    router.post('/adminUpdata', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var id = req.body.id;
        var status = req.body.status;
        if (!id || !status) {
            res.json({
                code: '100100',
                msg: "参数错误"
            });
        }
        Admin.update({id: id}, {status: status}, function (error, result) {
            if (error) {
                res.json({
                    code: '500',
                    msg: "Error: " + err
                });
            } else {
                if (result.ok == '1') {
                    res.json({
                        code: '0',
                        result: result
                    });
                } else {
                    res.json({
                        code: '100200',
                        msg: "更新失败"
                    });
                }
            }
        });
    });

    /**
     * 管理员列表
     */
    router.get('/adminList', passport.authenticate('bearerPC', {session: false}), function (req, res, next) {
        var startTime = req.query.startTime;
        var endTime = req.query.endTime;
        var status = req.query.status;
        var username = req.query.username;
        username = username && new RegExp("^.*" + username + ".*$");

        var condition = {};
        if (startTime && endTime) {
            condition.createTime = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            }
        }
        status && (condition.status = status);
        username && (condition.username = username);
        var page = parseInt(req.query.page || 0);
        var size = parseInt(req.query.size || 10);

        var query = Admin.find(condition, {username: 1, createTime: 1, status: 1});
        query.limit(size);
        query.skip(page * size);
        query.sort({createTime: 1});
        query.exec(function (err, result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error:" + err
                });
            } else {
                console.log(result);
                res.json({
                    code: '0',
                    data: result
                });
            }
        });
    });

};