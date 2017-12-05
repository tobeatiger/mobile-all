define(['text!templates/login-tpl.html'], function (loginTpl) {
    
    var LoginView = function (ViewController) {

        this.initialize = function () {
            // Define a div wrapper for the view (used to attach events)
            this.$el = $('<div/>');
            this.$el.html($wwCompile(loginTpl)(getScope()));
        };

        this.render = function() {

            // TODO: to be removed ......................... testing only .................................
            // TODO: to remove backend related service as well: http(s)://host:port/login/testingUsers

            // [Testing only....

            var dom$ = this.$el.find('#login');
            var userListDiv$ = $('<div class="user-list" style="display:none;position: absolute;top:280px;left:6px;border:1px solid #ddd;border-radius:5px;padding:5px;">' +
                    '<h5 style="margin:5px 0 10px;text-align:center;">选择登录用户（仅供测试）</h5>' +
                    '<ul style="list-style:none;padding:0;margin:0;width:250px;background-color:#eee;border-radius:4px;max-height:222px;overflow:auto;"></ul>' +
                    '<style>.user-list ul li{padding:8px;}.user-list ul li:nth-child(even){background-color:#f8f8f8;}</style>' +
                '</div>').appendTo(dom$);

            window.loginService.getTestingUsers().done(function (users) {
                var ul$ = userListDiv$.find('ul');
                $.each(users, function (i, user) {
                    var li$ = $('<li data-user-id="' + user.userId + '">' + user.userId + ': ' + user.nickName + '</li>').click(function () {
                        dom$.find('input[name="user"]').val(user.userId);
                        alert('已选：' + user.userId + ' - ' + user.nickName);
                    });
                    ul$.append(li$);
                })
            });

            var floatingBtn$ = $.wwFloatingButton({
                target: dom$,
                btnName: 'ww-login-floating-btn',
                allowDrag: false,
                icon: 'icon-more',
                onClick: function () {
                    if(floatingBtn$.hasClass('icon-more')) {
                        userListDiv$.show();
                        floatingBtn$.switchIcon('icon-cross');
                    } else {
                        userListDiv$.hide();
                        floatingBtn$.switchIcon();
                    }
                }
            }).css('top', '400px');

            // Testing only....]
            // TODO: to be removed ......................... testing only .................................

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
