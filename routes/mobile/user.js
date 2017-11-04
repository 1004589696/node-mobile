var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var passport = require('passport');
var secretOrPrivateKey = "dingcunkuan The NO.1";

var User = require("../../schema/user.js");          //schema User

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

    router.post('/user/add', function (req, res, next) {
        if (!req.body.phone || !req.body.password) {
            res.json({
                code: '100100',
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
                    code: '100200',
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
                        var refresh_token = jwt.sign(data, secretOrPrivateKey, {
                            expiresIn: 60 * 60 * 24 * 2  // 2*24小时过期
                        });
                        var access_token = jwt.sign(data, secretOrPrivateKey, {
                            expiresIn: 60 * 60 * 24  // 24小时过期
                        });
                        res.json({
                            code: '0',
                            result: {
                                refresh_token: refresh_token,
                                access_token: access_token
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

    router.post('/user/login', function (req, res, next) {
        var reqData = {phone: req.body.phone, password: req.body.password};
        if (!reqData.phone || !reqData.password) {
            res.json({
                code: '100100',
                msg: "Error: 用户名或密码不能为空！"
            });
        }
        User.findOne({phone: reqData.phone}, function (err, result) {
            if (err) {
                res.json({
                    code: '500',
                    msg: "Error: The Server Error " + err
                });
            } else {
                if (result) {
                    IsUser(reqData.password, result.password, function (code) {
                        if (code === '500') {
                            res.json({
                                code: '500',
                                msg: "Error: The Server Error"
                            });
                        } else if (code) {
                            var refresh_token = jwt.sign(reqData, secretOrPrivateKey, {
                                expiresIn: 60 * 60 * 24 * 2  // 2*30小时过期
                            });
                            var access_token = jwt.sign(reqData, secretOrPrivateKey, {
                                expiresIn: 60 * 60 * 24  // 24小时过期
                            });
                            res.json({
                                code: '0',
                                result: {
                                    refresh_token: refresh_token,
                                    access_token: access_token
                                }
                            });
                        } else {
                            res.json({
                                code: '100200',
                                msg: "密码错误"
                            });
                        }
                    });
                } else {
                    res.json({
                        code: '100300',
                        msg: "用户名错误"
                    });
                }
            }
        });
    });

    /**
     *  refresh token
     */
    router.post('/user/refreshToken', function (req, res, next) {
        var token = req.body.token;
        if (!token) {
            res.json({
                code: '100100',
                msg: "Error: Token不能为空！"
            });
        }
        jwt.verify(token, 'dingcunkuan The NO.1', function (err, decoded) {
            if (decoded) {
                User.findOne({phone: decoded.phone}, function (err, result) {
                    if (err) {
                        res.json({
                            code: '500',
                            msg: "Error: The Server Error" + err
                        });
                    }
                    if (result) {
                        bcrypt.compare(decoded.password, result.password, function (err, checkData) {
                            if (err) {
                                res.json({
                                    code: '500',
                                    msg: "Error: The Server Error" + err
                                });
                            }
                            if (checkData) {
                                var obj = {};
                                obj.password = decoded.password;
                                obj.phone = decoded.phone;
                                var refresh_token = jwt.sign(obj, secretOrPrivateKey, {
                                    expiresIn: 60 * 60 * 24 * 2  // 24*30小时过期
                                });
                                var access_token = jwt.sign(obj, secretOrPrivateKey, {
                                    expiresIn: 60 * 60 * 24  // 24小时过期
                                });
                                res.json({
                                    code: '0',
                                    result: {
                                        refresh_token: refresh_token,
                                        access_token: access_token
                                    }
                                });
                            } else {
                                res.json({
                                    code: '100200',
                                    msg: "Error: refreshToken失效"
                                });
                            }
                        });
                    } else {
                        res.json({
                            code: '100200',
                            msg: "Error: refreshToken失效"
                        });
                    }
                })
            } else {
                res.json({
                    code: '100200',
                    msg: "Error: refreshToken失效"
                });
            }
        });
    });

    // router.get('/draw', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    //     res.json({
    //         code: '1',
    //         msg: "用户名或密码错误"
    //     });
    // });

};
