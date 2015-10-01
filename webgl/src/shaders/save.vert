#define SHADER_NAME SAVING_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
	vec4 pos = vec4(aTextureCoord.x, aTextureCoord.y, 0.0, 1.0);
    gl_Position = uPMatrix * uMVMatrix * pos;
    vTextureCoord = aTextureCoord;

    vColor = aVertexPosition;
    gl_PointSize = 1.0;
}