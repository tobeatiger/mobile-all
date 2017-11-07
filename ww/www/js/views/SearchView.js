define(['text!templates/ww/search-tpl.html'], function (tmpl) {

    var SearchView = function () {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(tmpl)(getScope()));
            setScope('wwSearchObj', {
                wwSearchText: ''
            });
            this.hash = window.location.hash.substr(1);
        };

        this._done = function (wwItems) {
            var ctl = this;
            if(!wwItems) {
                wwItems = [];
            }
            setScope('wwSearchItems', wwItems, false);
            if(!getScope('wwSearchItems') || getScope('wwSearchItems').length == 0) {
                ctl.$el.find('.no-wws').show();
            } else {
                ctl.$el.find('.no-wws').hide();
            }
        };

        this.render = function() {
            return this;
        };

        this.setFocus = function () {
            this.$el.find('.ww-search input').focus();
        };

        this.bindEvents = function () {
            var ctl = this;
            $(ctl.$el).off('click.li').on('click.li', 'li.table-view-cell', function () {
                window.location.href = '#ww/detail/' + $(this).attr('data-id');
            });

            var _h;
            var searchText, _lastSearch;
            $(ctl.$el).off('keyup.search').on('keyup.search', '.ww-search input', function () {
                clearTimeout(_h);
                _h = setTimeout(function () {
                    searchText = getScope('wwSearchObj').wwSearchText;
                    if(searchText) {
                        searchText = searchText.trim();
                    }
                    if(searchText !== _lastSearch) {
                        _lastSearch = searchText;
                        ctl.$el.find('.icon-search').addClass('loading');
                        window.wwService.textSearch(searchText).done(function (data) {
                            ctl._done(data, false, true);
                            ctl.$el.find('.icon-search').removeClass('loading');
                        });
                    }
                }, 600);
            });

            $(ctl.$el).off('click.clear').on('click.clear', '.ww-search .icon-close', function () {
                setScope('wwSearchObj', $.extend(getScope('wwSearchObj'), {wwSearchText: ''}));
                $(this).parent().find('input').trigger('keyup');
            });

            return ctl;
        };

        this.initialize();
    };

    return SearchView;
});
