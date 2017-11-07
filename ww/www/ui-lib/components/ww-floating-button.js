(function ($) {

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
            event.stopPropagation();
            var style = window.getComputedStyle(event.target, null);
            drag_start.data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
            drag_start._top = btn$[0].style.top;
        };
        var drag_over = function(event) {
            event.preventDefault();
            event.stopPropagation();
            if(!drag_start.data) {
                return false;
            }
            var offset = drag_start.data.split(',');
            //btn$[0].style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
            var targetTop = event.clientY + parseInt(offset[1],10);
            btn$[0].style.top = (targetTop < 30 ? 30 : (targetTop > _settings.maxTop ? _settings.maxTop : targetTop)) + 'px';
        };

        var drag_end = function(event) {
            event.stopPropagation();
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
            //btn$[0].addEventListener('touchstart', drag_start, false);
            //_settings.target[0].addEventListener('touchmove', drag_over, false);
            //_settings.target[0].addEventListener('touchend', drag_end, false);
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

}(jQuery));