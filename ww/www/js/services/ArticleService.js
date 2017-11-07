define([], function () {

    return new function () {

        this.getArticles = function (wwId, query) {
            return $.ajax({
                url: context_root + '/article/ww/' + wwId + '/articles/byPage',
                type: 'get',
                data: query
            });
        };

        //this.getNewArticles = function (firstItemUpdateTime) {
        //    return $.ajax({
        //        url: context_root + '/article/list',
        //        type: 'get',
        //        data: {
        //            firstItemUpdateTime: firstItemUpdateTime
        //        }
        //    });
        //};

        this.findById = function (id) {
            return $.ajax({
                url: context_root + '/article/detail/' + id,
                type: 'get'
            });
        };

        this.createOrUpdate = function (action, articleData) {
            return $.ajax({
                url: (action == window.wwActions.newWW) ? context_root + '/article/create' : context_root + '/article/update',
                type: 'POST',
                data: articleData,
                dataType: 'json'
            });
        };

        function _plusAction (action, direction, id) {
            if(direction == 1) {
                return $.ajax({
                    url: context_root + '/article/' + action + '/' + id,
                    type: 'post'
                });
            } else {
                return $.ajax({
                    url: context_root + '/article/' + action + '-cancel/' + id,
                    type: 'post'
                });
            }
        }

        this.agreeOn = function (id, direction) {
            return _plusAction('agree', direction, id);
        };

        this.watchOn = function (id, direction) {
            return _plusAction('watch', direction, id);
        };

        this.collectOn = function (id, direction) {
            return _plusAction('collect', direction, id);
        };

        this.commentAgree = function (id, direction) {
            return _plusAction('commentAgree', direction, id);
        };

        this.getComments = function (articleId, queries, refresh) {
            return $.ajax({
                url: context_root + '/article/detail/' + articleId + '/comments/byPage',
                data: queries
            });
        };

        this.addComment = function (articleId, comment, replyTo) {
            return $.ajax({
                url: context_root + '/article/detail/' + articleId + '/comments/add',
                type: 'post',
                data: {
                    comment: comment,
                    replyTo: replyTo
                }
            });
        };

    } ();

});