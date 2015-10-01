#define SHADER_NAME RENDER_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform sampler2D texture;
uniform sampler2D textureNext;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float flashingRange;
uniform float percent;
uniform float revealPercent;

varying float alpha;
varying float opacity;

const float PI = 3.1415926;
const float PI_2 = 3.1415926*2.0;

float getDiff(float a, float b) {
    float diff = b - a;
    if(diff > PI) diff -= PI_2;
    else if(diff < -PI) diff += PI_2;
    return diff;
}


float contrast(float mValue, float mScale, float mMidPoint) {
	return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);
}

float contrast(float mValue, float mScale) {
	return contrast(mValue,  mScale, .5);
}

const float NEAR = 5.0;
const float FAR = 4000.0;
//float f = 800.0;
    
float getDepth(float z, float n, float f) {
    return (2.0 * n) / (f + n - z*(f-n));
}

float cubicIn(float t) {
	return t * t * t;
}

float exponentialIn(float t) {
	return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}


void main(void) {
	vec2 uv         = vec2(aTextureCoord.x*.5, aTextureCoord.y*.5);
	vec2 uvShine    = vec2(aTextureCoord.x*.5, aTextureCoord.y*.5 + .5);
	vec4 color      = texture2D(texture, uv);
	vec4 colorNext  = texture2D(textureNext, uv);
	color 			= mix(color, colorNext, percent);

	float theta		= texture2D(texture, uvShine).r;
	float thetaNext = texture2D(textureNext, uvShine).r;
	float thetaNew 	= mix(theta, thetaNext, percent);
	if(thetaNew < theta) {
		thetaNew += PI_2;
	}
	vec4 pos        = vec4(aVertexPosition, 1.0);
	pos.xyz         = color.rgb;

	vec4 V          = uPMatrix * uMVMatrix * pos;
	gl_Position     = V;
	
	float depth     = 1.0 - getDepth(V.z/V.w, NEAR, FAR);
	float diffTheta = abs(getDiff(thetaNew, -PI));
	float a         = 0.0;

	if(diffTheta > flashingRange) a = 0.0;
	else {
		a = 1.0 - diffTheta/flashingRange;
	}

    alpha = smoothstep(0.0, 1.0, a) * .8 + .3;
    alpha *= depth;

    gl_PointSize = (1.0 + alpha * 2.0) * 1.5;

    float p = exponentialIn(revealPercent) * 2.1;
    const float range = .1;
    float uvSum = aTextureCoord.x + aTextureCoord.y;
    if(uvSum < p) opacity = 1.0;
    else if(uvSum < p + range) {
    	opacity = 1.0-(uvSum - p) / range;
	} else {
		opacity = 0.0;
	}
}