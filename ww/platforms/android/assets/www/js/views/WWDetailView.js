define(['text!templates/ww/ww-detail-tpl.html'], function (tpl) {

    var WWForumDetailView = function () {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(tpl)(getScope()));
            this.hash = window.location.hash.substr(1);
        };

        this.clearData = function () {
            // [clear previous view
            this.$el.find('#ww-detail-content').hide();
            setScope('currentWW', {});
            // clear previous view]
        };

        this._initToggle = function () {
            var ctl = this;
            ctl.$el.find('#ww-detail-content').show();
            //console.log(ctl.$el.find('.ww-item-content').css('height'));
            //console.log(ctl.$el.find('.ww-item-content').css('max-height'));
            if(parseInt(ctl.$el.find('.ww-item-content').css('height')) < parseInt(ctl.$el.find('.ww-item-content').css('max-height'))) {
                ctl.$el.find('.ww-content-toggle').removeClass('visible');
            } else {
                ctl.$el.find('.ww-content-toggle').addClass('visible');
            }
        };

        var articleCountPerPage = 15;
        this._articleSortBy = 'createTime';
        this.loadArticles = function (reload) {
            var ctl = this;
            window.articleService.getArticles(getScope('currentWW')._id, {
                countPerPage: articleCountPerPage,
                lastId: reload ? null : ctl.$el.find('.article-list ul li:last').attr('data-id'),
                sortBy: ctl._articleSortBy,
                lastIds: function (lis$) {
                    if(ctl._articleSortBy == 'agree' ) {
                        var ids = [];
                        var lastItem$ = $(lis$[lis$.length - 1]);
                        for(var i = 0; i < lis$.length; i++) {
                            if($(lis$.get(lis$.length-1-i)).attr('data-agree') == lastItem$.attr('data-agree')) {
                                ids.push($(lis$.get(lis$.length-1-i)).attr('data-id'));
                            } else {
                                break;
                            }
                        }
                        return ids;
                    } else {
                        return undefined;
                    }
                } (ctl.$el.find('.article-list ul li'))
            }).done(function (data) {
                if(!data || data.length == 0) {
                    ctl._scrollLoader.endOfScroll();
                } else {
                    if(reload) {
                        setScope('currentWW', $.extend(getScope('currentWW'), {wwArticles: data}));
                        ctl._initScrollLoader();
                    } else {
                        setScope('currentWW', $.extend(getScope('currentWW'), {wwArticles: getScope('currentWW').wwArticles.concat(data)}));
                    }
                    if(data.length < articleCountPerPage) {
                        ctl._scrollLoader.endOfScroll();
                    } else {
                        ctl._scrollLoader.removeLoader();
                    }
                }
            });
        };
        this._initScrollLoader = function () {
            var ctl = this;
            ctl._scrollLoader = ctl.$el.find('#ww-detail-content').wwScrollLoader({
                loadBottom: function (seq) {
                    ctl.loadArticles();
                },
                pull: function (distance) {
                    //alert(distance);
                },
                pullEnd: function () {
                },
                onScroll: function (scrollTop) {
                    if(scrollTop < ctl.$el.find('.title-block h4').height()) {
                        setScope('currentWW', $.extend(getScope('currentWW'), { _showTitle: false }));
                    } else {
                        setScope('currentWW', $.extend(getScope('currentWW'), { _showTitle: true }));
                    }
                }
            });
        };

        this.render = function(id) {
            var ctl = this;
            ctl.$el.wwViewLoader();
            ctl.$el.find('.content-block').removeClass('autoHeightContent');
            ctl.$el.find('.ww-content-toggle').removeClass('icon-up').addClass('icon-down');

            window.wwService.findById(id, {articleCountPerPage: articleCountPerPage}).done(function (item) {
                ctl.$el.wwViewLoader('R');
                item.detail = $wwSce.trustAsHtml(item.detail);  // to make sure some html attrs not removed by the directive
                item.isCreator = (window.user && window.user.userId === (item.author ? item.author.userId : -1));
                setScope('currentWW', item);
                ctl.$el.find('.ww-item-content img').each(function () {
                    $(this).load(function() {
                        ctl._initToggle();
                    }).attr('src', context_root + $(this).attr('data-src'));
                });
                item._detail = ctl.$el.find('.ww-item-content').html();  // keep for further edit
                ctl._initToggle();
                ctl._initScrollLoader();
            });

            return ctl;
        };

        this.bindEvents = function () {
            var ctl = this;

            ctl.$el.off('click.lefNav').on('click.lefNav', '.icon-left-nav', function () {
                //window.location.href = '#ww';
                window.backHandler();
            });

            ctl.$el.off('click.toggle').on('click.toggle', '.ww-content-toggle', function () {
                if($(this).hasClass('icon-down')) {
                    $(this).closest('.content-block').addClass('autoHeightContent');
                    $(this).removeClass('icon-down').addClass('icon-up');
                } else {
                    $(this).closest('.content-block').removeClass('autoHeightContent');
                    $(this).removeClass('icon-up').addClass('icon-down');
                }
            });

            ctl.$el.off('click.comments').on('click.comments', '.footer .comments', function () {
                window.location.href = '#ww/detail/' + getScope('currentWW')._id + '/comments';
            });

            var _plusCB = function (action, data, msg) {
                //console.log(data);
                var actionD = action+'d';
                if(action == 'watch' || action == 'collect') {
                    actionD = action + 'ed';
                }
                if(data && data[action] != undefined) {
                    var updated = {};
                    updated[action] = data[action];
                    updated[actionD] = data[actionD];
                    setScope('currentWW', $.extend(getScope('currentWW'), updated));
                    alert(msg);
                }
            };
            ctl.$el.off('click.btn-agree').on('click.btn-agree', '.btn-agree', function () {
                var ww = getScope('currentWW');
                if(ww.agreed) {
                    window.wwService.agreeOn(ww._id, -1).done(function (data) {_plusCB('agree', data, '已取消点赞')});  //取消点赞/共鸣
                } else {
                    window.wwService.agreeOn(ww._id, 1).done(function (data) {_plusCB('agree', data, '已点赞')});   //点赞/共鸣
                }
            });
            ctl.$el.off('click.btn-watch').on('click.btn-watch', '.btn-watch', function () {
                var ww = getScope('currentWW');
                if(ww.watched) {
                    window.wwService.watchOn(ww._id, -1).done(function (data) {_plusCB('watch', data, '已取消关注')});  //取消关注
                } else {
                    window.wwService.watchOn(ww._id, 1).done(function (data) {_plusCB('watch', data, '已关注')});   //关注
                }
            });
            ctl.$el.off('click.collect').on('click.collect', '.collect', function () {
                var ww = getScope('currentWW');
                if(ww.collected) {
                    window.wwService.collectOn(ww._id, -1).done(function (data) {_plusCB('collect', data, '已取消收藏')});  //取消收藏
                } else {
                    window.wwService.collectOn(ww._id, 1).done(function (data) {_plusCB('collect', data, '已收藏')});   //收藏
                }
            });

            ctl.$el.off('click.article').on('click.article', '.article-list li', function () {
                window.location.href = '#ww/detail/' + getScope('currentWW')._id + '/article/detail/'+$(this).attr('data-id');
            });

            ctl.$el.off('click.compose-article').on('click.compose-article', '.compose-article', function () {
                window.location.href = '#ww/detail/' + getScope('currentWW')._id + '/article/create';
            });

            ctl.$el.off('click.actions').on('click.actions', '.bar-tab span.edit-ww', function () {
                window.location.href = '#ww/edit';
            });

            var floatingMenu$ = ctl.$el.find('.article-list').wwPopupMenu({
                hideList: function () {
                },
                items: [
                    {icon: 'icon-sort-asc', text: '时间升序', selected: true, sortBy: 'createTime', onClick: function (item) {
                        ctl._articleSortBy = item.sortBy;
                        ctl.loadArticles(true);
                    }},
                    {icon: 'icon-sort-desc', text: '时间降序', sortBy: '-createTime', onClick: function (item) {
                        ctl._articleSortBy = item.sortBy;
                        ctl.loadArticles(true);
                    }},
                    {icon: 'icon-thumb-up', text: '点赞最多', sortBy: 'agree', onClick: function (item) {
                        ctl._articleSortBy = item.sortBy;
                        ctl.loadArticles(true);
                    }}
                ]
            });
            ctl.$el.off('click.articleSortingIcon').on('click.articleSortingIcon', '.article-block .header .icon', function () {
                floatingMenu$.toggleList();
            });

            $(window).off('wwbeforechangeview.wwDetail').on('wwbeforechangeview.wwDetail', function (e, currentHash, nextHash) {
                if(currentHash == ctl.hash) {
                    ctl._scrollLoader.rememberScroll();
                } else if(nextHash == ctl.hash) {
                    ctl._scrollLoader.resetScroll();
                }
            });

            return ctl;
        };

        this.initialize();
    };

    return WWForumDetailView;
});
