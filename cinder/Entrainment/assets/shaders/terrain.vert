uniform vec3 position;
uniform vec2 uvOffset;
uniform float height;
uniform float numTiles;

uniform sampler2D texture;
uniform sampler2D textureNormal;


varying vec2 vGloabalUV;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;

const float NEAR = 5.0;
const float FAR = 4000.0;

float getDepth(float z, float n, float f) {
    return (2.0 * n) / (f + n - z*(f-n));
}

void main() {
    gl_FrontColor       = gl_Color;
    gl_TexCoord[0]      = gl_MultiTexCoord0;
    vec4 pos            = gl_Vertex;
    
    vec2 uv             = gl_TexCoord[0].st / numTiles;
    uv                  += uvOffset;
    vGloabalUV          = uv;
    
    vec3 colorHeight    = texture2D(texture, uv).rgb;
    pos.y               += length(colorHeight) * height - height;
    pos.rgb             += position;
    
    vec4 V              = gl_ModelViewProjectionMatrix * pos;
    gl_Position         = V;
    
    vDepth              = 1.0 - getDepth(V.z/V.w, NEAR, FAR);
    vNormal             = (texture2D(textureNormal, uv).rgb-.5) * 2.0;
    vVertexPosition     = pos.rgb;
}