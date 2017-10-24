var express = require('express');
var router = express.Router();


//mobile
require("./userRouter").mobileRouter(router);


module.exports = router;