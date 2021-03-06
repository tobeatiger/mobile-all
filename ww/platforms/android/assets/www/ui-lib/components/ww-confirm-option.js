(function ($) {

    $.wwConfirmOption = function (params) {
        var _settings = $.extend(true, {
            target: $('body'),
            onConfirm: function (index) {
                console.log(index);
            }
        }, params ? params : {});

        var container$ = _settings.target.find('#ww-confirm');

        if(!container$.get(0)) {
            container$ = $(
                '<div id="ww-conform">' +
                    '<div class="ww-background-cover">' +
                    '</div>' +
                    '<div style="position:absolute;top:0;left:0;background-color:white;border-radius:4px;text-align:center;height:132px;width:80%;z-index:2;margin-top:50%;margin-left:10%;padding:30px">' +
                        '<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-right:15px;"><span data-index="1" class="icon icon-camera" style="font-size:72px"></span></div>' +
                        '<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-left:15px;"><span data-index="2" class="icon icon-image" style="font-size:72px;position:relative;top:2px;"></span></div>' +
                        //'<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-right:15px;vertical-align:top;"><img data-index="1" style="width:72px;margin-top: 9px;" src="assets/css/images/ic_camera_72px.png"></div>' +
                        //'<div style="display:inline-block;height:100%;width:calc(50% - 15px);margin-left:15px;"><img data-index="2" style="width:72px;" src="assets/css/images/ic_album_72px.png"></div>' +
                    '</div>' +
                '</div>'
            ).appendTo(_settings.target);
        }

        container$.find('span').click(function () {
            _settings.onConfirm($(this).attr('data-index'));
            container$.hide();
        }).end().find('> div:nth(0)').click(function() {
            container$.hide();
        });

        return container$.show();
    };

}(jQuery));