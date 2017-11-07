(function ($) {

    $.fn.wwPopupMenu = function (params) {

        var target$ = $(this);

        var _settings = $.extend(true, {
            items: [
                {
                    icon: 'icon-sort-asc',
                    text: '时间升序',
                    onClick: function (item) {console.log('item ' + item.text +  ' clicked')}
                }
            ],
            position: {
                top: 50,
                right: 14
            }
        }, params ? params : {});

        var listDom$ = $(
            '<div class="ww-popup-menu">' +
                '<div class="ww-background-cover"></div>' +
                '<ul></ul>' +
            '</div>'
        );
        target$.before(listDom$);
        var ul$ = listDom$.find('ul');
        ul$.css('right', (parseInt(target$.css('right')) + 70) + 'px');

        var selectedItem = _settings.items[0];
        function _appendItem (item) {
            var li$ = $('<li><span class="icon ' + item.icon + '"></span><span class="item icon">' + item.text + '</span></li>').click(function () {
                $(this).parent().find('li').removeClass('selected');
                $(this).addClass('selected');
                item.onClick(item);
                listDom$.toggleList();
                selectedItem = item;
            }).appendTo(ul$);
            if(item.selected) {
                li$.addClass('selected');
            }
        }
        for(var i=0; i<_settings.items.length; i++) {
            var item = _settings.items[i];
            _appendItem(item);
        }

        listDom$.hide();

        listDom$.toggleList = function () {
            listDom$.fadeToggle(100);
            ul$.css('top', _settings.position.top + 'px').css('right', _settings.position.right + 'px');
        };

        listDom$.getSelectedItem = function () {
            return selectedItem;
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