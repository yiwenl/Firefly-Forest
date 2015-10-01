void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    float b = 0.0;
    if(texCoord.y >= 1.0) b = 1.0;
    gl_FragColor = vec4(texCoord.y, 0.0, b, 1.0);
}