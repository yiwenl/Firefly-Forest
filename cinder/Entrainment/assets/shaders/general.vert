uniform vec3 position;
uniform vec3 scale;

void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;
    
    pos.xyz         *= scale;
    pos.xyz         += position;

    gl_Position     = gl_ModelViewProjectionMatrix * pos;
}