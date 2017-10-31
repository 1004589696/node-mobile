/**
 * Created by Administrator on 2017/10/22.
 */
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var jwt = require("jsonwebtoken");

var User = require("../schema/mobile/user.js");          //schema User

/**
 * passport  OAuth 2.0
 */
passport.use(new BearerStrategy(
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

/**
 * passport  用户名密码
 */
passport.use(new LocalStrategy(
    function(username, password, done) {
        token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQ1IiwicGFzc3dvcmQiOiIxMjM0NTYiLCJpYXQiOjE1MDk0MTM4NTYsImV4cCI6MTUwOTUwMDI1Nn0.dIVimdtBwXcWq9ce4grZMJtwnYJbF0pP7PeN6hPmRaw';
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));