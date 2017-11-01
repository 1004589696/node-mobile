/**
 * Created by Administrator on 2017/10/22.
 */
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');
const saltRounds = 10;

var User = require("../schema/mobile/user");          //schema User
var Admin = require("../schema/pc/admin");

/**
 * passport  OAuth 2.0
 */
passport.use('bearer',new BearerStrategy(
    function (token, done) {
        User.findOne({access_token: token}, function (err, userData) {
            if (err) {
                return done(err);
            }
            if (!userData) {
                return done(null, false);
            }
            jwt.verify(token, 'dingcunkuan The NO.1', function(err, decoded) {
                if(decoded){
                    return done(null, userData);
                }else{
                    return done(null, false);
                }
            });
        });
    }
));


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

passport.use('bearerPC',new BearerStrategy(
    function (token, done) {
        jwt.verify(token, 'dingcunkuan', function(err, decoded) {
            if(decoded){
                Admin.findOne({username: decoded.username}, function (err, userData) {
                    if (err) {
                        return done(null, false);
                    }
                    if (!userData) {
                        return done(null, false);
                    }
                    IsUser(decoded.password,userData.password,function (code) {
                        if (code === '500') {
                            return done(null, false);
                        } else if (code) {
                            return done(null, userData);
                        } else {
                            return done(null, false);
                        }
                    });
                });
            }else{
                return done(null, false);
            }
        });
    }
));
