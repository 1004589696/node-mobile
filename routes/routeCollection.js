var express = require('express');
var router = express.Router();


//mobile
require("./mobile/userRouter").mobileRouter(router);

//pc
// require("./pc/pcRouter").pcRouter(router);


module.exports = router;