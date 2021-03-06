define([], function () {

    return new function () {

        this.getArticles = function (wwId, query) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if(Math.random() > 0.5) {
                    deferred.resolve([articleItem]);
                } else {
                    deferred.resolve([]);
                }
            }, 200);
            return deferred.promise();
        };

        //this.getNewArticles = function (firstItemUpdateTime) {
        //    var ctl = this;
        //    var deferred = $.Deferred();
        //    setTimeout(function () {
        //        deferred.resolve([]); //todo
        //    }, 200);
        //    return deferred.promise();
        //};

        this.findById = function (id) {
            var deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve($.extend(true, {}, articleItem));
            }, 400);
            return deferred.promise();
        };

        this.createOrUpdate = function (action, articleData) {
            var deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve({_id: articleItem._id});
            }, 400);
            return deferred.promise();
        };

        this.agreeOn = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if(direction == 1) {
                    deferred.resolve({articleAgreed:true,agree:27});
                } else {
                    deferred.resolve({articleAgreed:false,agree:26});
                }
            }, 100);
            return deferred.promise();
        };

        this.watchOn = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if(direction == 1) {
                    deferred.resolve({articleWatched:true,watch:15});
                } else {
                    deferred.resolve({articleWatched:false,watch:14});
                }
            }, 100);
            return deferred.promise();
        };

        this.collectOn = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if(direction == 1) {
                    deferred.resolve({articleCollected:true,collect:13});
                } else {
                    deferred.resolve({articleCollected:false,collect:12});
                }
            }, 100);
            return deferred.promise();
        };

        this.getComments = function (articleId, queries, refresh) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if (Math.random() > 0.5) {
                    deferred.resolve(comments);
                } else {
                    deferred.resolve({
                        comments: [],
                        user: comments.user
                    });
                }
            }, 100);
            return deferred.promise();
        };

        var articleItem = {
            "_id": "58c88273b9a4f24ee48280e9",
            "weijian": {
                "_id": "58bb727d73925e402036bf65",
                "title": "短短的标题",
                "detail": "<p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p>&#x77ED;&#x77ED;&#x7684;<span style=\"color: rgb(119, 119, 119);\">&#x5185;&#x5BB9; </span></p><p><br></p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p><br></p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p><p>&#x77ED;&#x77ED;&#x7684;&#x5185;&#x5BB9; </p>",
                "shortDetail": "短短的内容 短短的内容 短短的内容 短短的内容 短短的内容 短短的内容 短短的内容 短短的内容 短短的内容 ",
                "author": "58606d1bf93ca84d54031f75",
                "__v": 2,
                "updateTime": "2017-03-14T23:53:23.075Z",
                "createTime": "2017-03-05T02:05:49.943Z",
                "pictures": [],
                "userTags": [],
                "wwTags": [{"_id": "58c88065b9a4f24ee48280e8", "name": "尽力而为"}, {
                    "_id": "58c88065b9a4f24ee48280e7",
                    "name": "为所欲为"
                }, {"_id": "58c88065b9a4f24ee48280e6", "name": "何为(问答)"}],
                "wwArticles": ["58c88273b9a4f24ee48280e9", "58c73eef9781a35388f439d2"],
                "comments": [],
                "browsed": 0,
                "collect": 1,
                "accept": 0,
                "watch": 0,
                "disagree": 0,
                "agree": 1
            },
            "title": "[论]人生得意须尽欢，莫使金樽空对月。",
            "content": "<p>&#x541B;&#x4E0D;&#x89C1;&#xFF0C;&#x9EC4;&#x6CB3;&#x4E4B;&#x6C34;&#x5929;&#x4E0A;&#x6765;&#xFF0C;&#x5954;&#x6D41;&#x5230;&#x6D77;&#x4E0D;&#x590D;&#x56DE;&#x3002;</p><p>&#x541B;&#x4E0D;&#x89C1;&#xFF0C;&#x9AD8;&#x5802;&#x660E;&#x955C;&#x60B2;&#x767D;&#x53D1;&#xFF0C;&#x671D;&#x5982;&#x9752;&#x4E1D;&#x66AE;&#x6210;&#x96EA;&#x3002;</p><p>&#x4EBA;&#x751F;&#x5F97;&#x610F;&#x987B;&#x5C3D;&#x6B22;&#xFF0C;&#x83AB;&#x4F7F;&#x91D1;&#x6A3D;&#x7A7A;&#x5BF9;&#x6708;&#x3002;</p><p>&#x5929;&#x751F;&#x6211;&#x6750;&#x5FC5;&#x6709;&#x7528;&#xFF0C;&#x5343;&#x91D1;&#x6563;&#x5C3D;&#x8FD8;&#x590D;&#x6765;&#x3002;</p><p>&#x70F9;&#x7F8A;&#x5BB0;&#x725B;&#x4E14;&#x4E3A;&#x4E50;&#xFF0C;&#x4F1A;&#x987B;&#x4E00;&#x996E;&#x4E09;&#x767E;&#x676F;&#x3002;</p><p>&#x5C91;&#x592B;&#x5B50;&#xFF0C;&#x4E39;&#x4E18;&#x751F;&#xFF0C;&#x5C06;&#x8FDB;&#x9152;&#xFF0C;&#x541B;&#x83AB;&#x505C;&#x3002;</p><p>&#x4E0E;&#x541B;&#x6B4C;&#x4E00;&#x66F2;&#xFF0C;&#x8BF7;&#x541B;&#x4E3A;&#x6211;&#x4FA7;&#x8033;&#x542C;&#x3002;</p><p>&#x949F;&#x9F13;&#x9994;&#x7389;&#x4E0D;&#x8DB3;&#x8D35;&#xFF0C;&#x4F46;&#x613F;&#x957F;&#x9189;&#x4E0D;&#x590D;&#x9192;&#x3002;</p><p>&#x53E4;&#x6765;&#x5723;&#x8D24;&#x7686;&#x5BC2;&#x5BDE;&#xFF0C;&#x60DF;&#x6709;&#x996E;&#x8005;&#x7559;&#x5176;&#x540D;&#x3002;</p><p>&#x9648;&#x738B;&#x6614;&#x65F6;&#x5BB4;&#x5E73;&#x4E50;&#xFF0C;&#x6597;&#x9152;&#x5341;&#x5343;&#x6063;&#x6B22;&#x8C11;&#x3002;</p><p>&#x4E3B;&#x4EBA;&#x4F55;&#x4E3A;&#x8A00;&#x5C11;&#x94B1;&#xFF0C;&#x5F84;&#x987B;&#x6CBD;&#x53D6;&#x5BF9;&#x541B;&#x914C;&#x3002;</p><p>&#x4E94;&#x82B1;&#x9A6C;&#xFF0C;&#x5343;&#x91D1;&#x88D8;&#xFF0C;</p><p>&#x547C;&#x513F;&#x5C06;&#x51FA;&#x6362;&#x7F8E;&#x9152;&#xFF0C;&#x4E0E;&#x5C14;&#x540C;&#x9500;&#x4E07;&#x53E4;&#x6101;&#x3002;</p>",
            "shortContent": "君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复...",
            "author": {
                "_id": "58606d1bf93ca84d54031f75",
                "userName": "Borry Huang",
                "userId": "43310547",
                "__v": 0,
                "nickName": "我思故我在",
                "signature": "别人笑我太疯癫，我笑他人看不穿",
                "userWatches": [],
                "articleWatches": [],
                "articleCollects": [],
                "articleAgrees": [],
                "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b4b76d4e53ce2948999e01"],
                "collects": ["58bb727d73925e402036bf65"],
                "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                "photo": "assets/css/images/Lisa_Wong.jpg"
            },
            "__v": 0,
            "updateTime": "2017-03-14T23:53:23.062Z",
            "createTime": "2017-03-14T23:53:23.062Z",
            "pictures": [],
            "browsed": 0,
            "collect": 0,
            "accept": 0,
            "watch": 0,
            "disagree": 0,
            "agree": 0,
            "comments": []
        };

        var comments = {
            "comments": [
                {
                    "_id": "58f2c870d1beca12d43e377e",
                    "content": "君不见，黄河之水天上来，奔流到海不复回。<br/>君不见，高堂明镜悲白发，朝如青丝暮成雪。<br/>人生得意须尽欢，莫使金樽空对月。<br/>天生我材必有用，千金散尽还复来。<br/>烹羊宰牛且为乐，会须一饮三百杯。<br/>岑夫子，丹丘生，将进酒，君莫停。<br/>与君歌一曲，请君为我侧耳听。<br/>钟鼓馔玉不足贵，但愿长醉不复醒。<br/>古来圣贤皆寂寞，惟有饮者留其名。<br/>陈王昔时宴平乐，斗酒十千恣欢谑。<br/>主人何为言少钱，径须沽取对君酌。<br/>五花马，千金裘，<br/>呼儿将出换美酒，与尔同销万古愁。",
                    "author": {
                        "_id": "58ec202f0d3b6a1abc3e1dd0",
                        "userName": "Hes Liong",
                        "userId": "43334777",
                        "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                        "nickName": "蓝翔先生",
                        "signature": "What the f... fine!",
                        "updateTime": "2017-04-18T00:29:57.021Z",
                        "createTime": "2017-04-11T00:15:43.412Z",
                        "commentAgrees": ["58e57d5e1b91e81d08a6ca3f", "58f2c870d1beca12d43e377e", "58e0443ba90fb01944131b8a"],
                        "userWatches": [],
                        "articleWatches": [],
                        "articleCollects": [],
                        "articleAgrees": ["58c73eef9781a35388f439d2"],
                        "watches": [],
                        "collects": [],
                        "agrees": [],
                        "photo": "assets/css/images/user.png"
                    },
                    "linkTo": "Article",
                    "linkToId": "58c88273b9a4f24ee48280e9",
                    "__v": 0,
                    "updateTime": "2017-04-16T01:28:24.747Z",
                    "createTime": "2017-04-16T01:27:12.900Z",
                    "disagree": 0,
                    "agree": 2
                }, {
                    "_id": "58f5526426583c169410abc4",
                    "content": "我也来一首？",
                    "author": {
                        "_id": "58606d1bf93ca84d54031f75",
                        "userName": "Borry Huang",
                        "userId": "43310547",
                        "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                        "__v": 0,
                        "nickName": "我思故我在",
                        "signature": "别人笑我太疯癫，我笑他人看不穿",
                        "updateTime": "2017-04-16T01:27:57.727Z",
                        "createTime": "2017-05-06T23:46:05.403Z",
                        "commentAgrees": ["58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab", "58e05c31a0a7bc18389421e0", "58e0443ba90fb01944131b8a", "58e57c5e6064a328e88ed542", "58e57ce46064a328e88ed547", "58e57d5e1b91e81d08a6ca3f", "58e57d501b91e81d08a6ca3e", "58f16cf6cf1a7a18545db28c", "58f16d6dcf1a7a18545db28d", "58f16fe4cf1a7a18545db28e", "58f1701fcf1a7a18545db28f", "58f171bfcf1a7a18545db290", "58f17226cf1a7a18545db291", "58f2c870d1beca12d43e377e"],
                        "userWatches": [],
                        "articleWatches": ["58c9de182497633ed0c78e47"],
                        "articleCollects": ["58c9de182497633ed0c78e47"],
                        "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47", "58c73eef9781a35388f439d2"],
                        "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                        "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                        "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                        "photo": "assets/css/images/Lisa_Wong.jpg"
                    },
                    "linkTo": "Article",
                    "linkToId": "58c88273b9a4f24ee48280e9",
                    "__v": 0,
                    "updateTime": "2017-04-17T23:40:20.636Z",
                    "createTime": "2017-04-17T23:40:20.636Z",
                    "disagree": 0,
                    "agree": 0
                }, {
                    "_id": "58f5529e26583c169410abc5",
                    "content": "啦啦啦啦",
                    "author": {
                        "_id": "58606d1bf93ca84d54031f75",
                        "userName": "Borry Huang",
                        "userId": "43310547",
                        "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                        "__v": 0,
                        "nickName": "我思故我在",
                        "signature": "别人笑我太疯癫，我笑他人看不穿",
                        "updateTime": "2017-04-16T01:27:57.727Z",
                        "createTime": "2017-05-06T23:46:05.403Z",
                        "commentAgrees": ["58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab", "58e05c31a0a7bc18389421e0", "58e0443ba90fb01944131b8a", "58e57c5e6064a328e88ed542", "58e57ce46064a328e88ed547", "58e57d5e1b91e81d08a6ca3f", "58e57d501b91e81d08a6ca3e", "58f16cf6cf1a7a18545db28c", "58f16d6dcf1a7a18545db28d", "58f16fe4cf1a7a18545db28e", "58f1701fcf1a7a18545db28f", "58f171bfcf1a7a18545db290", "58f17226cf1a7a18545db291", "58f2c870d1beca12d43e377e"],
                        "userWatches": [],
                        "articleWatches": ["58c9de182497633ed0c78e47"],
                        "articleCollects": ["58c9de182497633ed0c78e47"],
                        "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47", "58c73eef9781a35388f439d2"],
                        "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                        "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                        "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                        "photo": "assets/css/images/Lisa_Wong.jpg"
                    },
                    "linkTo": "Article",
                    "linkToId": "58c88273b9a4f24ee48280e9",
                    "__v": 0,
                    "updateTime": "2017-04-17T23:41:18.679Z",
                    "createTime": "2017-04-17T23:41:18.679Z",
                    "disagree": 0,
                    "agree": 0
                }, {
                    "_id": "58f55c1726583c169410abd0",
                    "content": "锦瑟无端五十弦，一弦一柱思华年。<br/>庄生晓梦迷蝴蝶，望帝春心托杜鹃。<br/>沧海月明珠有泪，蓝田日暖玉生烟。<br/>此情可待成追忆，只是当时已惘然。",
                    "author": {
                        "_id": "58606d1bf93ca84d54031f75",
                        "userName": "Borry Huang",
                        "userId": "43310547",
                        "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                        "__v": 0,
                        "nickName": "我思故我在",
                        "signature": "别人笑我太疯癫，我笑他人看不穿",
                        "updateTime": "2017-04-16T01:27:57.727Z",
                        "createTime": "2017-05-06T23:46:05.403Z",
                        "commentAgrees": ["58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab", "58e05c31a0a7bc18389421e0", "58e0443ba90fb01944131b8a", "58e57c5e6064a328e88ed542", "58e57ce46064a328e88ed547", "58e57d5e1b91e81d08a6ca3f", "58e57d501b91e81d08a6ca3e", "58f16cf6cf1a7a18545db28c", "58f16d6dcf1a7a18545db28d", "58f16fe4cf1a7a18545db28e", "58f1701fcf1a7a18545db28f", "58f171bfcf1a7a18545db290", "58f17226cf1a7a18545db291", "58f2c870d1beca12d43e377e"],
                        "userWatches": [],
                        "articleWatches": ["58c9de182497633ed0c78e47"],
                        "articleCollects": ["58c9de182497633ed0c78e47"],
                        "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47", "58c73eef9781a35388f439d2"],
                        "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                        "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                        "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                        "photo": "assets/css/images/Lisa_Wong.jpg"
                    },
                    "linkTo": "Article",
                    "linkToId": "58c88273b9a4f24ee48280e9",
                    "__v": 0,
                    "updateTime": "2017-04-18T00:21:43.384Z",
                    "createTime": "2017-04-18T00:21:43.384Z",
                    "disagree": 0,
                    "agree": 0
                }, {
                    "_id": "58f5524726583c169410abc3",
                    "content": "好诗",
                    "author": {
                        "_id": "58606d1bf93ca84d54031f75",
                        "userName": "Borry Huang",
                        "userId": "43310547",
                        "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                        "__v": 0,
                        "nickName": "我思故我在",
                        "signature": "别人笑我太疯癫，我笑他人看不穿",
                        "updateTime": "2017-04-16T01:27:57.727Z",
                        "createTime": "2017-05-06T23:46:05.410Z",
                        "commentAgrees": ["58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab", "58e05c31a0a7bc18389421e0", "58e0443ba90fb01944131b8a", "58e57c5e6064a328e88ed542", "58e57ce46064a328e88ed547", "58e57d5e1b91e81d08a6ca3f", "58e57d501b91e81d08a6ca3e", "58f16cf6cf1a7a18545db28c", "58f16d6dcf1a7a18545db28d", "58f16fe4cf1a7a18545db28e", "58f1701fcf1a7a18545db28f", "58f171bfcf1a7a18545db290", "58f17226cf1a7a18545db291", "58f2c870d1beca12d43e377e"],
                        "userWatches": [],
                        "articleWatches": ["58c9de182497633ed0c78e47"],
                        "articleCollects": ["58c9de182497633ed0c78e47"],
                        "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47", "58c73eef9781a35388f439d2"],
                        "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                        "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                        "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                        "photo": "assets/css/images/Lisa_Wong.jpg"
                    },
                    "linkTo": "Article",
                    "linkToId": "58c88273b9a4f24ee48280e9",
                    "replyTo": "58f2c870d1beca12d43e377e",
                    "__v": 0,
                    "updateTime": "2017-04-17T23:39:51.887Z",
                    "createTime": "2017-04-17T23:39:51.887Z",
                    "disagree": 0,
                    "agree": 0
                }, {
                    "_id": "58f55c3126583c169410abd1",
                    "content": "锦瑟呀，你为何竟然有五十条弦？<br/>每弦每节，都令人怀思黄金华年。<br/>我心象庄子，为蝴蝶晓梦而迷惘；<br/>又象望帝化杜鹃，寄托春心哀怨<br/>沧海明月高照，鲛人泣泪皆成珠<br/>蓝田红日和暖，可看到良玉生烟。<br/>悲欢离合之情，岂待今日来追忆，<br/>只是当年却漫不经心，早已惘然。",
                    "author": {
                        "_id": "58606d1bf93ca84d54031f75",
                        "userName": "Borry Huang",
                        "userId": "43310547",
                        "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                        "__v": 0,
                        "nickName": "我思故我在",
                        "signature": "别人笑我太疯癫，我笑他人看不穿",
                        "updateTime": "2017-04-16T01:27:57.727Z",
                        "createTime": "2017-05-06T23:46:05.410Z",
                        "commentAgrees": ["58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab", "58e05c31a0a7bc18389421e0", "58e0443ba90fb01944131b8a", "58e57c5e6064a328e88ed542", "58e57ce46064a328e88ed547", "58e57d5e1b91e81d08a6ca3f", "58e57d501b91e81d08a6ca3e", "58f16cf6cf1a7a18545db28c", "58f16d6dcf1a7a18545db28d", "58f16fe4cf1a7a18545db28e", "58f1701fcf1a7a18545db28f", "58f171bfcf1a7a18545db290", "58f17226cf1a7a18545db291", "58f2c870d1beca12d43e377e"],
                        "userWatches": [],
                        "articleWatches": ["58c9de182497633ed0c78e47"],
                        "articleCollects": ["58c9de182497633ed0c78e47"],
                        "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47", "58c73eef9781a35388f439d2"],
                        "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                        "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                        "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                        "photo": "assets/css/images/Lisa_Wong.jpg"
                    },
                    "linkTo": "Article",
                    "linkToId": "58c88273b9a4f24ee48280e9",
                    "replyTo": "58f55c1726583c169410abd0",
                    "__v": 0,
                    "updateTime": "2017-04-18T00:22:09.276Z",
                    "createTime": "2017-04-18T00:22:09.276Z",
                    "disagree": 0,
                    "agree": 0
                }],
            "user": {
                "_id": "58606d1bf93ca84d54031f75",
                "userName": "Borry Huang",
                "userId": "43310547",
                "__v": 0,
                "nickName": "我思故我在",
                "signature": "别人笑我太疯癫，我笑他人看不穿",
                "updateTime": "2017-04-16T01:27:57.727Z",
                "createTime": "2017-05-06T23:46:05.425Z",
                "commentAgrees": [{"_id": "58daf818c84de75744e5b70a"}, {"_id": "58d9a79fc9c003419c2f7bc6"}, {"_id": "58deef75aaea4551602536ab"}, {"_id": "58e05c31a0a7bc18389421e0"}, {"_id": "58e0443ba90fb01944131b8a"}, {"_id": "58e57c5e6064a328e88ed542"}, {"_id": "58e57ce46064a328e88ed547"}, {"_id": "58e57d5e1b91e81d08a6ca3f"}, {"_id": "58e57d501b91e81d08a6ca3e"}, {"_id": "58f16cf6cf1a7a18545db28c"}, {"_id": "58f16d6dcf1a7a18545db28d"}, {"_id": "58f16fe4cf1a7a18545db28e"}, {"_id": "58f1701fcf1a7a18545db28f"}, {"_id": "58f171bfcf1a7a18545db290"}, {"_id": "58f17226cf1a7a18545db291"}, {"_id": "58f2c870d1beca12d43e377e"}],
                "userWatches": [],
                "articleWatches": ["58c9de182497633ed0c78e47"],
                "articleCollects": ["58c9de182497633ed0c78e47"],
                "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47", "58c73eef9781a35388f439d2"],
                "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                "photo": "assets/css/images/Lisa_Wong.jpg"
            }
        };

    } ();

});