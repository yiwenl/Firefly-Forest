float map(float value, float sx, float sy, float tx, float ty) {
    float p = (value - sx) / ( sy - sx);
    return tx + p * ( ty - tx);
}


float hash( vec2 p ) {
    float h = dot(p,vec2(127.1,311.7));
    return fract(sin(h)*43758.5453123);
}

float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
                             hash( i + vec2(1.0,0.0) ), u.x),
                        mix( hash( i + vec2(0.0,1.0) ),
                            hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float contrast(float mValue, float mScale, float mMidPoint) {
    return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);
}

float contrast(float mValue, float mScale) {
    return contrast(mValue,  mScale, .5);
}

vec2 contrast(vec2 mValue, float scale) {
    return vec2(contrast(mValue.x, scale), contrast(mValue.y, scale));
}


mat2 rotate(in float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, s, -s, c);
}


const float RX = 1.6;
const float RY = 1.2;
const mat2 rotation = mat2(RX,RY,-RY,RX);
const int NUM_ITER = 10;
const float PI = 3.141592657;

uniform float time;
uniform float noiseScale;
uniform	float noiseOffset;
uniform	float detailMapScale;
uniform	float detailMapHeight;
uniform sampler2D texture;

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    float offset = 5.000;
    vec2 uv = vec2(.5) + rotate(time) * (texCoord - vec2(.5)) + sin(time+cos(time)) * .01;
    vec3 detail = texture2D(texture, texCoord * detailMapScale).rgb * detailMapHeight;
    float grey = 0.0;
    
    float scale = noiseScale;
    for(int i=0; i<NUM_ITER; i++) {
        grey += noise(uv*offset) * scale;
        offset *= 1.5 * noiseOffset;
        scale *= 0.6 * noiseOffset;
        uv *= rotation;
    }
    
    float p = sin(texCoord.x * PI) * sin(texCoord.y * PI);
    p = pow(p, 1.5);
    grey = mix(grey, -p, .25);
    
//    gl_FragColor = vec4(vec3(grey), 1.0);
    gl_FragColor = vec4(vec3(grey)+detail*p, 1.0);
//    gl_FragColor = vec4(detail, 1.0);
}