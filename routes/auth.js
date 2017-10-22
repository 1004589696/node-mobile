/**
 * Created by Administrator on 2017/10/22.
 */
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require("../schema/mobile/user.js");          //schema User

/**
 * passport  OAuth 2.0
 */
passport.use(new BearerStrategy(
    function (token, done) {
        console.log(token);
        User.findOne({access_token: token}, function (err, userData) {
            if (err) {
                return done(err);
            }
            if (!userData) {
                return done(null, false);
            }
            return done(null, userData);
        });
    }
));