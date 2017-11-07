define(['text!templates/ww/ww-forum-tpl.html'], function (forumTpl) {

    var WWForumListView = function (forumContainer$) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div class="ww-scroll-loader-inner-wrap"/>');
            this.$el.html($wwCompile(forumTpl)(getScope()));
            //setScope('wwSearchObj', {
            //    showWWSearch: false,
            //    wwSearchText: undefined
            //});
            this.hash = window.location.hash.substr(1);
        };

        this.countPerPage = 14;  // todo: get 14 items for first page temporary

        this._done = function (wwItems, appendTop, refreshAll) {
            if(!wwItems) {
                return;
            }

            var ctl = this;

            ctl.firstItemUpdateTime = wwItems.length ? wwItems[0].updateTime : ctl.firstItemUpdateTime;
            if(appendTop) {

                // 1. compare new items with existing items; 2. remove duplicated items; 3. setScope with the latest combined items
                setScope('wwItems', wwItems.concat(_.differenceBy(getScope('wwItems'), wwItems, '_id')));
                ctl._scrollLoader.resetLoaderPosition();
                //setScope('wwItems', wwItems, 'T');

                //var _height = parseInt(ctl.$el.height());
                //forumContainer$.scrollTop(parseInt(ctl.$el.height()) - _height + parseInt(ctl.$el.find('.ww-search').outerHeight(true)) - 5);
            } else if(refreshAll) {
                //ctl.searchUpdateTime = wwItems.length ? wwItems[wwItems.length - 1].updateTime : ctl.searchUpdateTime;
                setScope('wwItems', wwItems, false);
            } else {
                ctl.lastItemUpdateTime = wwItems.length ? wwItems[wwItems.length - 1].updateTime : ctl.lastItemUpdateTime;
                setScope('wwItems', wwItems, true);
            }
            forumContainer$.wwViewLoader('H');
            if(!getScope('wwItems') || getScope('wwItems').length == 0) {
                ctl.$el.find('.no-wws').show();
            } else {
                ctl.$el.find('.no-wws').hide();
            }
        };

        this.render = function() {
            var ctl = this;
            forumContainer$.append(ctl.$el);
            ctl.$ul = ctl.$el.find('ul');

            var floatingBtn$ = $.wwFloatingButton({
                target: forumContainer$,
                btnName: 'ww-forum-floating-btn',
                icon: 'icon-more',
                onClick: function () {
                    floatingList$.toggleList();
                    if(floatingBtn$.hasClass('icon-more')) {
                        floatingBtn$.switchIcon('icon-cross');
                    } else {
                        floatingBtn$.switchIcon();
                    }
                    //window.location.href = '#ww/create';
                }
            });

            var floatingList$ = floatingBtn$.wwFloatingList({
                hideList: function () {
                    floatingBtn$.switchIcon();
                },
                items: [
                    {icon: 'icon-search', text: '搜索', onClick: function (item) {
                        //setScope('wwSearchObj', $.extend(getScope('wwSearchObj'), {showWWSearch: true}));
                        //floatingList$.toggleList();
                        //floatingBtn$.switchIcon();
                        //ctl.$el.find('.ww-search input').focus();
                        floatingList$.toggleList();
                        floatingBtn$.switchIcon();
                        window.location.href = '#ww/search';
                    }},
                    {icon: 'icon-filter', text: '选择标签', onClick: function (item) {
                        //window.location.href = '#ww/detail/58b0da1ee83d382a8c3e25af';
                        alert('TODO');
                    }},
                    {icon: 'icon-plus', text: '创建为谏', onClick: function (item) {
                        floatingList$.toggleList();
                        floatingBtn$.switchIcon();
                        window.location.href = '#ww/create';
                    }}
                ]
            });

            forumContainer$.wwViewLoader(null, {top: 100});
            ctl.retrieveWW().done(function (wwItems) {
                ctl._done(wwItems);
            });

            return ctl;
        };

        this.retrieveWW = function () {
            var ctl = this;
            ctl.$el.find('.no-wws').hide();
            return window.wwService.getWWs(this.countPerPage, ctl.lastItemUpdateTime);
        };

        this.retrieveNewWW = function () {
            var ctl = this;
            ctl.$el.find('.no-wws').hide();
            forumContainer$.wwViewLoader(null, {top: 100});
            return window.wwService.getNewWWs(ctl.firstItemUpdateTime);
        };

        this.bindEvents = function () {
            var ctl = this;
            ctl._scrollLoader = forumContainer$.wwScrollLoader({
                loadBottom: function (seq) {
                    var scrollLoader = this;
                    //if(getScope('wwItems') && getScope('wwItems').length < ctl.countPerPage) {
                    //    //scrollLoader.endOfScroll();
                    //} else {
                        ctl.retrieveWW().done(function (wwItems) {
                            ctl._done(wwItems);
                            if(wwItems.length < ctl.countPerPage) {
                                scrollLoader.endOfScroll();
                            } else {
                                scrollLoader.removeLoader();
                            }
                        });
                    //}
                },
                pull: function (distance) {
                    if(!ctl._loadingNewWW) {
                        if(distance-80 < 30) {
                            forumContainer$.wwViewLoader(null, {top: distance-80})
                                .addClass('noAnimation')
                                .css('transform', 'rotate('+(distance*2)+'deg)');
                        } else {
                            ctl._loadingNewWW = true;
                            forumContainer$.wwViewLoader().removeClass('noAnimation');
                            ctl.retrieveNewWW().done(function (wwItems) {
                                ctl._done(wwItems, true);  // call done to append to top
                                alert(wwItems.length + ' 条新为谏', {top: 200}, 2000);
                                setTimeout(function() {
                                    ctl._loadingNewWW = false;
                                }, 2000);
                            });
                        }
                    }
                },
                pullEnd: function () {
                    if(!ctl._loadingNewWW) {
                        forumContainer$.wwViewLoader().removeClass('noAnimation');
                        forumContainer$.wwViewLoader('H');
                    }
                }
            });
            $(window).off('wwbeforechangeview').on('wwbeforechangeview', function (e, currentHash, nextHash) {
                if(currentHash == ctl.hash) {
                    ctl._scrollLoader.rememberScroll();
                } else if(nextHash == ctl.hash) {
                    ctl._scrollLoader.resetScroll();
                }
            });
            $(ctl.$el).off('click.li').on('click.li', 'li.table-view-cell', function () {
                window.location.href = '#ww/detail/' + $(this).attr('data-id');
            });
            $(ctl.$el).off('click.reload-ww').on('click.reload-ww', '.no-wws .reload-ww', function () {
                forumContainer$.wwViewLoader();
                ctl.retrieveWW().done(function (wwItems) {
                    ctl._done(wwItems);
                });
            });

            //var _h;
            //$(ctl.$el).off('keyup.search').on('keyup.search', '.ww-search input', function () {
            //    clearTimeout(_h);
            //    _h = setTimeout(function () {
            //        window.wwService.textSearch(getScope('wwSearchObj').wwSearchText).done(function (data) {
            //            ctl._done(data, false, true);
            //        });
            //    }, 600);
            //});
            //
            //$(ctl.$el).off('click.clear').on('click.clear', '.ww-search .icon-close', function () {
            //    setScope('wwSearchObj', $.extend(getScope('wwSearchObj'), {wwSearchText: ''}));
            //    $(this).parent().find('input').trigger('keyup');
            //});

            return ctl;
        };

        this.initialize();
    };

    return WWForumListView;
});
