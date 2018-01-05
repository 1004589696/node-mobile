var express = require('express');
var router = express.Router();

require("./user").mobileRouter(router);
require("./lucydraw").mobileRouter(router);

module.exports = router;