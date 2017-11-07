/*
 * @(#)J3DI.js  2.0  2013-12-31
 *
 * Copyright (c) 2011-2013 Werner Randelshofer, Switzerland.
 * You may not use, copy or modify this file, except in compliance with the
 * accompanying license terms.
 *
 * Portions of this script (as marked) have been taken from the following sources:
 *
 *   David Roe
 *   http://stackoverflow.com/questions/4878145/javascript-and-webgl-external-scripts
 *
 *   Apple Inc.
 *   The J3DI.js file as linked from:
 *   https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/sdk/demos/webkit/SpinningBox.html
 *
 *     Copyright (C) 2009 Apple Inc. All Rights Reserved.
 *
 *     Redistribution and use in source and binary forms, with or without
 *     modification, are permitted provided that the following conditions
 *     are met:
 *     1. Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *     2. Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *
 *     This software is provided by apple inc. ``as is'' and any
 *     express or implied warranties, including, but not limited to, the
 *     implied warranties of merchantability and fitness for a particular
 *     purpose are disclaimed.  in no event shall apple inc. or
 *     contributors be liable for any direct, indirect, incidental, special,
 *     exemplary, or consequential damages (including, but not limited to,
 *     procurement of substitute goods or services; loss of use, data, or
 *     profits; or business interruption) however caused and on any theory
 *     of liability, whether in contract, strict liability, or tort
 *     (including negligence or otherwise) arising in any way out of the use
 *     of this software, even if advised of the possibility of such damage.
 *
 *
 *   Google Inc.
 *   The J3DI.js file as linked from:
 *   https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/sdk/demos/webkit/SpinningBox.html
 * 
 *     Copyright 2010, Google Inc.
 *     All rights reserved.
 *
 *     Redistribution and use in source and binary forms, with or without
 *     modification, are permitted provided that the following conditions are
 *     met:
 *
 *         * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *         * Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following disclaimer
 *     in the documentation and/or other materials provided with the
 *     distribution.
 *         * Neither the name of Google Inc. nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 *     This software is provided by the copyright holders and contributors
 *     "as is" and any express or implied warranties, including, but not
 *     limited to, the implied warranties of merchantability and fitness for
 *     a particular purpose are disclaimed. in no event shall the copyright
 *     owner or contributors be liable for any direct, indirect, incidental,
 *     special, exemplary, or consequential damages (including, but not
 *     limited to, procurement of substitute goods or services; loss of use,
 *     data, or profits; or business interruption) however caused and on any
 *     theory of liability, whether in contract, strict liability, or tort
 *     (including negligence or otherwise) arising in any way out of the use
 *     of this software, even if advised of the possibility of such damage.
 */

J3DI = function() {

 /*
  * initWebGL
  *
  * Initialize the Canvas element with the passed name as a WebGL object and return the
  * WebGLRenderingContext.
  * Instead of passing a name, you can pass the element directly.
  *
  * Load shaders with the passed names and create a program with them. Return this program
  * in the 'program' property of the returned context.
  *
  * For each string in the passed attribs array, bind an attrib with that name at that index.
  * Once the attribs are bound, link the program and then use it.
  *
  * Set the clear color to the passed array (4 values) and set the clear depth to the passed value.
  * Enable depth testing and blending with a blend func of (SRC_ALPHA, ONE_MINUS_SRC_ALPHA)
  *
  * A console function is added to the context: console(string). This can be replaced
  * by the caller. By default, it maps to the window.console() function on WebKit and to
  * an empty function on other browsers.
  *
  * The callback function is called when the shaders have been loaded.
  *
  * @param canvasName If this is a string, specifies the id of a canvas element.
  *                   If this is an element, specifies the desired canvas element.
  * @param vshader    Specifies the id of a script-element with type="x-shader/x-vertex". 
  *                   Can be an array with multiple ids.
  * @param fshader    Specifies the id of a script-element with type="x-shader/x-fragment". 
  *                   Can be an array with multiple ids. Must have the same array length as vshader.
  * @param attribs
  * @param uniforms
  * @param clearColor
  * @param clearDepth
  * @param optAttribs
  * @param callback   On success, this function is called with callback(gl).
  * @param errorCallback
  *
  * Original code by Apple Inc.
  */
var initWebGL = function (canvasName, vshader, fshader, attribs, uniforms, clearColor, clearDepth, optAttribs, callback, errorCallback) {
    var canvas;
    if (typeof(canvasName)=='string') {
      canvas = document.getElementById(canvasName);
    } else {
      canvas = canvasName;
    }
    var gl = setupWebGL(canvas, optAttribs, errorCallback==null);
    if (gl==null|| typeof(gl)=='string' || (gl instanceof String) ) {
      if (errorCallback) {
        errorCallback(gl);
      }
      return null;
    }
    checkGLError(gl,'easywebgl.initWebGL setupWebGL');

    // Add a console
    gl.console = ("console" in window) ? window.console : { log: function() { } };
    
    
    // load the shaders asynchronously
    if (gl.programs == null) {
      gl.programs=Array();
    }
    
    var files=[];
    if (typeof vshader != 'object' || !( "length" in vshader)) {
      vshader=[vshader];
    }
    if (typeof fshader != 'object' || !( "length" in fshader)) {
      fshader=[fshader];
    }
    files = vshader.concat(fshader);
    checkGLError(gl,'easywebgl.initWebGL before loadFiles');
    
    loadFiles(files, 
      function (shaderText) {
        checkGLError(gl,'easywebgl.initWebGL loadFiles callback');
        var programCount=shaderText.length/2;
        for (var programIndex=0;programIndex<programCount;programIndex++) {
          // create our shaders
          checkGLError(gl,'easywebgl.initWebGL before loadShader '+programIndex);
          var vertexShader = loadShader(gl, vshader[programIndex], shaderText[programIndex], gl.VERTEX_SHADER);
          var fragmentShader = loadShader(gl, fshader[programIndex], shaderText[programIndex+programCount], gl.FRAGMENT_SHADER);
          if (!vertexShader || !fragmentShader) {
            if (errorCallback) errorCallback("Error compiling shaders.");
            else gl.console.log("Error compiling shaders.");
            return null;
          }
  
          // Create the program object
          gl.programs[programIndex] = gl.createProgram();
          checkGLError(gl,'easywebgl.initWebGL createProgram '+programIndex);
          
          var prg=gl.programs[programIndex];
          prg.vshaderId=vshader[programIndex];
          prg.fshaderId=fshader[programIndex];
  
          if (!prg)
              return null;
          
          // Attach our two shaders to the program
          gl.attachShader (prg, vertexShader);
          checkGLError(gl,'easywebgl.initWebGL attach vertex shader');
          gl.attachShader (prg, fragmentShader);
          checkGLError(gl,'easywebgl.initWebGL attach fragment shader');
          
          // Link the program
          gl.linkProgram(prg);
          checkGLError(gl,'easywebgl.initWebGL linkProgram');
          
          // Check the link status
          var linked = gl.getProgramParameter(prg, gl.LINK_STATUS);
          if (!linked) {
              // something went wrong with the link
              var error = gl.getProgramInfoLog (prg);
              gl.console.log("Error in program linking:"+error);
          
              gl.deleteProgram(prg);
              gl.deleteShader(fragmentShader);
              gl.deleteShader(vertexShader);
          
              return null;
          }
          // Bind attributes
          prg.attribs=[];
          for (var i = 0; i < attribs.length; ++i) {
            prg.attribs[attribs[i]]=gl.getAttribLocation(prg, attribs[i]);
            if (prg.attribs[attribs[i]]!=-1) {
              //gl.enableVertexAttribArray(prg.attribs[attribs[i]]);
            }
            //  gl.bindAttribLocation (gl.programs[programIndex], i, attribs[i]);
          }
          
          // Bind uniforms
          prg.uniforms=[];
          for (var i = 0; i < uniforms.length; ++i) {
            prg.uniforms[uniforms[i]]=gl.getUniformLocation(prg, uniforms[i]);
          }
          
          
          gl.useProgram(gl.programs[programIndex]);
          checkGLError(gl,'easywebgl.initWebGL useProgram '+prg.vshaderId+','+prg.fshaderId);
        }
        if (callback) callback(gl);
      }, 
      function (url) {
        if (errorCallback) errorCallback(url);
        else gl.console.log('Failed to download "' + url + '"');
      }
    );     
    
    

    checkGLError(gl,'easywebgl.initWebGL before clear');
    
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    gl.clearDepth(clearDepth);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    checkGLError(gl,'easywebgl.initWebGL after clear');

    return gl;
};

var checkGLError = function (gl, msg) {
    var error = gl.getError();
		
    if (error != gl.NO_ERROR) {
      var str = "GL Error: " + error+(msg==null?"":" "+msg);
        gl.console.log(str);
    }
};

/**
 * loadShader
 *
 * Original code by Apple Inc.
 */
var loadShader = function (ctx, shaderId, shaderScript, shaderType)
{
    // Create the shader object
    checkGLError(ctx,'easywebgl.loadShader before createShader '+shaderType);
    var shader = ctx.createShader(shaderType);
    checkGLError(ctx,'easywebgl.loadShader createShader '+shaderType);
    if (shader == null) {
        ctx.console.log("*** Error: unable to create shader '"+shaderId+"' error:"+ctx.getError());
        return null;
    }

    // Load the shader source
    ctx.shaderSource(shader, shaderScript);

    // Compile the shader
    ctx.compileShader(shader);

    // Check the compile status
    var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
    if (!compiled) {
        // Something went wrong during compilation; get the error
        var error = ctx.getShaderInfoLog(shader);
        ctx.console.log("*** Error compiling shader '"+shaderId+"':"+error);
        ctx.deleteShader(shader);
        return null;
    }
    return shader;
};

 
/**
 * Loads a text file.
 * 
 * @param url     The URL of the text file or the Id of a script element.
 * @param data    Data to be passed to the callback function.
 * @param callback On success, the callback function is called with callback(text, data).
 * @param errorCallback On failure, the callback function is called with 
 *                 errorCallback(urlOrId, data).
 *
 * Original code by David Roe.
 */
var loadFile = function (url, data, callback, errorCallback) {
    var scriptElem = document.getElementById(url);
    // instead of an URL we also accept the id of a script element
    if (scriptElem) {
      if (scriptElem.text) {
        callback(scriptElem.text, data);
        return;
      } else {
        url = scriptElem.src;
      }
    }
//window.console.log("url="+url);    
  
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
}
/**
 * Loads a XML file.
 * 
 * @param url     The URL of the text file or the Id of a script element.
 * @param data    Data to be passed to the callback function.
 * @param callback On success, the callback function is called with callback(text, data).
 * @param errorCallback On failure, the callback function is called with 
 *                 errorCallback(urlOrId, data).
 *
 * Original code by David Roe.
 */
var loadXML = function (url, data, callback, errorCallback) {
    var scriptElem = document.getElementById(url);
    // instead of an URL we also accept the id of a script element
    if (scriptElem) {
      if (scriptElem.text) {
        callback(scriptElem.text, data);
        return;
      } else {
        url = scriptElem.src;
      }
    }
//window.console.log("url="+url);    
  
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseXML, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
};

/**
 * Original code by David Roe.
 */
var loadFiles = function (urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        loadFile(urls[i], i, partialCallback, errorCallback);
    }
};


/**
// makeBox
//
// Create a box with vertices, normals and texCoords. Create VBOs for each as well as the index array.
// Return an object with the following properties:
//
//  normalObject        WebGLBuffer object for normals
//  texCoordObject      WebGLBuffer object for texCoords
//  vertexObject        WebGLBuffer object for vertices
//  indexObject         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexObject
//
 *
 * Original code by Apple Inc.
 */
var makeBox = function (ctx, bmin, bmax)
{
  if (bmin==null) bmin=new J3DIVector3(-1,-1,-1);
  if (bmax==null) bmax=new J3DIVector3(1,1,1);
  
    // box
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
    // vertex coords array
    var vertices = new Float32Array(
        [  bmax[0], bmax[1], bmax[2],  bmin[0], bmax[1], bmax[2],  bmin[0], bmin[1], bmax[2],   bmax[0], bmin[1], bmax[2],    // v0-v1-v2-v3 front
           bmax[0], bmax[1], bmax[2],   bmax[0], bmin[1], bmax[2],   bmax[0], bmin[1], bmin[2],   bmax[0], bmax[1], bmin[2],    // v0-v3-v4-v5 right
           bmax[0], bmax[1], bmax[2],   bmax[0], bmax[1], bmin[2],  bmin[0], bmax[1], bmin[2],  bmin[0], bmax[1], bmax[2],    // v0-v5-v6-v1 top
          bmin[0], bmax[1], bmax[2],  bmin[0], bmax[1], bmin[2],  bmin[0], bmin[1], bmin[2],  bmin[0], bmin[1], bmax[2],    // v1-v6-v7-v2 left
          bmin[0], bmin[1], bmin[2],   bmax[0], bmin[1], bmin[2],   bmax[0], bmin[1], bmax[2],  bmin[0], bmin[1], bmax[2],    // v7-v4-v3-v2 bottom
           bmax[0], bmin[1], bmin[2],  bmin[0], bmin[1], bmin[2],  bmin[0], bmax[1], bmin[2],   bmax[0], bmax[1],bmin[2] ]   // v4-v7-v6-v5 back
    );

    // normal array
    var normals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]    // v4-v7-v6-v5 back
       );


    // texCoord array
    var texCoords = new Float32Array(
        [  1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
           0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
           1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
           1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
           0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
           0, 0,   1, 0,   1, 1,   0, 1 ]   // v4-v7-v6-v5 back
       );

    // index array
    var indices = new Uint16Array(
        [  0, 2, 1,   0, 3, 2,    // front
           4, 6, 5,   4, 7, 6,    // right
           8,10, 9,   8,11,10,    // top
          12,14,13,  12,15,14,    // left
          16,18,17,  16,19,18,    // bottom
          20,22,21,  20,23,22 ]   // back
      );

    var retval = { };

    retval.normalObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.normalObject);
    ctx.bufferData(ctx.ARRAY_BUFFER, normals, ctx.STATIC_DRAW);

    retval.texCoordObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.texCoordObject);
    ctx.bufferData(ctx.ARRAY_BUFFER, texCoords, ctx.STATIC_DRAW);

    retval.vertexObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.vertexObject);
    ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);

    retval.indexObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, retval.indexObject);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indices, ctx.STATIC_DRAW);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);

    retval.numIndices = indices.length;
    
    retval.loaded = true;

    return retval;
};

/**
// makeSphere
//
// Create a sphere with the passed number of latitude and longitude bands and the passed radius.
// Sphere has vertices, normals and texCoords. Create VBOs for each as well as the index array.
// Return an object with the following properties:
//
//  normalObject        WebGLBuffer object for normals
//  texCoordObject      WebGLBuffer object for texCoords
//  vertexObject        WebGLBuffer object for vertices
//  indexObject         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexObject
//
 *
 * Original code by Apple Inc.
 */
var makeSphere = function (ctx, radius, lats, longs)
{
    var geometryData = [ ];
    var normalData = [ ];
    var texCoordData = [ ];
    var indexData = [ ];

    for (var latNumber = 0; latNumber <= lats; ++latNumber) {
        for (var longNumber = 0; longNumber <= longs; ++longNumber) {
            var theta = latNumber * Math.PI / lats;
            var phi = longNumber * 2 * Math.PI / longs;
            var sinTheta = Math.sin(theta);
            var sinPhi = Math.sin(phi);
            var cosTheta = Math.cos(theta);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1-(longNumber/longs);
            var v = latNumber/lats;

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            texCoordData.push(u);
            texCoordData.push(v);
            geometryData.push(radius * x);
            geometryData.push(radius * y);
            geometryData.push(radius * z);
        }
    }

    for (var latNumber = 0; latNumber < lats; ++latNumber) {
        for (var longNumber = 0; longNumber < longs; ++longNumber) {
            var first = (latNumber * (longs+1)) + longNumber;
            var second = first + longs + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first+1);

            indexData.push(second);
            indexData.push(second+1);
            indexData.push(first+1);
        }
    }

    var retval = { };

		if (ctx === null) {
			retval.normalArray = normalData;
			retval.textureArray = texCoordData;
			retval.vertexArray = geometryData;
			retval.numIndices = indexData.length;
			retval.indexArray = indexData;
			retval.loaded = true;
		} else {
			retval.normalObject = ctx.createBuffer();
			ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.normalObject);
			ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(normalData), ctx.STATIC_DRAW);
	
			retval.texCoordObject = ctx.createBuffer();
			ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.texCoordObject);
			ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(texCoordData), ctx.STATIC_DRAW);
	
			retval.vertexObject = ctx.createBuffer();
			ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.vertexObject);
			ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(geometryData), ctx.STATIC_DRAW);
	
			retval.numIndices = indexData.length;
			retval.indexObject = ctx.createBuffer();
			ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, retval.indexObject);
			ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), ctx.STREAM_DRAW);
	
			retval.loaded = true;
		}
    return retval;
};

/**
// loadObj
//
// Load a .obj file from the passed URL. Return an object with a 'loaded' property set to false.
// When the object load is complete, the 'loaded' property becomes true and the following
// properties are set:
//
//  normalObject        WebGLBuffer object for normals
//  texCoordObject      WebGLBuffer object for texCoords
//  vertexObject        WebGLBuffer object for vertices
//  indexObject         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexObject
//
 *
 * Original code by Apple Inc.
 */
var loadObj = function (ctx, url, callback, errorCallback)
{
    var obj = { loaded : false };
    obj.ctx = ctx;
    obj.url = url;
    
    // instead of an URL we also accept the id of a script element
    var scriptElem = document.getElementById(url);
    if (scriptElem) {
      if (scriptElem.text) {
        doLoadObj(obj, scriptElem.text, callback, errorCallback);
        return;
      } else {
        url = scriptElem.src;
      }
    }
    
    var req = new XMLHttpRequest();
    req.obj = obj;
    req.onreadystatechange = function () { processLoadObj(req, callback, errorCallback) };
    req.open("GET", url, true);
    req.send(null);
    return obj;
}

/*
 * Original code by Apple Inc.
 */
var processLoadObj = function (req, callback, errorCallback)
{
    //req.obj.ctx.console.log("req="+req)
    // only if req shows "complete"
    if (req.readyState == 4) {
        doLoadObj(req.obj, req.responseText, callback, errorCallback);
    }
}

/*
 * Original code by Apple Inc.
 */
var doLoadObj = function (obj, text, callback, errorCallback)
{
	  if (obj.ctx != null) {
      checkGLError(obj.ctx,'easywebgl.doLoadObj... '+obj.url);
		}
  
  
    var vertexArray = [ ];
    var normalArray = [ ];
    var textureArray = [ ];
    var indexArray = [ ];

    var vertex = [ ];
    var normal = [ ];
    var texture = [ ];
    var facemap = { };
    var index = 0;
    var tempIndexArray = new Array(4);

    // This is a map which associates a range of indices with a name
    // The name comes from the 'g' tag (of the form "g NAME"). Indices
    // are part of one group until another 'g' tag is seen. If any indices
    // come before a 'g' tag, it is given the group name "_unnamed"
    // 'group' is an object whose property names are the group name and
    // whose value is a 2 element array with [<first index>, <num indices>]
    var groups = { };
    var currentGroup = [0, 0];
    groups["_unnamed"] = currentGroup;

    var lines = text.split("\n");
    for (var lineIndex in lines) {
        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] == "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "g") {
            // new group
            currentGroup = [indexArray.length, 0];
            if (array[1] in groups) {
              array[1] += ' $'+lineIndex;
            }
            groups[array[1]] = currentGroup;
        }
        else if (array[0] == "v") {
            // vertex
            vertex.push(parseFloat(array[1]));
            vertex.push(parseFloat(array[2]));
            vertex.push(parseFloat(array[3]));
        }
        else if (array[0] == "vt") {
            // normal
            texture.push(parseFloat(array[1]));
            texture.push(parseFloat(array[2]));
        }
        else if (array[0] == "vn") {
            // normal
            normal.push(parseFloat(array[1]));
            normal.push(parseFloat(array[2]));
            normal.push(parseFloat(array[3]));
        }
        else if (array[0] == "f") {
            // face
            if (array.length != 4 && array.length != 5) {
							if (console !== undefined) {
                console.log("*** Error: face '"+line+"' not handled");
							}
              continue;
            }

              for (var i = 1; i < array.length; i++) {
                  if (!(array[i] in facemap)) {
                      // add a new entry to the map and arrays
                      var f = array[i].split("/");
                      var vtx, nor, tex;
  
                      if (f.length == 1) {
                          vtx = parseInt(f[0]) - 1;
                          nor = vtx;
                          tex = vtx;
                      }
                      else if (f.length = 3) {
                          vtx = parseInt(f[0]) - 1;
                          tex = parseInt(f[1]) - 1;
                          nor = parseInt(f[2]) - 1;
                      }
                      else {
                        if (console !== undefined) {
                          console.log("*** Error: did not understand face '"+array[i]+"'");
                        }
                        return null;
                      }
  
                      // do the vertices
                      var x = 0;
                      var y = 0;
                      var z = 0;
                      if (vtx * 3 + 2 < vertex.length) {
                          x = vertex[vtx*3];
                          y = vertex[vtx*3+1];
                          z = vertex[vtx*3+2];
                      }
                      vertexArray.push(x);
                      vertexArray.push(y);
                      vertexArray.push(z);
  
                      // do the textures
                      x = 0;
                      y = 0;
                      if (tex * 2 + 1 < texture.length) {
                          x = texture[tex*2];
                          y = texture[tex*2+1];
                      }
                      textureArray.push(x);
                      textureArray.push(y);
  
                      // do the normals
                      x = 0;
                      y = 0;
                      z = 1;
                      if (nor * 3 + 2 < normal.length) {
                          x = normal[nor*3];
                          y = normal[nor*3+1];
                          z = normal[nor*3+2];
                      }
                      normalArray.push(x);
                      normalArray.push(y);
                      normalArray.push(z);
  
                      facemap[array[i]] = index++;
                  }
  
                  tempIndexArray[i - 1] = facemap[array[i]];
                  //indexArray.push(facemap[array[i]]);
                  //currentGroup[1]++;
            }
            if (array.length == 5) { // quad
               indexArray.push(tempIndexArray[2]);
               indexArray.push(tempIndexArray[1]);
               indexArray.push(tempIndexArray[0]);
               indexArray.push(tempIndexArray[3]);
               indexArray.push(tempIndexArray[2]);
               indexArray.push(tempIndexArray[0]);
               currentGroup[1]+=6;
            } else { // triangle
              for (var i=2; i >= 0; i--) {
                 indexArray.push(tempIndexArray[i]);
              }
              currentGroup[1]+=3;
            }
        }
    }

    // set the VBOs
		if (obj.ctx === null) {
			obj.normalArray = normalArray;
			obj.textureArray = textureArray;
			obj.vertexArray = vertexArray;
			obj.numIndices = indexArray.length;
			obj.indexArray = indexArray;
			obj.groups = groups;
			obj.loaded = true;
		} else {
			obj.normalObject = obj.ctx.createBuffer();
			obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.normalObject);
			obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(normalArray), obj.ctx.STATIC_DRAW);
	
			obj.texCoordObject = obj.ctx.createBuffer();
			obj.textureArray = textureArray; // is this needed?
			obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.texCoordObject);
			obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(textureArray), obj.ctx.STATIC_DRAW);
	
			obj.vertexObject = obj.ctx.createBuffer();
			obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.vertexObject);
			obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(vertexArray), obj.ctx.STATIC_DRAW);
	
			obj.numIndices = indexArray.length;
			obj.indexObject = obj.ctx.createBuffer();
			obj.ctx.bindBuffer(obj.ctx.ELEMENT_ARRAY_BUFFER, obj.indexObject);
			obj.ctx.bufferData(obj.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), obj.ctx.STREAM_DRAW);
	
			obj.groups = groups;
			obj.loaded = true;
	    checkGLError(obj.ctx,'easywebgl.doLoadObj '+obj.url);
  	}
    if (callback) {
      callback(obj);
    }
};

/**
// loadImageTexture
//
// Load the image at the passed url, place it in a new WebGLTexture object and return the WebGLTexture.
//
 *
 * Original code by Apple Inc.
 */
var loadImageTexture = function (ctx, url,callback,errorCallback)
{
    var texture = ctx.createTexture();
    texture.image = new Image();
    texture.image.onload = function() { doLoadImageTexture(ctx, texture.image, texture,callback,errorCallback) }
    texture.image.src = url;
    return texture;
};

/*
 * Original code by Apple Inc.
 */
var doLoadImageTexture = function (ctx, image, texture,callback,errorCallback)
{
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(
        ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    //ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    //ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
    //ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    //ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.generateMipmap(ctx.TEXTURE_2D)
    ctx.bindTexture(ctx.TEXTURE_2D, null);
    
    if (callback) callback();
};

/**
 * Creates the HTLM for a failure message
 * @param {string} canvasContainerId id of container of th
 *        canvas.
 * @return {string} The html.
 */
var makeFailHTML = function(msg) {
  return '' +
    '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
    '<td align="center">' +
    '<div style="display: table-cell; vertical-align: middle;">' +
    '<div style="">' + msg + '</div>' +
    '</div>' +
    '</td></tr></table>';
};

/**
 * Mesasge for getting a webgl browser
 * @type {string}
 */
var GET_A_WEBGL_BROWSER_MSG = 'This page requires a browser that supports WebGL.';
var GET_A_WEBGL_BROWSER = '' +
  GET_A_WEBGL_BROWSER_MSG+'<br/>' +
  '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

/**
 * Message for need better hardware
 * @type {string}
 */
var OTHER_PROBLEM_MSG= "It doesn't appear your computer can support WebGL.";
var OTHER_PROBLEM = '' + OTHER_PROBLEM_MSG + "<br/>" +
  '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

/**
 * Creates a webgl context. If creation fails it will
 * change the contents of the container of the <canvas>
 * tag to an error message with the correct links for WebGL.
 * @param {Element} canvas. The canvas element to create a
 *     context from.
 * @param {WebGLContextCreationAttirbutes} opt_attribs Any
 *     creation attributes you want to pass in.
 * @return {WebGLRenderingContext} The created context or a string with an error message.
 */
var setupWebGL = function(canvas, opt_attribs, showLinkOnError) {
  function showLink(str) {
    var container = canvas.parentNode;
    if (container) {
      container.innerHTML = makeFailHTML(str);
    }
  };

  if (!window.WebGLRenderingContext) {
    if (showLinkOnError) {
      showLink(GET_A_WEBGL_BROWSER);
    }
    return GET_A_WEBGL_BROWSER_MSG;
  }

  var context = create3DContext(canvas, opt_attribs);
  if (!context) {
    if (showLinkOnError) {
      showLink(OTHER_PROBLEM);
    }
    return OTHER_PROBLEM_MSG;
  }
  return context;
};

/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @return {!WebGLContext} The created context.
 */
var create3DContext = function(canvas, opt_attribs) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  return context;
}

return {
  initWebGL: initWebGL,
  checkGLError: checkGLError,
  loadShader: loadShader,
  loadFile: loadFile,
  loadXML: loadXML,
  loadFiles: loadFiles,
  makeBox: makeBox,
  makeSphere: makeSphere,
  loadObj: loadObj,
  loadImageTexture: loadImageTexture,
  create3DContext: create3DContext,
  setupWebGL: setupWebGL
};
}();

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

