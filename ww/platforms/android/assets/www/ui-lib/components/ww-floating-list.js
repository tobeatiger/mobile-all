(function ($) {

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

}(jQuery));