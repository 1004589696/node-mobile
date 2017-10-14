var express = require('express');
var router = express.Router();


//mobile
require("./mobile/mobileRouter").mobileRouter(router);

//pc
require("./pc/pcRouter").pcRouter(router);


module.exports = router;