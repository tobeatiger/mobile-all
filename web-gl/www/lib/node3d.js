/*
 * @(#)node3d.js  1.0  2011-06-22
 *
 * Copyright (c) 2011-2012 Werner Randelshofer, Switzerland.
 * You may not use, copy or modify this file, except in compliance with the
 * accompanying license terms.
 */

/** A simple 3d scenegraph.
 */
Node3D=function() {
  this.initNode3D();
}

Node3D.prototype.initNode3D=function() {
  this.matrix=new J3DIMatrix4();
  this.children=[];
  this.parent=null;
}

/** The parent of a node. */
Node3D.prototype.parent=null;

/** The children of a node. */
Node3D.prototype.children=null;

/** The transformation matrix of a node. */
Node3D.prototype.matrix=null;

/** Applies the scene graph transformation to m. */
Node3D.prototype.transform=function(m) {
  if (this.parent != null) this.parent.transform(m);
  m.multiply(this.matrix);
}

/** Adds a child. */
Node3D.prototype.add=function(child) {
  if (child.parent != null) {
    child.parent.remove(child);
  }
  this.children[this.children.length]=child;
  child.parent=this;
}

/** Removes a child. */
Node3D.prototype.remove=function(child) {
  if (child.parent == this) {
    for (var i=0;i<this.children.length;i++) {
      if (this.children[i]==child) {
        this.children=this.children.slice(0,i)+this.children.slice(i+1);
        break;
      }
    }
    child.parent = null;
  }
}
