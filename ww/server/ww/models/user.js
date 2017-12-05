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

//setTimeout(function () {

    //var jim = new UserDocuments({
    //    userName: 'Jim YI',
    //    userId: '43425307',
    //    email: 'tobeatiger@126.com',
    //    userPassword: '$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK',
    //    photoURL: ''
    //});
    //jim.save(function (err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log('saved!');
    //    }
    //});
    //var borry = new UserDocuments({
    //    userName: 'Borry Huang',
    //    userId: '43310547',
    //    userPassword: '$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK',
    //    photoURL: ''
    //});
    //borry.save(function (err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log('saved!');
    //    }
    //});

    //var niki = new UserDocuments({
    //    userName: 'Niki Pan',
    //    userId: 'niki.l.s.pan',
    //    email: 'niki.l.s.pan@gmail.com',
    //    userPassword: '$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK',
    //    photoURL: ''
    //});
    //niki.save(function (err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log('saved!');
    //    }
    //});
    //var hby = new UserDocuments({
    //    userName: 'HBY',
    //    userId: 'baiyue.huang',
    //    email: 'baiyue.huang@126.com',
    //    userPassword: '$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK',
    //    photoURL: ''
    //});
    //hby.save(function (err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log('saved!');
    //    }
    //});

//}, 500);

module.exports = UserDocuments;