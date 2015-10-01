#define SHADER_NAME NORMAL_FRAGMENT

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float scale;

vec3 getPos(vec2 uv) {
    vec3 pos = vec3(.0);
	pos.y = texture2D(texture, uv).r * scale;
    pos.xz = uv;
    
    return pos;
}

void main(void) {
    const float gap = .01;
    vec2 uvRight = vTextureCoord + vec2(gap, .0);
    vec2 uvBottom = vTextureCoord + vec2(0.0, gap);
    
    vec3 posCurr = getPos(vTextureCoord);
    vec3 posRight = getPos(uvRight);
    vec3 posBottom = getPos(uvBottom);
    
    vec3 vRight = posRight - posCurr;
    vec3 vBottom = posBottom - posCurr;
    
    // vec3 normal = normalize(cross(vRight, vBottom));
    vec3 normal = normalize(cross(vBottom, vRight));
    // normal = (normal + 1.0) * .5;
    // normal.g *= 0.;
    
    gl_FragColor = vec4(normal, 1.0);
}
