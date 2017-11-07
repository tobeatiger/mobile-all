(function ($) {

    $.fn.wwPullEvent = function (params) {

        var container$ = $(this);

        var _settings = $.extend(true, {
            pull: function (distance) {},
            pullEnd: function () {}
        }, params ? params : {});

        var pull_start = function (event) {
            event.stopPropagation();
            if(container$.scrollTop() < 3) {
                pull_start.startTop = event.clientY;
            } else {
                pull_start.startTop = undefined;
            }
        };
        var pulling = function(event) {
            event.preventDefault();
            event.stopPropagation();
            if(pull_start.startTop == undefined || event.clientY - pull_start.startTop < 1) {
                return false;
            }
            _settings.pull.apply(container$, [event.clientY - pull_start.startTop]);
        };
        var pull_end = function(event) {
            event.stopPropagation();
            pull_start.startTop = undefined;
            _settings.pullEnd.apply(container$, []);
        };
        container$.off('mousedown').on('mousedown', pull_start)
            .off('mousemove').on('mousemove', pulling)
            .off('mouseup').on('mouseup', pull_end);

        //container$[0].addEventListener('mousedown', pull_start, false);
        //container$[0].addEventListener('mousemove', pulling, false);
        //container$[0].addEventListener('mouseup', pull_end, false);

        return container$;
    };

}(jQuery));