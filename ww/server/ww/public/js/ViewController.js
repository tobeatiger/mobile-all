define([
    'LoginService',
    'WWService',
    'ArticleService',
    'LoginView',
    'MainView',
    'SearchView',
    'WWDetailView',
    'WWCreateView',
    'WWCreateTagsView',
    'ArticleCreateView',
    'ArticleDetailView',
    'CommentsView'
],
function (
    LoginService,
    WWService,
    ArticleService,
    LoginView,
    MainView,
    SearchView,
    WWDetailView,
    WWCreateView,
    WWCreateTagsView,
    ArticleCreateView,
    ArticleDetailView,
    CommentsView
) {

    window.wwActions = {
        newWW: 'newWW',
        editWW: 'editWW',
        newArticle: 'newArticle',
        editArticle: 'editArticle'
    };

    window.wwService = WWService;
    window.articleService = ArticleService;
    window.loginService = LoginService;

    var loginView;
    var mainView = new MainView().render().bindEvents();
    var searchView = new SearchView().render().bindEvents();
    var wwCreateView = new WWCreateView(wwActions.newWW).render().bindEvents();
    var wwCreateTagsView = new WWCreateTagsView(wwActions.newWW).render().bindEvents();
    var wwEditView = new WWCreateView(wwActions.editWW).render().bindEvents();
    var wwEditTagsView = new WWCreateTagsView(wwActions.editWW).render().bindEvents();
    var articleCreateView = new ArticleCreateView(wwActions.newArticle).render().bindEvents();
    var articleEditView = new ArticleCreateView(wwActions.editArticle).render().bindEvents();
    var wwDetailView;
    var articleDetailView;

    var _ctl = {
        start: function () {

            loginView = new LoginView(_ctl).render().bindEvents();

            // check user without calling global ajaxError
            loginService.checkLogin(false).done(function (user) {
                window.user = user;
                _ctl.switchView('main');
            }).fail(function () {
                _ctl.switchView('login');
            });

            $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
                if(jqxhr.status == 403) {
                    window.wwConfirm('要去登录/注册吗？',function(ok) {
                        if(ok) {
                            _ctl.switchView('login');
                        }
                    }, '还未登录', ['是的', '等等再说']);
                }
            });
        },
        switchView: function (id) {

            if(id == 'login') {

                slider.slidePage(loginView.$el);
                window.location.href = '#login';

            } else if (id == 'main') {

                window.location.href = '#ww';

                // 为谏
                router.addRoute('ww', function() {
                    mainView.changeView('ww', slider);
                });

                router.addRoute('ww/search', function() {
                    slider.slidePage(searchView.$el);
                    searchView.setFocus();
                });

                router.addRoute('ww/detail/:id', function(id) {
                    if(!wwDetailView) {
                        wwDetailView = new WWDetailView().bindEvents();
                    }
                    //if(!$('body').find('#ww-detail-view').get(0)) {  // in case back nav by program without a 'slidePage' was done before
                    if(window._nav_backing) {
                        slider.slidePage(wwDetailView.$el);
                    } else {
                        wwDetailView.clearData();  // clear previous rendered data if any
                        slider.slidePage(wwDetailView.$el, function () {
                            wwDetailView.render(id);
                        });
                    }
                    //}
                });

                router.addRoute('ww/detail/:id/comments', function(wwId) {
                    var commentView = new CommentsView(wwId, null, 'ww').bindEvents();
                    slider.slidePage(commentView.$el, function () {
                        commentView.render();
                    });
                });

                router.addRoute('ww/detail/:wwId/article/detail/:articleId/comments', function(wwId, articleId) {
                    var commentView = new CommentsView(wwId, articleId, 'article').bindEvents();
                    slider.slidePage(commentView.$el, function () {
                        commentView.render();
                    });
                });

                router.addRoute('ww/create', function() {
                    loginService.checkLogin().done(function () {
                        setScope('action', wwActions.newWW);
                        slider.slidePage(wwCreateView.$el);
                        wwCreateView.createEditorOnce();
                    }).fail(function () {
                        window.backHandler();
                    });
                });
                router.addRoute('ww/create/tags', function() {
                    slider.slidePage(wwCreateTagsView.$el);
                });
                router.addRoute('ww/edit', function() {
                    loginService.checkLogin().done(function () {
                        setScope('action', wwActions.editWW);
                        slider.slidePage(wwEditView.$el);
                        wwEditView.createEditorOnce();
                        wwEditView.initWWData();
                    }).fail(function () {
                        window.backHandler();
                    });
                });
                router.addRoute('ww/edit/tags', function() {
                    slider.slidePage(wwEditTagsView.$el);
                    wwEditTagsView.initWWTags();
                });

                router.addRoute('ww/detail/:wjId/article/create', function() {
                    loginService.checkLogin().done(function () {
                        setScope('action', wwActions.newArticle);
                        slider.slidePage(articleCreateView.$el);
                        articleCreateView.createEditorOnce();
                        articleCreateView.initData();
                    }).fail(function () {
                        window.backHandler();
                    });
                });
                router.addRoute('ww/detail/:wjId/article/edit/:articleId', function(wjId, articleId) {
                    loginService.checkLogin().done(function () {
                        setScope('action', wwActions.editArticle);
                        slider.slidePage(articleEditView.$el);
                        articleEditView.createEditorOnce();
                        articleEditView.initData(wjId, articleId);
                    }).fail(function () {
                        window.backHandler();
                    });
                });

                router.addRoute('ww/detail/:wjId/article/detail/:articleId', function(wjId, articleId) {
                    if(!articleDetailView) {
                        articleDetailView = new ArticleDetailView().bindEvents();
                    }
                    //if(!$('body').find('#article-detail-view').get(0)) {  // in case back nav by program without a 'slidePage' was done before
                    if(window._nav_backing) {
                        slider.slidePage(articleDetailView.$el);
                    } else {
                        articleDetailView.clearData();  // clear previous rendered data if any
                        slider.slidePage(articleDetailView.$el, function () {
                            articleDetailView.render(articleId);
                        });
                    }
                    //}
                });

                // 热论
                router.addRoute('hot', function() {
                    mainView.changeView('hot', slider);
                    //mainView.$el.find('.ww-articles-tmp').bindLongPress(2000, function() {
                    //    alert('yeah!!!');
                    //});
                });

                // 消息
                router.addRoute('messages', function() {
                    mainView.changeView('messages', slider);
                });

                // 我为
                router.addRoute('myww', function() {
                    mainView.changeView('myww', slider);
                });

                // 我的
                router.addRoute('me', function() {
                    mainView.changeView('me', slider);
                });

                router.setPostRoute(function () {
                    window._nav_backing = false;
                });

                router.start();
            }
        }
    };

    return _ctl;
});