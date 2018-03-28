var express = require('express');
var router = express.Router();
const User = require('./../modules/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.url = "index.html"
});

module.exports = router;
