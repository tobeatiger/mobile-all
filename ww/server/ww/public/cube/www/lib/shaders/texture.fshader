/*
 * @(#)texture.fshader  1.1  2012-07-15
 *
 * Copyright (c) 2011-2012 Werner Randelshofer, Immensee, Switzerland.
 * All rights reserved.
 *
 * You may not use, copy or modify this file, except in compliance with the
 * license agreement you entered into with Werner Randelshofer.
 * For details see accompanying license terms.
 */

// WebGL Fragment Shader
#ifdef GL_ES
    precision mediump float;
#endif

// World information
// -----------------
uniform vec3 camPos;         // camera position in world coordinates
uniform vec3 lightPos;       // light position in world coordinates

// Model information
// -----------------
uniform vec4 mPhong;         // vertex ambient, diffuse, specular, shininess
uniform sampler2D mTexture;  // texture
uniform bool mHasTexture; 


// Fragment information
// --------------------
varying vec4 fColor;
varying vec4 fNormal;
varying vec4 fPos;
varying vec2 fTexture;       // fragment texture cooordinates


void main() {
  vec3 wi = normalize(lightPos - fPos.xyz); // direction to light source
  vec3 wo = normalize(camPos - fPos.xyz); // direction to observer
  vec3 n = normalize(fNormal.xyz);
  float specular=pow( max(0.0,-dot(reflect(wi, n), wo)), mPhong.w)*mPhong.z;
  float diffuse=max(0.0,dot(wi,n))*mPhong.y;
  float ambient=mPhong.x;
  
  vec4 color=(mHasTexture)?texture2D(mTexture, fTexture):fColor;
  
	gl_FragColor=vec4(color.rgb*(diffuse+ambient)+specular*vec3(1,1,1), color.a);
}
 
 
