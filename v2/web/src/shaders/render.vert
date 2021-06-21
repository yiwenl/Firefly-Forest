#version 300 es

precision highp float;
in vec3 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uPosMap;
uniform sampler2D uDataMap;
uniform vec2 uViewport;

out vec3 vColor;

const float radius = 0.02;
#pragma glslify: particleSize = require(glsl-utils/particleSize.glsl)

#define PI 3.141592653

#define YELLOW vec3(1.0)
// #define YELLOW vec3(202.0, 187.0, 55.0)/255.0

void main(void) {
    vec3 pos = texture(uPosMap, aVertexPosition.xy).xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport, radius) * mix(1.0, 2.0, aVertexPosition.z);

    vec3 data = texture(uDataMap, aVertexPosition.xy).rgb;
    float cycle = data.x;

    float g = abs(cycle - PI);
    g = smoothstep(0.7, 0.2, g);
    g = sin(g * PI * 0.5);

    g = mix(g, 1.0, .3);

    vColor = vec3(g) * YELLOW * 1.2;
}