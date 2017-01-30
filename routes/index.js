var express = require('express');
var router = express.Router();
var param = require('../param');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Marker generator', socketPort: param.socketPort });
});

module.exports = router;
