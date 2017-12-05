var base = require('./../models/base');
var UserDocuments = require('./../models/user');

var express = require('express');
var router = express.Router();
var routerBase = require('./base');
routerBase.initRouter(router);

// GET: http(s)://host:port/login
router.get('/', function(req, res) {
    res.render('login-poc.jade', {});
});

// to check if user already login or not
router.get('/check-login', routerBase.checkUser, function(req, res) {
    res.send(req.session.user);
});

// POST: http(s)://host:port/login
router.post('/', function(req, res, next) {
    if(!req.body.user || !req.body.password) {
        res.status('400');
        res.send('Invalid post!');
    } else {
        console.log('Authentication...');
        if(base.mongoose.connection.readyState != 1) { // not connected
            var err = new Error('Database not connected');
            next(err);
        } else {
            UserDocuments.findOne({userId: req.body.user}).exec(function (err, user) {
                if(err) {
                    console.log(err);
                    next(err);
                } else {
                    if(!user) {
                        res.status('404');
                        res.render('login-poc.jade', {message: 'Invalid user name!'});
                    } else {
                        base.compareCode(req.body.password, user.userPassword, function(err, match) {
                            if(match) {
                                user.userPassword = undefined; //never expose the user password, even it's encrypt
                                req.session.user = user;
                                res.redirect('/home');
                            } else {
                                res.status('403');
                                res.render('login-poc.jade', {message: 'Wrong password!'})
                            }
                        });
                    }
                }
            });
        }
    }
});

// TODO: to be integrated with ww
// POST: http(s)://host:port/login/ww-login
router.post('/ww-login', function(req, res, next) {
    if(!req.body.user || !req.body.password) {
        res.status('400');
        res.send('请输入用户名和密码!');
    } else {
        console.log('Authentication...');
        if(base.mongoose.connection.readyState != 1) { // not connected
            res.status('500');
            res.send('Data base not connected!');
        } else {
            UserDocuments.findOne({userId: req.body.user}).exec(function (err, user) {
                if(err) {
                    console.log(err);
                    next(err);
                } else {
                    if(!user) {
                        res.status('404');
                        res.send('用户名不存在!');
                    } else {
                        base.compareCode(req.body.password, user.userPassword, function(err, match) {
                            if(match) {
                                user.userPassword = undefined; //never expose the user password, even it's encrypt
                                req.session.user = user;
                                res.status('200');
                                res.send(user);
                            } else {
                                res.status('403');
                                res.send('密码错误!');
                            }
                        });
                    }
                }
            });
        }
    }
});

// POST: http(s)://host:port/login/ww-logout
router.post('/ww-logout', function(req, res, next) {
    req.session.user = null;
    res.status('200').send('logout successfully!');
});

// TODO: to be removed ......................... testing only .................................
// GET: http(s)://host:port/login/testingUsers
router.get('/testingUsers', function(req, res, next) {
    UserDocuments.find({testingAcc: true}).exec(function (err, users) {
        if(err) {
            console.log(err);
            next(err);
        } else {
            if(!users) {
                res.status('404');
                res.send('no users!');
            } else {
                var result = [];
                for(var i=0;i<users.length;i++) {
                    result.push({
                        userId: users[i].userId,
                        nickName: users[i].nickName
                    });
                    users[i].userPassword = undefined;
                }
                res.send(result);
            }
        }
    });
});
// TODO: to be removed ......................... testing only .................................

routerBase.initErrorHandle(router);

module.exports = router;