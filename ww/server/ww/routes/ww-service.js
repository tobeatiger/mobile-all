var WeiJian = require('./../models/weijian');
var Picture = require('./../models/pictures');
var User = require('./../models/user');
var Comment = require('./../models/comment');

var articleService = require('./article-service');

var _ = require('lodash');

var express = require('express');
var router = express.Router();
var routerBase = require('./base');
routerBase.initRouter(router);

var cheerio = require('cheerio');

function getUserUpdated (req, next, cb, pops) {
    if(req.session.user) {
        if(!pops) {
            pops = ['agrees', 'watches', 'collects'];
        }
        var q = User.findOne({_id: req.session.user._id});
        for(var i=0;i<pops.length;i++) {
            q.populate(pops[i], '_id');
        }
        q.exec(function (err, user) {
            if(err) {
                return next(err);
            }
            cb(user);
        });
    } else {
        cb();
    }
}

router.get('/detail/:id', function (req, res, next) {
    WeiJian.findOne({_id: req.params.id}).populate('author')/*.populate({
        path: 'wwArticles',
        populate: { path: 'author' }
    })*/.exec(function (err, wj) {
        if(err) {
            return next(err);
        }
        if(wj) {
            if(wj.author) {
                wj.author.userPassword = undefined;
            }
            articleService.queryArticles({
                weijianId: wj._id,
                countPerPage: req.query.articleCountPerPage
            }, function (err, articles) {
                if(err) {
                    return next(err);
                }
                var result = wj.toObject();  // use the toObject to get the JSON data from the document
                result.wwArticles = articles;
                getUserUpdated(req, next, function (user) {
                    if(user && user.agrees) {
                        for (var i = 0; i < user.agrees.length; i++) {
                            if (user.agrees[i]._id + '' == wj._id + '') {
                                result.agreed = true;
                                break;
                            }
                        }
                    }
                    if(user && user.watches) {
                        for(var i=0;i<user.watches.length;i++) {
                            if(user.watches[i]._id+'' == wj._id+'') {
                                result.watched = true;
                                break;
                            }
                        }
                    }
                    if(user && user.collects) {
                        for(var i=0;i<user.collects.length;i++) {
                            if(user.collects[i]._id+'' == wj._id+'') {
                                result.collected = true;
                                break;
                            }
                        }
                    }
                    res.send(result);
                });
            });
        } else {
            return next({status: 404, message: 'WW Not found'});
        }
    });
});

//router.get('/detail/:id/comments', function (req, res, next) {
//    WeiJian.findOne({_id: req.params.id}, {comments: 1}).populate({
//        path: 'comments',
//        populate: { path: 'author' }
//    }).exec(function (err, wj) {
//        if(err) {
//            return next(err);
//        }
//        var result = {
//            comments: []
//        };
//        if(wj) {
//            result.comments = wj.comments;
//            getUserUpdated(req, next, function (user) {
//                result.user = user;
//                result.user.userPassword = undefined;
//                res.send(result);
//            }, ['commentAgrees']);
//        }
//    });
//});

router.get('/detail/:id/comments/byPage', function (req, res, next) {

    Comment.queryComments({
        linkTo: 'WeiJian',
        req: req,
        res: res,
        next: next,
        getUserUpdated: getUserUpdated
    });

    //var countPerPage = req.query.countPerPage || 15;
    //var sortBy = req.query.sortBy || 'createTime';
    //var lastId = req.query.lastId;
    //var lastIds = req.query.lastIds;
    //if(!lastId) {
    //    _queryComments();
    //} else {
    //    Comment.findOne({_id: lastId}).exec(function (err, doc) {
    //        if(err) {
    //            console.log(err);
    //            _queryComments();
    //        } else {
    //            _queryComments(doc, lastIds);
    //        }
    //    });
    //}
    //
    //function _queryComments (lastDoc, lastIds) {
    //
    //    var result = {
    //        comments: []
    //    };
    //
    //    var query;
    //    if(lastDoc && lastIds && lastIds.length) {
    //        query = Comment.find({linkTo: 'WeiJian', linkToId: req.params.id, replyTo: undefined, _id: { $nin: lastIds }});
    //    } else {
    //        query = Comment.find({linkTo: 'WeiJian', linkToId: req.params.id, replyTo: undefined});
    //    }
    //
    //    var sorting = {};
    //    if(sortBy === 'agree') {
    //        sorting['agree'] = -1;
    //        sorting['createTime'] = 1;
    //        if(lastDoc) {
    //            //query.where('agree').lte(lastDoc.agree).where('createTime').gt(lastDoc.createTime);
    //            query.where('agree').lte(lastDoc.agree);
    //        }
    //    } else if (sortBy === '-createTime') {
    //        sorting['createTime'] = -1;
    //        if(lastDoc) {
    //            query.where('agree').where('createTime').lt(lastDoc.createTime);
    //        }
    //    } else {
    //        sorting['createTime'] = 1;
    //        if(lastDoc) {
    //            query.where('agree').where('createTime').gt(lastDoc.createTime);
    //        }
    //    }
    //
    //    query.sort(sorting).limit(countPerPage).populate('author').exec(function (err, docs) {
    //        if(err) {
    //            return next(err);
    //        }
    //        if(docs && docs.length) {
    //            var ids = _.map(docs, '_id');
    //            Comment.find({linkTo: 'WeiJian', linkToId: req.params.id, replyTo: { $in: ids }}).populate('author').exec(function (err, subDocs) {
    //                if(err) {
    //                    return next(err);
    //                }
    //                result.comments = docs.concat(subDocs);
    //                getUserUpdated(req, next, function (user) {
    //                    result.user = user;
    //                    result.user.userPassword = undefined;
    //                    res.send(result);
    //                }, ['commentAgrees']);
    //            });
    //        } else {
    //            res.send(result);
    //        }
    //    });
    //}
});

router.post('/detail/:id/comments/add', routerBase.checkUser, function (req, res, next) {
    var comment = req.body.comment;
    var replyTo = req.body.replyTo;

    if(comment) {
        var $ = cheerio.load('<div id="_content">' + comment + '</div>');
        comment = $('#_content').text().replace(/\n/g, '<br/>');
    }

    if(comment && comment.trim().length > 0) {

        WeiJian.findOne({_id: req.params.id}, {_id:1}).exec(function(err, wj) {
            if(err) {
                return next(err);
            }
            if(wj) {

                var _saveNewComment = function (replyTo) {
                    var newComment = new Comment({
                        content: comment.trim(),
                        author: req.session.user._id,
                        linkTo: 'WeiJian',
                        linkToId: req.params.id,
                        replyTo: (replyTo || {})._id
                    });
                    newComment.save(function (err, commentDoc) {
                        if(err) {
                            return next(err);
                        }
                        WeiJian.update({_id: wj._id}, {$addToSet: {comments: commentDoc}}).exec(function (err, result) {
                            if(err) {
                                return next(err);
                            }
                            if(result.nModified > 0) {
                                Comment.findOne({_id: commentDoc._id}).populate('author').exec(function(err, doc) {
                                    if(err) {
                                        return next(err);
                                    }
                                    res.send(doc);
                                });
                            } else {
                                res.status(404);
                                res.send('No WeiJian updated: ' + req.params.id);
                            }
                        });
                    });
                };

                if(replyTo && replyTo.trim() !== '') {
                    Comment.findOne({_id: replyTo.trim()}).exec(function(err, replyTo) {
                        if(err) {
                            return next(err);
                        }
                        _saveNewComment(replyTo);
                    });
                } else {
                    _saveNewComment();
                }

            } else {
                res.status(404);
                res.send('WeiJian not found: ' + req.params.id);
            }
        });

    } else {
        res.status(400);
        res.send('No/Empty comment posted');
    }
});

router.post('/commentAgree/:id', routerBase.checkUser, function (req, res, next) {
    Comment.agree(req.session.user, req.params.id, 1, function (err, result) {
        if(err) {
            return next(err);
        }
        res.send(result);
    });
});

router.post('/commentAgree-cancel/:id', routerBase.checkUser, function (req, res, next) {
    Comment.agree(req.session.user, req.params.id, -1, function (err, result) {
        if(err) {
            return next(err);
        }
        res.send(result);
    });
});

function _ww_save_or_update (req, res, next) {

    var data = req.body;

    var $ = cheerio.load('<div id="_ww_content">' + data.detail + '</div>');
    var pics = [];
    $('#_ww_content').find('img').each(function (idx) {
        //var picData = $(this).attr('picture-index', idx).text('(图片)').attr('src');
        var picData = $(this).text('(图片)').attr('src');
        if(!$(this).attr('data-src')) {
            // new upload image
            pics.push({
                linkTo: 'weijian',
                data: picData
            });
            $(this).removeAttr('src');
        }
    });

    if(pics.length > 0) {
        data.pictures = data.pictures || [];
        Picture.create(pics, function (err, pics) {
            if (err) {
                return next(err);
            }
            for(var i=0;i<pics.length;i++) {
                data.pictures.push(pics[i]._id);
            }
            var newPicIndex = 0;
            $('#_ww_content').find('img').each(function () {
                if(!$(this).attr('data-src')) {
                    $(this).attr('data-src', '/media/pic/' + pics[newPicIndex]._id + '/data').attr('data-pic-id', pics[newPicIndex]._id);
                    newPicIndex++;
                }
            });
            saveWeijian(data);
        });
    } else {
        saveWeijian(data);
    }

    function saveWeijian (theData) {
        theData._detail = $('#_ww_content').text();
        theData.shortDetail = theData._detail.length > 70 ? theData._detail.substr(0, 70) + '...' : theData._detail;
        $('#_ww_content').find('img').each(function (idx) {
            $(this).text('');  //attr('src', '/ww/pic/' + pics[idx]._id + '/data');
        });
        theData.detail = $('#_ww_content').html();
        theData.author = req.session.user._id;
        if(theData._id) {  // update
            theData.updateTime = new Date();
            WeiJian.update({_id: theData._id}, {$set: theData}).exec(function (err) {
                if(err) {
                    return next(err);
                }
                console.log('Update WeiJian successfully.', theData._id);
                res.send({_id: theData._id});
            });
        } else {  // create
            var newWJ = new WeiJian(theData);
            newWJ.save(function (err, doc) {
                if(err) {
                    return next(err);
                }
                console.log('Save WeiJian successfully.', doc._id);
                res.send({_id: doc._id});
            });
        }
    }
}

router.post('/create', routerBase.checkUser, function (req, res, next) {
    return _ww_save_or_update(req, res, next);
});

router.post('/update', routerBase.checkUser, function (req, res, next) {
    return _ww_save_or_update(req, res, next);
});

function plusAction (action, direction, req, res, next) {

    var actionS = action+'s', actionD = action+'d';
    if(action == 'watch' || action == 'collect') {
        actionS = action + 'es';
        actionD = action + 'ed';
    }
    if(action == 'collect') {
        actionS = action + 's';
        actionD = action + 'ed';
    }

    WeiJian.findOne({_id: req.params.id}, function (err1, wj) {
        if(err1) {
            return next(err1);
        }

        if(!wj) {
            res.status(404);
            res.send('WeiJian not found: ' + req.params.id);
            return;
        }

        var opsAdd = {$addToSet: {}};
        var opsPull = {$pull: {}};
        opsAdd.$addToSet[actionS] = wj;
        opsPull.$pull[actionS] = {$in: [wj._id]};
        //var userOps = (direction == 1) ? {$addToSet: {agrees: wj}} : {$pull: {agrees: {$in: [wj._id]}}};
        var userOps = (direction == 1) ? opsAdd : opsPull;
        User.update({_id: req.session.user._id}, userOps).exec(function (err2, result) {

            if(err2) {
                return next(err2);
            }

            if(result.nModified > 0) {

                console.log('Update User ' + actionS + '(' + direction + ') successfully.', req.session.user._id);

                var wjOps = {$inc: {}, $set: {updateTime: new Date()}};
                wjOps.$inc[action] = direction;
                WeiJian.update({_id: req.params.id}, wjOps).exec(function (err3, result2) {
                    if(err3) {
                        return next(err3);
                    }

                    console.log('Update WeiJian ' + actionS + '(' + direction + ') successfully.', req.params.id);

                    var response = {};
                    response[actionD] = (direction == 1);
                    response[action] = wj[action] + direction;
                    response.result = result2;
                    res.send(response);

                    User.update({_id: req.session.user._id}, {$set: {updateTime: new Date()}}).exec(function (err, result3) {
                        if(!err) {
                            console.log('Update user updateTime: ', result3);
                        }
                    });
                });

            } else {

                res.send(result);
            }
        });
    });
}

router.post('/agree/:id', routerBase.checkUser, function (req, res, next) {
    plusAction('agree', 1, req, res, next);
});

router.post('/agree-cancel/:id', routerBase.checkUser, function (req, res, next) {
    plusAction('agree', -1, req, res, next);
});

router.post('/watch/:id', routerBase.checkUser, function (req, res, next) {
    plusAction('watch', 1, req, res, next);
});

router.post('/watch-cancel/:id', routerBase.checkUser, function (req, res, next) {
    plusAction('watch', -1, req, res, next);
});

router.post('/collect/:id', routerBase.checkUser, function (req, res, next) {
    plusAction('collect', 1, req, res, next);
});

router.post('/collect-cancel/:id', routerBase.checkUser, function (req, res, next) {
    plusAction('collect', -1, req, res, next);
});

router.get('/list', function (req, res, next) {

    var q = WeiJian.find({}).sort('-updateTime').populate('author');

    if(req.query.lastItemUpdateTime) {
        q.where('updateTime').lt(new Date(req.query.lastItemUpdateTime));
        //q.where('updateTime').lte(new Date(req.query.lastItemUpdateTime));
        q.limit((req.query.countPerPage && parseInt(req.query.countPerPage)) || 20);
    } else if(req.query.firstItemUpdateTime) {
        q.where('updateTime').gt(new Date(req.query.firstItemUpdateTime));
    }

    q.exec(function (err, docs) {
        if(err) {
            return next(err);
        }
        console.log(docs.length + ' WeiJians found');
        res.send(docs);
    });
});

router.get('/search', function (req, res, next) {

    if(!req.query.searchText || req.query.searchText.trim() == '*' || req.query.searchText.trim() == '') {
        return res.send([]);
    }

    var tokens = req.query.searchText.split(' ');
    var regStr = '(?=.*' + tokens[0].trim() + ')';
    for(var i=1;i<tokens.length;i++) {
        if(tokens[i].trim() !== '') {
            regStr += ('(?=.*' + tokens[i].trim() + ')');
        }
    }
    var reg = new RegExp(regStr);
    WeiJian.find({
        $or: [{title: reg}, {_detail: reg}]
    }).sort('-agree').limit(50).populate('author').exec(function (err, docs) {
        if(err) {
            return next(err);
        }
        res.send(docs);
    });
});

// error will be cached successfully, maybe mongodb throws error so that crash the app
//router.get('/test/err', function (req, res, next) {
//    req.sss.bb = undefined;
//    res.send(req.ca.b);
//});

routerBase.initErrorHandle(router);

module.exports = router;