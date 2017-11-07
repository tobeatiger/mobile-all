define([], function () {

    return new function () {

        this._getWWFirst = true;
        this.getWWs = function (countPerPage, lastItemUpdateTime) {
            return $.ajax({
                url: context_root + '/ww/list',
                type: 'get',
                data: {
                    countPerPage: countPerPage,
                    lastItemUpdateTime: lastItemUpdateTime
                }
            });
        };

        this.getNewWWs = function (firstItemUpdateTime) {
            return $.ajax({
                url: context_root + '/ww/list',
                type: 'get',
                data: {
                    firstItemUpdateTime: firstItemUpdateTime
                }
            });
        };

        this.findById = function (id, queries) {
            return $.ajax({
                url: context_root + '/ww/detail/' + id,
                type: 'get',
                data: queries
            });
        };

        this.textSearch = function (searchText) {
            return $.ajax({
                url: context_root + '/ww/search',
                type: 'get',
                data: {
                    searchText: searchText
                    //updateTime: lastItemUpdateTime
                }
            });
        };

        this.createOrUpdate = function (action, wwData) {
            return $.ajax({
                url: (action == window.wwActions.newWW) ? context_root + '/ww/create' : context_root + '/ww/update',
                type: 'POST',
                data: wwData,
                dataType: 'json'
            });
        };

        function _plusAction (action, direction, id) {
            if(direction == 1) {
                return $.ajax({
                    url: context_root + '/ww/' + action + '/' + id,
                    type: 'post'
                });
            } else {
                return $.ajax({
                    url: context_root + '/ww/' + action + '-cancel/' + id,
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

        this.getWWHotTopics = function () {
            // todo
        };

        this.commentAgree = function (id, direction) {
            return _plusAction('commentAgree', direction, id);
        };

        this.getComments = function (wwId, queries, refresh) {
            return $.ajax({
                url: context_root + '/ww/detail/' + wwId + '/comments/byPage',
                data: queries
                //{
                //    sortBy: 'agree',
                //    //lastId: '58d9a79fc9c003419c2f7bc6',
                //    lastId: '58e57c5e6064a328e88ed542',
                //    countPerPage: 15
                //}
            });
        };

        this.addComment = function (wwId, comment, replyTo) {
            return $.ajax({
                url: context_root + '/ww/detail/' + wwId + '/comments/add',
                type: 'post',
                data: {
                    comment: comment,
                    replyTo: replyTo
                }
            });
        };
    } ();

});