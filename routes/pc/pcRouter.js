var express = require('express');
var router = express.Router();

require("./lucydraw").pcRouter(router);
require("./admin").pcRouter(router);

module.exports = router;