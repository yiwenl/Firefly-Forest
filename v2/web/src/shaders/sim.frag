#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uVelMap;
uniform sampler2D uExtraMap;
uniform sampler2D uDataMap;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uModelViewMatrixInverse;

uniform float uTime;
uniform float uMaxRadius;
uniform int uNum;

layout (location = 0) out vec4 oFragColor0;
layout (location = 1) out vec4 oFragColor1;
layout (location = 2) out vec4 oFragColor2;
layout (location = 3) out vec4 oFragColor3;

#pragma glslify: curlNoise = require(glsl-utils/curlNoise.glsl)

float map(float v, float a, float b, float c, float d) {
    float p = (v - a) / ( b - a);
    return c + ( d - c) * p;
}

vec3 _normalize(vec3 v) {
    if(length(v) <= 0.0) {
        return vec3(0.0);
    } else {
        return normalize(v);
    }
}

#define radius 3.0
#define minThres 0.1
#define maxThres 0.7

#define PI 3.141592653
#define PI2 PI * 2.0



void main(void) {
    vec3 pos = texture(uPosMap, vTextureCoord).xyz;
    vec3 vel = texture(uVelMap, vTextureCoord).xyz;
    vec3 extra = texture(uExtraMap, vTextureCoord).xyz;
    vec3 data = texture(uDataMap, vTextureCoord).xyz;

    vec3 dirSelf = _normalize(vel);
    float cycle = data.x;

    // force
    vec3 acc = vec3(0.0);

    // noise
    vec3 noise = curlNoise(pos * 0.2 + uTime * 0.05);
    noise.y += extra.y * 0.5;
    acc += noise * 0.5;
    acc.y += noise.y * 0.5;

    vec2 uvParticle;
    vec3 posParticle, dirParticle, dir;
    float dist, t, p, f, _radius, cycleParticle, diff;

    float num = float(uNum);
    _radius = radius * mix(0.5, 2.0, extra.x) * 0.5;

    float cycleSync = 0.0;
    

    for(int i=0 ; i<uNum; i++) {
        for(int j=0 ; j<uNum; j++) {
            uvParticle = vec2(float(i) / num, float(j) / num);

            
            posParticle = texture(uPosMap, uvParticle).xyz;
            dist = distance(posParticle, pos);

            if(dist > 0.0 && dist < _radius) {

                // getting particle data
                cycleParticle = texture(uDataMap, uvParticle).x;
                dirParticle = _normalize(texture(uVelMap, uvParticle).xyz);
                dir = normalize(pos - posParticle);

                p = dist / radius;

                // repel
                f = smoothstep(minThres, 0.0, p);
                acc += dir * f;

                // pulling
                f = smoothstep(maxThres, 1.0, p);
                acc -= dir * f * 0.001;

                // alignment
                dir = _normalize(dirSelf + dirParticle);
                f = smoothstep(minThres, maxThres, p);
                f = sin(f * PI);
                acc += dir * f * 0.01;
            }

            // Entrainment
            if(dist > 0.0 && dist < _radius * 0.3) {

                diff = cycleParticle - cycle;
                if(diff > PI) {
                    diff -= PI2;
                } 
                if(diff < -PI) {
                    diff += PI2;
                }
                cycleSync += diff;
            }
        }
    }

    // pulling back to center
    dist = length(pos.xz);
    f = smoothstep(uMaxRadius * 0.25, uMaxRadius * 0.8, dist);
    dir = _normalize(vec3(pos.x, 0.0, pos.z));
    acc -= dir * f;    

    f = smoothstep(0.2, 0.0, pos.y);
    acc.y += f * mix(0.5, 1.0, data.y);

    f = smoothstep(0.5, 3.5, pos.y);
    acc.y -= f * mix(0.5, 1.0, data.z);

    acc.y *= 0.5;

    float speedOffset = mix(1.0, 2.0, extra.y);
    vel += acc * 0.0001 * speedOffset * 32.0 / num;

    pos += vel;
    vel *= 0.956;

    // write back cycle
    cycle += (mix(0.1, 0.12, extra.z) + cycleSync * 0.0005 * mix(0.5, 1.0, extra.x)) * 0.5;
    cycle = mod(cycle, PI * 2.0);
    data.x = cycle;


    oFragColor0 = vec4(pos, 1.0);
    oFragColor1 = vec4(vel, 1.0);
    oFragColor2 = vec4(extra, 1.0);
    oFragColor3 = vec4(data, 1.0);
}