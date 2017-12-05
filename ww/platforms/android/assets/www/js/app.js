// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    var www_root = '.';

    var body$ = $('body');
    window.slider = new PageSlider(body$);
    slider.slidePage($('<div data-not-to-keep-events=true><img style="width:360px;" src="./assets/pics/ww-cover.jpg" /></div>'));

    requirejs.config({
        baseUrl: www_root,
        waitSeconds: 0,
        paths: {
            text: 'lib/require/text',
            domReady: 'lib/require/domReady',
            templates: 'js/views/templates',

            ViewController: 'js/ViewController.min',

            LoginView: 'js/views/LoginView.min',
            MainView: 'js/views/MainView.min',
            SearchView: 'js/views/SearchView.min',
            WWCreateView: 'js/views/WWCreateView.min',
            WWCreateTagsView: 'js/views/WWCreateTagsView.min',
            ArticleCreateView: 'js/views/ArticleCreateView.min',
            WWDetailView: 'js/views/WWDetailView.min',
            ArticleDetailView: 'js/views/ArticleDetailView.min',
            CommentsView: 'js/views/CommentsView.min',
            WWForumListView: 'js/views/WWForumListView.min',
            WWReLunListView: 'js/views/WWReLunListView.min',

            //LoginService: 'js/services/memory/LoginService.min',
            LoginService: 'js/services/LoginService.min',
            //WWService: 'js/services/memory/WWService.min',
            WWService: 'js/services/WWService.min',
            //ArticleService: 'js/services/memory/ArticleService.min'
            ArticleService: 'js/services/ArticleService.min'
        },
        shim: {},
        config: {
            text: {
                useXhr: function (url, protocol, hostname, port) {
                    return true;
                }
            },
            wwApp: {
                debug: true   // todo
            }
        }
    });

    //window.setCookie = function (c_name,value,expiredays) {
    //    var exdate = new Date();
    //    exdate.setDate(exdate.getDate()+expiredays);
    //    document.cookie = c_name+ "=" +escape(value)+
    //        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    //};
    //
    //window.getCookie = function (c_name) {
    //    if (document.cookie.length>0) {
    //        var c_start = document.cookie.indexOf(c_name + "=");
    //        if (c_start!=-1) {
    //            c_start=c_start + c_name.length+1;
    //            var c_end=document.cookie.indexOf(";",c_start);
    //            if (c_end==-1) c_end=document.cookie.length;
    //            return unescape(document.cookie.substring(c_start,c_end));
    //        }
    //    }
    //    return "";
    //};

    window._alert = window.alert;
    window.alert = function (text, position, delay) {
        $.wwBubbleNotification({
            text: text,
            position: position ? position : {},
            delay: delay
        });
    };

    window.wwConfirm = function (message, cb, title, buttons) {

        if(navigator.notification) {
            if(!title) {
                title = '请确认';
            }
            if(!buttons) {
                buttons = ['取消', '确定'];
            } else {
                var _t = buttons[1];
                buttons[1] = buttons[0];
                buttons[0] = _t;
            }
            navigator.notification.confirm(
                '\n'+message,
                function (result) {
                    if(result == 2) {
                        // ok
                        cb(true);
                    } else {
                        // cancel
                        cb(false);
                    }
                },
                '\n'+title,
                buttons
            );
        } else {
            var result = confirm(message);
            setTimeout(function () {
                cb(result);
            }, 1);
        }
    };

    window._nav_backing = false;
    window.backHandler = function() {
        var currentPage = window.location.hash.substr(1);
        if(currentPage.split('/').length > 1) {
            window._nav_backing = true;
            history.go(-1);
        } else {
            if(this.__triggerFrom == 'backbutton') { // from backbutton (android)
                if(!backHandler.__prevTime) {
                    backHandler.__prevTime = new Date().getTime();
                } else if(new Date().getTime() - backHandler.__prevTime < 500) { // press backbutton twice in 0.5 seconds
                    navigator.app.exitApp();
                } else {
                    backHandler.__prevTime = new Date().getTime();
                }
                alert('再按一次退出应用', null, 500);
            }
        }
    };

    //$.fn.bindLongPress = function (time, cb) {
    //    var t;
    //    var el$ = $(this);
    //    el$.off('mousedown.longpress').on('mousedown.longpress', function() {
    //        t = setTimeout(function() {
    //            cb.bind(el$)();
    //        }, time);
    //    }).off('mouseup.longpress').on('mouseup.longpress', function() {
    //        clearTimeout(t);
    //    });
    //    return el$;
    //};

    document.addEventListener('backbutton', backHandler.bind({__triggerFrom: 'backbutton'}), false);

    define('wwApp', ['domReady', 'module'], function (domReady, module) {

        domReady(function () {
            if(navigator.notification && module.config().debug) {

                navigator.notification.prompt(
                    '\n请输入测试服务器 IP：',
                    function (results) {
                        if(results.buttonIndex == 2) {
                            // ok
                            www_root = 'http://' + results.input1 + ':3005/web';
                        } else {
                            // cancel
                            www_root = '.';
                            requirejs.config({
                                paths: {
                                    LoginService: 'js/services/memory/LoginService.min',
                                    WWService: 'js/services/memory/WWService.min',
                                    ArticleService: 'js/services/memory/ArticleService.min'
                                }
                            });
                        }
                        window.context_root = www_root.substr(0, www_root.indexOf('/web'));
                        setTimeout(function () {
                            _init(www_root);
                        }, 500);
                    },
                    '测试服务器输入',
                    ['算了', '好的'],
                    //'192.168.1.104'
                    '118.89.30.45'
                );
            } else {
                www_root = 'http://118.89.30.45:3005/web';  // TODO: use prompt in testing mode
                if(www_root == '.') { //testing only  // TODO: use prompt in testing mode
                    requirejs.config({
                        paths: {
                            LoginService: 'js/services/memory/LoginService.min',
                            WWService: 'js/services/memory/WWService.min',
                            ArticleService: 'js/services/memory/ArticleService.min'
                        }
                    });
                }
                window.context_root = www_root.substr(0, www_root.indexOf('/web'));
                _init(www_root);
            }
        });

        function _init(www_root) {

            // load css files from server: todo: handle dom ready???
            $('#ww-styles').attr('href', www_root+'/'+$('#ww-styles').attr('data-href'));
            $('#ww-component-styles').attr('href', www_root+'/'+$('#ww-component-styles').attr('data-href'));

            setScope('context_root', window.context_root);

            requirejs.config({
                baseUrl: www_root
            });

            $.ajaxSetup({
                xhrFields: { withCredentials: true }
            });

            require(['ViewController', 'domReady', 'ui-lib/ww-jq-ui.min'], function (ViewController, domReady) {
                // 程序入口
                domReady(function () {
                    ViewController.start();
                });
            });
        }
    });

    require(['wwApp']);

}());