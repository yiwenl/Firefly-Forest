void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;

    gl_Position     = gl_ModelViewProjectionMatrix * pos;
//    gl_PointSize    = 10.0;
}