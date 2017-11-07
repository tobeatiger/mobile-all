(function ($) {

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

}(jQuery));