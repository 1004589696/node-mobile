var express = require('express');
var router = express.Router();

exports.mobileRouter = function () {
    require("./userRouter").mobileRouter(router);
};