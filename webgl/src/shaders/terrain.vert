#define SHADER_NAME VERTEX_TERRAIN

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;
uniform vec2 uvOffset;
uniform float height;
uniform float numTiles;
uniform sampler2D texture;
uniform sampler2D textureNormal;


varying vec2 vTextureCoord;
varying vec2 vGloabalUV;
// varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;


const float NEAR = 5.0;
const float FAR = 4000.0;
//float f = 800.0;
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
	vec3 pos         = aVertexPosition;
	vec2 uv          = aTextureCoord / numTiles;
	uv               += uvOffset;
	vGloabalUV 		 = uv;
	
	vec3 colorHeight = texture2D(texture, uv).rgb;
	pos.y            = length(colorHeight) * height - height;
	// pos.y            = - height;
	pos              += position;
	
	vec4 V 		     = (uPMatrix * uMVMatrix) * vec4(pos, 1.0);
	gl_Position      = V;

	vDepth 			 = 1.0 - getDepth(V.z/V.w, NEAR, FAR);
	
	
	vTextureCoord    = aTextureCoord;
	// vColor           = vec3(length(colorHeight));
	vNormal          = texture2D(textureNormal, uv).rgb;
	vVertexPosition  = pos;
}