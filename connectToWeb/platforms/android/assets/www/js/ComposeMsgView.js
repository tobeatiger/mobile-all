var ComposeMsgView = function() {

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {
        this.$el.html(this.template());
        var quill = new Quill('#test-quill', {
            modules: {
                toolbar: [
                    ['bold', 'blockquote'],
                    ['link', 'image']
                ]
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
        });
        var toolbar = quill.getModule('toolbar');
        if(navigator.camera && navigator.camera) {
            toolbar.addHandler('image', function () {
                var q = this;
                var selectionIndex = q.quill.getSelection().index;
                $.wwConfirmOption({
                    target: $('body').find('> div.page'),
                    onConfirm: function (index) {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,  //PHOTOLIBRARY
                            encodingType: Camera.EncodingType.JPEG
                        };
                        if(index == 1) {
                            options.sourceType = Camera.PictureSourceType.CAMERA;
                        }
                        navigator.camera.getPicture(function cameraSuccess(imageUri) {
                            q.quill.insertEmbed(selectionIndex, 'image', 'data:image/jpg;base64,' + imageUri);
                        }, function cameraError(error) {
                            //alert('failed'); //todo
                            console.debug("Unable to obtain picture: " + error, "app");
                        }, options);
                    }
                });
                //navigator.notification.confirm(
                //    '拍照，还是在相册中选择相片？',
                //    function (buttonIndex) {
                //        var options = {
                //            quality: 50,
                //            destinationType: Camera.DestinationType.DATA_URL,
                //            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,  //PHOTOLIBRARY
                //            encodingType: Camera.EncodingType.JPEG
                //        };
                //        if(buttonIndex == 2) {
                //            options.sourceType = Camera.PictureSourceType.CAMERA;
                //        }
                //        navigator.camera.getPicture(function cameraSuccess(imageUri) {
                //            q.quill.insertEmbed(q.quill.getSelection().index, 'image', 'data:image/jpg;base64,' + imageUri);
                //        }, function cameraError(error) {
                //            //alert('failed'); //todo
                //            console.debug("Unable to obtain picture: " + error, "app");
                //        }, options);
                //    },
                //    '图片来源选择',
                //    ['选择照片', '拍照']
                //);
                q.quill.blur();
            });
        } else {
            toolbar.addHandler('image', function () {
                $.wwConfirmOption({
                    target: $('body').find('> div.page'),
                    onConfirm: function (index) {
                    }
                });
            });
        }
        return this;
    };

    this.initialize();

};