/*
 * @(#)cube3dcanvas.js  1.0  2013-12-28
 *
 * Copyright (c) 2013 Werner Randelshofer, Switzerland.
 * You may not use, copy or modify this file, except in compliance with the
 * accompanying license terms.
 */

/** Base class for objects which can render a Cube3D into an HTML 5 canvas 
    using one of its contexts (3D or 2D context). And which can handle
		input events and forward them to the Cube3D.
*/

// ===============================
//
// Cube3DCanvas
//
// ===============================

/** Creates a Cube3DCanvas. 
    Subclasses must call initCube3DCanvas(). */
Cube3DCanvas = function() {
  this.initCube3DCanvas();
}

/** Initializes the Cube3DCanvas object. */
Cube3DCanvas.prototype.initCube3DCanvas = function() {
  this.canvas=null;
	this.cube3d=null;
  this.willRepaint=false;
  this.repaintCallbacks=[];
  this.currentAngle=0;
  this.autorotate=false;
  this.autorotateFunction=null;
  this.rotateFunction=null;
  this.mouseDownX=undefined;
  this.mouseDownY=undefined;
  this.mousePrevX=undefined;
  this.mousePrevY=undefined;
  this.mousePrevTimestamp=undefined;
  this.rotationMatrix=new J3DIMatrix4();
  this.smoothRotationFunction=null;
  this.spin=new J3DIVector3();

  
  var self = this;
  this.mouseDownListener = function (event) {return self.onMouseDown(event);};
  this.selectStartListener = function (event) {return false;};
  this.touchMoveListener = function (event) {return self.onTouchMove(event);};
  this.touchStartListener = function (event) {return self.onTouchStart(event);};
  this.touchEndListener = function (event) {return self.onTouchEnd(event);};
  this.mouseUpListener = function(event) {return self.onMouseUp(event);};
  this.mouseDownListener = function(event) {return self.onMouseDown(event);};
  this.mouseMoveListener = function(event) {return self.onMouseMove(event);};
  this.moves = [];
}

/** Sets Cube3D object. */
Cube3DCanvas.prototype.setCube3D = function(cube3d) {
  this.cube3d=cube3d;
}

/** Gets Cube3D object. */
Cube3DCanvas.prototype.getCube3D = function() {
  return this.cube3d;
}


/** Sets the canvas. 
  * Calls closeCanvas() and then initCanvas().
	* Returns true, if setting the canvas was successful, false otherwise.
  */
Cube3DCanvas.prototype.setCanvas = function(canvas) {
  if (this.canvas != null) {
    this.canvas.removeEventListener("selectstart",this.selectStartListener);
    this.canvas.removeEventListener('mousedown',this.mouseDownListener);
    document.removeEventListener('mousemove', this.mouseMoveListener);
    document.removeEventListener('mouseup', this.mouseUpListener);
    this.canvas.remoevEventListener("touchstart", this.touchStartListener);
    document.removeEventListener("touchmove", this.touchMoveListener);
    document.removeEventListener("touchend", this.touchEndListener);
    this.closeCanvas();
	}
  this.canvas=canvas;
  if (this.canvas != null) {
     var success = this.openCanvas();
     if (success) {
        this.canvas.addEventListener("selectstart",this.selectStartListener, false);
        this.canvas.addEventListener("touchstart", this.touchStartListener, false);
        document.addEventListener("touchmove", this.touchMoveListener, false);
        document.addEventListener("touchend", this.touchEndListener, false);
        this.canvas.addEventListener('mousedown',this.mouseDownListener,false);
        document.addEventListener('mouseup', this.mouseUpListener, false);
        document.addEventListener('mousemove', this.mouseMoveListener,false);
     }
     return success;     
	}
	return false;
}
/** Gets the canvas. */
Cube3DCanvas.prototype.getCube3D = function() {
  return this.canvas;
}

/** Opens the canvas for rendering. Protected method. 
 *  Returns true if opening was successful, false otherwise.
 *  This method should only be called from method setCanvas.
 */
Cube3DCanvas.prototype.openCanvas = function() {
	// subclass responsibility
	return false;
}
/** Closes the current canvas. Protected method. 
 *  This method should only be called from method setCanvas.
 */
Cube3DCanvas.prototype.closeCanvas = function() {
	// subclass responsibility
}

/**
 * Requests a repaint. 
 *
 * Calls the provided callback-function before drawing the cube. 
 * The cube is only drawn once if multiple repaints are pending.
 * All pending callbacks are executed in fifo order.
 *
 * @param callback an optional callback function.
 */
Cube3DCanvas.prototype.repaint = function(callback) {
  if (callback != null) {
    this.repaintCallbacks[this.repaintCallbacks.length]=callback;
  }
  
  if (this.willRepaint == false) {
    this.willRepaint=true;
    var self=this;
    var f=function() {
      self.willRepaint=false;
      
      // invoke all callbacks
      var callbacks=self.repaintCallbacks;
      self.repaintCallbacks=[];
      for (var i=0;i<callbacks.length;i++) {
        callbacks[i]();
      }
      
      // draw the cube
      self.draw();
    };
    window.requestAnimFrame(f, this.canvas);
  }
}



Cube3DCanvas.prototype.reset = function() {
  this.currentAngle=0;
  this.xRot=this.cube3d.attributes.xRot;
  this.yRot=this.cube3d.attributes.yRot;
  this.rotationMatrix.makeIdentity();
  this.smoothRotationFunction=null;
  this.moves = [];
  
  var self=this;
  var f=function() {
      // Cancel all other lenghty operations
      self.cube.cancel=true;
      
      // Wait until cube3d has finished twisting
      if (self.cube3d.isTwisting) {
        self.repaint(f);
        return;
      }
      // Reset cube
      self.cube.reset();
      
      // Other lenghty operations are go now
      self.cube.cancel=false;
  };
  this.repaint(f);
  return;
}
/** Play. Scrambles or solves the cube.
 */
Cube3DCanvas.prototype.play = function() {
  if (this.cube.isSolved()) {
    this.scramble();
  } else {
    this.solve();
  }
}
/** Play. Scrambles or solves the cube.
 */
Cube3DCanvas.prototype.solveStep = function() {
  // Wait until we can lock the cube. This prevents that multiple
  // twist operations run concurrently.
  var owner=new Object();
  if (!this.cube.lock(owner)) {
    return false;
  }
  this.cube.unlock(owner);
  
  return this.doSolveStep();
}
/** Protected method. */
Cube3DCanvas.prototype.doSolveStep = function() {
  if (this.cube.isSolved()) {
    this.moves = [];
    return true;
  } else if (this.moves.length == 0) {
    this.reset();
    return true;
  } else {
    var move = this.moves.pop();
    move.applyInverseTo(this.cube);
    if (this.cube.isSolved()) {
      this.moves = [];
      this.wobble();
      return true;
    }
    return false;
  }
}
/** Solves the cube.
 */
Cube3DCanvas.prototype.solve = function() {
  var self=this;
  var owner=new Object();
  var f=function() {
        // Wait until we can lock the cube. This prevents that multiple
        // scramble operations run concurrently.
        if (!self.cube.lock(owner)) {
          self.repaint(f);
          return;
        }
        // Wait until cube3d has finished twisting
        if (self.cube3d.isTwisting) {
          self.repaint(f);
          return;
        }
        // => First move: Speed the cube up 
        self.cube3d.attributes.twistDuration=self.cube3d.attributes.scrambleTwistDuration;
        
        if (! self.cube.cancel) {
          // => not cancelled? solve one step
          if (! self.doSolveStep()) {
            // => not solved? go again
            self.repaint(f);
            return;
          }
        }
        
        // => We are done: Restore the speed
        self.cube3d.attributes.twistDuration=self.cube3d.attributes.userTwistDuration;
        
        // Unlock the cube
        self.cube.unlock(owner);
      };
  this.repaint(f);
}
/** Scrambles the cube.
 * @param scrambleCount Number > 1.
 * @param animate       Boolean. Whether to animate to cube or just snap
 *                               into scrambled position.
 */
Cube3DCanvas.prototype.scramble = function(scrambleCount,animate) {
  if (scrambleCount==null) scrambleCount=16;
  if (animate==null) animate=true;
  
  var self=this;
  
    
  // Create random moves
  var parser=new ScriptParser();
  var scrambleNodes=parser.createRandomScript(scrambleCount);
  this.moves = this.moves.concat(scrambleNodes);
  
  // Perform the scrambling moves
  if (! animate) {
    var f=function() {
        // Cancel all other lenghty operations
        self.cube.cancel=true;
      
        // Wait until cube3d has finished twisting
        if (self.cube3d.isTwisting) {
          self.repaint(f);
          return;
        }
        
        // Scramble the cube
        for (var i=0;i<scrambleNodes.length;i++) {
          scrambleNodes[i].applyTo(self.cube);
        }
        
        // Other lenghty operations are go now
        self.cube.cancel=false;
    };
    this.repaint(f);
    return;
  }
  
  var next=0; // next twist to be performed
  var owner=new Object();
  var f=function() {
        // Wait until we can lock the cube. This prevents that multiple
        // scramble operations run concurrently.
        if (!self.cube.lock(owner)) {
          self.repaint(f);
          return;
        }
        // Wait until cube3d has finished twisting
        if (self.cube3d.isTwisting) {
          self.repaint(f);
          return;
        }
    
        if (next==0) {
          // => First move: Speed the cube up 
          self.cube3d.attributes.twistDuration=self.cube3d.attributes.scrambleTwistDuration;
        }  

        if (self.cube.cancel) {
          // => cancel? gently stop scrambling
          next=scrambleNodes.length;
        }
        
        // Initiate the next move
        if (next<scrambleNodes.length) {
          scrambleNodes[next].applyTo(self.cube);
          next++;
          self.repaint(f);
        } else {
          // => We are done: Restore the speed
          self.cube3d.attributes.twistDuration=self.cube3d.attributes.userTwistDuration;
          
          // Unlock the cube
          self.cube.unlock(owner);
        }
      };
  this.repaint(f);
}


/**
 * Enables/disables autorotation.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.setAutorotate = function(newValue) {
  if (newValue != this.autorotate) {
    this.autorotate=newValue;
    if (newValue) {
      var self=this;
      var start=new Date().getTime();
      var anglePerSecond=20;
      var prev=start;
      var startAngle=this.currentAngle;
      this.autorotateFunction=function() {
          if (self.autorotate) self.repaint(self.autorotateFunction);
          var now=new Date().getTime();
          var elapsed=now-start;
          self.currentAngle=(startAngle+elapsed*anglePerSecond/1000)%360;
      };
      this.repaint(this.autorotateFunction);
    }
  }
}
/**
 * Rotates the cube by the given amount.
 *
 * @param dx Degrees 360° on X-axis.
 * @param dy Degrees 360° on Y-axis.
 */
Cube3DCanvas.prototype.rotate = function(dx,dy) {
      var rm=new J3DIMatrix4();
      rm.rotate(dy, 0, 1, 0);
      rm.rotate(dx, 1, 0, 0);
      rm.multiply(this.rotationMatrix); // FIXME - Numerically unstable
      this.rotationMatrix.load(rm);
      this.repaint();
}
/**
 * Wobbles the cube.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.wobble = function(amount, duration) {
  if (amount==null) amount=0.3;
  if (duration==null) duration=500;
  
      var self=this;
      var start=new Date().getTime();
      var f=function() {
          var now=new Date().getTime();
          var elapsed=now-start;
          var x=elapsed/duration;
          if (x<1) {
            self.repaint(f);
        //    self.cube3d.attributes.scaleFactor=1+0.3*Math.sin(Math.PI*x);
            self.cube3d.attributes.scaleFactor=1+amount*Math.pow(1-Math.pow(x*2-1,2),4);
          } else {
            self.cube3d.attributes.scaleFactor=1;
          }
      };
      this.repaint(f);
}
/**
 * Explodes the cube.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.explode = function(amount,duration) {
  if (amount==null) amount=2;
  if (duration==null) duration=2000;
  
      var self=this;
      var start=new Date().getTime();
      var f=function() {
          var now=new Date().getTime();
          var elapsed=now-start;
          var x=elapsed/duration;
          if (x<1) {
            self.repaint(f);
            self.cube3d.attributes.explosionFactor=amount*Math.pow(1-Math.pow(x*2-1,2),4);
            self.cube3d.updateExplosionFactor();
          } else {
            self.cube3d.attributes.explosionFactor=0;
            self.cube3d.updateExplosionFactor();
          }
      };
      this.repaint(f);
}
/** Prints a log message. */
Cube3DCanvas.prototype.log = function(msg) {
  this.gl.console.log(msg);
}

Cube3DCanvas.prototype.stateChanged = function(event) {
  this.repaint();
}
Cube3DCanvas.prototype.getCubeAttributes = function() {
  return this.cube3d.attributes;
}
Cube3DCanvas.prototype.setCubeAttributes = function(attr) {
  this.cube3d.attributes=attr;
  this.forceColorUpdate=true;
  
  var gl=this.gl;  
  gl.clearColor(attr.backgroundColor[0]/255.0, attr.backgroundColor[1]/255.0, 
                attr.backgroundColor[2]/255.0, attr.backgroundColor[3]/255.0);
}
/**
 * MouseDown handler for the canvas object.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.onTouchStart = function(event) {
//    console.log('onTouchStart '+event.clientX+","+event.clientY+" "+event.touches.length);
  if (event.touches.length == 1) {
    event.preventDefault();
    event.clientX=event.touches[0].clientX;
    event.clientY=event.touches[0].clientY;
    this.onMouseDown(event);
  } else {
    this.isMouseDrag = false;
  }
}
Cube3DCanvas.prototype.onTouchEnd = function(event) {
  //event.preventDefault();
  event.clientX=this.mousePrevX;
  event.clientY=this.mousePrevY;
  this.onMouseUp(event);
}
Cube3DCanvas.prototype.onTouchMove = function(event) {
  //event.preventDefault();
  event.clientX=event.touches[0].clientX;
  event.clientY=event.touches[0].clientY;
  this.onMouseMove(event);
  console.log(event);
}
/**
 * MouseDown handler for the canvas object.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.onMouseDown = function(event) {
  this.mouseDownX=event.clientX;
  this.mouseDownY=event.clientY;
  this.mousePrevX=event.clientX;
  this.mousePrevY=event.clientY;
  this.mousePrevTimeStamp=event.timeStamp;
  this.isMouseDrag=true;
  var isect=this.mouseIntersectionTest(event);
  this.mouseDownIsect=isect;
  this.isCubeSwipe=isect!=null;
  if (isect==null) {
    this.smoothRotationFunction = null;
  }
}
/**
 * MouseMove handler for the canvas object.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.onMouseMove = function(event) {
  if (this.isMouseDrag) {
    var x = event.clientX;
    var y = event.clientY;
  
    var dx = (this.mousePrevY - y) * (360 / this.width);
    var dy = (this.mousePrevX - x) * (360 / this.height);
    var mouseTimestep=(event.timeStamp-this.mousePrevTimeStamp)/1000;

    if (this.isCubeSwipe) {
      var sqrDist=dx*dx+dy*dy;
      if (!this.cube3d.isTwisting && sqrDist>16) { // min swipe-distance: 4 pixels
        var cube3d=this.cube3d;
        var isect=this.mouseIntersectionTest(event);
        if (isect != null && isect.face==this.mouseDownIsect.face) {
          
          var u=Math.floor(isect.uv[0]*3);
          var v=Math.floor(isect.uv[1]*3);
  
          var du=isect.uv[0]-this.mouseDownIsect.uv[0];
          var dv=isect.uv[1]-this.mouseDownIsect.uv[1];
          
          
          var swipeAngle=Math.atan2(dv,du)*180/Math.PI+180;
          var swipeDirection=Math.round((swipeAngle)/90)%4;
  
          var face=isect.face;
          var axis=cube3d.boxSwipeToAxisMap[face][swipeDirection];
          var layerMask=cube3d.boxSwipeToLayerMap[face][u][v][swipeDirection];
          var angle=cube3d.boxSwipeToAngleMap[face][swipeDirection];
          //this.log('virtualrubik face,u,v,s:'+face+' '+u+' '+v+' '+swipeDirection);
          //this.log('virtualrubik ax,l,an   :'+axis+' '+layerMask+' '+angle);
          if (event.shiftKey || event.metaKey) angle=2*angle;
          var move=new TwistNode(axis,layerMask,angle);
          this.pushMove(move);
          move.applyTo(this.cube);
          if (this.cube.isSolved()) {
            this.wobble();
          }
          
          this.isCubeSwipe=false;
          this.isMouseDrag=false;
        }
      }
    } else {
      var rm=new J3DIMatrix4();
      rm.rotate(dy, 0, 1, 0);
      rm.rotate(dx, 1, 0, 0);
      var v = rm.loghat().divide(Math.max(0.1,mouseTimestep));
      rm.multiply(this.rotationMatrix); // FIXME - Numerically unstable
      this.rotationMatrix.load(rm);
      var self=this;
      var start = new Date().getTime();
      var damping=1;
      var f = function () {
          if (self.smoothRotationFunction != f) return;
          
          var now = new Date().getTime();
          var h = (now - start)/1000;

          // Euler Step for 2nd Order ODE
          // ODE:
          //   x'(t) = v(t)
          //   v'(t) = F(t) - ( damping * v(t) ) / m
          // Compute:
          //   x(t0+h) := x(t0) + h * x'(t0)
          //           := x(t0) + h * v(t0);
          //   v(t0+h) := v(t0) + h * v'(t0)
          //           := v(t0) + h * (F(t0)-dampings*v(t0))/m
          if (Math.abs(v.norm()) < 0.1) {
            self.smoothRotationFunction = null;
          } else {
            var rm = new J3DIVector3(v).multiply(h).exphat();
            rm.multiply(self.rotationMatrix); // FIXME - Numerically unstable
            self.rotationMatrix.load(rm);
            
            var vv=new J3DIVector3(v);
            if (h*damping<1) {
              v.subtract(vv.multiply(h*damping));
            } else {
              v.load(0,0,0);
            }
            
            self.repaint(f);
          }
          
          start = now;
        };
        this.smoothRotationFunction = f;
        this.repaint(f);
      
    }
  
    this.mousePrevX=event.clientX;
    this.mousePrevY=event.clientY;
    this.mousePrevTimeStamp=event.timeStamp;
  }
}
/**
 * MouseOut handler for the canvas object.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.onMouseOut = function(event) {
  this.isMouseDrag=false;
}


/**
 * MouseUp handler for the canvas object.
 *
 * @param newValue A boolean.
 */
Cube3DCanvas.prototype.onMouseUp = function(event) {
  this.isMouseDrag=false;
  this.isCubeSwipe=false;
  
    
  if (this.mouseDownX!=event.clientX || this.mouseDownY!=event.clientY) {
    // the mouse has been moved between mouse down and mouse up
    return;
  }
  
  var cube3d=this.cube3d;
  if (cube3d.isTwisting) {
    return;
  }
  
  var isect=this.mouseIntersectionTest(event);
  
  if (isect==null) {
    this.sphereHit=false;
  } else {
    this.spherePos.load(isect.point);
    this.sphereHit=true;
    
    if (event.altKey || event.ctrlKey) isect.angle*=-1;
    if (event.shiftKey || event.metaKey) isect.angle*=2;
          var move=new TwistNode(isect.axis,isect.layerMask,isect.angle);
          this.pushMove(move);
          move.applyTo(this.cube);
          if (this.cube.isSolved()) {
            this.wobble();
          }
  }
  
  // Make sure that onTouchUp can not reuse these values
  this.mousePrevX = NaN;
  this.mousePrevY = NaN;
  
  this.draw();
}
/** @param move twistNode. */
Cube3DCanvas.prototype.pushMove = function(move) {
  if (this.moves.length == 0) {
    this.moves.push(move);
  } else {
     var lastMove = this.moves.pop();
     if (lastMove.consume(move)) {
       if (! lastMove.doesNothing()) {
         this.moves.push(lastMove);
       } else {
       console.log('last move does nothing');
       }
     } else {
       this.moves.push(lastMove);
       this.moves.push(move);
     }
  }
}

/**
 * Hit test for mouse events.
 */
Cube3DCanvas.prototype.mouseIntersectionTest = function(event) {
  // subclass responsibility
}

/** Intersection test for a ray and a plane. 
 * The ray must be given as an object with {point:J3DIVector3, dir:J3DIVector3}.
 * The plane must be given as an object with {point:J3DIVector3, normal:J3DIVector3}.
 * -> dir and normal must be normalized vectors.
 *
 * Returns the intersection data: hit-point 3d coordinates and in u,v coordinates as
 *                                         {point:J3DIVector3, uv:J3DIVector3, t:float}
 */
Cube3DCanvas.prototype.intersectPlane = function(ray, plane) {
  // solve for t:
  // t = (ray.p - plane.p) * plane.n / ray.d * plane.n
  var divisor = ray.dir.dot(plane.normal);
  if (Math.abs(divisor) < 1e-20) {
    return null;
  }
  this.log("planeNormal:"+plane.normal);
  this.log(divisor+" divi:"+ new J3DIVector3(plane.normal).divide(divisor));
  var thit = -( 
    (new J3DIVector3(ray.point).subtract(plane.point)).dot( new J3DIVector3(plane.normal).divide(divisor) )
    );
  
  var phit = new J3DIVector3(ray.point).add(new J3DIVector3(ray.dir).multiply(t));
  
  var uv3d = new J3DIVector3(plane.point).subtract(phit);
  
  // find parametric representation of plane hit
  if (Math.abs(plane.normal[0])>Math.abs(plane.normal[1]) && Math.abs(plane.normal[0])>Math.abs(plane.normal[2])) {
     // Y-Z plane
     var uv=new J3DIVector3(uv3d[1],uv3d[2],0);   
  } else if (Math.abs(plane.normal[1])>Math.abs(plane.normal[0]) &&Math.abs(plane.normal[1])>Math.abs(plane.normal[2])) {
     // X-Z plane
     var uv=new J3DIVector3(uv3d[0],uv3d[2],0);   
  } else {
     // X-Y plane
     var uv=new J3DIVector3(uv3d[0],uv3d[1],0);   
  }

  return {point:phit,uv:uv,t:t}  
}
/** Intersection test for a ray and an axis-oriented box. 
 * The ray must be given as an object with {point:J3DIVector3, dir:J3DIVector3}.
 * The box must be given as an object with {pMin:J3DIVector3, pMax:J3DIVector3}.
 * -> dir must be a normalized vector.
 * -> All coordinates in pMin must be smaller than in pMax
 *
 * Returns the intersection data: hit-point 3d coordinates and in u,v coordinates as
 *                                         {point:J3DIVector3, uv:J3DIVector3, t:float, face:int}
 */
Cube3DCanvas.prototype.intersectBox = function(ray, box) {
  var pMin=box.pMin; var pMax=box.pMax;
  var t0=0; var t1=Number.MAX_VALUE;
  var face0 = -1;  var face1 = -1;
  for (var i=0;i<3;i++) {
    // update interval for i-th bounding box slab
    var invRayDir = 1.0/ray.dir[i];
    var tNear = (pMin[i] - ray.point[i]) * invRayDir;
    var tFar = (pMax[i] - ray.point[i]) * invRayDir;
    
    // update parametric interval from slab intersection
    var faceSwap=0;
    if (tNear > tFar) { var swap=tNear; tNear=tFar; tFar = swap; faceSwap=3; }
    if (tNear > t0) { t0=tNear; face0=i+faceSwap; }
    if (tFar < t1) { t1=tFar; face1=i+3-faceSwap; }
    if (t0>t1) return null;
  }
  var thit;
  var facehit;
  if (t0<t1 && face0!=-1 || face1==-1) {
    thit=t0;
    facehit=face0;
  } else {
    thit=t1;
    facehit=face1;
  }

  var phit = new J3DIVector3(ray.point).add(new J3DIVector3(ray.dir).multiply(thit));
  // find parametric representation of box hit
  var u,v;
  switch (facehit) {
    case 0: {// left
        var dpdu = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]) );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[2]-pMin[2])*dpdu[2];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    case 3: {// right
        var dpdu = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]) );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[2]-pMin[2])*dpdu[2];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    case 1: {// down
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0);
        var dpdv = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]));
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[2]-pMin[2])*dpdv[2];
        break;
    }
    case 4: {// up
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0);
        var dpdv = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]));
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[2]-pMin[2])*dpdv[2];
        break;
    }
    case 2: {// front
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0 );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    case 5: {// back
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0 );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    default:
      //alert("ERROR, illegal face number:"+facehit);
  }
  
  return {point:phit, uv:new J3DIVector3(u,v,0), t:thit, face:facehit}
}

