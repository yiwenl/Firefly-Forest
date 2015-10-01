uniform sampler2D   texture;
uniform float opacity;

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    gl_FragColor = texture2D(texture, texCoord);
    gl_FragColor.a *= opacity;
}