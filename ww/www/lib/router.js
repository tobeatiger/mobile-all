var router = (function () {

    "use strict";

    var routes = [];
    var postRoute = function () {};

    function addRoute(route, handler) {
        routes.push({parts: route.split('/'), handler: handler});
    }

    function load(route) {
        window.location.hash = route;
    }

    $(window).data('currentHash', window.location.hash.substr(1));  // add by HBY
    var prevHash, currentHash, nextHash;  // add by HBY
    function start() {

        var path = window.location.hash.substr(1),
            parts = path.split('/'),
            partsLength = parts.length;

        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            if (route.parts.length === partsLength) {
                var params = [];
                for (var j = 0; j < partsLength; j++) {
                    if (route.parts[j].substr(0, 1) === ':') {
                        params.push(parts[j]);
                    } else if (route.parts[j] !== parts[j]) {
                        break;
                    }
                }
                if (j === partsLength) {

                    $(window).data('nextHash', window.location.hash.substr(1));    // add by HBY
                    currentHash = $(window).data('currentHash');    // add by HBY
                    nextHash = $(window).data('nextHash');    // add by HBY
                    $(window).trigger('wwbeforechangeview', [currentHash, nextHash]); // add by HBY - before change view event

                    route.handler.apply(undefined, params);  // will change view here
                    postRoute();

                    prevHash = $(window).data('currentHash');  // add by HBY
                    currentHash = $(window).data('nextHash');  // add by HBY
                    $(window).trigger('wwpostchangeview', [prevHash, currentHash]);   // add by HBY - post change view event
                    $(window).data('currentHash', window.location.hash.substr(1)); // add by HBY

                    return;
                }
            }
        }
    }

    function setPostRoute(func) {
        postRoute = func;
    }

    $(window).on('hashchange', start);

    return {
        addRoute: addRoute,
        load: load,
        start: start,
        setPostRoute: setPostRoute
    };

}());