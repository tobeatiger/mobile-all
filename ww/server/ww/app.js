var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

// routes
//var index = require('./routes/index');
var loginPoc = require('./routes/login-poc');
var users = require('./routes/users');
var wwService = require('./routes/ww-service');
var articleService = require('./routes/article-service');
var mediaService = require('./routes/media-service');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var routerBase = require('./routes/base');
routerBase.initRouter(app);
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
//app.use(cookieParser());

//app.get('/web/*', function (req, res, next) {
//  res.header('Access-Control-Allow-Origin', '*');
//  next();
//});
app.use('/web', express.static(path.join(__dirname, 'public')));

// use routes
//app.use('/home', index);
app.use('/login', loginPoc);
app.use('/users', users);
app.use('/ww', wwService);
app.use('/article', articleService);
app.use('/media', mediaService);

//app.get('/test/err', function (req, res, next) {
//  res.send(req.ca.b);
//});

routerBase.initErrorHandle(app);

module.exports = app;
