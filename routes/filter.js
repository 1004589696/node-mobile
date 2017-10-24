/**
 * Created by cunkuan on 2017/10/13.
 */
var express = require('express');
var router = express.Router();

exports.routerFilter = function (req, res, next) {
    var is_public = req.originalUrl.indexOf("/public");
    if (is_public !== -1) {
        return next();
    } else {
        clientFun(req, res, next);
    }
};

var clientFun = function (req, res, next) {
    var url = req.originalUrl;
    return next();
};