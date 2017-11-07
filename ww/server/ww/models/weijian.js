var base = require('./base');
var User = require('./user');
var Article = require('./article');
var Comment = require('./comment');
var Picture = require('./pictures');

var Types = base.mongoose.Schema.Types;

var WWTagsSchema = new base.mongoose.Schema({ name: String });
var UserTagsSchema = new base.mongoose.Schema({
    name: String,
    userId: String
});

//db.weijians.createIndex({createTime:1})
//db.weijians.createIndex({updateTime:1})
//db.weijians.createIndex({title:'text',detail:'text',shortDetail:'text'})
var WeiJianSchema = new base.mongoose.Schema({
        title: String,
        detail: String,
        _detail: String, // 非 HTML 文本
        shortDetail: String,
        agree: {type: Number, default: 0},    // 共鸣
        disagree: {type: Number, default: 0}, // 踩
        watch: {type: Number, default: 0},    // 关注
        accept: {type: Number, default: 0},   // 纳谏
        collect: {type: Number, default: 0},  // 收藏
        browsed: {type: Number, default: 0},   // 浏览
        comments: [{type: Types.ObjectId, ref: 'Comment'}],
        wwArticles: [{type: Types.ObjectId, ref: 'Article'}],
        author: {type: Types.ObjectId, ref: 'User'},
        wwTags: [WWTagsSchema],
        userTags: [UserTagsSchema],
        pictures: [{type: Types.ObjectId, ref: 'Picture'}],
        createTime: {type: Date, default: Date.now},
        updateTime: {type: Date, default: Date.now}  // should be updated when user edit the content or related articles added
    });

WeiJianSchema.methods.createWJ = function (cb) {
    var wj = this;
    wj.save(function (err, doc) {
        if(err) {
            console.log('Failed to save WeiJian.', err);
            cb({error: err});
            return false;
        }
        console.log('Save WeiJian successfully.', doc._id);
        cb(doc);
    });
};

var WeiJian = base.mongoose.model('WeiJian', WeiJianSchema);

module.exports = WeiJian;