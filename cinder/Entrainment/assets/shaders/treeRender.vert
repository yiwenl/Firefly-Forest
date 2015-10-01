attribute vec3 posOffset;

varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;
varying float vDeferLight;
//uniform sampler2D   textureParticles;
//uniform float particleLightStrength;

const float NEAR = 5.0;
const float FAR = 4000.0;

const float numParticles = 64.0;
const float width = numParticles;
const float height = numParticles;


float getDepth(float z, float n, float f) {
    return (2.0 * n) / (f + n - z*(f-n));
}
void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;
    
    pos.xyz         += posOffset;

    vec4 V          = gl_ModelViewProjectionMatrix * pos;
    gl_Position     = V;
    
    vVertexPosition = pos.xyz;
    vNormal   		= normalize(vec3(gl_Vertex.x, 0.0, gl_Vertex.z));
    vDepth          = 1.0 - getDepth(V.z/V.w, NEAR, FAR);
    
    
//    float light     = .0;
//
//    vec2 resolution     = vec2(numParticles*2.0, numParticles*2.0);
//    vec2 uvPosParticle;
//    vec3 posParticle, dirParticle;
//    float dist;
    
//    const float MIN_DIST = 400.0;
//    const float PARTICLE_LIGHT_STRENGTH = .45;
//    const float skip = 5.0;
//    
//    for (float y=0.0;y<height;y+=skip) {
//        for (float x=0.0;x<width;x+=skip) {
//            uvPosParticle = vec2(x/resolution.x, y/resolution.y + .5);
//            posParticle = texture2D(textureParticles, uvPosParticle).rgb;
//            dirParticle = normalize(posParticle - pos.xyz);
//            dist = distance(pos.xyz, posParticle);
//            if(dist < MIN_DIST) {
//                light += pow((1.0 - dist / MIN_DIST) * PARTICLE_LIGHT_STRENGTH * max(dot(dirParticle, vNormal), 0.0), 3.0);
//            }
//        }
//    }
    
    vDeferLight = .0;
}