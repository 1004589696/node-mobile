/**
 * Created by cunkuan on 2017/10/13.
 */
var express = require('express');
var router = express.Router();

exports.routerFilter = function (req, res, next) {
    return next();
    // var is_pc = req.originalUrl.indexOf("/pc/");
    // if (is_pc === -1) {
    //     return next();
    // } else {
    //     clientFun(req, res, next);
    // }
};

var clientFun = function (req, res, next) {
    var url = req.originalUrl;
    console.log(req);
    return next();
};