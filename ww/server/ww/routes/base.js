var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = {
    initRouter: function (router) {
        router.use(bodyParser.json({limit: '50mb'}));
        router.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
        router.use(cookieParser());
        router.use(session({
            secret: 'my secret key tobeatiger ww',
            resave: false,
            saveUninitialized: false
        }));
        router.use(function (req, res, next) {  // todo: proper settings???
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        });
    },
    checkUser: function (req, res, next) {
        if(req.session.user) {
            next();
        } else {
            res.status(403);
            res.send('Not authorised');
        }
    },
    initErrorHandle: function (router) {
        // catch 404 and forward to error handler
        router.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        // error handler
        router.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
};