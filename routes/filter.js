/**
 * Created by cunkuan on 2017/10/13.
 */
var express = require('express');
var router = express.Router();

var User = require("../schema/mobile/user.js");          //schema User

exports.routerFilter = function (req, res, next) {
    var is_public = req.originalUrl.indexOf("/public");
    if (is_public === -1) {
        return next();
    } else {
        clientFun(req, res, next);
    }
};

var clientFun = function (req, res, next) {
    var url = req.originalUrl;
    var authorization = req.headers.authorization;

    if (url.indexOf("/mobile") != -1) {

    } else if (url.indexOf("/pc") != -1) {

    }
};