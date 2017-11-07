/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    jiandaoStoredData: null,
    shitouStoredData: null,
    buStoredData: null,
    fileDataRead: null,
    fileDataWrite: null,
    inited: false,
    oprFileName: 'c_gesture.txt',
    deleteFileCallBack: function () {
    },
    deleteFileFailedCallback: null,

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        if(id === 'deviceready') {
            app.oprFileName = 'c_gesture.txt';
            app.readFile();
        }
    },

    resetImgProperties: function (img$, size) {
        img$.css('top', 0).css('left', 0).css('width', size).css('height', size);
    },

    init: function () {

        app.inited = true;

        if(app.fileDataRead) {
            $('.customize .jiandao').attr('src', app.fileDataRead.jiandao);
            app.adjustPhotoPosition(100, $('.customize .jiandao'));

            $('.customize .shitou').attr('src', app.fileDataRead.shitou);
            app.adjustPhotoPosition(100, $('.customize .shitou'));

            $('.customize .bu').attr('src', app.fileDataRead.bu);
            app.adjustPhotoPosition(100, $('.customize .bu'));
        } else {
            $('.customize .jiandao').attr('src', 'img/jiandao.jpg');
            app.resetImgProperties($('.customize .jiandao'), 100);
            $('.customize .shitou').attr('src', 'img/shitou.jpg');
            app.resetImgProperties($('.customize .shitou'), 100);
            $('.customize .bu').attr('src', 'img/bu.jpg');
            app.resetImgProperties($('.customize .bu'), 100);
        }

        $('#setDefaultBtn').off('click').on('click', function () {
            var comfirmed = confirm('Are you sure you want to use default gestures?\nPlease note that your customization will be cleared!');
            if(comfirmed) {
                app.oprFileName = 'c_gesture.txt';
                app.deleteFileCallBack = function () {

                    $('.customize .jiandao').attr('src', 'img/jiandao.jpg');
                    app.resetImgProperties($('.customize .jiandao'), 100);
                    $('.customize .shitou').attr('src', 'img/shitou.jpg');
                    app.resetImgProperties($('.customize .shitou'), 100);
                    $('.customize .bu').attr('src', 'img/bu.jpg');
                    app.resetImgProperties($('.customize .bu'), 100);

                    if($('.imageContainer .jiandao')[0]) {
                        $('.imageContainer .jiandao').attr('src', 'img/jiandao.jpg');
                        app.resetImgProperties($('.imageContainer .jiandao'), 300);
                    }
                    if($('.imageContainer .shitou')[0]) {
                        $('.imageContainer .shitou').attr('src', 'img/shitou.jpg');
                        app.resetImgProperties($('.imageContainer .shitou'), 300);
                    }
                    if($('.imageContainer .bu')[0]) {
                        $('.imageContainer .bu').attr('src', 'img/bu.jpg');
                        app.resetImgProperties($('.imageContainer .bu'), 300);
                    }
                    alert('Cleared gesture customization! Default gestures are used.');
                };
                app.deleteFileFailedCallback = null;
                app.deleteFile();
            }
        });

        var x, y, z, last_x, last_y, last_z;
        var SHAKE_THRESHOLD = 150;
        var speed = 0;
        var onSuccess = function (acceleration) {
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            speed = Math.abs(x + y + z - last_x - last_y - last_z) / 100 * 1000;
            if (speed > SHAKE_THRESHOLD) {
                //a shake
                var randomValue = Math.random() * 3;
                if(randomValue < 1) {
                    app.showLuckyDraw('.jiandao');
                    //$('.imageContainer').empty().append($('.jiandao').clone());
                } else if (randomValue >= 1 && randomValue < 2) {
                    app.showLuckyDraw('.shitou');
                    //$('.imageContainer').empty().append($('.shitou').clone());
                } else {
                    app.showLuckyDraw('.bu');
                    //$('.imageContainer').empty().append($('.bu').clone());
                }
                speed = 0;
            }
            last_x = x;
            last_y = y;
            last_z = z;
        };

        var onError = function () {
            console.log('onError!');
        };

        var options = { frequency: 100 };

        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

        $('.customize .jiandao').off('click').on('click', function () {
            var control = this;
            app.getPhoto(control);
        });

        $('.customize .shitou').off('click').on('click', function () {
            var control = this;
            app.getPhoto(control);
        });

        $('.customize .bu').off('click').on('click', function () {
            var control = this;
            app.getPhoto(control);
        });
    },

    showLuckyDraw: function (resultClass) {
        if(navigator.vibrate) {
            navigator.vibrate(500);
        } else if(navigator.notification && navigator.notification.vibrate) {
            navigator.notification.vibrate(500);
        }
        app.showAnimation(['.jiandao', '.shitou', '.bu', '.jiandao', '.shitou', '.bu', '.jiandao', '.shitou', '.bu'], resultClass);
    },

    showAnimation: function (sequence, resultClass) {
        if(sequence.length > 0) {
            var currentImgCls = sequence.pop();
            $('.imageContainer').find('img').fadeOut(50, function () {
                $(this).remove();
                var tempImg$ = $(currentImgCls).clone().removeAttr('style').hide().appendTo($('.imageContainer'));
                if(tempImg$.attr('src') != 'img/jiandao.jpg' && tempImg$.attr('src') != 'img/shitou.jpg' && tempImg$.attr('src') != 'img/bu.jpg') {
                    tempImg$.css('width', 300).css('height', 534);
                    tempImg$.css('top', -71);
                }
                //app.adjustPhotoPosition(300, tempImg$);
                tempImg$.show(50).end();
                app.showAnimation(sequence, resultClass);
            });
        } else {
            $('.imageContainer').find('img').remove();
            var resultImg$ = $(resultClass).clone().removeAttr('style').appendTo($('.imageContainer')).show();
            app.adjustPhotoPosition(300, resultImg$);

            $('.imageContainer').css('border-color', 'green').css('background-color', 'green');
            setTimeout(function () {
                $('.imageContainer').css('border-color', '#888').css('background-color', 'white');
            }, 800);
            //$('.imageContainer').find('img').fadeOut(100, function () {
            //    $(this).remove();
            //    $(resultClass).clone().hide().appendTo($('.imageContainer')).show(100).delay(100).end();
            //    $('.imageContainer').css('border-color', 'blue').css('border-size', '2px').delay(200).css('border-color', '#888').css('border-size', '1px');
            //    alert(10);
            //});
        }
    },

    getPhoto: function (control) {

        //var canvas = document.createElement('canvas');
        //var context = canvas.getContext('2d');

        navigator.camera.getPicture(
            //function (imageData) {
            function (imageURI) {
                //$('.tempImg').attr('src', "data:image/jpeg;base64," + imageData);
                //canvas.width = $('.tempImg')[0].width;
                //canvas.height = $('.tempImg')[0].width;
                //context.drawImage($('.tempImg')[0], 0, ($('.tempImg')[0].height - canvas.width)/2, canvas.width, canvas.width, 0, 0, canvas.width, canvas.height);
                //$(control).attr('src', canvas.toDataURL());

                $(control).attr('src', imageURI);
                app.adjustPhotoPosition(100, $(control));

                setTimeout(function () {
                    app.saveCustomization();
                }, 100)
            },
            function () {
            },
            {
                quality: 50,
                targetWidth: 467,
                targetHeight: 832,
                //allowEdit: true,
                //destinationType: Camera.DestinationType.DATA_URL
                destinationType: Camera.DestinationType.FILE_URI
            }
        );
    },

    adjustPhotoPosition: function (size, img$) {

        if(img$.attr('src') == 'img/jiandao.jpg' || img$.attr('src') == 'img/shitou.jpg' || img$.attr('src') == 'img/bu.jpg') {
            //defaults
            return;
        }

        var preloadImg$ = img$.removeAttr('style').clone().appendTo('body');

        var h = preloadImg$.height;
        var w = preloadImg$.width;

        if(h > 0 && w > 0) {
            if(h > w) {
                img$.css('width', size).css('height', parseInt(h * size / w));
                img$.css('top', - parseInt(((h - w) / 2) * (size / h)) - (2 * size/100));
            } else if (w > h) {
                img$.css('height', size).css('width', parseInt(w * size / h));
                img$.css('left', - parseInt(((w - h) / 2) * (size / w)) - (2 * size/100));
            }
        } else {
            preloadImg$.off('load').on('load', function () {
                if (this.complete || this.readyState ==  'complete') {
                    h = this.height;
                    w = this.width;
                    console.log('hhhhhhhhhhh:'+ h);
                    console.log('wwwwwwwwwww:'+ w);
                    if(h > w) {
                        img$.css('width', size).css('height', parseInt(h * size / w));
                        img$.css('top', - parseInt(((h - w) / 2) * (size / h)) - (2 * size/100));
                    } else if (w > h) {
                        img$.css('height', size).css('width', parseInt(w * size / h));
                        img$.css('left', - parseInt(((w - h) / 2) * (size / w)) - (2 * size/100));
                    }
                    $(this).remove();
                }
            });
        }
    },

    saveCustomization: function () {
        var custGestureData = {
            jiandao: '',
            shitou: '',
            bu: ''
        };
        custGestureData.jiandao = "" + $('.customize .jiandao').attr('src');
        custGestureData.shitou = "" + $('.customize .shitou').attr('src');
        custGestureData.bu = "" + $('.customize .bu').attr('src');

        app.fileDataWrite = JSON.stringify(custGestureData);

        app.deleteAndWriteCustGesture();
    },

    deleteAndWriteCustGesture: function () {
        app.oprFileName = 'c_gesture.txt';
        app.deleteFileCallBack = function () {
            app.oprFileName = 'c_gesture.txt';
            app.writeToFile();
        };
        app.deleteFileFailedCallback = function () {
            app.oprFileName = 'c_gesture.txt';
            app.writeToFile();
        }
        app.deleteFile();
    },

    playAudio: function (url) {
        // Play the audio file at url
        var my_media = new Media(url,
            // success callback
            function () {
                //console.log("playAudio():Audio Success");
            },
            // error callback
            function (err) {
                //console.log("playAudio():Audio Error: " + err);
            }
        );
        // Play audio
        my_media.play();
    },

    writeToFile: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFSForWrite, function () {alert('Failed request file system!')});
    },

    gotFSForWrite: function(fileSystem) {
        fileSystem.root.getFile(app.oprFileName, {create: true, exclusive: false}, app.gotWriteFileEntry, function () {alert('Failed to get file write!')});
    },

    gotWriteFileEntry: function(fileEntry) {
        fileEntry.createWriter(app.gotFileWriter, function () {alert('Failed to create writer!')});
    },

    gotFileWriter: function(writer) {
        writer.seek(writer.length);
        writer.write(app.fileDataWrite);
        writer.onwriteend = function(evt){
            //alert("You wrote '" + app.fileDataWrite + "' at the end of the file.");
        }
    },

    readFile: function() {
        app.fileDataRead = null;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFSForRead, function () {
            app.fileDataRead = null;
            if(app.inited == false) {
                app.init();
                app.inited = true;
            }
        });
    },

    gotFSForRead: function(fileSystem) {
        fileSystem.root.getFile(app.oprFileName, null, app.gotReadFileEntry, function () {
            app.fileDataRead = null;
            if(app.inited == false) {
                app.init();
                app.inited = true;
            }
        });
    },

    gotReadFileEntry: function(fileEntry) {
        fileEntry.file(app.gotFileRead, function () {
            app.fileDataRead = null;
            if(app.inited == false) {
                app.init();
                app.inited = true;
            }
        });
    },

    gotFileRead: function(file){
        //app.readDataUrl(file);
        app.readAsText(file);
    },

    readDataUrl: function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            //evt.target.result; //set data here
            if(app.inited == false) {
                app.init();
                app.inited = true;
            }
        };
        reader.readAsDataURL(file);
    },

    readAsText:function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            //alert('data read:' + evt.target.result);
            console.log('=====> onloadend: before parse...');
            try {
                app.fileDataRead = $.parseJSON(evt.target.result); //set data here
            } catch (e) {
                app.fileDataRead = null;
                console.log('Invalid JSON format retrieved!');
            }
            console.log('=====> onloadend: after parse...');
            console.log('=====> onloadend: after parse...app.inited:' + app.inited);
            //return;
            if(app.inited == false) {
                app.inited = true;
                setTimeout(function () {
                    app.init();
                }, 100);
            }
        };
        reader.readAsText(file);
    },

    deleteFile: function() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFSForRemove, function () {
            if(app.deleteFileFailedCallback) {
                app.deleteFileFailedCallback();
            }
        });
    },

    gotFSForRemove: function(fileSystem) {
        fileSystem.root.getFile(app.oprFileName, {create: false, exclusive: false}, app.gotRemoveFileEntry, function () {
            if(app.deleteFileFailedCallback) {
                app.deleteFileFailedCallback();
            }
        });
    },

    gotRemoveFileEntry: function(fileEntry) {
        fileEntry.remove(
            app.deleteFileCallBack,
            function(error) {
                if(app.deleteFileFailedCallback) {
                    app.deleteFileFailedCallback();
                }
            }
        );
    }
};