var express = require('express');
var router = express.Router();

require("./pc/pcRouter").pcRouter(router);

module.exports = router;