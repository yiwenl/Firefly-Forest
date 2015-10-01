uniform sampler2D texture;
uniform float flashingRange;
varying vec4 vColor;

const float PI = 3.1415926;
const float PI_2 = 3.1415926*2.0;

float getDiff(float a, float b) {
    float diff = b - a;
    if(diff > PI) diff -= PI_2;
    else if(diff < -PI) diff += PI_2;
    return diff;
}


const float NEAR = 5.0;
const float FAR = 4000.0;

float getDepth(float z, float n, float f) {
    return (2.0 * n) / (f + n - z*(f-n));
}


void main() {
    vec2 uv             = gl_MultiTexCoord0.st;
    uv                  *= .5;
    uv.y                += .5;
    
    vec2 uvTheta        = uv - vec2(0.0, 0.5);
    vec4 pos            = gl_Vertex;
    vec3 colorPos       = texture2D(texture, uv).xyz;
    float theta         = texture2D(texture, uvTheta).x;
    
    pos.xyz             = colorPos;
    
    vec4 V              = gl_ModelViewProjectionMatrix * pos;
    gl_Position         = V;
    
    
    float diffTheta     = abs(getDiff(theta, -PI));
    
    float a             = 0.0;
    if(diffTheta > flashingRange) a = 0.0;
    else {
        a = 1.0 - diffTheta/flashingRange;
    }
    
    float depth         = mix(1.0 - getDepth(V.z/V.w, NEAR, FAR), 1.0, .8);
    float alpha         = smoothstep(0.0, 1.0, a) * .8 + .3;
//    if(uv.x >= .25 || uv.y < .75) alpha = 0.0;
    
    vColor              = vec4(vec3(1.0), alpha);
    gl_PointSize        = (1.0 + alpha * 2.0) * 1.5 * depth;
}