var express = require('express');
var router = express.Router();
var routerBase = require('./base');
routerBase.initRouter(router);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

routerBase.initErrorHandle(router);

module.exports = router;
