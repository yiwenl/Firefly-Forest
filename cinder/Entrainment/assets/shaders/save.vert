varying vec4 vColor;

void main() {
    vec2 pos        = gl_MultiTexCoord0.st;

    gl_Position     = gl_ModelViewProjectionMatrix * vec4(pos, 0.0, 1.0);
    
    vColor          = vec4(gl_Vertex.xyz, 1.0);
}