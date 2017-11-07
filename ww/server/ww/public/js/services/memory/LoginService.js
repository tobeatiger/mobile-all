define([], function () {

    return new function () {

        this.checkLogin = function () {
            var deferred = $.Deferred();
            setTimeout(function () {
                if(window.user) {
                    deferred.resolve(window.user);
                } else {
                    deferred.reject();
                }
            }, 100);
            return deferred.promise();
        };

        this.login = function (user, password) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if(parseInt(Math.round(Math.random())) == 0) {
                    deferred.reject({
                        responseText: '运气不好哦，再试一次 ' + (new Date().getTime()+'').slice(-4)
                    });
                } else {
                    deferred.resolve(userData);
                }
            }, 300);
            return deferred.promise();
        };

        var userData = {
            "_id": "58606d1bf93ca84d54031f75",
            "userName": "Borry Huang",
            "userId": "43310547",
            "nickName": "我思故我在",
            "signature": "别人笑我太疯癫，我笑他人看不穿",
            "userWatches": [],
            "articleAgrees": [],
            "watches": ["58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b"],
            "agrees": ["58b373eb040a263358f0764b", "58b0da1ee83d382a8c3e25af", "58b4b76d4e53ce2948999e01", "58b4b2084e53ce2948999dfd"],
            "photo": "assets/css/images/Lisa_Wong.jpg"
        };

    }();

});