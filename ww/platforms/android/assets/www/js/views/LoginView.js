define(['text!templates/login-tpl.html'], function (loginTpl) {
    
    var LoginView = function (ViewController) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(loginTpl)(getScope()));
        };

        this.render = function() {
            return this;
        };

        this.bindEvents = function () {
            var dom$ = this.$el;
            dom$.find('#btn-login').off('click').click(function () {
                window.loginService.login(dom$.find('input[name="user"]').val(), dom$.find('input[name="password"]').val())
                    .done(function (user) {
                        //window.setCookie('Authentication', 'testCookieValueBorry', 10);
                        window.user = user;
                        ViewController.switchView('main');
                    })
                    .fail(function (err) {
                        dom$.find('#login-message').text(err.responseText).show();
                    });
            });
            dom$.find('#link-reset-password').click(function () {
                alert('TODO');  // TODO: 忘记密码
            });
            dom$.find('#btn-sign-up').click(function () {
                alert('TODO');  // TODO: 注册用户
            });
            dom$.find('#link-browse').click(function () {
                ViewController.switchView('main'); // 浏览进入
            });
            return this;
        };

        this.initialize();
    };

    return LoginView;
});
