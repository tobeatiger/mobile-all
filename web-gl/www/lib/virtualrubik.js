/*
 * @(#)virtualrubik.js  1.1.2  2012-09-16
 *
 * Copyright (c) 2011-2012 Werner Randelshofer, Switzerland.
 * You may not use, copy or modify this file, except in compliance with the
 * accompanying license terms.
 */

/* Usage:
 * Here is a minimal example of an HTML page which uses this script. 

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<title>Virtual Rubik's Cube with WebGL</title>
<script type="text/javascript" src="lib/virtualrubik.js"></script>
<script type="text/javascript">includeVirtualRubik("lib");</script>
</head>
<body onload="attachVirtualRubik();">
<p>Virtual Rubik's Cube with WebGL</p>
<canvas class="virtualrubik" width="400" height="400"
   stickersImage="image.jpg"
   altImage="alternativeImage.jpg"
></canvas>
<p>© 2011-2012 Werner Randelshofer. All Rights Reserved</p>
</body>
</html> 

*/

var global_virtualrubik_baseURL=null;
var global_virtualrubik_modules=[];

/** Loads a JavaScript module. */
function require(module,extension,file) {
	if (extension === undefined) {
    extension = 'js';
  }
	if (file === undefined) {
    file = module + '.' + extension;
  }
	switch (extension) {
		case 'vshader' : type='text/x-vertex';       path='/shaders/'; break;
		case 'fshader' : type='text/x-fragment';     path='/shaders/'; break;
		case 'obj'     : type='text/x-wavefront'; path='/models/'; break;
		default       :
		case 'js'     : type='text/javascript';         path='/'; break;
	}
	if (global_virtualrubik_modules.indexOf(module) == -1) {
		global_virtualrubik_modules.push(module);
		
		var baseURL=global_virtualrubik_baseURL;
    document.write('<script id="'+module+'" type="'+type+'" src="'+baseURL+path+file+'"></script>');
	}
}



/** Includes additional scripts. 
 * This function must be executed in the <head> element of a page.
 * 
 * @param baseURL Optional parameter giving the base URL of the script files.
 *               If baseURL is null, "." is used.
 */
function includeVirtualRubik(baseURL) {
  if (baseURL==null) { baseURL="."; }
  
  global_virtualrubik_baseURL=baseURL;

  require('J3DI');
  require('J3DIMath');
  require('splineinterpolator');
  require('node3d');
  require('cube');
  require('cube3d');
  require('cube3dcanvas');
  require('cube3dwebglcanvas');
  require('cube3d2dcanvas');
  require('cubeattributes');
  require('rubikscube');
  require('rubikscube3d');
  require('scriptparser');
  require('vshader','vshader','texture.vshader');
  require('fshader','fshader','texture.fshader');
	
  require('rubik_center', 'obj','full/rubik_center.obj');
  require('rubik_side',   'obj','full/rubik_side.obj');
  require('rubik_edge',   'obj','full/rubik_edge.obj');
  require('rubik_corner', 'obj','full/rubik_corner.obj');
  require('rubik_sticker','obj','full/rubik_sticker.obj');
	
  require('rubik_center_simple', 'obj','simpler_nodisassembly/rubik_center.obj');
  require('rubik_side_simple',   'obj','simpler_nodisassembly/rubik_side.obj');
  require('rubik_edge_simple',   'obj','simpler_nodisassembly/rubik_edge.obj');
  require('rubik_corner_simple', 'obj','simpler_nodisassembly/rubik_corner.obj');
  require('rubik_sticker_simple','obj','simpler_nodisassembly/rubik_sticker.obj');
	/*
  require('rubik_center_simple', 'obj','simpler/rubik_center.obj');
  require('rubik_side_simple',   'obj','simpler/rubik_side.obj');
  require('rubik_edge_simple',   'obj','simpler/rubik_edge.obj');
  require('rubik_corner_simple', 'obj','simpler/rubik_corner.obj');
  require('rubik_sticker_simple','obj','simpler/rubik_sticker.obj');
/*
  document.write('<script type="text/javascript" src="'+baseURL+'/webgl-utils.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/easywebgl.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/J3DIMath.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/splineinterpolator.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/node3d.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cube.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cube3d.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cube3dcanvas.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cube3dwebglcanvas.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cubeattributes.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/rubikscube.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/rubikscube3d.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/scriptparser.js"></script>');
  document.write('<script id="vshader" type="x-shader/x-vertex" src="'+baseURL+'/shaders/texture.vshader"></script>');
  document.write('<script id="fshader" type="x-shader/x-fragment" src="'+baseURL+'/shaders/texture.fshader"></script>');
  document.write('<script id="rubik_center" type="application/x-wavefront" src="'+baseURL+'/models/rubik_center.obj"></script>');
  document.write('<script id="rubik_side" type="application/x-wavefront" src="'+baseURL+'/models/rubik_side.obj"></script>');
  document.write('<script id="rubik_edge" type="application/x-wavefront" src="'+baseURL+'/models/rubik_edge.obj"></script>');
  document.write('<script id="rubik_corner" type="application/x-wavefront" src="'+baseURL+'/models/rubik_corner.obj"></script>');
  document.write('<script id="rubik_sticker" type="application/x-wavefront" src="'+baseURL+'/models/rubik_sticker.obj"></script>');
	*/
}
 
 /** 
  * Attaches a virtual rubik's cube to the specified canvas element.
  * The attachment occurs only after the body of the document has been fully
  * loaded.
  *
  * @param divOrCanvas Optional <div> or <canvas> object.
  *               If canvas is null, a rubik's cube is attached to all <canvas> 
  *               elements in the document with class "virtualrubik".
  */
function attachVirtualRubik(divOrCanvas, initCallback) {
  // if we have been called before the document was loaded, we install a
  // listener and retry.
  if (document.body == null) {
    var f=function() {
      try {
      window.removeEventListener('load',f,false);
      } catch (err) {
        // => IE does not support event listeners 
        window.detachEvent('onload',f,false);
      }
      attachVirtualRubik(divOrCanvas);
    }
    try {
    window.addEventListener('load',f,false);
    } catch (err) {
      // => IE does not support event listeners 
      window.attachEvent('onload',f,false);
    }
    return;
  }

  
  // get the console
   var console = ("console" in window) ? window.console : { log: function() { } };  
   
   if (divOrCanvas==null) {
     // => no element was provided, attach to all elements with class "virtualrubik"
     try {
     var htmlCollection=document.getElementsByClassName("virtualrubik");
     if (htmlCollection.length == 0) {
       console.log('Error: virtualrubik.js no canvas or div element with class name "virtualrubik" found.');
       return;
     }
     } catch (err) {
       // => IE does not support getElementsByClassName
       return;
     }
     for (i=0;i<htmlCollection.length;  i++) {
       var elem=htmlCollection[i];
       attachVirtualRubik(elem);
     }
   } else {
     // => an element was provided, attach VirtualRubik to it
     var canvasElem = null;
     if (divOrCanvas.tagName=="CANVAS") {
        // => A <canvas> element was provided, attach to it
         canvasElem = divOrCanvas;
     } else if (divOrCanvas.tagName=="DIV") {
        // => A <div> element was provided, insert a canvas element
        canvasElem = document.createElement("canvas");
        canvasElem.setAttribute('width','400px');
        canvasElem.setAttribute('height','400px');
        divOrCanvas.appendChild(canvasElem);
     } else {
         console.log('Error: virtualrubik.js element '+divOrCanvas+' is not a canvas or a div.');
         return;
     }
     var vr=new VirtualRubik(canvasElem);
     vr.initCallback=initCallback;
     vr.init();
     canvasElem.virtualrubik=vr;
   }
 }
 
 /** Constructor.
  * 
  * Creates a virtual rubik's cube and attaches it to the specified canvas
  * object. 
  */
 VirtualRubik = function(canvas) {
   this.canvas=canvas;
   this.baseURL=global_virtualrubik_baseURL; // FIXME
 }
 
/** Initializes WebGL. */
VirtualRubik.prototype.init = function() {
 this.canvas3d = new Cube3DWebGLCanvas();
 var s = this.canvas3d.setCanvas(this.canvas);
 if (!s) {
   this.canvas3d = new Cube3D2DCanvas();
	 this.canvas3d.setCanvas(this.canvas);
 }
}
VirtualRubik.prototype.reset = function() {
	this.canvas3d.reset();
}
VirtualRubik.prototype.scramble = function(scrambleCount,animate) {
	this.canvas3d.scramble(scrambleCount,animate);
}
VirtualRubik.prototype.play = function() {
	this.canvas3d.play();
}
VirtualRubik.prototype.solveStep = function() {
	this.canvas3d.solveStep();
}
VirtualRubik.prototype.wobble = function() {
	this.canvas3d.wobble();
}
VirtualRubik.prototype.explode = function() {
	this.canvas3d.explode();
}
VirtualRubik.prototype.explodeBig = function() {
    this.canvas3d.explodeBig();
}
VirtualRubik.prototype.explodeSmall = function() {
    this.canvas3d.explodeSmall();
}
VirtualRubik.prototype.explodeToggle = function() {
    if(!this.exploded) {
        this.canvas3d.explodeBig();
        this.exploded = true;
    } else {
        this.canvas3d.explodeSmall();
        this.exploded = false;
    }
}
VirtualRubik.prototype.loukong = function() {
    this.canvas3d.loukong = !this.canvas3d.loukong;
    this.canvas3d.draw();
}
VirtualRubik.prototype.setAutorotate = function(newValue) {
	 this.canvas3d.setAutorotate(newValue);
}