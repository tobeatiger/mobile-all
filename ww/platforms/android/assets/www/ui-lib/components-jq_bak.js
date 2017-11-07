(function () {

    // TODO: move all the css to "components.css"

    $.wwConfirmOption = function (params) {
        var _settings = $.extend(true, {
            target: $('body'),
            onConfirm: function (index) {
                console.log(index);
            }
        }, params ? params : {});

        var container$ = _settings.target.find('#ww-confirm');

        if(!container$.get(0)) {
            container$ = $(
                '<div id="ww-conform">' +
                    '<div class="ww-background-cover">' +
                    '</div>' +
                    '<div style="position:absolute;top:0;left:0;background-color:white;border-radius:4px;text-align:center;height:132px;width:80%;z-index:2;margin-top:50%;margin-left:10%;padding:30px">' +
                        '<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-right:15px;"><span data-index="1" class="icon icon-camera" style="font-size:72px"></span></div>' +
                        '<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-left:15px;"><span data-index="2" class="icon icon-image" style="font-size:72px;position:relative;top:2px;"></span></div>' +
                        //'<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-right:15px;vertical-align:top;"><img data-index="1" style="width:72px;margin-top: 9px;" src="assets/css/images/ic_camera_72px.png"></div>' +
                        //'<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-left:15px;"><img data-index="2" style="width:72px;" src="assets/css/images/ic_album_72px.png"></div>' +
                    '</div>' +
                '</div>'
            ).appendTo(_settings.target);
        }

        container$.find('span').click(function () {
            _settings.onConfirm($(this).attr('data-index'));
            container$.hide();
        }).end().find('> div:nth(0)').click(function() {
            container$.hide();
        });

        return container$.show();
    };

    $.wwBubbleNotification = function (params) {
        var _settings = $.extend(true, {
            text: 'Some information...',
            position: {bottom: '70px'},
            delay: 2000
        }, params ? params : {});

        var container$ = $('<div class="ww-bubble-notification"></div>').text(_settings.text).appendTo($('body'));
        if(_settings.position.top) {
            container$.css('top', _settings.position.top)
        } else {
            container$.css('bottom', _settings.position.bottom)
        }

        container$.css('margin-left', 'calc(50% - ' + (container$.width() + 30)/2 + 'px)').delay(_settings.delay).fadeOut(300, function () {
            container$.remove();
        });

        return container$;
    };

    $.wwFloatingButton = function (params) {
        var _settings = $.extend(true, {
            target: $('body'),
            btnName: '',
            icon: 'icon-more',
            top: 300,
            onClick: function () {console.log('default click')}
        }, params ? params : {});

        var btn$ = _settings.target.find('.ww-draggable-btn');

        _settings.maxTop = _settings.maxTop || _settings.target.height() - 80;

        var drag_start = function (event) {
            var style = window.getComputedStyle(event.target, null);
            drag_start.data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
            drag_start._top = btn$[0].style.top;
        };
        var drag_over = function(event) {
            event.preventDefault();
            if(!drag_start.data) {
                return false;
            }
            var offset = drag_start.data.split(',');
            //btn$[0].style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
            var targetTop = event.clientY + parseInt(offset[1],10);
            btn$[0].style.top = (targetTop < 30 ? 30 : (targetTop > _settings.maxTop ? _settings.maxTop : targetTop)) + 'px';
        };

        var drag_end = function(event) {
            drag_start.data = undefined;
            localStorage.setItem(_settings.btnName, btn$[0].style.top);
            if(drag_start._top === btn$[0].style.top && $(event.target).hasClass('ww-draggable-btn') && !drag_end._clickFired) {
                drag_end._clickFired = true;
                _settings.onClick.bind(btn$)();
                setTimeout(function () {
                    drag_end._clickFired = false;
                }, 50)
            }
        };

        if(!btn$.get(0)) {

            btn$ = $('<aside class="ww-draggable-btn icon" draggable="true"></aside>').prependTo(_settings.target);

            btn$[0].addEventListener('mousedown', drag_start, false);
            _settings.target[0].addEventListener('mousemove', drag_over, false);
            _settings.target[0].addEventListener('mouseup', drag_end, false);
        }
        btn$.css('top', localStorage.getItem(_settings.btnName) || _settings.top+'px').addClass(_settings.icon);

        btn$.switchIcon = function (icon) {
            if(icon) {
                btn$.removeClass(_settings._currentIcon).removeClass(_settings.icon).addClass(icon);
                _settings._currentIcon = icon;
            } else {
                btn$.removeClass(_settings._currentIcon).addClass(_settings.icon);
            }
        };

        return btn$;
    };

    var mouseEventTypes = {
        touchstart : "mousedown",
        touchmove : "mousemove",
        touchend : "mouseup"
    };

    for (originalType in mouseEventTypes) {
        document.addEventListener(originalType, function(originalEvent) {
            var event = document.createEvent("MouseEvents");
            var touch = originalEvent.changedTouches[0];
            event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
                window, 0, touch.screenX, touch.screenY, touch.clientX,
                touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
                touch.metaKey, 0, null);
            originalEvent.target.dispatchEvent(event);
        });
    }

    $.fn.wwViewLoader = function (hideOrRemove, params) {

        var container$ = $(this);

        var _settings = $.extend(true, {
            top: 100
        }, params ? params : {});

        if(!hideOrRemove && !container$.find('.ww-view-loader').get(0)) {
            container$.prepend('<div class="ww-view-loader"></div>').find('.ww-view-loader').css('top', _settings.top+'px');
        } else if (!hideOrRemove && container$.find('.ww-view-loader').get(0)) {
            container$.find('.ww-view-loader').css('top', _settings.top+'px');
        } else if((hideOrRemove == 'R' || hideOrRemove == 'Remove') && container$.find('.ww-view-loader').get(0)) {
            container$.find('.ww-view-loader').fadeOut(function () {
                $(this).remove();
            });
        } else if ((hideOrRemove == 'H' || hideOrRemove == 'Hide') && container$.find('.ww-view-loader').get(0)) {
            container$.find('.ww-view-loader').css('top', '-80px').one('webkitTransitionEnd', function(e) {
                $(e.target).remove();
            });
        }

        return container$;
    };

    $.fn.wwScrollLoader = function (params) {

        var container$ = $(this);

        var _settings = $.extend(true, {
            bottomPixels: 30,
            loader: $('<div class="ww-scroll-loader">正在努力为陛下加载...</div>'),
            insertAfter: function () {
                return container$.find('li:last');
            },
            callback: function () {return true;}
        }, params ? params : {});

        var fired = false;
        var fireSeq = 0;
        container$.endOfList = false;

        container$.off('scroll').on('scroll', function () {

            if(container$.endOfList) {
                return;
            }

            var isFireable;
            if(container$.get(0) == document || container$.get(0) == window) {
                isFireable = $(document).height() - $(window).height() <= $(window).scrollTop() + _settings.bottomPixels;
            } else {
                var inner_wrap = container$.find('.ww-scroll-loader-inner-wrap');
                if(inner_wrap.length == 0) {
                    inner_wrap = container$.wrapInner('<div class="ww-scroll-loader-inner-wrap" />').find('.ww-scroll-loader-inner-wrap');
                }
                isFireable = inner_wrap.length > 0 && (inner_wrap.height() - container$.height() <= container$.scrollTop() + _settings.bottomPixels);
            }

            if(isFireable && !fired) {
                if(!container$.find('#ww-scroll-loader').get(0)) {
                    container$.appendLoader();
                } else {
                    fireSeq++;
                    fired = true;
                    _settings.callback.apply(container$, [fireSeq]);
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

    $.fn.wwFloatingList = function (params) {

        var target$ = $(this);

        var _settings = $.extend(true, {
            items: [
                {
                    icon: 'icon-gear',
                    text: '标签',
                    onClick: function (item) {console.log('item ' + item.text +  ' clicked')}
                }
            ]
        }, params ? params : {});

        var listDom$ = $(
            '<div class="ww-floating-list">' +
                '<div class="ww-background-cover"></div>' +
                '<ul></ul>' +
            '</div>'
        );
        target$.before(listDom$);
        var ul$ = listDom$.find('ul');
        ul$.css('right', (parseInt(target$.css('right')) + 70) + 'px');

        function _appendItem (item) {
            $('<li><span class="icon ' + item.icon + '"></span><span class="item">' + item.text + '</span></li>').click(function () {
                item.onClick(item);
            }).appendTo(ul$);
        }
        for(var i=0; i<_settings.items.length; i++) {
            var item = _settings.items[i];
            _appendItem(item);
        }

        //ul$.append(
        //    '<li><span class="icon icon-search"></span><span class="item">搜索</span></li>' +
        //    '<li><span class="icon icon-filter"></span><span class="item">标签</span></li>' +
        //    '<li><span class="icon icon-plus"></span><span class="item">创建</span></li>'
        //);

        listDom$.hide();

        listDom$.toggleList = function () {
            listDom$.fadeToggle(100);
            var _top = parseInt(target$.css('top')) - parseInt(ul$.css('height')) + parseInt(target$.css('height'));
            if(_top < 30) {
                _top = 30;
            }
            ul$.css('top', _top + 'px');
        };

        listDom$.find('.ww-background-cover').click(function () {
            if(_settings.hideList && typeof _settings.hideList == 'function') {
                _settings.hideList();
                listDom$.fadeOut(100);
            }
        });

        return listDom$;
    };

}());