define(['text!templates/main-tpl.html',
    'text!templates/main-ww-tpl.html',
    'text!templates/main-ww-hot-tpl.html',
    'text!templates/main-messages-tpl.html',
    'text!templates/main-my-ww-tpl.html',
    'text!templates/main-me-tpl.html'], function (main, ww, hot, messages, myww, me) {

    var _map = {
        'ww': {
            id: 'tab-ww',
            tpl: ww
        },
        'hot': {
            id: 'tab-ww-hot',
            tpl: hot
        },
        'messages': {
            id: 'tab-ww-messages',
            tpl: messages
        },
        'myww': {
            id: 'tab-my-ww',
            tpl: myww
        },
        'me': {
            id: 'tab-me',
            tpl: me
        }
    };

    var MainView = function () {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(main)(getScope()));
        };

        this.render = function() {
            return this;
        };

        this.bindEvents = function () {
            this.$el.find('.tab-item').off('click').on('click', function () {
                $(this).parent().find('a.tab-item').removeClass('active');
                $(this).addClass('active');
            });
            return this;
        };

        this.changeView = function (viewId, slider) {
            var ctrl = this;
            if(!$('body').find('.ww-main').get(0)) {
                slider.slidePage(this.$el, function () {
                    ctrl._changeView(viewId);
                });
            } else {
                ctrl._changeView(viewId);
            }
        };

        this._changeView = function (viewId) {

            var view = _map[viewId].tpl;
            var id = _map[viewId].id;

            var firstRenderView = false;
            this.$el.find('.ww-main > .ww-tab').hide();
            if(!this.$el.find('.ww-main > #' + id).show().get(0)) {
                this.$el.find('.ww-main').append($(view).wrap('<div id="' + id + '" class="ww-tab"></div>').parent());
                firstRenderView = true;
            }

            // 1. tab ww - first render
            if(firstRenderView && id == _map.ww.id) {
                this.initTabWW(id);
            }

            // 2. tab ww articles - first render
            if(firstRenderView && id == _map.hot.id) {
                this.initTabHot(id);
            }

            // 3. tab ww messages - first render
            if(firstRenderView && id == _map.messages.id) {

            }

            // 4. tab my ww - first render
            if(firstRenderView && id == _map.myww.id) {

            }

            // 5. tab me - first render
            if(firstRenderView && id == _map.me.id) {

            }
        };
        
        this.initTabWW = function (id) {

            var container$ = $('#'+_map.ww.id).find('.ww-container');
            var forumContainer$ = container$.find('#weijian-tab-1');
            var hotTopicContainer$ = container$.find('#weijian-tab-2');

            // bind the tab switch events
            this.$el.find('.ww-main').on('click', '#' + id + ' .ww-nav .control-item', function (e) {
                var ctl$ = $(this);
                require(['WWForumListView'], function (WWForumListView) {
                    container$.find('.ww-sub-container').hide();
                    if(ctl$.attr('data-item-name') == 'weijian-tab-1') {
                        if(!forumContainer$._wwForumView) {
                            // create WWForumView here
                            forumContainer$._wwForumView = new WWForumListView(forumContainer$).render().bindEvents();
                        }
                        forumContainer$.show();
                    } else if (ctl$.attr('data-item-name') == 'weijian-tab-2') {
                        if(!hotTopicContainer$._wwHotTopicView) {
                            // create WWHotTopicView here
                            hotTopicContainer$._wwHotTopicView = null;  // todo
                        }
                        hotTopicContainer$.show();
                    }
                });
                ctl$.parent().find('.control-item').removeClass('active');
                ctl$.addClass('active');
            });

            this.$el.find('.ww-main > #' + id + ' .ww-nav .control-item').eq(0).click();
        };

        this.initTabHot = function (id) {

            var container$ = $('#'+_map.hot.id).find('.ww-container');
            var relunContainer$ = container$.find('#hot-tab-1');  // 热门为论
            var xinluContainer$ = container$.find('#hot-tab-2');  // 我为心路

            // bind the tab switch events
            this.$el.find('.ww-main').on('click', '#' + id + ' .ww-nav .control-item', function (e) {
                var ctl$ = $(this);
                require(['WWReLunListView'], function (WWReLunListView) {
                    container$.find('.ww-sub-container').hide();
                    if(ctl$.attr('data-item-name') == 'hot-tab-1') {
                        if(!relunContainer$._relunView) {
                            // create WWRelunView here
                            relunContainer$._relunView = new WWReLunListView(relunContainer$).render().bindEvents();
                        }
                        relunContainer$.show();
                    } else if (ctl$.attr('data-item-name') == 'hot-tab-2') {
                        if(!xinluContainer$._xinluView) {
                            // create WWXinluView here
                            xinluContainer$._xinluView = null;  // todo
                        }
                        xinluContainer$.show();
                    }
                });
                ctl$.parent().find('.control-item').removeClass('active');
                ctl$.addClass('active');
            });

            this.$el.find('.ww-main > #' + id + ' .ww-nav .control-item').eq(0).click();
        };

        this.initialize();
    };

    return MainView;
});
