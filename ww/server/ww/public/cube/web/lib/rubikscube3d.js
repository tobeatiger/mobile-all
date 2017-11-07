/*
 * @(#)rubikscube3d.js  1.0.1  2011-08-09
 *
 * Copyright (c) 2011-2012 Werner Randelshofer, Switzerland.
 * You may not use, copy or modify this file, except in compliance with the
 * accompanying license terms.
 */


/** Constructor
 * Creates the 3D geometry of a Rubik's Cube.
 */
RubiksCube3D=function() {
  this.initRubiksCube3D();
}

RubiksCube3D.prototype=new Cube3D();


RubiksCube3D.prototype.initRubiksCube3D=function() {
  this.initCube3D(); // initialize super class
	
  this.cornerCount=8;
  this.edgeCount=12;
  this.sideCount=6;
  this.centerCount=1;
  this.partCount=8+12+6+1;
  this.cornerOffset=0;
  this.edgeOffset=8;
  this.sideOffset=8+12;
  this.centerOffset=8+12+6;
  this.stickerCount=9*6;

  this.cube=new RubiksCube();
  this.cube.addCubeListener(this);
  this.attributes=this.createAttributes();
  
  this.partToStickerMap=new Array(this.partCount);  
  for (var i=0;i<this.partCount;i++) {
    this.parts[i]=new Node3D();
    this.rotationTransforms[i]=new Node3D();
    this.explosionTransforms[i]=new Node3D();
    this.locationTransforms[i]=new Node3D();
    
    this.explosionTransforms[i].add(this.parts[i]);
    this.locationTransforms[i].add(this.explosionTransforms[i]);
    this.rotationTransforms[i].add(this.locationTransforms[i]);
    this.add(this.rotationTransforms[i]);
    
    this.identityVertexMatrix[i]=new J3DIMatrix4();
    
    this.partToStickerMap[i]=new Array(3);
  }

  for (var i=0;i<this.stickerCount;i++) {
    this.partToStickerMap[this.stickerToPartMap[i]][this.stickerToFaceMap[i]]=i;  
  }
  
  var partSize=1.78;
  
  /*
   * Corners
   *             +---+---+---+
   *          ulb|4.0|   |2.0|ubr
   *             +---+   +---+
   *             |     1     |
   *             +---+   +---+
   *          ufl|6.0|   |0.0|urf
   * +---+---+---+---+---+---+---+---+---+---+---+---+
   * |4.1|   |6.2|6.1|   |0.2|0.1|   |2.2|2.1|   |4.2|
   * +---+   +---+---+   +---+---+   +---+---+   +---+
   * |     3     |     2     |     0     |     5     |
   * +---+   +---+---+   +---+---+   +---+---+   +---+
   * |5.2|   |7.1|7.2|   |1.1|1.2|   |3.1|3.2|   |5.1|
   * +---+---+---+---+---+---+---+---+---+---+---+---+
   *          dlf|7.0|   |1.0|dfr
   *             +---+   +---+
   *             |     4     |
   *             +---+   +---+
   *          dbl|5.0|   |3.0|drb
   *             +---+---+---+
   */
   var cornerOffset=this.cornerOffset;
  // Move all corner parts to up front left (ufl) and then rotate them in place
  for (var i = 0; i < this.cornerCount; i++) {
      var index = cornerOffset + i;
      this.explosionTransforms[index].matrix.translate(-partSize,partSize, -partSize);
      this.explosionTransforms[index].matrix.rotate(180, 0, 1, 0);
  }
  
  // 0:urf
  this.identityVertexMatrix[cornerOffset + 0].rotate(90, 0,-1, 0);
  // 1:dfr
  this.identityVertexMatrix[cornerOffset + 1].rotate(180,   0, 0, 1);
  // 2:ubr
  this.identityVertexMatrix[cornerOffset + 2].rotate(180,   0, 1, 0);
  // 3:drb
  this.identityVertexMatrix[cornerOffset + 3].rotate(90, 0, -1, 0);
  this.identityVertexMatrix[cornerOffset + 3].rotate(180,   0, 0, 1);
  // 4:ulb
  this.identityVertexMatrix[cornerOffset + 4].rotate(90, 0, 1, 0);
  // 5:dbl
  this.identityVertexMatrix[cornerOffset + 5].rotate(180,   1, 0, 0);
  // 6:ufl
  //--no transformation---
  // 7:dlf
  this.identityVertexMatrix[cornerOffset + 7].rotate(180,   1, 0, 0);
  this.identityVertexMatrix[cornerOffset + 7].rotate(90, 0, 1, 0);
  //
  /**
   * Edges
   *             +---+---+---+
   *             |   |3.1|   |
   *             +--- --- ---+
   *             |6.0| u |0.0|
   *             +--- --- ---+
   *             |   |9.1|   |
   * +---+---+---+---+---+---+---+---+---+---+---+---+
   * |   |6.1|   |   |9.0|   |   |0.1|   |   |3.0|   |
   * +--- --- ---+--- --- ---+--- --- ---+--- --- ---+
   * |7.0| l 10.0|10.1 f |1.1|1.0| r |4.0|4.1| b |7.1|
   * +--- --- ---+--- --- ---+--- --- ---+--- --- ---+
   * |   |8.1|   |   |11.0   |   |2.1|   |   |5.0|   |
   * +---+---+---+---+---+---+---+---+---+---+---+---+
   *             |   |11.1   |
   *             +--- --- ---+
   *             |8.0| d |2.0|
   *             +--- --- ---+
   *             |   |5.1|   |
   *             +---+---+---+
   */
  // Move all edge parts to front up (fu) and then rotate them in place
  var edgeOffset=this.edgeOffset;
  for (var i = 0; i < this.edgeCount; i++) {
      var index = edgeOffset + i;
      this.explosionTransforms[index].matrix.translate(0, partSize, -partSize);
      this.explosionTransforms[index].matrix.rotate(180, 0, 1, 0);
  }
  // ur
  this.identityVertexMatrix[edgeOffset + 0].rotate(90, 0, 0, -1);
  this.identityVertexMatrix[edgeOffset + 0].rotate(90, 0, 1, 0);
  // rf
  this.identityVertexMatrix[edgeOffset + 1].rotate(90, -1, 0, 0);
  this.identityVertexMatrix[edgeOffset + 1].rotate(90, 0, -1, 0);
  // dr
  this.identityVertexMatrix[edgeOffset + 2].rotate(90, 0, 0, -1);
  this.identityVertexMatrix[edgeOffset + 2].rotate(90, 0, -1, 0);
  // bu
  this.identityVertexMatrix[edgeOffset + 3].rotate(180, 0, 1, 0);
  // rb
  this.identityVertexMatrix[edgeOffset + 4].rotate(90, 0, -1, 0);
  this.identityVertexMatrix[edgeOffset + 4].rotate(90, 0, 0, -1);
  // bd
  this.identityVertexMatrix[edgeOffset + 5].rotate(180, 1, 0, 0);
  // ul
  this.identityVertexMatrix[edgeOffset + 6].rotate(90, 0, -1, 0);
  this.identityVertexMatrix[edgeOffset + 6].rotate(90, 1, 0, 0);
  // lb
  this.identityVertexMatrix[edgeOffset + 7].rotate(90, 0, 1, 0);
  this.identityVertexMatrix[edgeOffset + 7].rotate(90, 0, 0, 1);
  // dl
  this.identityVertexMatrix[edgeOffset + 8].rotate(90, 0, 1, 0);
  this.identityVertexMatrix[edgeOffset + 8].rotate(90, -1, 0, 0);
  // fu
  //--no transformation--
  // lf
  this.identityVertexMatrix[edgeOffset + 10].rotate(90, 0, 1, 0);
  this.identityVertexMatrix[edgeOffset + 10].rotate(90, 0, 0, -1);

  // fd
  this.identityVertexMatrix[edgeOffset + 11].rotate(180, 0, 0, 1);
  /* Sides
   *             +------------+
   *             |     .1     |
   *             |    ---     |
   *             | .0| 1 |.2  |
   *             |    ---     |
   *             |     .3     |
   * +-----------+------------+-----------+-----------+
   * |     .0    |     .2     |     .3    |    .1     |
   * |    ---    |    ---     |    ---    |    ---    |
   * | .3| 3 |.1 | .1| 2 |.3  | .2| 0 |.0 | .0| 5 |.2 |
   * |    ---    |    ---     |    ---    |    ---    |
   * |     .2    |    .0      |     .1    |     .3    |
   * +-----------+------------+-----------+-----------+
   *             |     .0     |
   *             |    ---     |
   *             | .3| 4 |.1  |
   *             |    ---     |
   *             |     .2     |
   *             +------------+
   */
  var sideOffset=this.sideOffset;
  for (var i = 0; i < this.sideCount; i++) {
      var index = sideOffset + i;
      this.explosionTransforms[index].matrix.translate(0, 0, -partSize);
      this.explosionTransforms[index].matrix.rotate(180,0, 1, 0);
  }
  // Move all side parts to front
  // r
  this.identityVertexMatrix[sideOffset + 0].rotate(90, 0, -1, 0);
  this.identityVertexMatrix[sideOffset + 0].rotate(90, 0, 0, 1);
  // u
  this.identityVertexMatrix[sideOffset + 1].rotate(90, 1, 0, 0);
  this.identityVertexMatrix[sideOffset + 1].rotate(90, 0, 0, -1);
  // f
  //this.identityVertexMatrix[sideOffset + 2].rotate(180, 0, 0, 1);
  // l
  this.identityVertexMatrix[sideOffset + 3].rotate(90, 0, 1, 0);
  this.identityVertexMatrix[sideOffset + 3].rotate(180, 0, 0, 1);
  // d
  this.identityVertexMatrix[sideOffset + 4].rotate(180, 0, 0, 1);
  this.identityVertexMatrix[sideOffset + 4].rotate(90, 1, 0, 0);
  // b
  this.identityVertexMatrix[sideOffset + 5].rotate(90, 0, 0, 1);
  this.identityVertexMatrix[sideOffset + 5].rotate(180, 0, 1, 0);


  // ----------------------------         
  // Reset all rotations
  for (var i=0;i<this.partCount;i++) {
    this.locationTransforms[i].matrix.load(this.identityVertexMatrix[i]);
  }

}

/* Maps stickers to cube parts.
 *                +----+----+----+
 *                | 4.0|11  | 2.0|
 *                +----      ----+
 *                |14.0 21    8.0|
 *                +----      ----+
 *                | 6.0|17  | 0.0|
 * +----+----+----+----+----+----+----+----+----+----+----+----+
 * | 4.1|14  | 6.2| 6.1|17.0| 0.2| 0.1| 8  | 2.2| 2.1|11.0| 4.2|
 * +----      ----+----      ----+----      ----+----      ----+
 * |15.0 23   18.0|18   22    9  | 9.0 20   12.0|12   25   15  |
 * +----      ----+----      ----+----      ----+----      ----+
 * | 5.2|16  | 7.1| 7.2|19.0| 1.1| 1.2|10  | 3.1| 3.2|13.0| 5.1|
 * +----+----+----+----+----+----+----+----+----+----+----+----+
 *                | 7.0|19  | 1.0|
 *                +----      ----+
 *                |16.0 24   10.0|
 *                +----      ----+
 *                |5.0 |13  | 3.0|
 *                +----+----+----+
 */
RubiksCube3D.prototype.stickerToPartMap = [
        0, 8, 2, 9, 20, 12, 1, 10, 3, // right
        4, 11, 2, 14, 21, 8, 6, 17, 0, // up
        6, 17, 0, 18, 22, 9, 7, 19, 1, // front
        4, 14, 6, 15, 23, 18, 5, 16, 7, // left
        7, 19, 1, 16, 24, 10, 5, 13, 3, // down
        2, 11, 4, 12, 25, 15, 3, 13, 5 // back
];

/** Maps parts to stickers. This is a two dimensional array. The first
 * dimension is the part index, the second dimension the orientation of
 * the part. */
RubiksCube3D.prototype.partToStickerMap=null;
RubiksCube3D.prototype.getStickerIndexForPartIndex=function(partIndex, orientationIndex) {
  return this.partToStickerMap[partIndex][orientationIndex];
}

/**
 * Gets the part which holds the indicated sticker.
 * The sticker index is interpreted according to this
 * scheme:
 * <pre>
 *                 +---+---+---+
 *                 | 9 | 10| 11|
 *                 +---+---+---+
 *                 | 12| 13| 14|
 *                 +---+---+---+
 *                 | 15| 16| 17|
 *     +---+---+---+---+---+---+---+---+---+---+---+---+
 *     | 27| 28| 29| 18| 19| 20| 0 | 1 | 2 | 45| 46| 47|
 *     +---+---+---+---+---+---+---+---+---+---+---+---+
 *     | 30| 31| 32| 21| 22| 23| 3 | 4 | 5 | 48| 49| 50|
 *     +---+---+---+---+---+---+---+---+---+---+---+---+
 *     | 33| 34| 35| 24| 25| 26| 6 | 7 | 8 | 51| 52| 53|
 *     +---+---+---+---+---+---+---+---+---+---+---+---+
 *                 | 36| 37| 38|
 *                 +---+---+---+
 *                 | 39| 40| 41|
 *                 +---+---+---+
 *                 | 42| 43| 44|
 *                 +---+---+---+
 * </pre>
 */
RubiksCube3D.prototype.getPartIndexForStickerIndex=function(stickerIndex) {
    return stickerToPartMap[stickerIndex];
}
RubiksCube3D.prototype.stickerToFaceMap = [
        1, 1, 2, 0, 0, 0, 2, 1, 1, // right
        0, 1, 0, 0, 0, 0, 0, 1, 0, // up
        1, 0, 2, 1, 0, 1, 2, 0, 1, // front
        1, 1, 2, 0, 0, 0, 2, 1, 1, // left
        0, 1, 0, 0, 0, 0, 0, 1, 0, // down
        1, 0, 2, 1, 0, 1, 2, 0, 1 // back
];

/** Default cube attributes. */
RubiksCube3D.prototype.createAttributes=function() {
  var a=new CubeAttributes(this.partCount, 6*9, [9,9,9,9,9,9]);
  var partsPhong=[0.5,0.6,0.4,16.0];//shiny plastic [ambient, diffuse, specular, shininess]
  for (var i=0;i<this.partCount;i++) {
    a.partsFillColor[i]=[40,40,40,255];
    a.partsPhong[i]=partsPhong;
  }
  a.partsFillColor[this.centerOffset]=[240,240,240,255];
  
  var faceColors=[
    [255,210,  0,255],// right: yellow
    [  0, 51,115,255],// up   : blue
    [140,  0, 15,255],// front: red
    [248,248,248,255],// left : white
    [  0,115, 47,255],// down : green
    [255, 70,  0,255] // back : orange
  ];
  
  var stickersPhong=[0.8,0.2,0.1,8.0];//shiny paper [ambient, diffuse, specular, shininess]
  
  for (var i=0;i<6;i++) {
    for (var j=0;j<9;j++) {
      a.stickersFillColor[i*9+j]=faceColors[i];
      a.stickersPhong[i*9+j]=stickersPhong;
    }
  }
  
  return a;
}

RubiksCube3D.prototype.updateExplosionFactor=function(factor) {
  if (factor == null) {
      factor=this.attributes.explosionFactor;
  }
        var explosionShift=1.78;
        var baseShift = explosionShift + explosionShift * factor;
        var shift;
        var a = this.attributes;
        for (var i = 0; i < this.cornerCount; i++) {
            var index = this.cornerOffset + i;
            shift = baseShift + a.partExplosion[index];
            this.explosionTransforms[index].matrix.makeIdentity();
            this.explosionTransforms[index].matrix.translate(-shift, shift, -shift);
            this.explosionTransforms[index].matrix.rotate(180,0, 1, 0);
        }
        for (var i = 0; i < this.edgeCount; i++) {
            var index = this.edgeOffset + i;
            shift = baseShift + a.partExplosion[index];
            this.explosionTransforms[index].matrix.makeIdentity();
            this.explosionTransforms[index].matrix.translate(0, shift, -shift);
            this.explosionTransforms[index].matrix.rotate(180, 0, 1, 0);
        }
        for (var i = 0; i < this.sideCount; i++) {
            var index = this.sideOffset + i;
            shift = baseShift + a.partExplosion[index];
            this.explosionTransforms[index].matrix.makeIdentity();
            this.explosionTransforms[index].matrix.translate(0, 0, -shift);
            this.explosionTransforms[index].matrix.rotate(180, 0, 1, 0);
        }
        this.fireStateChanged();
    }


RubiksCube3D.prototype.validateTwist=function(partIndices, locations, orientations, length, axis, angle, alpha) {
    var rotation = this.updateTwistRotation;
    rotation.makeIdentity();
    var rad = (90 * angle * (1 - alpha));
    switch (axis) {
        case 0:
            rotation.rotate(rad,-1, 0, 0);
            break;
        case 1:
            rotation.rotate(rad,0, -1, 0);
            break;
        case 2:
            rotation.rotate(rad,0, 0, 1);
            break;
    }

    var orientationMatrix = this.updateTwistOrientation;
    for (var i = 0; i < length; i++) {
        orientationMatrix.makeIdentity();
        if (partIndices[i] < this.edgeOffset) { //=> part is a corner
            switch (orientations[i]) {
                case 0:
                    break;
                case 1:
                    orientationMatrix.rotate(90,-1, 0, 0);
                    orientationMatrix.rotate(90,0, 0, -1);
                    break;
                case 2:
                    orientationMatrix.rotate(90,0, 0,1);
                    orientationMatrix.rotate(90,1, 0, 0);
                    break;
            }
        } else if (partIndices[i] < this.sideOffset) { //=> part is an edge
            orientationMatrix.makeIdentity();
            if (orientations[i] == 1) { 
                orientationMatrix.rotate(90,-1, 0, 0);
                orientationMatrix.rotate(180,0, 0, 1);
            }
        } else if (partIndices[i] < this.centerOffset) {//=> part is a side
            if (orientations[i] > 0) {
              orientationMatrix.rotate(90*orientations[i],0, 0,-1);
            }
        }
        this.parts[partIndices[i]].matrix.load(orientationMatrix);
        var transform = this.locationTransforms[partIndices[i]].matrix;
        transform.load(rotation);
        transform.multiply(this.identityVertexMatrix[locations[i]]);
    }
}

RubiksCube3D.prototype.cubeTwisted=function(evt) {
  if (this.repainter==null) {
      this.updateCube();
      return;
  }
  
        var layerMask = evt.layerMask;
        var axis = evt.axis;
        var angle = evt.angle;
        var model = this.cube;

        var partIndices = new Array(27);
        var locations =  new Array(27);
        var orientations =  new Array(27);
        var count = 0;

        var affectedParts = evt.getAffectedLocations();
        if ((layerMask & 2) != 0) {
            count = affectedParts.length + 1;
            locations=affectedParts.slice(0,count);
            locations[count - 1] = this.centerOffset;
        } else {
            count = affectedParts.length;
            locations=affectedParts.slice(0,count);
        }
        for (var i = 0; i < count; i++) {
            partIndices[i] = model.getPartAt(locations[i]);
            orientations[i] = model.getPartOrientation(partIndices[i]);
        }

        var finalCount=count;
        var self=this;
        var interpolator = new SplineInterpolator(0, 0, 1, 1);
        var start=new Date().getTime();
        var duration=this.attributes.twistDuration*Math.abs(angle);
        this.isTwisting=true;
        var f=function() {
          var now=new Date().getTime();
          var elapsed=now-start;
          var value=elapsed/duration;
          if (value<1) {
            self.validateTwist(partIndices, locations, orientations, finalCount, axis, angle, interpolator.getFraction(value));
            self.repainter.repaint(f);
          } else {
            self.validateTwist(partIndices, locations, orientations, finalCount, axis, angle, 1.0);
            self.isTwisting=false;
          }
        };
        this.repainter.repaint(f);
}

RubiksCube3D.prototype.boxClickToAxisMap = [
          [[ 0, 1, 0],[ 2, 0, 2],[ 0, 1, 0]],// right
          [[ 1, 2, 1],[ 0, 1, 0],[ 1, 2, 1]],// down
          [[ 2, 1, 2],[ 0, 2, 0],[ 2, 1, 2]],// front
          [[ 0, 1, 0],[ 2, 0, 2],[ 0, 1, 0]],// left
          [[ 1, 2, 1],[ 0, 1, 0],[ 1, 2, 1]],// up
          [[ 2, 1, 2],[ 0, 2, 0],[ 2, 1, 2]],// back
        ];
RubiksCube3D.prototype.boxClickToAngleMap = [
          [[-1,-1,-1],[-1,-1, 1],[-1, 1,-1]],
          [[-1, 1,-1],[ 1,-1,-1],[-1,-1,-1]],
          [[ 1, 1, 1],[-1, 1, 1],[ 1,-1, 1]],
          [[ 1, 1, 1],[ 1, 1,-1],[ 1,-1, 1]],
          [[ 1,-1, 1],[-1, 1, 1],[ 1, 1, 1]],
          [[-1,-1,-1],[ 1,-1,-1],[-1, 1,-1]],
        ];
RubiksCube3D.prototype.boxClickToLayerMap = [
          [[ 1, 2, 1],[ 2, 1, 2],[ 1, 2, 1]],
          [[ 1, 2, 1],[ 2, 1, 2],[ 1, 2, 1]],
          [[ 4, 2, 4],[ 2, 4, 2],[ 4, 2, 4]],
          [[ 4, 2, 4],[ 2, 4, 2],[ 4, 2, 4]],
          [[ 4, 2, 4],[ 2, 4, 2],[ 4, 2, 4]],
          [[ 1, 2, 1],[ 2, 1, 2],[ 1, 2, 1]],
        ];
RubiksCube3D.prototype.boxSwipeToAxisMap = [
  [ 1, 2, 1, 2],// left
  [ 2, 0, 2, 0],// down
  [ 1, 0, 1, 0],// front
  [ 1, 2, 1, 2],// right
  [ 2, 0, 2, 0],// up
  [ 1, 0, 1, 0],// back
];
RubiksCube3D.prototype.boxSwipeToAngleMap = [
  [-1,-1, 1, 1],// left
  [ 1, 1,-1,-1],// down
  [ 1,-1,-1, 1],// front
  [ 1, 1,-1,-1],// right
  [-1,-1, 1, 1],// up
  [-1, 1, 1,-1],// back
];
RubiksCube3D.prototype.boxSwipeToLayerMap = [
  [[ [ 1, 4, 1, 4], [ 2, 4, 2, 4], [ 4, 4, 4, 4]],[ [ 1, 2, 1, 2], [ 2, 2, 2, 2], [ 4, 2, 4, 2]],[ [ 1, 1, 1, 1], [ 2, 1, 2, 1], [ 4, 1, 4, 1]]],// left
  [[ [ 4, 1, 4, 1], [ 2, 1, 2, 1], [ 1, 1, 1, 1]],[ [ 4, 2, 4, 2], [ 2, 2, 2, 2], [ 1, 2, 1, 2]],[ [ 4, 4, 4, 4], [ 2, 4, 2, 4], [ 1, 4, 1, 4]]],// down
  [[ [ 1, 1, 1, 1], [ 2, 1, 2, 1], [ 4, 1, 4, 1]],[ [ 1, 2, 1, 2], [ 2, 2, 2, 2], [ 4, 2, 4, 2]],[ [ 1, 4, 1, 4], [ 2, 4, 2, 4], [ 4, 4, 4, 4]]],// front
  [[ [ 1, 4, 1, 4], [ 2, 4, 2, 4], [ 4, 4, 4, 4]],[ [ 1, 2, 1, 2], [ 2, 2, 2, 2], [ 4, 2, 4, 2]],[ [ 1, 1, 1, 1], [ 2, 1, 2, 1], [ 4, 1, 4, 1]]],// right
  [[ [ 4, 1, 4, 1], [ 2, 1, 2, 1], [ 1, 1, 1, 1]],[ [ 4, 2, 4, 2], [ 2, 2, 2, 2], [ 1, 2, 1, 2]],[ [ 4, 4, 4, 4], [ 2, 4, 2, 4], [ 1, 4, 1, 4]]],// up
  [[ [ 1, 1, 1, 1], [ 2, 1, 2, 1], [ 4, 1, 4, 1]],[ [ 1, 2, 1, 2], [ 2, 2, 2, 2], [ 4, 2, 4, 2]],[ [ 1, 4, 1, 4], [ 2, 4, 2, 4], [ 4, 4, 4, 4]]],// back
];

// The following properties may have different values depending on
// the 3D model being used.
RubiksCube3D.prototype.stickerOffsets=[6,3 ,7,3 ,8,3,//right
                      6,4, 7,4, 8,4,
                      6,5, 7,5, 8,5,
                      
                      3,0, 4,0, 5,0,//up
                      3,1, 4,1, 5,1,//
                      3,2, 4,2, 5,2,
                      
                      3,3, 4,3, 5,3,//front
                      3,4, 4,4, 5,4,
                      3,5, 4,5, 5,5,
                      
                      0,3, 1,3, 2,3,//left
                      0,4, 1,4, 2,4,
                      0,5, 1,5, 2,5,
                      
                      3,6, 4,6, 5,6,//down
                      3,7, 4,7, 5,7,
                      3,8, 4,8, 5,8,
                      
                      6,6, 7,6, 8,6,//back
                      6,7, 7,7, 8,7,
                      6,8, 7,8, 8,8
];

RubiksCube3D.prototype.sideMatrices=[
  new J3DIMatrix4().rotate(90,0,0,-1), //r
  new J3DIMatrix4().rotate(90,0,0,1), //u
  new J3DIMatrix4().rotate(180,0,0,1), 
  new J3DIMatrix4().rotate(0,0,0,1), 
  new J3DIMatrix4().rotate(0,0,0,1), 
  new J3DIMatrix4().rotate(90,0,0,1) 
];
RubiksCube3D.prototype.edgeMatrices=[
  new J3DIMatrix4().rotate(90,0,0,1), 
  new J3DIMatrix4().rotate(90,0,0,-1), 
  new J3DIMatrix4().rotate(90,0,0,1), 
  new J3DIMatrix4().rotate(180,0,0,1), 
  new J3DIMatrix4().rotate(90,0,0,1), 
  new J3DIMatrix4().rotate(0,0,0,1), 
  new J3DIMatrix4().rotate(90,0,0,-1), 
  new J3DIMatrix4().rotate(90,0,0,-1), 
  new J3DIMatrix4().rotate(90,0,0,-1), 
  new J3DIMatrix4().rotate(180,0,0,1), 
  new J3DIMatrix4().rotate(90,0,0,1), 
  new J3DIMatrix4().rotate(0,0,0,1) 
];
RubiksCube3D.prototype.cornerMatrices=[
  new J3DIMatrix4().rotate(180,0,0,1), //urfr
  new J3DIMatrix4().rotate(0,0,0,-1), 
  new J3DIMatrix4().rotate(180,0,0,1), //
  new J3DIMatrix4().rotate(0,0,0,1), //
  new J3DIMatrix4().rotate(180,0,0,1), //
  new J3DIMatrix4().rotate(0,0,0,1), //
  new J3DIMatrix4().rotate(180,0,0,-1), //
  new J3DIMatrix4().rotate(0,0,0,-1), //
];