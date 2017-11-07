define(['text!templates/article/article-detail-tpl.html'], function (tpl) {

    var ArticleDetailView = function () {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(tpl)(getScope()));
            this.hash = window.location.hash.substr(1);
        };

        this.clearData = function () {
            // [clear previous view
            this.$el.find('#article-detail-content').hide();
            setScope('currentArticle', {});
            // clear previous view]
        };

        this.render = function(id) {
            var ctl = this;
            ctl.$el.wwViewLoader();

            window.articleService.findById(id).done(function (item) {
                ctl.$el.wwViewLoader('R');
                item.content = $wwSce.trustAsHtml(item.content);  // to make sure some html attrs not removed by the directive
                item.isCreator = (window.user && window.user.userId === (item.author ? item.author.userId : -1));
                setScope('currentArticle', item);
                ctl.$el.find('.ww-item-content img').each(function () {
                    $(this).load(function() {
                    }).attr('src', context_root + $(this).attr('data-src'));
                });
                item._content = ctl.$el.find('.ww-item-content').html();  // keep for further edit
                ctl.$el.find('#article-detail-content').show();
                ctl._scrollLoader = ctl.$el.find('#article-detail-content').wwScrollLoader({
                    loadBottom: null,
                    pull: null,
                    pullEnd: null,
                    onScroll: function (scrollTop) {
                        if(scrollTop < ctl.$el.find('.title-block h4').height()) {
                            setScope('currentArticle', $.extend(getScope('currentArticle'), { _showTitle: false }));
                        } else {
                            setScope('currentArticle', $.extend(getScope('currentArticle'), { _showTitle: true }));
                        }
                    }
                });
            });

            return ctl;
        };

        this.bindEvents = function () {
            var ctl = this;

            ctl.$el.off('click.lefNav').on('click.lefNav', '.icon-left-nav', function () {
                window.backHandler();
            });

            ctl.$el.off('click.actions').on('click.actions', '.bar-tab a.edit-article', function () {
                var currArticle = getScope('currentArticle');
                window.location.href = '#ww/detail/' + currArticle.weijian._id + '/article/edit/' + currArticle._id;
            });

            ctl.$el.off('click.comment-article').on('click.comment-article', '.bar-tab .comment-article', function () {
                var currArticle = getScope('currentArticle');
                window.location.href = '#ww/detail/' + currArticle.weijian._id + '/article/detail/' + currArticle._id + '/comments';
            });

            var _plusCB = function (action, data, msg) {
                //console.log(data);
                var actionD = action + 'd';
                if(action == 'watch' || action == 'collect') {
                    actionD = action + 'ed';
                }
                actionD = 'article'+actionD[0].toUpperCase()+actionD.substr(1);
                if(data && data[action] != undefined) {
                    var updated = {};
                    updated[action] = data[action];
                    updated[actionD] = data[actionD];
                    setScope('currentArticle', $.extend(getScope('currentArticle'), updated));
                    alert(msg);
                }
            };
            ctl.$el.off('click.agree-article').on('click.agree-article', '.agree-article', function () {
                var ww = getScope('currentArticle');
                if(ww.articleAgreed) {
                    window.articleService.agreeOn(ww._id, -1).done(function (data) {_plusCB('agree', data, '已取消点赞')});  //取消点赞/共鸣
                } else {
                    window.articleService.agreeOn(ww._id, 1).done(function (data) {_plusCB('agree', data, '已点赞')});   //点赞/共鸣
                }
            });
            //ctl.$el.off('click.btn-watch').on('click.btn-watch', '.btn-watch', function () {
            //    var ww = getScope('currentArticle');
            //    if(ww.articleWatched) {
            //        window.articleService.watchOn(ww._id, -1).done(function (data) {_plusCB('watch', data, '已取消关注')});  //取消关注
            //    } else {
            //        window.articleService.watchOn(ww._id, 1).done(function (data) {_plusCB('watch', data, '已关注')});   //关注
            //    }
            //});
            ctl.$el.off('click.bookmark-article').on('click.bookmark-article', '.bookmark-article', function () {
                var ww = getScope('currentArticle');
                if(ww.articleCollected) {
                    window.articleService.collectOn(ww._id, -1).done(function (data) {_plusCB('collect', data, '已取消收藏')});  //取消收藏
                } else {
                    window.articleService.collectOn(ww._id, 1).done(function (data) {_plusCB('collect', data, '已收藏')});   //收藏
                }
            });

            return ctl;
        };

        this.initialize();
    };

    return ArticleDetailView;
});
