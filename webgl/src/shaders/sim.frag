#define SHADER_NAME SIMULATION_FRAGMENT
precision highp float;
uniform sampler2D texture;
uniform float time;
uniform float numParticles;
varying vec2 vTextureCoord;

// const float maxRadius = 100.0;
const float maxRotSpeed = .001;
const float width = 64.0;
const float height = 64.0;

uniform float maxThreshold;
uniform float minThreshold;
uniform float maxSpeed;
uniform float minSpeed;
uniform float zoneRadius;
uniform float repelStrength;
uniform float orientStrength;
uniform float attractStrength;

uniform float flockingStrength;
uniform float noiseStrength;
uniform float posOffset;
uniform float maxRadius;
uniform float skipCount;

// const float posOffset = .05;
uniform float maxThetaDiff;
uniform float catchingSpeed;
uniform float flashingSpeed;
uniform float syncRadius;

uniform float noiseOffset;


//  add trees
const int NUM_TREES = 20;
const float PI = 3.1415926;
const float PI_2 = 3.1415926*2.0;
const float yFloor = -80.0;
const float yCeiling = 400.0;

uniform vec3 trees[NUM_TREES];

uniform float frameGap;
uniform float speedMultiplier;

//  METHODS
float getDiff(float a, float b) {
    float diff = b - a;
    if(diff > PI) diff -= PI_2;
    else if(diff < -PI) diff += PI_2;
    return diff;
}


float getTheta(float theta) {
    if(theta > PI) return theta - PI_2;
    else if(theta < -PI) return theta + PI_2;
    else return theta;
}

float getSign(float value) {
    if(value > 0.0) return 1.0;
    else if (value < 0.0) return -1.0;
    else return 0.0;
}

float map(float value, float sx, float sy, float tx, float ty) {
    float p = (value - sx) / (sy - sx);
    p = clamp(p, 0.0, 1.0);
    return tx + (ty - tx) * p;
}



void main(void) {
    vec2 resolution = vec2(numParticles*2.0, numParticles*2.0);
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    if(vTextureCoord.y < .5) {
        if(vTextureCoord.x < .5) {
            vec3 pos = texture2D(texture, uv).rgb;
            vec2 uvVel = vec2(uv.x + .5, uv.y);
            vec3 vel = texture2D(texture, uvVel).rgb;
            pos += vel*speedMultiplier;
            gl_FragColor = vec4(pos, 1.0);
        } else {
            vec3 vel      = texture2D(texture, uv).rgb;
            vec2 uvPos    = vec2(uv.x - .5, uv.y);
            vec2 uvExtra  = vec2(uv.x - .5, uv.y + .5);
            vec2 uvOffset = vec2(uv.x, uv.y + .5);
            vec3 pos      = texture2D(texture, uvPos).rgb;
            vec3 extra    = texture2D(texture, uvExtra).rgb;
            vec3 offset   = texture2D(texture, uvOffset).rgb;
            float radiusOffset = mix(offset.g, 1.0, noiseOffset);

            // float distSqrd = 0.0;
            float zoneRadiusSqrd = zoneRadius * zoneRadius * radiusOffset;
            float f = 0.0;
            float dist, distSqrd, percent, threshdelta;
            vec2 uvPosParticle, uvVelParticle;
            vec3 dir, posParticle, velParticle;

            for (float y=0.0;y<height;y++) {
                for (float x=0.0;x<width;x++) {
                    if( (x+numParticles) == gl_FragCoord.x && y == gl_FragCoord.y) continue;

                    uvPosParticle = vec2(x/resolution.x, y/resolution.y);
                    posParticle = texture2D(texture, uvPosParticle).rgb;
                    dist = distance(pos, posParticle);
                    
                    if(dist > 0.0) {
                        distSqrd = dist * dist;
                        if(distSqrd < zoneRadiusSqrd) {
                            percent = distSqrd / zoneRadiusSqrd;
                            dir = posParticle - pos;
                            dir = normalize(dir);

                            if(percent < minThreshold) {    //  separate
                                f = (minThreshold/percent - 1.0);
                                vel -= dir * f * repelStrength;
                            } else if(percent < maxThreshold) {
                                uvVelParticle = vec2(uvPosParticle.x+.5, uvPosParticle.y);
                                velParticle = texture2D(texture, uvVelParticle).rgb;
                                threshdelta = map(percent, minThreshold, maxThreshold, 0.0, 1.0);

                                vec3 avgDir = (vel + velParticle) * .5;
                                if(length(avgDir) > 0.0) {
                                    avgDir = normalize(avgDir);
                                    float f = ( 1.0 - cos( threshdelta * PI_2 ) * 0.5 + 0.5 );
                                    vel += avgDir * f * orientStrength;
                                }
                            } else {    //  attract
                                threshdelta = map(percent, maxThreshold, 1.0, 0.0, 1.0);
                                f = ( 1.0 - cos( threshdelta * PI_2 ) * -0.5 + 0.5 );
                                vel += dir * f * attractStrength;
                            }

                        }    
                    }
                    
                }
            }


            float distToTree;
            vec2 dirToTree;
            const float treeRadius = 150.0;
            const float avoidStrength = .01;

            //  avoiding trees
            for(int i=0; i<NUM_TREES; i++) {
                vec3 tree = trees[i];
                dirToTree = pos.xz-tree.xy;
                distToTree = length(dirToTree);

                if(distToTree > 0.0) {
                    if( distToTree < treeRadius) {
                        dirToTree = normalize(dirToTree);
                        float f = (treeRadius - distToTree) * avoidStrength;
                        vel.xz += dirToTree * f ;
                    }
                }
            }

            
            float gravity = .005 * skipCount;

            float lenPos    = length(pos.xz);
            if(lenPos > maxRadius) {
                vec2 dirPos = normalize(pos.xz);
                f           = (lenPos - maxRadius) * gravity;
                vel.xz      -= dirPos * f;
            }


            //  y check
            if(pos.y < yFloor) {
                vel.y += (yFloor - pos.y) * gravity;
            } else if(pos.y > yCeiling) {
                vel.y += (yCeiling - pos.y) * gravity * .1;
            }

            
            float speed = length(vel);
            float _minSpeed = extra.y;
            float _maxSpeed = extra.z;
            if(speed > _maxSpeed) {
                vel = normalize(vel) * _maxSpeed;
            } else if(speed < _minSpeed) {
                vel = normalize(vel) * _minSpeed;
            }

            // vel.y           *= .996;
            vel.y *= (1.0 - offset.z * .01);
            gl_FragColor = vec4(vel, 1.0);
        }    
    } else {
        if(vTextureCoord.x < .5) { 
            vec3 colorTheta = texture2D(texture, uv).rgb;
            vec2 uvCurrPos = vec2(uv.x, uv.y-.5);
            vec2 uvCurrOffset = vec2(uv.x+.5, uv.y);
            vec3 posCurr = texture2D(texture, uvCurrPos).rgb;
            vec3 offsetCurr = texture2D(texture, uvCurrOffset).rgb;
            float flashingOffset = mix(offsetCurr.r, 1.0, noiseOffset);
            colorTheta.r += flashingSpeed * flashingOffset;
            float dist = 0.0;

            vec2 uvPosParticle, uvThetaParticle;
            vec3 posParticle, thetaParticle;
            

            for (float y=0.0;y<height;y++) {
                for (float x=0.0;x<width;x++) {
                    if( x == gl_FragCoord.x && (y+numParticles) == gl_FragCoord.y) continue;
                    uvThetaParticle  = vec2(x/resolution.x, y/resolution.y + .5);
                    uvPosParticle    = vec2(x/resolution.x, y/resolution.y);
                    posParticle      = texture2D(texture, uvPosParticle).rgb;
                    thetaParticle    = texture2D(texture, uvThetaParticle).rgb;
                    dist             = distance(posCurr, posParticle);

                    if(dist < syncRadius) {
                        float diff = getDiff(colorTheta.x, thetaParticle.x);
                        if(abs(diff) > maxThetaDiff) {
                            colorTheta.r += getSign(diff) * catchingSpeed * .1;
                        }
                    }
                }
            }
            if(colorTheta.x > PI_2) colorTheta.x -= PI_2;
            gl_FragColor = vec4(colorTheta, 1.0);
        } else {
            gl_FragColor = texture2D(texture, uv);
        }
    }
    
}