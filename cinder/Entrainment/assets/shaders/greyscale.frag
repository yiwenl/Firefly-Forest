uniform sampler2D   texture;

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    gl_FragColor = texture2D(texture, texCoord);
    float grey = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
    gl_FragColor.rgb = vec3(grey);
}