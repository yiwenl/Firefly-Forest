#define SHADER_NAME VERTEX_TREE



precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;


varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;
varying float vDeferLight;
uniform float flashingRange;


const float NEAR = 5.0;
const float FAR = 4000.0;
//float f = 800.0;



//	DEFER LIGHTING
uniform sampler2D textureParticles;

const float numParticles = 64.0;
const float width = numParticles;
const float height = numParticles;

const float PI = 3.1415926;
const float PI_2 = 3.1415926*2.0;

float getDiff(float a, float b) {
    float diff = b - a;
    if(diff > PI) diff -= PI_2;
    else if(diff < -PI) diff += PI_2;
    return diff;
}

	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {

	vec3 finalPos   = aVertexPosition + aPosOffset;
	vec4 V          = (uPMatrix * uMVMatrix) * vec4(finalPos, 1.0);
	gl_Position     = V;
	vVertexPosition = finalPos;
	vTextureCoord   = aTextureCoord;
	vNormal   		= normalize(vec3(aVertexPosition.x, 0.0, aVertexPosition.z));
	vDepth          = 1.0 - getDepth(V.z/V.w, NEAR, FAR);


	vec2 resolution     = vec2(numParticles*2.0, numParticles*2.0);
	vec2 uvPosParticle, uvThetaParticle;
	vec3 posParticle, dirParticle;
	float dist, theta;

	const float MIN_DIST = 400.0;
    const float PARTICLE_LIGHT_STRENGTH = .35;
    const float skip = 2.0;
    float light     = .0;
    /*
    for (float y=0.0;y<height;y+=skip) {
        for (float x=0.0;x<width;x+=skip) {
            uvPosParticle = vec2(x/resolution.x, y/resolution.y)*.5;
            posParticle = texture2D(textureParticles, uvPosParticle).rgb;
            

            dirParticle = normalize(posParticle - finalPos.xyz);
            dist = distance(finalPos.xyz, posParticle);
            if(dist < MIN_DIST) {
            	uvThetaParticle = uvPosParticle + vec2(0.0, .5);
            	theta = texture2D(textureParticles, uvThetaParticle).r;
            	float diffTheta = abs(getDiff(theta, -PI));
            	float a         = 0.0;

            	if(diffTheta > flashingRange) a = 0.0;
            	else {
            		a = 1.0 - diffTheta/flashingRange;
            	}

                light += pow((1.0 - dist / MIN_DIST) * PARTICLE_LIGHT_STRENGTH * max(dot(dirParticle, vNormal), 0.0), 3.0) * a;
            }
        }
    }*/

    vDeferLight = light;
}