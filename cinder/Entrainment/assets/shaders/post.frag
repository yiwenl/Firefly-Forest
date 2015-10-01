uniform sampler2D   texture;
uniform sampler2D   textureGradient;
uniform float exposure;

const float RADIUS = 0.8;
const float SOFTNESS = 0.4;

void main(void) {
    vec2 texCoord       = gl_TexCoord[0].st;
    vec4 colorOrg       = texture2D(texture, texCoord);
    vec3 color          = clamp(colorOrg.rgb, 0.005, .9975);
//    vec3 color          = colorOrg.rgb;
    float maxLength     = length(vec3(1.0));
    float leng          = length(color)/maxLength;
    vec2 uv             = vec2(leng, 0.0);
    vec3 colorMapped    = texture2D(textureGradient, uv).rgb;
    colorMapped         = mix(colorMapped, color, .1);
    
    //  Tone Mapping
    colorMapped.rgb     *= exposure;
    colorMapped.rgb     = colorMapped.rgb/(1.0 + colorMapped.rgb);
    
    
    float len           = distance(texCoord, vec2(.5));
    float vignette      = smoothstep(RADIUS, RADIUS-SOFTNESS, len);
    colorMapped.rgb     *= vignette;
    
    gl_FragColor        = vec4(colorMapped, 1.0);
}