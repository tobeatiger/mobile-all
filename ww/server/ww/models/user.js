var base = require('./base');

var Types = base.mongoose.Schema.Types;

var UserDocuments = base.mongoose.model('User', {
    userName: String,
    userId: String,
    nickName: String,
    email: String,
    userPassword: String,
    photo: {type: String, default: '/media/userPhoto/_undefined_'},  // a url
    signature: String,
    agrees: [{type: Types.ObjectId, ref: 'WeiJian'}],  // agrees on Weijians
    collects: [{type: Types.ObjectId, ref: 'WeiJian'}],  // 收藏 on Weijians
    watches: [{type: Types.ObjectId, ref: 'WeiJian'}],  // watches on Weijians
    articleAgrees: [{type: Types.ObjectId, ref: 'Article'}],  // watches on Articles (为论)
    articleCollects: [{type: Types.ObjectId, ref: 'Article'}],  // 收藏 on Article (为论)
    articleWatches: [{type: Types.ObjectId, ref: 'Article'}],  // watches on Article (为论)
    userWatches: [{type: Types.ObjectId, ref: 'User'}],  // watches on Users
    commentAgrees: [{type: Types.ObjectId, ref: 'Comment'}],
    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now}
});

module.exports = UserDocuments;