(function ($) {

    var Delta = Quill.import('delta');

    $.addQHandler = function (name, toolbar) {

        // image handler
        if(name == 'image') {
            if(navigator.camera && navigator.camera) {
                toolbar.addHandler('image', function () {
                    var _q = this.quill;
                    var selectionIndex = _q.getSelection().index;
                    $.wwConfirmOption({
                        target: $('body').find('> div.page'),
                        onConfirm: function (index) {
                            var options = {
                                quality: 50,
                                allowEdit: true,
                                destinationType: Camera.DestinationType.DATA_URL,
                                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,  //PHOTOLIBRARY
                                encodingType: Camera.EncodingType.JPEG
                            };
                            if (index == 1) {
                                options.sourceType = Camera.PictureSourceType.CAMERA;
                            }
                            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                                //_q.insertEmbed(selectionIndex, 'image', 'data:image/jpg;base64,' + imageUri);
                                _q.updateContents(new Delta().retain(selectionIndex).insert({image: 'data:image/jpg;base64,' + imageUri},{alt: '(图片)'}));
                            }, function cameraError(error) {
                                //alert('failed'); //todo
                                console.debug("Unable to obtain picture: " + error, "app");
                            }, options);
                        }
                    });
                    _q.blur();
                });
            } else {
                //toolbar.addHandler('image', function () {
                //    $.wwConfirmOption({
                //        target: $('body').find('> div.page')
                //    });
                //    //this.quill.insertEmbed(1, 'image', 'data:image/jpg;base64,00013223');
                //});
            }
        }

        // link handler
        if(name == 'link') {
            toolbar.addHandler('link', function (value) {
                var _q = this.quill;
                if(value) {
                    var href = prompt('请输入链接地址');
                    var hrefName = prompt('请输入链接名称');
                    if(href && href.trim() != '') {
                        if(!hrefName || hrefName.trim() == '') {
                            hrefName = href;
                        }
                        //_q.clipboard.dangerouslyPasteHTML(_q.getSelection().index, '<a href="' + href + '">' + hrefName + '</a>');
                        _q.updateContents(new Delta().retain(_q.getSelection().index).insert(hrefName,{link: href}));
                    }
                }
            });
        }

        // bold handler
        if(name == 'bold') {
            toolbar.addHandler('bold', function (value) {
                var _q = this.quill;
                var sStart = _q.getSelection().index;
                var sLength = _q.getSelection().length;

                var selectedDelta = _q.getContents(sStart, sLength);
                var _bold = null;
                selectedDelta.forEach(function (op) {
                    if(!op.attributes) {
                        op.attributes = {};
                    }
                    if(_bold === null) {
                        _bold = !op.attributes.bold;
                    }
                    op.attributes.bold = _bold;
                });

                _q.updateContents(new Delta().retain(sStart).delete(sLength).concat(selectedDelta));
                _q.setSelection(sStart, sLength);
            });
        }
    };

}(jQuery));