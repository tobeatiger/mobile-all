/*
 * @(#)cube3dwebglcanvas.js  1.0  2013-12-30
 *
 * Copyright (c) 2013 Werner Randelshofer, Switzerland.
 * You may not use, copy or modify this file, except in compliance with the
 * accompanying license terms.
 */

/** Renders a Cube3D into an HTML 5 canvas 
    using its WebGL 3D context. 
*/

// ===============================
//
// Cube3DWebGLCanvas
//
// ===============================

/** Creates a Cube3DWebGLCanvas. 
    Subclasses must call initCube3DWebGLCanvas(). */
Cube3DWebGLCanvas = function() {
  this.initCube3DWebGLCanvas();
}
Cube3DWebGLCanvas.prototype=new Cube3DCanvas();


/** Initializes the Cube3DWebGLCanvas object. */
Cube3DWebGLCanvas.prototype.initCube3DWebGLCanvas = function() {
  this.initCube3DCanvas();
	this.gl = null;
}

/** Opens the canvas for rendering. Protected method. */
Cube3DWebGLCanvas.prototype.openCanvas = function() {
	var self=this;
  var container = this.canvas.parentNode;
	
	
  this.gl=J3DI.initWebGL(
		this.canvas, // id of the canvas element
		["vshader"], // id of the vertex shader
	  ["fshader"], // id of the fragment shader
		["vPos","vNormal","vColor","vTexture"], // attribute names
		["camPos","lightPos","mvMatrix","mvNormalMatrix","mvpMatrix","mPhong","mTexture","mHasTexture"], // uniform names
		[0, 0, 0, 0], // clear color rgba
		10000, // clear depth
		{antialias:true},
		
		function(gl) { // success callback function
		  self.checkGLError("initWebGLCallback");
		  
     // Enable all of the vertex attribute arrays.
      self.checkGLError("beforeInitScene");
      self.initScene();
      self.checkGLError("afterInitScene");
      
      if (self.initCallback != null) {
        self.initCallback(self);
      }
		  self.draw();
		},
		
		function(msg) { // failure callback function
		  return;
		  self.gl=null;
			if (container) {
			  var altImageURL=self.canvas.getAttribute('altImage');
			  if (altImageURL==null) {
			    altImageURL = "images/webgl-rubikscube.png";
			  }
				container.innerHTML = '<img src="'+altImageURL+'" width="462" height="462" title="'+msg+'">';
			}
		}
		);	
  return this.gl != null;
}
/** Closes the current canvas. Protected method. */
Cube3DWebGLCanvas.prototype.closeCanvas = function() {
	// empty
}

 /** Initializes the scene.
  * This function is called from init().
  */
Cube3DWebGLCanvas.prototype.initScene = function() {
  var gl=this.gl;
  var prg=gl.programs[0];
  var self=this;
  var fRepaint=function() {self.repaint();};
  gl.useProgram(prg);  
  
  this.world=new Node3D();
  this.cube3d=new RubiksCube3D();
  this.world.add(this.cube3d);
  this.cube=this.cube3d.cube;
  this.cube3d.addChangeListener(this);
  var attr=this.cube3d.attributes;
  
  this.currentAngle=0;
  this.xRot=attr.xRot;
  this.yRot=attr.yRot;
  this.camPos=new J3DIVector3(0,0,-7);
  this.lookAtPos=new J3DIVector3(0,0,0);
  this.up=new J3DIVector3(0,1,0);
  this.lightPos=new J3DIVector3(4,4,-8);
  this.center=J3DI.loadObj(gl,"rubik_center",fRepaint);
  this.center.proxy=null;
  this.corner=J3DI.loadObj(gl,"rubik_corner",fRepaint);
  this.corner.proxy=null;
  this.edge=J3DI.loadObj(gl,"rubik_edge",fRepaint);
  this.edge.proxy=null;
  this.side=J3DI.loadObj(gl,"rubik_side",fRepaint);
  this.side.proxy=null;
  //this.sticker=loadObj(gl,"rubik_sticker",fRepaint);
  this.stickers=new Array(this.cube3d.stickerCount);
  
  
  var stickersImageURL=this.canvas.getAttribute('stickersImage');
  if (stickersImageURL!=null) {
    attr.stickersImageURL=stickersImageURL;
  }
  
  for (var i=0;i<this.cube3d.stickerCount;i++) {
    this.stickers[i]=J3DI.loadObj(gl,"rubik_sticker",fRepaint);
    this.stickers[i].hasTexture=attr.stickersImageURL!=null;
    if (i*2+1<this.cube3d.stickerOffsets.length) {
    this.stickers[i].textureOffsetX=this.cube3d.stickerOffsets[i*2];
    this.stickers[i].textureOffsetY=this.cube3d.stickerOffsets[i*2+1];
    }
    this.stickers[i].textureScale=56/512;
    //this.stickers[i]={proxy:this.sticker,hasTexture:true,textureOffset:0,textureScale:512/56};
  }
  //attr.stickersImageURL='rubikscube.png';
  if (attr.stickersImageURL) {
    var txtrURL=this.baseURL+'/textures/';
    window.stickersTexture=J3DI.loadImageTexture(gl,attr.stickersImageURL,fRepaint);
  }
  
  
  this.mvMatrix = new J3DIMatrix4();
  this.perspectiveMatrix = new J3DIMatrix4();
  this.mvpMatrix = new J3DIMatrix4();
  this.mvNormalMatrix = new J3DIMatrix4();
  this.spherePos=new J3DIVector3(0,0,5);
  this.cubeSize=1.8*3; // size of a cube side in centimeters
  this.invCameraMatrix=new J3DIMatrix4();  
  this.cameraMatrix=new J3DIMatrix4();  
  this.rotationMatrix = new J3DIMatrix4();
  
  gl.clearColor(attr.backgroundColor[0], attr.backgroundColor[1], attr.backgroundColor[2], attr.backgroundColor[3]);
  
  this.forceColorUpdate=false;
  this.checkGLError('initScene');
}

/**
 * This function is called before we draw.
 * It adjusts the perspective matrix to the dimensions of the canvas.
 */
Cube3DWebGLCanvas.prototype.reshape = function() {
   var gl=this.gl;
    var canvas = this.canvas;
    if (canvas.clientWidth == this.width && canvas.clientHeight == this.height)
        return;
 
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
 
    gl.viewport(0, 0, this.width, this.height);
  this.checkGLError('reshape');
    
}
Cube3DWebGLCanvas.prototype.updateMatrices = function() {
    // Update the perspective matrix
    this.cameraMatrix.makeIdentity();
    this.cameraMatrix.lookat(
          this.camPos[0], this.camPos[1], this.camPos[2], 
          this.lookAtPos[0], this.lookAtPos[1], this.lookAtPos[2], 
          this.up[0], this.up[1], this.up[2]
          );
    
  var flip=new J3DIMatrix4();
  flip.scale(1,1,-1);
  flip.multiply(this.cameraMatrix);
  this.cameraMatrix.load(flip);    
  
    this.perspectiveMatrix = new J3DIMatrix4();
    this.perspectiveMatrix.perspective(30, this.width/this.height, 1, 12);
    this.perspectiveMatrix.multiply(this.cameraMatrix);
//    this.perspectiveMatrix.scale(1,1,1);
    
    this.invCameraMatrix.load(this.cameraMatrix);
    this.invCameraMatrix.invert();
    this.rasterToCameraMatrix = new J3DIMatrix4(this.perspectiveMatrix);
    this.rasterToCameraMatrix.invert();
    
}
/** Draws the scene. */
Cube3DWebGLCanvas.prototype.draw = function() {
  this.clearGLError('draw...');

  if (!this.camPos) return;
  
	this.reshape();
	this.updateMatrices();
	var self=this;
	
	var gl=this.gl;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.checkGLError('draw gl.clear');
  // enable blending
	gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  
	// enable back face culling
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
  this.checkGLError('draw gl.cullFace');
	
  // Pass the camera and light positions
  var prg=gl.programs[0];
  gl.useProgram(prg);
  this.checkGLError('draw useProgram');
  
  gl.uniform3f(prg.uniforms["camPos"], this.camPos[0], this.camPos[1], this.camPos[2]);
  this.checkGLError('draw camPos');
  gl.uniform3f(prg.uniforms["lightPos"], this.lightPos[0], this.lightPos[1], this.lightPos[2]);
  this.checkGLError('draw lightPos');

  var cube3d=this.cube3d;
  cube3d.repainter=this;
  var attr=this.cube3d.attributes;

  // part colors
  var ccenter=attr.partsFillColor[cube3d.centerOffset];
  var cparts=attr.partsFillColor[cube3d.cornerOffset];
  //var phongparts=[0.5,0.6,0.4,16.0];//ambient, diffuse, specular, shininess
  //var phongstickers=[0.8,0.2,0.1,8.0];//ambient, diffuse, specular, shininess
  
  // world-view transformation
  var wvMatrix = this.world.matrix;
  wvMatrix.makeIdentity();
  wvMatrix.multiply(this.rotationMatrix);
  wvMatrix.rotate(this.cube3d.attributes.xRot,1,0,0);
  wvMatrix.rotate(this.cube3d.attributes.yRot,0,-1,0);
  wvMatrix.rotate(this.currentAngle, 1,1,1);
  var scaleFactor =0.4*attr.scaleFactor;  
	wvMatrix.scale(scaleFactor,scaleFactor,scaleFactor);

  //  this.log('  center w==c3d.p          ?:'+(this.world===this.cube3d.parent));
  //  this.log('  center c3d==c3d.parts[0].p?:'+(this.cube3d===this.cube3d.parts[0].parent));
//	this.world.add(this.cube3d); 
	
  // model view transformation
  var mvMatrix=this.mvMatrix;
  
  // draw the sphere  
  /*
  if (this.sphereHit) {
    var phongparts=[0.5,0.6,0.4,16.0];//ambient, diffuse, specular, shininess
    mvMatrix.load(wvMatrix);
    mvMatrix.translate(this.spherePos[0],this.spherePos[1],this.spherePos[2]);
    this.drawObject(this.sphere, mvMatrix, this.sphereHit?chit:cmiss,phongparts,true);  
  } */
  
  // draw center parts
  for (var i=0;i<this.cube3d.centerCount;i++) {
    mvMatrix.makeIdentity();
    this.cube3d.parts[this.cube3d.centerOffset+i].transform(mvMatrix);
    this.drawObject(this.center, mvMatrix, ccenter,attr.partsPhong[this.cube3d.centerOffset+i]);
  }
  // draw side parts
  for (var i=0;i<cube3d.sideCount;i++) {
      mvMatrix.makeIdentity();
      cube3d.parts[cube3d.sideOffset+i].transform(mvMatrix);
      var si=cube3d.getStickerIndexForPartIndex(cube3d.sideOffset+i,0);
      mvMatrix.multiply(cube3d.sideMatrices[i]);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si]);
      //this.drawObject(this.side, mvMatrix, cparts, attr.partsPhong[this.cube3d.sideOffset+i]);
  }
  // draw edge parts
  for (var i=0;i<this.cube3d.edgeCount;i++) {
      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.edgeOffset+i].transform(mvMatrix);
      //this.drawObject(this.edge, mvMatrix, cparts, attr.partsPhong[this.cube3d.edgeOffset+i]);
      var si=cube3d.getStickerIndexForPartIndex(cube3d.edgeOffset+i,0);
	  mvMatrix.multiply(cube3d.edgeMatrices[i]);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si]);

      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.edgeOffset+i].transform(mvMatrix);
      mvMatrix.rotate(90,-1,0,0); // this should be in rubikscube3d! (?) maybe not
      //mvMatrix.rotate(90,0,0,1);  // this should be in rubikscube3d! (?) maybe not
      //if(i==8) {
      //  mvMatrix.rotate(270,0,0,1);  // this should be in rubikscube3d! (?) maybe not
      //} else {
      //  mvMatrix.rotate(90,0,0,1);  // this should be in rubikscube3d! (?) maybe not
      //}
      mvMatrix.multiply(cube3d.edgeMatrices[i]);
      si=cube3d.getStickerIndexForPartIndex(cube3d.edgeOffset+i,1);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si]);

      //mvMatrix.makeIdentity();
      //this.cube3d.parts[this.cube3d.edgeOffset+i].transform(mvMatrix);
      //this.drawObject(this.edge, mvMatrix, cparts, attr.partsPhong[this.cube3d.edgeOffset+i]);
  }
  // draw corner parts
  for (var i=0;i<this.cube3d.cornerCount;i++) {
      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.cornerOffset+i].transform(mvMatrix);
      //this.drawObject(this.corner, mvMatrix, cparts, attr.partsPhong[this.cube3d.cornerOffset+i],this.forceColorUpdate);
      var si=cube3d.getStickerIndexForPartIndex(cube3d.cornerOffset+i,1);
	  mvMatrix.multiply(cube3d.cornerMatrices[i]);

      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si],this.forceColorUpdate);
      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.cornerOffset+i].transform(mvMatrix);
      mvMatrix.rotate(90,-1,0,0); // this should be in rubikscube3d! (?) maybe not
	  	mvMatrix.multiply(cube3d.cornerMatrices[i]);

      si=cube3d.getStickerIndexForPartIndex(cube3d.cornerOffset+i,0);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si],this.forceColorUpdate);
      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.cornerOffset+i].transform(mvMatrix);
      mvMatrix.rotate(90,0,1,0); // this should be in rubikscube3d! (?) maybe not
	  	mvMatrix.multiply(cube3d.cornerMatrices[i]);

      si=cube3d.getStickerIndexForPartIndex(cube3d.cornerOffset+i,2);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si],this.forceColorUpdate);

      //mvMatrix.makeIdentity();
      //this.cube3d.parts[this.cube3d.cornerOffset+i].transform(mvMatrix);
      //this.drawObject(this.corner, mvMatrix, cparts, attr.partsPhong[this.cube3d.cornerOffset+i],this.forceColorUpdate);
  }
	gl.flush();
	this.forceColorUpdate=false;
  this.checkGLError('...draw');

    if(!this.loukong) {
      self.draw2(mvMatrix);
    }
};

Cube3DWebGLCanvas.prototype.draw2 = function(mvMatrix) {
  var cube3d=this.cube3d;
  cube3d.repainter=this;
  var attr=this.cube3d.attributes;

  // part colors
  var cparts=attr.partsFillColor[cube3d.cornerOffset];

  // draw side parts
  for (var i=0;i<cube3d.sideCount;i++) {
    mvMatrix.makeIdentity();
    cube3d.parts[cube3d.sideOffset+i].transform(mvMatrix);
    this.drawObject(this.side, mvMatrix, cparts, attr.partsPhong[this.cube3d.sideOffset+i]);
  }
  // draw edge parts
  for (var i=0;i<this.cube3d.edgeCount;i++) {
    mvMatrix.makeIdentity();
    this.cube3d.parts[this.cube3d.edgeOffset+i].transform(mvMatrix);
    this.drawObject(this.edge, mvMatrix, cparts, attr.partsPhong[this.cube3d.edgeOffset+i]);
  }
  // draw corner parts
  for (var i=0;i<this.cube3d.cornerCount;i++) {
    mvMatrix.makeIdentity();
    this.cube3d.parts[this.cube3d.cornerOffset+i].transform(mvMatrix);
    this.drawObject(this.corner, mvMatrix, cparts, attr.partsPhong[this.cube3d.cornerOffset+i],this.forceColorUpdate);
  }
};

/** Draws an individual object of the scene. */
Cube3DWebGLCanvas.prototype.drawObject = function(obj, mvMatrix, color, phong, forceColorUpdate) {
  if (obj==null) return;
  if (obj.proxy) {
    if (obj.proxy.loaded) {
      obj.colorObject=obj.proxy.colorObject;
      obj.vertexObject=obj.proxy.vertexObject;
      obj.texCoordObject=obj.proxy.texCoordObject;
      obj.indexObject=obj.proxy.indexObject;
      obj.normalObject=obj.proxy.normalObject;
      obj.numIndices=obj.proxy.numIndices;
      obj.textureArray=obj.proxy.textureArray;
      obj.ctx=obj.proxy.ctx;
      obj.proxy=null;
      obj.loaded=true;
    } else {
      return;
    }
  }
  
  if (! obj.loaded) return;
  
  var gl=this.gl;
  var prg=gl.programs[0];
  
  // Compute a new texture array
  if (obj.textureScale!=null) {
    var textureArray=new Array(obj.textureArray.length);
    for (var i=0;i<textureArray.length;i+=2) {
      textureArray[i]=(obj.textureArray[i]+obj.textureOffsetX)*obj.textureScale;
      textureArray[i+1]=(obj.textureArray[i+1]+obj.textureOffsetY)*obj.textureScale;
    }
    obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.texCoordObject);
    obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(textureArray), obj.ctx.STATIC_DRAW);
    obj.textureScale=null;
  }
  
  // generate vertex colors.
  if (obj.colorObject == null || forceColorUpdate) {  
  //if (obj.colorObject == null) {  

    var randomColors=Array(obj.numIndices*4);
    for (i=0;i<obj.numIndices;i++) {
      if (color == null) {
        randomColors[i*4]=Math.random()*255;
        randomColors[i*4+1]=Math.random()*255;
        randomColors[i*4+2]=Math.random()*255;
        randomColors[i*4+3]=255; // alpha
      } else {
        randomColors[i*4]=color[0];
        randomColors[i*4+1]=color[1];
        randomColors[i*4+2]=color[2];
        randomColors[i*4+3]=color[3]; // alpha
      }
    }
    colors = new Uint8Array(randomColors);
    // Set up the vertex buffer for the colors
    if (obj.colorObject==null) {
      obj.colorObject = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorObject);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);	
  }

  // Pass the phong material attributes position
  this.checkGLError('virtualrubik.js::drawObject.before mPhong');
  gl.uniform4f(prg.uniforms["mPhong"], phong[0], phong[1], phong[2], phong[3]);
  this.checkGLError('mPhong');
  
  gl.uniformMatrix4fv(prg.uniforms["mvMatrix"], false, mvMatrix.getAsFloat32Array());
  this.checkGLError('mvMatrix');
  
  this.mvpMatrix.load(this.perspectiveMatrix);
  this.mvpMatrix.multiply(mvMatrix);
  gl.uniformMatrix4fv(prg.uniforms["mvpMatrix"], false, this.mvpMatrix.getAsFloat32Array());
  this.checkGLError('mvpMatrix');
  
  this.mvNormalMatrix.load(mvMatrix);
  this.mvNormalMatrix.invert();
  this.mvNormalMatrix.transpose();
  gl.uniformMatrix4fv(prg.uniforms["mvNormalMatrix"], false, this.mvNormalMatrix.getAsFloat32Array());
	this.checkGLError('mvNormalMatrix');
	
	var prg=gl.programs[0];
	if (window.stickersTexture != null) {
	  if (prg.uniforms['mTexture']) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, window.stickersTexture);
      gl.uniform1i(prg.uniforms['mTexture'], 0);
      this.checkGLError('mTexture');
	  }
	}
	
	if (prg.uniforms['mHasTexture']) {
	  gl.uniform1i(prg.uniforms['mHasTexture'], obj.hasTexture?1:0);
    this.checkGLError('drawObject mHasTexture');
	}
	
	// Draw the object
  if (prg.attribs["vPos"]>=0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexObject);
    gl.enableVertexAttribArray(prg.attribs["vPos"]);
    gl.vertexAttribPointer(prg.attribs["vPos"], 3, gl.FLOAT, false, 0, 0);
    this.checkGLError('drawObject vPos');
  }
  
  if (prg.attribs["vNormal"]>=0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalObject);
    gl.enableVertexAttribArray(prg.attribs["vNormal"]);
    gl.vertexAttribPointer(prg.attribs["vNormal"], 3, gl.FLOAT, false, 0, 0);
    this.checkGLError('drawObject vNormal');
  }
  
	if (prg.attribs["vColor"]>=0) {
	  gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorObject);
    gl.enableVertexAttribArray(prg.attribs["vColor"]);
	  gl.vertexAttribPointer(prg.attribs["vColor"], 4,gl.UNSIGNED_BYTE, false, 0, 0);
    this.checkGLError('drawObject vColor');
	}
  
	if (prg.attribs["vTexture"]>=0) {
	  gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoordObject);
    gl.enableVertexAttribArray(prg.attribs["vTexture"]);
    gl.vertexAttribPointer(prg.attribs["vTexture"], 2, gl.FLOAT, false, 0, 0);
    this.checkGLError('drawObject vTexture');
  }
  
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexObject);
  gl.drawElements(gl.TRIANGLES, obj.numIndices, gl.UNSIGNED_SHORT, 0);
  
  this.checkGLError('drawObject.drawElements vshader='+prg.vshaderId+" fshader="+prg.fshaderId);

}

Cube3DWebGLCanvas.prototype.checkGLError = function(msg) {
  if (this.checkForErrors) {
    var gl=this.gl;
    var error = gl.getError();
    
    if (error != gl.NO_ERROR) {
      var str = "GL Error: " + error+(msg==null?"":" "+msg);
        gl.console.log(str);
        gl.hasError=true;
        //throw str;  => Don't throw error, maybe we can still render something
    }
  }
}
Cube3DWebGLCanvas.prototype.clearGLError = function(msg) {
    var gl=this.gl;
    var error = gl.getError();
    gl.hasError=false;
}


/**
 * Hit test for mouse events.
 */
Cube3DWebGLCanvas.prototype.mouseIntersectionTest = function(event) {
  // point in raster coordinates
  var rect = this.canvas.getBoundingClientRect();  
  var pRaster=new J3DIVector3(event.clientX - rect.left, event.clientY - rect.top, 0);
  
  // point in camera coordinates
  var pCamera=new J3DIVector3((pRaster[0] - this.width/2)/this.width*2, (pRaster[1] - this.height/2)/-this.height*2, 0);
  
  // point in world coordinates
  var pWorld = new J3DIVector3(pCamera);
  pWorld.multVecMatrix(this.rasterToCameraMatrix);

  // Inverse model-world matrix
  var wmMatrix = new J3DIMatrix4(this.world.matrix);
  wmMatrix.invert();
  
  // point in model coordinates
  var pModel =  new J3DIVector3(pWorld);  
  pModel.multVecMatrix(wmMatrix);
  
  // camera ray in model coordinates
  var ray={point:new J3DIVector3(), dir:new J3DIVector3()};
  ray.point.load(this.camPos);
  ray.point.multVecMatrix(wmMatrix);
  ray.dir.load(pModel);
  ray.dir.subtract(ray.point);
  ray.dir.normalize();
  
  var box={pMin:new J3DIVector3(-this.cubeSize/2,-this.cubeSize/2,-this.cubeSize/2),pMax:new J3DIVector3(this.cubeSize/2,this.cubeSize/2,this.cubeSize/2)};
  var isect = this.intersectBox(ray, box);
  
  if (isect != null) {
    var face=isect.face;
    var u=Math.floor(isect.uv[0]*3);
    var v=Math.floor(isect.uv[1]*3);
    
    var cube3d=this.cube3d;
    isect.axis=cube3d.boxClickToAxisMap[face][u][v];
    isect.layerMask=cube3d.boxClickToLayerMap[face][u][v];
    isect.angle=cube3d.boxClickToAngleMap[face][u][v];
  }
  
  return isect;
}


