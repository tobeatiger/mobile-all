define(['text!templates/ww/ww-creation-tags.html'], function (tpl) {

    var WWCreateTagsView = function (action) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(tpl)(getScope()));
        };

        this.render = function() {
            return this;
        };

        this.bindEvents = function () {
            var dom$ = this.$el;
            dom$.find('a.icon-left-nav').off('click').click(function() {
                window.backHandler();
            });
            dom$.find('a.ww-save').off('click').click(function() {
                if(dom$.find('li .toggle.active').length == 0) {
                    alert('最少选择一个标签', {top: '440px'});
                } else {
                    var wwData = setScope(action, $.extend(getScope(action), function (toggles$) {
                        var tags = [];
                        toggles$.each(function () {
                            tags.push({
                                name: $(this).parent().text().trim()
                            });
                        });
                        return {wwTags: tags};
                    }(dom$.find('li .toggle.active'))));
                    //console.log(wwData);
                    wwService.createOrUpdate(action, wwData).done(function (data) {
                        history.pushState({},'','#ww');
                        window.location.href = '#ww/detail/'+data._id;
                        setTimeout(function () {
                            setScope(action, {});  //clear data after creation
                            alert((action == window.wwActions.newWW) ? '创建成功' : '修改成功');
                        }, 400);
                    }).fail(function () {
                        alert((action == window.wwActions.newWW) ? '哎呀，创建出了点问题' : '哎呀，修改出了点问题');
                    });
                }
            });
            dom$.find('li .toggle').off('click').click(function() {
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    if(dom$.find('#ww-tags-common > li .toggle.active').length >= 2 && $(this).closest('ul').attr('id') !== 'ww-tag-question') {
                        alert('最多选择两个标签', {top: '440px'});
                    } else {
                        $(this).addClass('active');
                    }
                }
            });
            return this;
        };

        this.initWWTags = function () {
            var wwTags = $.map(getScope('currentWW').wwTags, function (obj) {
                return obj.name;
            });
            this.$el.find('#ww-tags-common li .toggle').each(function() {
                if($.inArray($(this).parent().text().trim(), wwTags) > -1) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        };

        this.initialize();
    };

    return WWCreateTagsView;
});
