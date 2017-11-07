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
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var x, y, z, last_x, last_y, last_z;
        var SHAKE_THRESHOLD = 300;
        var shakeTimes = 0;
        var speed = 0;
        var maxSpeed = 0;
        $('.shakeTimes').val(shakeTimes);
        var onSuccess = function (acceleration) {
            $('.xValue').val(acceleration.x);
            $('.yValue').val(acceleration.y);
            $('.zValue').val(acceleration.z);
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            speed = Math.abs(x + y + z - last_x - last_y - last_z) / 100 * 1000;
            if(speed > maxSpeed) {
                maxSpeed = speed;
                $('.maxSpeed').val(maxSpeed);
            }
            if (speed > SHAKE_THRESHOLD) {
                //a shake
                $('.shakeTimes').val(++shakeTimes);
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
        
        $('.qrScaner').click(function () {
              QRScanner.prepare(function (err, status) {
			  if (err) {
			     // here we can handle errors and clean up any loose ends. 
			     console.error(err);
			  }
			  if (status.authorized) {
			     // W00t, you have camera access and the scanner is initialized. 
			     // QRscanner.show() should feel very fast.
			     QRScanner.scan(function displayContents(err, text) {
					  if(err){
					    // an error occurred, or the scan was canceled (error code `6`) 
					  } else {
					    // The scan completed, display the contents of the QR code: 
					    alert(text);
					  }
				 });
				 
				 QRScanner.show();
			     
			  } else if (status.denied) {
			     // The video preview will remain black, and scanning is disabled. We can 
			     // try to ask the user to change their mind, but we'll have to send them 
			     // to their device settings with `QRScanner.openSettings()`. 
			  } else {
			     // we didn't get permission, but we didn't get permanently denied. (On 
			     // Android, a denial isn't permanent unless the user checks the "Don't 
			     // ask again" box.) We can ask again at the next relevant opportunity. 
			  }
		   }); // show the prompt 
        });
    }
};
