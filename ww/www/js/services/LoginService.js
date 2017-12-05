define([], function () {

    return new function () {

        this.checkLogin = function (global) {
            return $.ajax({
                url: context_root + '/login/check-login',
                type: 'get',
                global: (global !== false)
            });
        };

        this.login = function (user, password) {
            return $.ajax({
                url: context_root + '/login/ww-login',
                type: 'POST',
                global: false,
                data: {
                    user: user,
                    password: password
                }
            });
        };

        this.logout = function () {
            return $.ajax({
                url: context_root + '/login/ww-logout',
                type: 'POST'
            });
        };

        this.getTestingUsers = function () {
            return $.ajax({
                url: context_root + '/login/testingUsers',
                type: 'get'
            });
        };

    } ();

});