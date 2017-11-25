var Article = require('./../models/article');
var WeiJian = require('./../models/weijian');
var Picture = require('./../models/pictures');
var User = require('./../models/user');
var Comment = require('./../models/comment');

var _ = require('lodash');

var express = require('express');
var router = express.Router();
var routerBase = require('./base');
routerBase.initRouter(router);

var cheerio = require('cheerio');

function getUserUpdated (req, next, cb, pops) {
    if(req.session.user) {
        if(!pops) {
            pops = ['articleAgrees', 'articleWatches', 'articleCollects'];
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

router.queryArticles = function (params, cb) {

    var weijianId = params.weijianId;
    var lastDoc = params.lastDoc;
    var lastIds = params.lastIds;  // used to filter duplicated records when sort by 'agree'
    var countPerPage = params.countPerPage;
    var sortBy = params.sortBy;

    if(!countPerPage) {
        countPerPage = 15;
    }

    var query;
    if(lastDoc && lastIds && lastIds.length) {
        query = Article.find({weijian: weijianId, _id: { $nin: lastIds }});
    } else {
        query = Article.find({weijian: weijianId});
    }

    var sorting = {};
    if(sortBy === 'agree') {
        sorting['agree'] = -1;
        sorting['createTime'] = 1;
        if(lastDoc) {
            //query.where('agree').lte(lastDoc.agree).where('createTime').gt(lastDoc.createTime);
            query.where('agree').lte(lastDoc.agree);
        }
    } else if (sortBy === '-createTime') {
        sorting['createTime'] = -1;
        if(lastDoc) {
            query.where('agree').where('createTime').lt(lastDoc.createTime);
        }
    } else {
        sorting['createTime'] = 1;
        if(lastDoc) {
            query.where('agree').where('createTime').gt(lastDoc.createTime);
        }
    }

    query.sort(sorting).limit(parseInt(countPerPage)).populate('author').exec(function (err, docs) {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    });
};

router.get('/ww/:id/articles/byPage', function (req, res, next) {
    if(req.query.lastId) {
        Article.findOne({_id: req.query.lastId}).exec(function(err, doc) {
            if(err) {
                return next(err);
            }
            router.queryArticles({
                weijianId: req.params.id,
                lastDoc: doc,
                lastIds: req.query.lastIds,
                countPerPage: req.query.countPerPage,
                sortBy: req.query.sortBy
            }, function (err, docs) {
                if(err) {
                    return next(err);
                }
                res.send(docs);
            });
        });
    } else {
        router.queryArticles({
            weijianId: req.params.id,
            countPerPage: req.query.countPerPage,
            sortBy: req.query.sortBy
        }, function (err, docs) {
            if(err) {
                return next(err);
            }
            res.send(docs);
        });
    }
});

router.get('/detail/:id', function (req, res, next) {
    Article.findOne({_id: req.params.id}).populate('weijian').populate('author').exec(function (err, art) {
        if(err) {
            return next(err);
        }
        if(art) {
            if(art.author) {
                art.author.userPassword = undefined;
            }
            getUserUpdated(req, next, function (user) {
                var result = art.toObject();  // use the toObject to get the JSON data from the document
                if(user && user.articleAgrees) {
                    for (var i = 0; i < user.articleAgrees.length; i++) {
                        if (user.articleAgrees[i]._id + '' == art._id + '') {
                            result.articleAgreed = true;
                            break;
                        }
                    }
                }
                if(user && user.articleWatches) {
                    for(var i=0;i<user.articleWatches.length;i++) {
                        if(user.articleWatches[i]._id+'' == art._id+'') {
                            result.articleWatched = true;
                            break;
                        }
                    }
                }
                if(user && user.articleCollects) {
                    for(var i=0;i<user.articleCollects.length;i++) {
                        if(user.articleCollects[i]._id+'' == art._id+'') {
                            result.articleCollected = true;
                            break;
                        }
                    }
                }
                res.send(result);
            });
        } else {
            return next({status: 404, message: 'Article Not found'});
        }
    });
});

router.get('/detail/:id/comments/byPage', function (req, res, next) {
    Comment.queryComments({
        linkTo: 'Article',
        req: req,
        res: res,
        next: next,
        getUserUpdated: getUserUpdated
    });
});

router.post('/detail/:id/comments/add', routerBase.checkUser, function (req, res, next) {
    var comment = req.body.comment;
    var replyTo = req.body.replyTo;

    if(comment) {
        var $ = cheerio.load('<div id="_content">' + comment + '</div>');
        comment = $('#_content').text().replace(/\n/g, '<br/>');
    }

    if(comment && comment.trim().length > 0) {

        Article.findOne({_id: req.params.id}, {_id:1}).exec(function(err, article) {
            if(err) {
                return next(err);
            }
            if(article) {

                var _saveNewComment = function (replyTo) {
                    var newComment = new Comment({
                        content: comment.trim(),
                        author: req.session.user._id,
                        linkTo: 'Article',
                        linkToId: req.params.id,
                        replyTo: (replyTo || {})._id
                    });
                    newComment.save(function (err, commentDoc) {
                        if(err) {
                            return next(err);
                        }
                        Article.update({_id: article._id}, {$addToSet: {comments: commentDoc}}).exec(function (err, result) {
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
                                res.send('No Article updated: ' + req.params.id);
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
                res.send('Article not found: ' + req.params.id);
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

function _findWeiJian (id, cb) {
    WeiJian.findOne({_id: id}).exec(function (err, wj) {
        if(err) {
            cb(err);
        } else {
            cb(null, wj);
        }
    });
}

function _article_save_or_update (req, res, next) {

    var data = req.body;
    if(!data || !data.weijianId) {
        res.status(403);
        return res.send('Invalid post data, no related Weijian provided!');
    }

    _findWeiJian(data.weijianId, function (err, wj) {

        if (err) {
            return next(err);
        }

        if(!wj) {
            res.status(404);
            return res.send('WeiJian not found! ' + data.weijianId);
        }

        var $ = cheerio.load('<div id="_article_content">' + data.content + '</div>');
        var pics = [];
        $('#_article_content').find('img').each(function (idx) {
            var picData = $(this).text('(图片)').attr('src');
            if(!$(this).attr('data-src')) {
                // new upload image
                pics.push({
                    linkTo: 'article',
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
                $('#_article_content').find('img').each(function () {
                    if(!$(this).attr('data-src')) {
                        $(this).attr('data-src', '/media/pic/' + pics[newPicIndex]._id + '/data').attr('data-pic-id', pics[newPicIndex]._id);
                        newPicIndex++;
                    }
                });
                saveArticle(data);
            });
        } else {
            saveArticle(data);
        }

        function _updateWeiJian(wj, cb) {
            wj.save(function (saveError, wj) {
                if(saveError) {
                    return next(saveError);
                }
                console.log('Update WeiJian successfully.', wj._id);
                cb(null, wj);
            });
        }

        function saveArticle (theData) {

            theData.weijian = wj._id;
            theData._content = $('#_article_content').text();
            theData.shortContent = theData._content.length > 70 ? theData._content.substr(0, 70) + '...' : theData._content;
            $('#_article_content').find('img').each(function (idx) {
                $(this).text('');
            });
            theData.content = $('#_article_content').html();
            theData.author = req.session.user._id;
            if(theData._id) {  // update
                theData.updateTime = new Date();
                Article.update({_id: theData._id}, {$set: theData}).exec(function (err) {
                    if(err) {
                        return next(err);
                    }
                    console.log('Update Article successfully.', theData._id);

                    wj.updateTime = new Date().getTime();
                    _updateWeiJian(wj, function (saveErr) {
                        if(!saveErr) {
                            res.send({_id: theData._id});
                        }
                    });
                });
            } else {  // create
                var newArticle = new Article(theData);
                newArticle.save(function (err, doc) {
                    if(err) {
                        return next(err);
                    }
                    console.log('Save Article successfully.', doc._id);

                    wj.updateTime = new Date().getTime();
                    wj.wwArticles = [doc._id].concat(wj.wwArticles);
                    _updateWeiJian(wj, function (saveErr) {
                        if(!saveErr) {
                            res.send({_id: doc._id});
                        }
                    });
                });
            }
        }
    });
}

router.post('/create', routerBase.checkUser, function (req, res, next) {
    return _article_save_or_update(req, res, next);
});

router.post('/update', routerBase.checkUser, function (req, res, next) {
    return _article_save_or_update(req, res, next);
});

function plusAction (action, direction, req, res, next) {

    var suffix = 'article';
    var actionS = action+'s', actionD = action+'d';
    if(action == 'watch' || action == 'collect') {
        actionS = action + 'es';
        actionD = action + 'ed';
    }
    if(action == 'collect') {
        actionS = action + 's';
        actionD = action + 'ed';
    }
    actionS = suffix + actionS[0].toUpperCase() + actionS.substr(1);
    actionD = suffix + actionD[0].toUpperCase() + actionD.substr(1);

    Article.findOne({_id: req.params.id}, function (err1, obj) {
        if(err1) {
            return next(err1);
        }

        if(!obj) {
            res.status(404);
            res.send('Article not found: ' + req.params.id);
            return;
        }

        var opsAdd = {$addToSet: {}};
        var opsPull = {$pull: {}};
        opsAdd.$addToSet[actionS] = obj;
        opsPull.$pull[actionS] = {$in: [obj._id]};
        var userOps = (direction == 1) ? opsAdd : opsPull;
        User.update({_id: req.session.user._id}, userOps).exec(function (err2, result) {

            if(err2) {
                return next(err2);
            }

            if(result.nModified > 0) {

                console.log('Update User ' + actionS + '(' + direction + ') successfully.', req.session.user._id);

                var objOps = {$inc: {}, $set: {updateTime: new Date()}};
                objOps.$inc[action] = direction;
                Article.update({_id: req.params.id}, objOps).exec(function (err3, result2) {
                    if(err3) {
                        return next(err3);
                    }

                    console.log('Update Article ' + actionS + '(' + direction + ') successfully.', req.params.id);

                    var response = {};
                    response[actionD] = (direction == 1);
                    response[action] = obj[action] + direction;
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

routerBase.initErrorHandle(router);

module.exports = router;