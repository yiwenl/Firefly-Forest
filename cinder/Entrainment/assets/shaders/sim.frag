uniform sampler2D   texture;

//  pulling back to center
uniform float       maxRaidus;
uniform float       gravity;
uniform float       yFloor;
uniform float       yCeiling;
uniform float       zoneRadius;
uniform float       lowThreshold;
uniform float       highThreshold;
uniform float       repelStrength;
uniform float       attractStrength;
uniform float       orientStrength;
uniform float       yVelDecrease;
uniform vec3        trees[20];

//  FLASAHING
uniform float       flashingRadius;
uniform float       catchingSpeed;
uniform float       flashingSpeed;
uniform float       maxThetaDiff;
uniform float       speedMutiplier;

//  CONSTANTS
const float PI = 3.1415926;
const float PI_2 = PI * 2.0;
const float numParticles = 64.0;
const float width = numParticles;
const float height = numParticles;


//  METHODS
float map(float value, float sx, float sy, float tx, float ty) {
    float p = (value - sx) / (sy - sx);
    p = clamp(p, 0.0, 1.0);
    return tx + (ty - tx) * p;
}


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


void main(void) {
    vec2 resolution     = vec2(numParticles*2.0, numParticles*2.0);
    vec2 uv             = gl_TexCoord[0].st;
    
    if(uv.y > .5) {
        if(uv.x < .5) {     //  POSITIONS
            vec2 uvVel      = uv + vec2(.5, .0);
            vec3 color      = texture2D(texture, uv).xyz;
            vec3 vel        = texture2D(texture, uvVel).xyz;
            color           += vel;
            gl_FragColor    = vec4(color, 1.0);
        } else {            //  VELOCITY
            vec2 uvPos      = uv - vec2(.5, .0);
            vec2 uvExtra    = uv - vec2(.5, .5);
            vec2 uvOffsets  = uv - vec2(.0, .5);
            vec3 vel        = texture2D(texture, uv).xyz;
            vec3 pos        = texture2D(texture, uvPos).xyz;
            vec3 extra      = texture2D(texture, uvExtra).xyz;
            vec3 offsets    = texture2D(texture, uvOffsets).xyz;
            float f         = 0.0;
            
            //  flocking
//            float zr = offsets.r * zoneRadius;
            float zoneRadiusSqrd = zoneRadius * zoneRadius * offsets.r;
            float dist, distSqrd, percent, threshdelta;
            vec2 uvPosParticle, uvVelParticle;
            vec3 dir, posParticle, velParticle;
            
            
            for (float y=0.0;y<height;y++) {
                for (float x=y;x<width;x++) {
                    if( (x+numParticles) == gl_FragCoord.x && y == gl_FragCoord.y) continue;
                    
                    uvPosParticle = vec2(x/resolution.x, y/resolution.y + .5);
                    posParticle = texture2D(texture, uvPosParticle).rgb;
                    dist = distance(pos, posParticle);
                    distSqrd = dist * dist;
                    
                    if(distSqrd < zoneRadiusSqrd) {
                        percent = distSqrd / zoneRadiusSqrd;
                        dir = normalize(posParticle - pos);
                        
                        if(percent < lowThreshold) {    //  separate
                            f = (lowThreshold/percent - 1.0);
                            vel -= dir * f * repelStrength * speedMutiplier;
                        } else if(percent < highThreshold) {
                            uvVelParticle = vec2(uvPosParticle.x+.5, uvPosParticle.y);
                            velParticle = texture2D(texture, uvVelParticle).rgb;
                            threshdelta = map(percent, lowThreshold, highThreshold, 0.0, 1.0);
                            vec3 avgDir = normalize((vel + velParticle) * .5);
                            f = ( 1.0 - cos( threshdelta * PI_2 ) * 0.5 + 0.5 );
                            vel += avgDir * f * orientStrength * speedMutiplier;
                        } else {    //  attract
                            threshdelta = map(percent, highThreshold, 1.0, 0.0, 1.0);
                            f = ( 1.0 - cos( threshdelta * PI_2 ) * -0.5 + 0.5 );
                            vel += dir * f * attractStrength * speedMutiplier;
                        }
                        
                    }
                }
            }

            
            float distToTree;
            vec2 dirToTree;
            const float treeRadius = 150.0;
            const float avoidStrength = .01;
            
            // checking trees
            for (int i=0; i<20; i++) {
                vec3 tree = trees[i];
                distToTree = distance(pos.xz, tree.xz);
                if(distToTree < treeRadius) {
                    f = (treeRadius - distToTree) * avoidStrength;
                    dirToTree = normalize(pos.xz - tree.xz);
                    vel.xz += dirToTree * f * speedMutiplier;
                }
            }
            
            
            //  check distance to center
            float lenPos    = length(pos.xz);
            if(lenPos > maxRaidus) {
                vec2 dirPos = normalize(pos.xz);
                f           = (lenPos - maxRaidus) * gravity;
                vel.xz      -= dirPos * f * speedMutiplier;
            }
            
            
            //  check Y
            if(pos.y < yFloor) {
                vel.y += (yFloor - pos.y) * gravity * speedMutiplier;
            } else if(pos.y > yCeiling) {
                vel.y += (yCeiling - pos.y) * gravity * .1 * speedMutiplier;
            }
            
            //  speed checking
            float speed     = length(vel);
            vec3 velDir     = normalize(vel);
            float _minSpeed = extra.y * speedMutiplier;
            float _maxSpeed = extra.z * speedMutiplier;
            if(speed < _minSpeed) {
                vel         = velDir * _minSpeed;
            } else if(speed > _maxSpeed) {
                vel         = velDir * _maxSpeed;
            }
            
            vel.y           *= yVelDecrease;
            gl_FragColor    = vec4(vel, 1.0);
        }
    } else {
        if(uv.x < .5) {     //  Flashing
            vec3 colorTheta = texture2D(texture, uv).rgb;
            vec2 uvPos = uv + vec2(0.0, .5);
//            vec2 uvOffsets = uv + vec2(0.5, .0);
            vec3 pos = texture2D(texture, uvPos).rgb;
//            vec3 offsets = texture2D(texture, uvOffsets).rgb;
            colorTheta.r += flashingSpeed;
            
            float dist;
            vec2 uvPosParticle, uvThetaParticle;
            vec3 posParticle, thetaParticle;

            for (float y=0.0;y<height;y++) {
                for (float x=0.0;x<width;x++) {
                    uvPosParticle   = vec2(x/resolution.x, y/resolution.y + .5);
                    uvThetaParticle = vec2(x/resolution.x, y/resolution.y);
                    posParticle     = texture2D(texture, uvPosParticle).rgb;
                    thetaParticle   = texture2D(texture, uvThetaParticle).rgb;
                    dist            = distance(pos, posParticle);
                    
                    if (dist < flashingRadius) {
                        float diff = getDiff(colorTheta.x, thetaParticle.x);
                        if(abs(diff) > maxThetaDiff) {
                            colorTheta.r += getSign(diff) * catchingSpeed * .1;
                        }
                    }
                }
            }
            
            
            if(colorTheta.r > PI_2) colorTheta.r -= PI_2;
            gl_FragColor = vec4(colorTheta, 1.0);


        } else {
            gl_FragColor = vec4(0.0);
        }
    }

}