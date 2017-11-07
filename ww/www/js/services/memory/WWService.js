define([], function () {

    return new function () {

        this._getWWFirst = true;
        this.getWWs = function (countPerPage, lastItemUpdateTime) {  // todo timestamp for pagination
            var ctl = this;
            var deferred = $.Deferred();
            setTimeout(function () {
                console.log('returning WWs...' + new Date().getTime());
                var count = parseInt(Math.random() * countPerPage * 1.5) + 1;
                if (count > countPerPage) {
                    count = countPerPage;
                }
                if (ctl._getWWFirst) {
                    ctl._getWWFirst = false;
                    count = countPerPage;
                }
                console.log(count);
                deferred.resolve(wwItems.slice(0, count));
            }, 200);
            return deferred.promise();
        };

        this.getNewWWs = function (firstItemUpdateTime) {  // todo firstItemUpdateTime
            var deferred = $.Deferred();
            setTimeout(function () {
                console.log('returning New WWs...' + new Date().getTime());
                var count = parseInt(Math.random() * 8) + 1;
                var items = $.extend(true, [], wwItems.slice(0, count));
                $.each(items, function (i, item) {
                    item._id = new Date().getTime();
                    item.title = item.title + ' ' + new Date().getTime();
                    item.shortDetail = item.shortDetail + ' ' + new Date().toString();
                });
                deferred.resolve(items);
            }, 600);
            return deferred.promise();
        };

        this.findById = function (id) {
            var deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve($.extend(true, {}, wwItems[parseInt(Math.round(Math.random()))]));
            }, 400);
            return deferred.promise();
        };

        this.textSearch = function (searchText) {
            var ctl = this;
            var deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve(_.filter(wwItems, function (o) {
                    if (!searchText) {
                        return false;
                    }
                    var reg = new RegExp('(?=.*' + searchText + ')');
                    return reg.test(o.title) || reg.test(o.detail) || reg.test(o.shortDetail);
                }));
            }, 800);
            return deferred.promise();
        };

        this.createOrUpdate = function (action, wwData) {
            var deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve({_id: wwItems[0]._id});
            }, 400);
            return deferred.promise();
        };

        this.getWWHotTopics = function () {
            // todo
        };

        this.agreeOn = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if (direction == 1) {
                    deferred.resolve({agreed: true, agree: 11});
                } else {
                    deferred.resolve({agreed: false, agree: 10});
                }
            }, 100);
            return deferred.promise();
        };

        this.watchOn = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if (direction == 1) {
                    deferred.resolve({watched: true, watch: 5});
                } else {
                    deferred.resolve({watched: false, watch: 4});
                }
            }, 100);
            return deferred.promise();
        };

        this.collectOn = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if (direction == 1) {
                    deferred.resolve({collected: true, collect: 3});
                } else {
                    deferred.resolve({collected: false, collect: 2});
                }
            }, 100);
            return deferred.promise();
        };

        this.commentAgree = function (id, direction) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if (direction == 1) {
                    deferred.resolve({agreed: true, agree: 5});
                } else {
                    deferred.resolve({agreed: false, agree: 4});
                }
            }, 100);
            return deferred.promise();
        };

        this.getComments = function (wwId, queries, refresh) {
            var deferred = $.Deferred();
            setTimeout(function () {
                if (refresh || Math.random() > 0.5) {
                    var sortBy = (queries.sortBy == 'agree') ? 'agree' : 'createTime';
                    var comments_t = $.extend(true, [], comments.comments);
                    deferred.resolve({
                        comments: (queries.sortBy == 'createTime') ? _.sortBy(comments_t, [sortBy, 'createTime']) : _.sortBy(comments_t, [sortBy, 'createTime']).reverse(),
                        user: comments.user
                    });
                    //deferred.resolve(comments);
                } else {
                    deferred.resolve({
                        comments: [],
                        user: comments.user
                    });
                }
            }, 400);
            return deferred.promise();
        };

        this.addComment = function (wwId, comment, replyTo) {
            var deferred = $.Deferred();
            setTimeout(function () {
                deferred.resolve({
                    "_id": new Date().getTime() + '',
                    "content": comment,
                    "author": window.user,
                    "linkTo": "WeiJian",
                    "replyTo": replyTo,
                    "linkToId": wwId,
                    "createTime": new Date(),
                    "disagree": 0,
                    "agree": 0
                });
            }, 400);
            return deferred.promise();
        };

        var wwItems = [
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了偶尔失眠就别再强迫自己入睡了偶尔失眠就别再强迫自己入睡了偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。<br/><br/>" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。<br/><br/>" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。" +
                "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "comments": [{}, {}],
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [{
                    "_id": (new Date().getTime() + '').slice(-5),
                    "title": "[论]偶尔失眠就别再强迫自己入睡了",
                    "shortContent": "人生得意须尽欢，莫使金樽空对月。人生得意须尽欢，莫使金樽空对月。人生得意须尽欢，莫使金樽空对月。人生得意须尽欢...",
                    "content": "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>",
                    "comments": [{}, {}, {}],
                    "agree": 5,  //共鸣
                    "disagree": 1, //踩
                    "watch": 1, //关注
                    "accept": 1,  //纳谏
                    "collect": 2, //收藏
                    "browsed": 22, //浏览
                    "author": {
                        "userId": "33443344",
                        "nickName": "小明",
                        "photo": "assets/css/images/Lisa_Wong.jpg",
                        "signature": "我的故事。。。"
                    }
                }, {
                    "_id": (new Date().getTime() + '').slice(-5),
                    "title": "[论]偶尔失眠就别再强迫自己入睡了",
                    "shortContent": "庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴。乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。属予作文以记之...",
                    "content": "庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴。乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。属予作文以记之。<br/><br/>" +
                    "予观夫巴陵胜状，在洞庭一湖。衔远山，吞长江，浩浩汤汤，横无际涯；朝晖夕阴，气象万千。此则岳阳楼之大观也，前人之述备矣。然则北通巫峡，南极潇湘，迁客骚人，多会于此，览物之情，得无异乎?<br/><br/>" +
                    "若夫霪雨霏霏，连月不开，阴风怒号，浊浪排空；日星隐曜，山岳潜形；商旅不行，樯倾楫摧；薄暮冥冥，虎啸猿啼。登斯楼也，则有去国怀乡，忧谗畏讥，满目萧然，感极而悲者矣。<br/><br/>" +
                    "至若春和景明，波澜不惊，上下天光，一碧万顷；沙鸥翔集，锦鳞游泳；岸芷汀兰，郁郁青青。而或长烟一空，皓月千里，浮光跃金，静影沉璧，渔歌互答，此乐何极！登斯楼也，则有心旷神怡，宠辱偕忘，把酒临风，其喜洋洋者矣。<br/><br/>" +
                    "嗟夫！予尝求古仁人之心，或异二者之为，何哉？不以物喜，不以己悲；居庙堂之高则忧其民；处江湖之远则忧其君。是进亦忧，退亦忧。然则何时而乐耶？其必曰“先天下之忧而忧，后天下之乐而乐乎。”噫！微斯人，吾谁与归？",
                    "comments": [{}, {}],
                    "agree": 5,  //共鸣
                    "disagree": 1, //踩
                    "watch": 1, //关注
                    "accept": 1,  //纳谏
                    "collect": 2, //收藏
                    "browsed": 22, //浏览
                    "author": {
                        "userId": "43425307",
                        "nickName": "尖爷",
                        "photo": "assets/css/images/Lisa_Wong.jpg",
                        "signature": "恐龙拽根"
                    }
                }], //为论
                "author": {
                    "userId": "43310547",
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg",
                    "signature": "别人笑我太疯癫，我笑他人看不穿"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    },
                    {
                        "name": "何为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "为为宣言之封面设计",
                "shortDetail": "这是一个让你晒晒你做过的酷酷的事情的地方;这是一个让你谈论我们有何可为，如何为之的地方;这也是一个让你下定决心要有所作为的地方。圣人王阳明告诉我们要“知行合一”...",  //use type string in mongoDB ?
                "detail": "<blockquote><strong>Slide 1:</strong></blockquote><p><br></p><p>这是一个让你晒晒你做过的酷酷的事情的地方;</p><p>这是一个让你谈论我们有何可为，如何为之的地方<span style=\"color: rgb(119, 119, 119);\">;</span></p><p>这也是一个让你下定决心要有所作为的地方。</p><p><br></p><p>圣人王阳明告诉我们要“知行合一”，</p><p>“知乎”致力于提高我们的认知（在此致敬），</p><p>而我们让大家有所作为（行）！</p><p><br></p><p>有些事，我们尽力而为;</p><p>有些事，我们量力而为;</p><p>有些事，我们亲力亲为;</p><p>有些事，我们有所不为;</p><p>有些事，我们大有可为;</p><p>而有些事，我们不要忘了还要为所欲为！</p><p><br></p><blockquote><strong>Slide 2:</strong></blockquote><p><br></p><p><strong>为件</strong></p><p><br></p><p>你做了什么让你觉得骄傲的事情？</p><p>你做了什么让你很有成就感的事情？</p><p>你做了什么酷毙了的事情？</p><p>在这里，你可以创建<strong>为件</strong>大胆地晒出来！</p><p><br></p><p><strong>为件</strong>，亦可谓之“<strong>为谏</strong>”。</p><p>对于你看到的任何事情，</p><p>经历过的任何事情，</p><p>好的或者坏的，</p><p>你也可以对他人，对公众提出你的谏言。</p><p><br></p><blockquote><strong>Slide 3:</strong></blockquote><p><br></p><p><strong>为论</strong></p><p><br></p><p>基于“为件”所涉话题，</p><p>什么事情我们该去做？</p><p>什么事情我们不该做？</p><p>我们该如何去做？</p><p>你可以畅所欲言，发表你的高论。</p><p><br></p><blockquote><strong>Slide 4:</strong></blockquote><p><br></p><p><strong>我为</strong></p><p><br></p><p>你有什么需要下决心去做的事情吗？</p><p>你有什么需要告诉自己不该做的事情吗？</p><p>你有什么缺点/弱点需要下决心去挑战进步吗？</p><p>看到为友做了那么多有趣的事情，</p><p>你是否也跃跃欲试？</p><p>来吧，“<strong>我为</strong>”帮你管理你所有的“小目标”。</p><p><br></p>",
                "comments": [{}, {}],
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [{
                    "_id": (new Date().getTime() + '').slice(-5),
                    "title": "[论]为为宣言",
                    "shortContent": "庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴。乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。属予作文以记之...",
                    "content": "庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴。乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。属予作文以记之。<br/><br/>" +
                    "予观夫巴陵胜状，在洞庭一湖。衔远山，吞长江，浩浩汤汤，横无际涯；朝晖夕阴，气象万千。此则岳阳楼之大观也，前人之述备矣。然则北通巫峡，南极潇湘，迁客骚人，多会于此，览物之情，得无异乎?<br/><br/>" +
                    "若夫霪雨霏霏，连月不开，阴风怒号，浊浪排空；日星隐曜，山岳潜形；商旅不行，樯倾楫摧；薄暮冥冥，虎啸猿啼。登斯楼也，则有去国怀乡，忧谗畏讥，满目萧然，感极而悲者矣。<br/><br/>" +
                    "至若春和景明，波澜不惊，上下天光，一碧万顷；沙鸥翔集，锦鳞游泳；岸芷汀兰，郁郁青青。而或长烟一空，皓月千里，浮光跃金，静影沉璧，渔歌互答，此乐何极！登斯楼也，则有心旷神怡，宠辱偕忘，把酒临风，其喜洋洋者矣。<br/><br/>" +
                    "嗟夫！予尝求古仁人之心，或异二者之为，何哉？不以物喜，不以己悲；居庙堂之高则忧其民；处江湖之远则忧其君。是进亦忧，退亦忧。然则何时而乐耶？其必曰“先天下之忧而忧，后天下之乐而乐乎。”噫！微斯人，吾谁与归？",
                    "comments": [{}, {}, {}],
                    "agree": 5,  //共鸣
                    "disagree": 1, //踩
                    "watch": 1, //关注
                    "accept": 1,  //纳谏
                    "collect": 2, //收藏
                    "browsed": 22, //浏览
                    "author": {
                        "userId": "43425307",
                        "nickName": "尖爷",
                        "photo": "assets/css/images/Lisa_Wong.jpg",
                        "signature": "恐龙拽根"
                    }
                }, {
                    "_id": (new Date().getTime() + '').slice(-5),
                    "title": "[论]为为宣言",
                    "shortContent": "人生得意须尽欢，莫使金樽空对月。人生得意须尽欢，莫使金樽空对月。人生得意须尽欢，莫使金樽空对月。人生得意须尽欢...",
                    "content": "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>" +
                    "人生得意须尽欢，莫使金樽空对月。<br/><br/>",
                    "comments": [{}, {}],
                    "agree": 5,  //共鸣
                    "disagree": 1, //踩
                    "watch": 1, //关注
                    "accept": 1,  //纳谏
                    "collect": 2, //收藏
                    "browsed": 22, //浏览
                    "author": {
                        "userId": "33443344",
                        "nickName": "小明",
                        "photo": "assets/css/images/Lisa_Wong.jpg",
                        "signature": "我的故事。。。"
                    }
                }],
                "author": {
                    "userId": "43310547",
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg",
                    "signature": "Practise makes perfect"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": undefined,
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [], //为论
                "author": {
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "我要旅行，我要去西藏！！！",
                "shortDetail": "想去西藏好多年了，今年决定要对自己好点，无论如何一定要去一趟西藏了。吧啦吧啦，吧啦吧啦，吧啦吧啦，吧啦吧啦，吧啦吧啦，吧啦吧啦，吧啦吧啦，吧啦吧啦。",  //use type string in mongoDB ?
                "detail": undefined,
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [],
                "author": {
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": undefined,
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [], //为论
                "author": {
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "我要旅行，我要去西藏！！！",
                "shortDetail": "想去西藏好多年了，今年决定要对自己好点，无论如何一定要去一趟西藏了。",  //use type buffer in mongoDB ?
                "detail": undefined,
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [],
                "author": {
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": undefined,
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [], //为论
                "author": {
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "我要旅行，我要去西藏！！！",
                "shortDetail": "想去西藏好多年了，今年决定要对自己好点，无论如何一定要去一趟西藏了。",  //use type buffer in mongoDB ?
                "detail": undefined,
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [],
                "author": {
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": undefined,
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [], //为论
                "author": {
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "我要旅行，我要去西藏！！！",
                "shortDetail": "想去西藏好多年了，今年决定要对自己好点，无论如何一定要去一趟西藏了。",  //use type buffer in mongoDB ?
                "detail": undefined,
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [],
                "author": {
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": undefined,
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [], //为论
                "author": {
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "我要旅行，我要去西藏！！！",
                "shortDetail": "想去西藏好多年了，今年决定要对自己好点，无论如何一定要去一趟西藏了。",  //use type buffer in mongoDB ?
                "detail": undefined,
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [],
                "author": {
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "偶尔失眠就别再强迫自己入睡了",
                "shortDetail": "半夜失眠就不睡了，以其数羊浪费时间，不如做点别的事情，比如看看电子书，或者起来写代码吧，累了再睡更好。",
                "detail": undefined,
                "agree": 105,  //共鸣
                "disagree": 2, //踩
                "watch": 147, //关注
                "accept": 5,  //纳谏
                "collect": 2, //收藏
                "browsed": 421, //浏览
                "wwArticles": [], //为论
                "author": {
                    "nickName": "我思故我在",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "有所不为"
                    },
                    {
                        "name": "大有可为"
                    }
                ]
            },
            {
                "_id": new Date().getTime(),
                "title": "我要旅行，我要去西藏！！！",
                "shortDetail": "想去西藏好多年了，今年决定要对自己好点，无论如何一定要去一趟西藏了。",  //use type buffer in mongoDB ?
                "detail": undefined,
                "agree": 505,
                "disagree": 5,
                "watch": 108,
                "accept": 5,
                "collect": 2,
                "browsed": 899,
                "wwArticles": [],
                "author": {
                    "nickName": "今晚打老虎",
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "wwTags": [
                    {
                        "name": "尽力而为"
                    },
                    {
                        "name": "为所欲为"
                    }
                ],
                "updateTimestamp": new Date().getTime()
            }
        ];

        var comments = {
            "comments": [{
                "_id": "58d9a79fc9c003419c2f7bc6",
                "content": "庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴。乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。属予作文以记之...",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "updateTime": "2017-03-30T00:36:24.245Z",
                "createTime": "2017-03-28T00:00:31.473Z",
                "disagree": 0,
                "agree": 2
            }, {
                "_id": "58d9a860c9c003419c2f7bc7",
                "content": "人生得意须尽欢，莫使金樽空对月。人生得意须尽欢，莫使金樽空对月。人生得意须尽欢，莫使金樽空对月。人生得意须尽欢...",
                "author": {
                    "_id": "586aef17f6846f6e800dcaba",
                    "userName": "Jim YI",
                    "userId": "43425307",
                    "email": "tobeatiger@126.com",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "photoURL": "",
                    "__v": 0,
                    "signature": "What the f...",
                    "nickName": "我是吉姆",
                    "updateTime": "2017-04-02T23:18:01.241Z",
                    "createTime": "2017-04-02T23:18:01.241Z",
                    "commentAgrees": ["58d9a79fc9c003419c2f7bc6"],
                    "userWatches": [],
                    "articleWatches": [],
                    "articleCollects": ["58c88273b9a4f24ee48280e9"],
                    "articleAgrees": ["58c9de182497633ed0c78e47", "58c9dd332497633ed0c78e46", "58c9d487f67c7c0848492351", "58c88273b9a4f24ee48280e9"],
                    "watches": ["58bb727d73925e402036bf65", "58b373eb040a263358f0764b"],
                    "collects": [],
                    "agrees": ["58b4b76d4e53ce2948999e01", "58bb727d73925e402036bf65", "58b373eb040a263358f0764b"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "updateTime": "2017-04-02T23:18:01.241Z",
                "createTime": "2017-03-28T00:03:44.786Z",
                "disagree": 0,
                "agree": 1
            }, {
                "_id": "58daf818c84de75744e5b70a",
                "content": "呵呵，超级搞笑！",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "replyTo": "58d9a79fc9c003419c2f7bc6",
                "updateTime": "2017-03-30T00:28:08.649Z",
                "createTime": "2017-03-28T23:56:08.794Z",
                "disagree": 0,
                "agree": 1
            }, {
                "_id": "58dafc77c84de75744e5b70b",
                "content": "Here we go!",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "updateTime": "2017-03-30T00:19:36.779Z",
                "createTime": "2017-03-29T00:14:47.567Z",
                "disagree": 0,
                "agree": 1
            }, {
                "_id": "58dc53f7aaea4551602536a9",
                "content": "没有点过赞的评论。。。",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "replyTo": "58d9a79fc9c003419c2f7bc6",
                "updateTime": "2017-03-30T00:40:23.331Z",
                "createTime": "2017-03-30T00:40:23.331Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58deef51aaea4551602536aa",
                "content": "没有点赞的",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "replyTo": "58d9a79fc9c003419c2f7bc6",
                "updateTime": "2017-04-01T00:07:45.369Z",
                "createTime": "2017-04-01T00:07:45.369Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58deef75aaea4551602536ab",
                "content": "要赞的要赞的要赞的要赞的要赞的要赞的要赞的要赞的",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "replyTo": "58d9a79fc9c003419c2f7bc6",
                "updateTime": "2017-04-01T00:10:02.952Z",
                "createTime": "2017-04-01T00:08:21.419Z",
                "disagree": 0,
                "agree": 1
            }, {
                "_id": "58e0443ba90fb01944131b8a",
                "content": "普通评论",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "updateTime": "2017-04-02T00:22:19.526Z",
                "createTime": "2017-04-02T00:22:19.526Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58e04ebea0a7bc18389421db",
                "content": "回复吉姆的内容",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "replyTo": "58d9a860c9c003419c2f7bc7",
                "__v": 0,
                "updateTime": "2017-04-02T01:07:10.415Z",
                "createTime": "2017-04-02T01:07:10.415Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58e05a16a0a7bc18389421de",
                "content": "回复 我思故我在: 回复里的对话1",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "replyTo": "58d9a860c9c003419c2f7bc7",
                "__v": 0,
                "updateTime": "2017-04-02T01:55:34.892Z",
                "createTime": "2017-04-02T01:55:34.892Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58e05c0ca0a7bc18389421df",
                "content": "普通评论2",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "__v": 0,
                "updateTime": "2017-04-02T02:03:56.644Z",
                "createTime": "2017-04-02T02:03:56.643Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58e05c31a0a7bc18389421e0",
                "content": "回复吉姆的内容2",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "replyTo": "58d9a860c9c003419c2f7bc7",
                "__v": 0,
                "updateTime": "2017-04-02T02:04:33.334Z",
                "createTime": "2017-04-02T02:04:33.334Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58e05c4ba0a7bc18389421e1",
                "content": "回复 我思故我在: 回复里的对话2",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "replyTo": "58d9a860c9c003419c2f7bc7",
                "__v": 0,
                "updateTime": "2017-04-02T02:04:59.305Z",
                "createTime": "2017-04-02T02:04:59.305Z",
                "disagree": 0,
                "agree": 0
            }, {
                "_id": "58e05c7aa0a7bc18389421e2",
                "content": "普通回复评论",
                "author": {
                    "_id": "58606d1bf93ca84d54031f75",
                    "userName": "Borry Huang",
                    "userId": "43310547",
                    "userPassword": "$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK",
                    "__v": 0,
                    "nickName": "我思故我在",
                    "signature": "别人笑我太疯癫，我笑他人看不穿",
                    "updateTime": "2017-04-01T00:55:35.874Z",
                    "createTime": "2017-04-02T23:18:01.240Z",
                    "commentAgrees": ["58d9a860c9c003419c2f7bc7", "58dafc77c84de75744e5b70b", "58daf818c84de75744e5b70a", "58d9a79fc9c003419c2f7bc6", "58deef75aaea4551602536ab"],
                    "userWatches": [],
                    "articleWatches": ["58c9de182497633ed0c78e47"],
                    "articleCollects": ["58c9de182497633ed0c78e47"],
                    "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                    "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                    "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                    "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                    "photo": "assets/css/images/Lisa_Wong.jpg"
                },
                "linkTo": "WeiJian",
                "linkToId": "58bb727d73925e402036bf65",
                "replyTo": "58e05c0ca0a7bc18389421df",
                "__v": 0,
                "updateTime": "2017-04-02T02:05:46.005Z",
                "createTime": "2017-04-02T02:05:46.005Z",
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
                "updateTime": "2017-04-01T00:55:35.874Z",
                "createTime": "2017-04-02T23:18:01.251Z",
                "commentAgrees": [{"_id": "58d9a860c9c003419c2f7bc7"}, {"_id": "58dafc77c84de75744e5b70b"}, {"_id": "58daf818c84de75744e5b70a"}, {"_id": "58d9a79fc9c003419c2f7bc6"}, {"_id": "58deef75aaea4551602536ab"}],
                "userWatches": [],
                "articleWatches": ["58c9de182497633ed0c78e47"],
                "articleCollects": ["58c9de182497633ed0c78e47"],
                "articleAgrees": ["58c9dd332497633ed0c78e46", "58c9de182497633ed0c78e47"],
                "watches": ["58b4b2084e53ce2948999dfd", "58bb768773925e402036bf67", "58b373eb040a263358f0764b"],
                "collects": ["58bb727d73925e402036bf65", "58b4b76d4e53ce2948999e01"],
                "agrees": ["58b0da1ee83d382a8c3e25af", "58b4b2084e53ce2948999dfd", "58b373eb040a263358f0764b", "58b4b76d4e53ce2948999e01", "58bb768773925e402036bf67", "58bb727d73925e402036bf65"],
                "photo": "assets/css/images/Lisa_Wong.jpg"
            }
        };

    }();

});