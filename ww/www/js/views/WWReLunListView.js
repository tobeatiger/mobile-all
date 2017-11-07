define(['text!templates/article/relun-tpl.html'], function (forumTpl) {

    var WWRelunListView = function (forumContainer$) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div class="ww-scroll-loader-inner-wrap"/>');
            this.$el.html($wwCompile(forumTpl)(getScope()));
            this.hash = window.location.hash.substr(1);
        };

        this.render = function() {
            var ctl = this;
            forumContainer$.append(ctl.$el);
            return ctl;
        };

        this.bindEvents = function () {

            var ctl = this;

            ctl._scrollLoader = forumContainer$.wwScrollLoader({
                loadBottom: function (seq) {
                    var scrollLoader = this;
                },
                pull: function (distance) {
                },
                pullEnd: function () {
                }
            });
            $(window).off('wwbeforechangeview').on('wwbeforechangeview', function (e, currentHash, nextHash) {
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

    return WWRelunListView;
});
