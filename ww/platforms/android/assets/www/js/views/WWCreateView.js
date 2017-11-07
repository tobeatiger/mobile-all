define(['text!templates/ww/ww-creation.html'], function (tpl) {

    // action will be 'newWW' or 'editWW', reference to ViewController.js
    var WWCreateView = function (action) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(tpl)(getScope()));
            setScope(action, {});
            setScope(action+'TitleChange', this._titleChange.bind(this));
        };

        this._titleChange = function () {  // just used to adjust title layout for good looking: add/remove padding-top
            var titleDom$ = this.$el.find('textarea');
            if(titleDom$.prop('scrollHeight') > 42) {
                titleDom$.css('padding-top', '0px');
            } else {
                titleDom$.css('padding-top', '10px');
            }
        };

        this.render = function() {
            return this;
        };

        this.bindEvents = function () {
            var dom$ = this.$el;
            dom$.find('a.icon-left-nav').off('click').click(function() {
                window.backHandler();
            });
            dom$.find('#ww-next-step').off('click').click(function() {
                var editor$ = dom$.find('.ql-editor');
                var wwData = getScope(action); // action will be 'newWW' or 'editWW'
                if(wwData.title && wwData.title.trim().length > 4 && (editor$.text().trim().length > 9 || editor$.find('img').length > 0)) {
                    setScope(action, $.extend(wwData, {
                        detail: editor$.html()
                        //shortDetail: editor$.text().length > 70 ? editor$.text().substr(0, 70) + '...' : editor$.text()
                    }));
                    if(action == 'newWW') {
                        window.location.href = '#ww/create/tags';
                    } else {
                        window.location.href = '#ww/edit/tags';
                    }
                } else {
                    alert('标题至少 5 个字，内容至少 10 个字');
                }
            });
            return this;
        };

        this.createEditorOnce = function () {
            var ctrl = this;
            if(!ctrl.quill) {
                ctrl.quill = new Quill('#ww-create-quill-editor', {
                    modules: {
                        toolbar: [
                            ['bold', 'blockquote', 'link', 'image']
                        ]
                    },
                    placeholder: '编辑为谏',
                    theme: 'snow'
                });

                //ctrl.quill.on('text-change', function(delta, oldDelta, source) {
                //    if (source == 'api') {
                //        ctrl.$el.find('#ww-create-quill-editor .ql-editor img').each(function (index) {
                //            $(this).attr('data-index', index).text('（图片）');
                //        });
                //    } else if (source == 'user') {
                //    }
                //});

                //ctrl.quill.on('selection-change', function(range, oldRange, source) {
                //    alert(range.length);
                //});

                document.addEventListener("selectionchange", function() { // to fix the defect on 'bold' after selection on mobile device
                    ctrl.quill.getSelection();
                }, false);

                var toolbar = ctrl.quill.getModule('toolbar');
                $.addQHandler('image', toolbar);
                $.addQHandler('link', toolbar);
                //$.addQHandler('bold', toolbar);
            }
            return ctrl;
        };

        // for #ww/edit view
        this.initWWData = function () {
            var wwData = getScope('currentWW');
            setScope(action, wwData);
            this.$el.find('.ql-editor').html(wwData._detail);
            this._titleChange();
        };

        this.initialize();
    };

    return WWCreateView;
});
