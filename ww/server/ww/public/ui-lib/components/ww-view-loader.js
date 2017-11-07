(function ($) {

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

        return container$.find('.ww-view-loader');
    };

}(jQuery));