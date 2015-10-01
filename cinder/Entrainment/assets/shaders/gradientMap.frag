uniform sampler2D texture;
uniform sampler2D textureMap;

const float RADIUS = 0.5;
const float SOFTNESS = 0.35;

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    
    vec4 colorOrg = texture2D(texture, texCoord);
    vec4 colorGradientMap = texture2D(textureMap, texCoord);
    vec3 color = clamp(colorOrg.rgb*colorOrg.a, 0.005, 1.0);
    float maxLength = length(vec3(1.0));
    float leng = length(color)/maxLength;
    vec2 uv = vec2(leng, 0.0);
    vec3 colorMapped = texture2D(textureMap, uv).rgb;
    
    float len = distance(texCoord, vec2(.5));
    float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);
    
    gl_FragColor = vec4(colorMapped, 1.0);
//    gl_FragColor = colorGradientMap;
}