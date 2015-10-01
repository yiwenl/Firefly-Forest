
uniform sampler2D texture;
uniform float scale;

vec3 getPos(vec2 uv) {
    vec3 pos = vec3(.0);
    pos.y = texture2D(texture, uv).r * scale;
    pos.xz = uv;
    
    return pos;
}

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    const float gap = .01;
    vec2 uvRight = texCoord + vec2(gap, .0);
    vec2 uvBottom = texCoord + vec2(0.0, gap);
    
    vec3 posCurr = getPos(texCoord);
    vec3 posRight = getPos(uvRight);
    vec3 posBottom = getPos(uvBottom);
    
    vec3 vRight = posRight - posCurr;
    vec3 vBottom = posBottom - posCurr;
    
    // vec3 normal = normalize(cross(vRight, vBottom));
    vec3 normal = normalize(cross(vBottom, vRight));
//    normal.y *= .1;
//    normal = normalize(normal);
    // normal = (normal + 1.0) * .5;
    // normal.g *= 0.;
    
    gl_FragColor = vec4(normal, 1.0);
}
