var base = require('./base');
var User = require('./user');

var _ = require('lodash');

var Types = base.mongoose.Schema.Types;

var CommentSchema = new base.mongoose.Schema({
    content: String,
    author: {type: Types.ObjectId, ref: 'User'},
    linkTo: String,  // 'WeiJian' | 'Article' | ...
    linkToId: String, // id of 'WeiJian' or 'Article'...
    replyTo: {type: Types.ObjectId, ref: 'Comment'},
    agree: {type: Number, default: 0},
    disagree: {type: Number, default: 0},
    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now}
});

var Comments = base.mongoose.model('Comment', CommentSchema);

Comments.agree = function (user, commentId, direction, cb) {
    Comments.findOne({_id: commentId}).exec(function (err, comment) {
        if(err) {
            return cb(err);
        }
        if(!comment) {
            res.status(404);
            res.send('Comment not found: ' + commentId);
            return;
        }
        var opsAdd = {$addToSet: {}};
        var opsPull = {$pull: {}};
        opsAdd.$addToSet['commentAgrees'] = comment;
        opsPull.$pull['commentAgrees'] = {$in: [comment._id]};
        var userOps = (direction == 1) ? opsAdd : opsPull;
        User.update({_id: user._id}, userOps).exec(function (err, result) {
            if(err) {
                return cb(err);
            }
            if(result.nModified > 0) {
                console.log('Update User commentAgrees ' + ((direction == 1) ? '$addToSet' : '$pull') + ' successfully.', user._id);
                Comments.update({_id: commentId}, {$inc: {agree: direction}, $set: {updateTime: new Date()}}).exec(function (err, result) {
                    if(err) {
                        return cb(err);
                    }

                    console.log('Update Comment agree ' + direction + ' successfully.', commentId);

                    var response = {};
                    response['agreed'] = (direction == 1);
                    response['agree'] = comment['agree'] + direction;
                    response.result = result;

                    cb(null, response);

                    User.update({_id: user._id}, {$set: {updateTime: new Date()}}).exec(function (err, result) {
                        if(!err) {
                            console.log('Update user updateTime: ', result);
                        }
                    });
                });
            } else {
                cb(null, result);
            }
        });
    });
};

Comments.queryComments = function (params) {

    var linkTo, req, res, next, getUserUpdated;
    linkTo = params.linkTo;
    req = params.req;
    res = params.res;
    next = params.next;
    getUserUpdated = params.getUserUpdated;

    if(!(linkTo && req && res && next && getUserUpdated)) {
        return;
    }

    var countPerPage = req.query.countPerPage || 15;
    var sortBy = req.query.sortBy || 'createTime';
    var lastId = req.query.lastId;
    var lastIds = req.query.lastIds;
    if(!lastId) {
        _queryComments();
    } else {
        Comments.findOne({_id: lastId}).exec(function (err, doc) {
            if(err) {
                console.log(err);
                _queryComments();
            } else {
                _queryComments(doc, lastIds);
            }
        });
    }

    function _queryComments (lastDoc, lastIds) {

        var result = {
            comments: []
        };

        var query;
        if(lastDoc && lastIds && lastIds.length) {
            query = Comments.find({linkTo: linkTo, linkToId: req.params.id, replyTo: undefined, _id: { $nin: lastIds }});
        } else {
            query = Comments.find({linkTo: linkTo, linkToId: req.params.id, replyTo: undefined});
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
                return next(err);
            }
            if(docs && docs.length) {
                var ids = _.map(docs, '_id');
                Comments.find({linkTo: linkTo, linkToId: req.params.id, replyTo: { $in: ids }}).populate('author').exec(function (err, subDocs) {
                    if(err) {
                        return next(err);
                    }
                    result.comments = docs.concat(subDocs);
                    getUserUpdated(req, next, function (user) {
                        result.user = user || {};
                        result.user.userPassword = undefined;
                        res.send(result);
                    }, ['commentAgrees']);
                });
            } else {
                res.send(result);
            }
        });
    }
};

module.exports = Comments;