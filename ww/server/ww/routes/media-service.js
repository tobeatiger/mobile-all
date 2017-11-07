var Picture = require('./../models/pictures');
var UserPhoto = require('./../models/user-photo');

var express = require('express');
var router = express.Router();
var routerBase = require('./base');
routerBase.initRouter(router);

function processImage (data, res, next) {
    if(data) {
        var tokens = data.split(';base64,');
        if(tokens[1]) {
            var img = new Buffer(tokens[1], 'base64');
            res.writeHead(200, {
                'Content-Type': tokens[0].split(':')[1],
                'Content-Length': img.length
            });
            res.end(img);
        } else {
            return next({message: 'Invalid data of media!'});
        }
    } else {
        return next({message: 'media not found!', status: 404});
    }
}

router.get('/pic/:id/data', function (req, res, next) {
    Picture.findOne({_id: req.params.id}).exec(function (err, pic) {
        if(err) {
            return next(err);
        } else {
            processImage(pic ? pic.data : undefined, res, next);
        }
    });
});

var dfUserPhoto = 'data:image/png;base64,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';
router.get('/userPhoto/:userId', function (req, res, next) {
    UserPhoto.findOne({userId: req.params.userId}).exec(function (err, userPhoto) {
        if(err) {
            console.log(err);
            processImage(dfUserPhoto, res, next);
        } else {
            processImage(userPhoto ? userPhoto.data : dfUserPhoto, res, next);
        }
    });
});

router.post('/userPhoto/update/:userId', function (req, res, next) {
    console.log(req.body.data.length);
    UserPhoto.update({userId: req.params.userId}, {$set: {data: req.body.data}}).exec(function (err) {
        if(err) {
            return next(err);
        } else {
            res.send('Done!');
        }
    });
});

routerBase.initErrorHandle(router);

module.exports = router;