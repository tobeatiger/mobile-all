var base = require('./base');
var Types = base.mongoose.Schema.Types;

//db.articles.createIndex({createTime:1})
//db.articles.createIndex({updateTime:1})
//db.articles.createIndex({title:'text',content:'text',shortContent:'text'})
var Articles = base.mongoose.model('Article', {
    title: String,
    content: String,
    _content: String, // 非 HTML 文本
    shortContent: String,
    weijian: {type: Types.ObjectId, ref: 'WeiJian'}, //link to Weijian
    comments: [{type: Types.ObjectId, ref: 'Comment'}],
    agree: {type: Number, default: 0},  //赞
    disagree: {type: Number, default: 0}, //踩
    watch: {type: Number, default: 0}, //关注
    accept: {type: Number, default: 0},  //纳谏
    collect: {type: Number, default: 0}, //收藏
    browsed: {type: Number, default: 0}, //浏览
    author: {type: Types.ObjectId, ref: 'User'},
    pictures: [{type: Types.ObjectId, ref: 'Picture'}],
    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now}
});

module.exports = Articles;