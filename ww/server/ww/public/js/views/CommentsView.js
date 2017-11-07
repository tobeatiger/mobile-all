define(['text!templates/comments-tpl.html'], function (tmpl) {

    var CommentsView = function (wwId, articleId, type) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(tmpl)(getScope()));
            setScope('commentList', []);
            setScope('commentInputChange', this._inputChange.bind(this));
        };

        this._inputChange = function () {  // just used to adjust title layout for good looking: add/remove padding-top
            var inputDom$ = this.$el.find('.comment-input textarea');
            if(inputDom$.prop('scrollHeight') > 35) {
                inputDom$.css('padding-top', '5px');
            } else {
                inputDom$.css('padding-top', '10px');
            }
        };

        function _processData (data) {
            if(data) {
                _.forEach(data.comments, function (comment) {
                    if(_.find(data.user.commentAgrees, { '_id': comment._id })) {
                        comment.agreed = true;
                    }
                });
                var subComments = _.filter(data.comments, function(o) { return o.replyTo });
                data.comments = _.filter(data.comments, function(o) { return !o.replyTo });
                var aComment;
                _.forEach(subComments, function (o) {
                    aComment = _.find(data.comments, { _id: o.replyTo });
                    if(aComment) {
                        if(!aComment.subComments) {
                            aComment.subComments = [];
                        }
                        aComment.subComments.push(o);
                    }
                });
            }
            return data;
        }

        var _countPerPage = 15;

        this.render = function(sortBy) {
            var ctl = this;

            ctl._currentSortBy = sortBy || 'createTime';

            ctl.$el.wwViewLoader();
            var deferred;
            if(type == 'ww') {
                deferred = window.wwService.getComments(wwId, {
                    countPerPage: _countPerPage,
                    sortBy: ctl._currentSortBy
                }, true);
            } else {  // article
                deferred = window.articleService.getComments(articleId, {
                    countPerPage: _countPerPage,
                    sortBy: ctl._currentSortBy
                }, true);
            }
            deferred.done(function (data) {
                if(data) {
                    data = _processData(data);
                    setScope('commentList', []);  // avoid data mess up with previous render data in mock mode
                    setScope('commentList', data.comments);
                    ctl._initScrollLoader();
                }
                ctl.$el.find('.no-items').removeClass('hidden');
                ctl.$el.wwViewLoader('R');
            });

            return ctl;
        };

        this._initScrollLoader = function () {
            var ctl = this;
            //if(!ctl._scrollLoader) {
            ctl._scrollLoader = ctl.$el.find('.container').wwScrollLoader({
                insertAfter: function () {
                    return ctl.$el.find('.ww-scroll-loader-inner-wrap > ul > li:last');
                },
                loadBottom: function (seq) {
                    var scrollLoader = this;
                    var deferred;
                    var lastId = ctl.$el.find('.ww-scroll-loader-inner-wrap > ul > li:last').attr('data-id');
                    var lastIds = function (lis$) {
                        if(ctl._currentSortBy == 'agree' ) {
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
                    } (ctl.$el.find('.ww-scroll-loader-inner-wrap > ul > li'));
                    var queries = {
                        countPerPage: _countPerPage,
                        sortBy: ctl._currentSortBy,
                        lastId: lastId,
                        lastIds: lastIds
                    };

                    if(type == 'ww') {
                        deferred = window.wwService.getComments(wwId, queries);
                    } else {
                        deferred = window.articleService.getComments(articleId, queries);
                    }
                    deferred.done(function (data) {
                        if(data && data.comments && data.comments.length) {
                            data = _processData(data);
                            setScope('commentList', data.comments, true);
                            scrollLoader.removeLoader();
                        } else {
                            scrollLoader.endOfScroll();
                        }
                    });
                },
                pull: function (distance) {
                },
                pullEnd: function () {
                }
            });
            //}
        };

        this.bindEvents = function () {
            var ctl = this;

            ctl.$el.off('click.lefNav').on('click.lefNav', '.icon-left-nav', function () {
                window.backHandler();
            });
            ctl.$el.off('click.addComment').on('click.addComment', '.addComment', function () {
                var svc, id;
                if(type == 'ww') {
                    svc = window.wwService;
                    id = wwId;
                } else {
                    svc = window.articleService;
                    id = articleId;
                }
                svc.addComment(id, getScope('wwAddComment'), ctl.$el.find('.comment-input textarea').attr('data-reply-to')).done(function (commentObj) {
                    if(!commentObj.replyTo) {
                        //setScope('commentList', [commentObj], true);
                        //ctl._scrollLoader.resetLoaderPosition();
                        ctl.render(ctl._floatingMenu$.getSelectedItem().sortBy);
                    } else {
                        var list = getScope('commentList');
                        var targetComment = _.find(list, {_id: commentObj.replyTo});
                        if(!targetComment.subComments) {
                            targetComment.subComments = [];
                        }
                        targetComment.subComments.push(commentObj);
                        setScope('commentList', list);
                    }
                    ctl.$el.trigger('click.resetComment');
                });
            });
            ctl.$el.off('click.sub-comment-toggle').on('click.sub-comment-toggle', '.sub-comment-toggle, .toggle-area', function (e) {
                e.stopPropagation();
                var target$ = $(this);
                if(target$.hasClass('toggle-area')) {
                    target$ = target$.find('.sub-comment-toggle');
                }
                var subList$ = target$.closest('.comment-item').find('.comment-sub-list').toggleClass('hidden');
                if(subList$.hasClass('hidden')) {
                    target$.text('展开');
                } else {
                    target$.text('收起');
                }
            });

            ctl.$el.off('click.agree').on('click.agree', '.icon.agree', function (e) {
                e.stopPropagation();
                var icon$ = $(this);
                var df$;
                if(icon$.hasClass('active')) {
                    if(type == 'ww') {
                        df$ = window.wwService.commentAgree(icon$.closest('.comment-item').attr('data-id'), -1);
                    } else {
                        df$ = window.articleService.commentAgree(icon$.closest('.comment-item').attr('data-id'), -1);
                    }
                } else {
                    if(type == 'ww') {
                        df$ = window.wwService.commentAgree(icon$.closest('.comment-item').attr('data-id'), 1);
                    } else {
                        df$ = window.articleService.commentAgree(icon$.closest('.comment-item').attr('data-id'), 1);
                    }
                }
                df$.done(function (result) {
                    if(result.agreed) {
                        icon$.addClass('active');
                        icon$.find('span').text(result.agree);
                    } else {
                        icon$.removeClass('active');
                        icon$.find('span').text(result.agree);
                    }
                });
            });

            ctl.$el.off('click.li').on('click.li', '.comment-list .comment-item', function (e) {
                e.stopPropagation();
                var fillText = '';
                var replyToId = $(this).attr('data-id');
                if($(this).hasClass('comment-sub-item')) {
                    fillText = '回复 '+$(this).find('.userName').eq(0).text()+': ';
                    replyToId = $(this).parent().closest('.comment-item').attr('data-id');
                }
                ctl.$el.find('.comment-input textarea')
                    .attr('placeholder', '回复 '+$(this).find('.userName').eq(0).text())
                    .attr('data-reply-to', replyToId)
                    .val(fillText)
                    .focus();
            });
            ctl.$el.off('click.resetComment').on('click.resetComment', function (e) {
                if(!$(e.target).hasClass('addComment') && !$(e.target).parent().hasClass('comment-input')) {
                    ctl.$el.find('.comment-input textarea').attr('placeholder', '写评论').val('').removeAttr('data-reply-to');
                    setScope('wwAddComment', '');
                }
            });

            ctl._floatingMenu$ = ctl.$el.find('.container').wwPopupMenu({
                hideList: function () {
                },
                items: [
                    {icon: 'icon-sort-asc', text: '时间升序', selected: true, sortBy: 'createTime', onClick: function (item) {
                        ctl.render(item.sortBy);
                    }},
                    {icon: 'icon-sort-desc', text: '时间降序', sortBy: '-createTime', onClick: function (item) {
                        ctl.render(item.sortBy);
                    }},
                    {icon: 'icon-thumb-up', text: '点赞最多', sortBy: 'agree', onClick: function (item) {
                        ctl.render(item.sortBy);
                    }}
                ]
            });

            ctl.$el.off('click.icon-pull-right').on('click.icon-pull-right', 'header .icon.pull-right', function () {
                ctl._floatingMenu$.toggleList();
            });

            return ctl;
        };

        this.initialize();
    };

    return CommentsView;
});
