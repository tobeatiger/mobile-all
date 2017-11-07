define(['text!templates/article/article-creation.html'], function (tpl) {

    // action will be 'newWW' or 'editWW', reference to ViewController.js
    var ArticleCreateView = function (action) {

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
            dom$.find('#article-save').off('click').click(function() {
                var editor$ = dom$.find('.ql-editor');
                var articleData = getScope(action); // action will be 'newArticle' or 'editArticle'
                if(articleData.title && articleData.title.trim().length > 4 && (editor$.text().trim().length > 9 || editor$.find('img').length > 0)) {
                    setScope(action, $.extend(articleData, {
                        content: editor$.html()
                    }));
                    articleService.createOrUpdate(action, articleData).done(function (data) {
                        history.pushState({},'','#ww');  // todo: this need to be dynamic according to the ENTRY into article edit - make sure can back to the first level
                        history.pushState({},'','#ww/detail/'+articleData.weijianId);  // todo: this need to be dynamic according to the ENTRY into article edit
                        window.location.href = '#ww/detail/'+articleData.weijianId+'/article/detail/'+data._id;
                        setTimeout(function () {
                            setScope(action, {});  //clear data after creation
                            alert((action == window.wwActions.newArticle) ? '创建成功' : '修改成功');
                        }, 400);
                    }).fail(function () {
                        alert((action == window.wwActions.newArticle) ? '哎呀，创建出了点问题' : '哎呀，修改出了点问题');
                    });
                } else {
                    alert('标题至少 5 个字，内容至少 10 个字');
                }
            });
            return this;
        };

        this.createEditorOnce = function () {
            var ctrl = this;
            if(!ctrl.quill) {
                ctrl.quill = new Quill('#article-create-quill-editor', {
                    modules: {
                        toolbar: [
                            ['bold', 'blockquote', 'link', 'image']
                        ]
                    },
                    placeholder: '编辑为论',
                    theme: 'snow'
                });

                document.addEventListener("selectionchange", function() { // to fix the defect on 'bold' after selection on mobile device
                    ctrl.quill.getSelection();
                }, false);

                var toolbar = ctrl.quill.getModule('toolbar');
                $.addQHandler('image', toolbar);
                $.addQHandler('link', toolbar);
            }
            return ctrl;
        };

        this.initData = function () {
            if(action == window.wwActions.newArticle) {
                var wwData = getScope('currentWW');
                setScope(action, {
                    weijianId: wwData._id,
                    title: '[论]'+wwData.title
                });
            } else {
                var articleData = getScope('currentArticle');
                articleData.weijianId = articleData.weijian._id;
                setScope(action, articleData);
                this.$el.find('.ql-editor').html(articleData._content);
                this._titleChange();
            }
        };

        this.initialize();
    };

    return ArticleCreateView;
});
