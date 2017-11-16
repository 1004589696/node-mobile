/**
 * Created by cunkuan on 2017/10/13.
 */
var winston = require('winston');

exports.testLog = new (winston.Logger)({
    transports: [
        new(winston.transports.File)({filename: 'test.log'})
    ]
});