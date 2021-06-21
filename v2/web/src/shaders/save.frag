#version 300 es

precision highp float;
in vec3 vPosition;
in vec3 vNormal;
in vec3 vData;

layout (location = 0) out vec4 oFragColor0;
layout (location = 1) out vec4 oFragColor1;
layout (location = 2) out vec4 oFragColor2;
layout (location = 3) out vec4 oFragColor3;

vec3 _normalize(vec3 v) {
    if(length(v) <= 0.0) {
        return vec3(0.0);
    } else {
        return normalize(v);
    }
}

void main(void) {
    vec3 vel = _normalize(vNormal.yxz - vData.yxz) * 0.01;
    oFragColor0 = vec4(vPosition, 1.0);
    oFragColor1 = vec4(vel, 1.0);
    oFragColor2 = vec4(vNormal, 1.0);
    oFragColor3 = vec4(vData, 1.0);
}