(function ($) {

    $.fn.wwScrollLoader = function (params) {

        var container$ = $(this);

        var _settings = $.extend(true, {
            bottomPixels: 30,
            loader: $('<div class="ww-scroll-loader">正在努力加载...</div>'),
            insertAfter: function () {
                return container$.find('li:last');
            },
            loadBottom: function () {return true;},
            pull: function (distance) {},
            pullEnd: function () {},
            onScroll: null
        }, params ? params : {});

        var fired = false;
        var fireSeq = 0;
        container$.endOfList = false;

        container$.off('scroll').on('scroll', function () {

            if(_settings.onScroll && typeof _settings.onScroll == 'function') {
                _settings.onScroll(container$.scrollTop());
                if(!_settings.loadBottom) {
                    return;
                }
            }

            if(container$.endOfList) {
                return;
            }

            var inner_wrap = container$.find('.ww-scroll-loader-inner-wrap');
            if(inner_wrap.length == 0) {
                inner_wrap = container$.wrapInner('<div class="ww-scroll-loader-inner-wrap" />').find('.ww-scroll-loader-inner-wrap');
            }
            var isFireable = inner_wrap.length > 0 && (inner_wrap.height() - container$.height() <= container$.scrollTop() + _settings.bottomPixels);

            if(isFireable && !fired) {
                if(!container$.find('#ww-scroll-loader').get(0)) {
                    container$.appendLoader();
                } else {
                    fireSeq++;
                    fired = true;
                    _settings.loadBottom.apply(container$, [fireSeq]);
                    // delay for preventing event firing within a short period of time
                    var waitUntilLoaded = function (initTime) {
                        var _i = setInterval(function () {
                            if(!container$.find('#ww-scroll-loader').get(0)) { // until loader removed
                                clearInterval(_i);
                                fired = false;
                            } else if (new Date().getTime() - initTime > 20000) { // make sure will not wait forever
                                clearInterval(_i);
                                fired = false;
                            }
                        }, 500);
                    } (new Date().getTime())
                }
            }
        });

        if(_settings.pull && _settings.pullEnd) {
            container$.wwPullEvent({
                pull: _settings.pull,
                pullEnd: _settings.pullEnd
            });
        }

        container$.resetCounter = function () {
            fireSeq = 0;
        };

        container$.removeLoader = function () {
            container$.find('#ww-scroll-loader').remove();
            return container$;
        };

        container$.appendLoader = function () {
            _settings.insertAfter().after('<div id="ww-scroll-loader"></div>');
            return container$.find('#ww-scroll-loader').append(_settings.loader);
        };

        container$.endOfScroll = function () {
            container$.endOfList = true;
            container$.removeLoader().appendLoader().find('.ww-scroll-loader').text('没有更多内容');
        };

        container$.resetLoaderPosition = function () {
            _settings.insertAfter().after(container$.find('#ww-scroll-loader').detach());
        };

        container$.rememberScroll = function () {
            container$.data('scroll-top', container$.scrollTop());
        };

        container$.resetScroll = function () {
            setTimeout(function () {
                container$.scrollTop(parseInt(container$.data('scroll-top')));
            }, 1);
        };

        return container$;
    };

}(jQuery));