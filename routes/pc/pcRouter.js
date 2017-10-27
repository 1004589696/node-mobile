var express = require('express');
var router = express.Router();

exports.pcRouter = function(){
    require("./lucydraw").pcRouter(router);
};
