#define SHADER_NAME SAVING_FRAGMENT

precision highp float;
varying vec3 vColor;

void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
}