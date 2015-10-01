uniform sampler2D   texture;
uniform float exposure;

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    vec4 color = texture2D(texture, texCoord);
    color.rgb *= exposure;
    color.rgb = color.rgb/(1.0 + color.rgb);
    vec3 retColor = color.rgb;
    gl_FragColor = vec4(retColor, 1.0);
}