uniform sampler2D   texture;

varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;
varying float vDeferLight;

uniform vec3 lightPos;
uniform vec3 eyePos;
uniform vec3 diffuseColor;
uniform float treeDiffuseLightStrength;
uniform float specularLightStrength;


const vec3 ambientColor = vec3(10.0/255.0, 9.0/255.0, 15.0/255.0) * .5;
//const vec3 diffuseColor = vec3(42.0/255.0, 42.0/255.0, 42.0/255.0) * 2.25;
const vec3 specularColor = vec3(1.0) * .25;
const float shininess = 2.0;
const float screenGamma = 2.0; // Assume the monitor is calibrated to the sRGB color space

float map(float value, float sx, float sy, float tx, float ty) {
    float p = (value - sx) / (sy - sx);
    p = clamp(p, 0.0, 1.0);
    return tx + p * ( ty - tx);
}

void main(void) {
    vec2 uv = gl_TexCoord[0].st;
    vec2 treeUV = vec2(uv.x*2.0, uv.y);
    vec3 treeNormal = texture2D(texture, treeUV).rgb;
    treeNormal = (treeNormal- .5) * 2.0;
    
    vec3 normal = normalize(vNormal + treeNormal*.25);
    vec3 lightDir = normalize(lightPos);
    vec3 dirToEye = normalize(eyePos - vVertexPosition);
    
    vec3 color = ambientColor;
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);
    
    
    float lambertian = max(dot( normal , lightDir ), 0.0);
    if(lambertian > 0.0) {
        
        //	DIFFUSE LIGHT
        diffuse = diffuseColor * lambertian * treeDiffuseLightStrength;
        
        // //	SPECULAR LIGHT
        vec3 vertexToLight = normalize(lightPos - vVertexPosition);
        vec3 lightReflect = normalize(reflect(-vertexToLight, normal));
        float specularFactor = max(dot(dirToEye, lightReflect), 0.0);
        
        if(specularFactor > 0.0) {
            specularFactor = pow(specularFactor, shininess);
            specular = specularColor * specularFactor * lambertian * specularLightStrength;
        }		
    }
    
    color += diffuse + specular;
    float heightOffset = 1.0;
    const float heightThreshold = .85;
    if(uv.y > heightThreshold) {
        heightOffset = map(uv.y, heightThreshold, 1.0, 1.0, 0.0);
    }
    
    float depthOffset = pow(clamp(vDepth+.35, 0.0, 1.0), 6.0);
    color *= depthOffset;
    color += vec3(vDeferLight);
    
    gl_FragColor = vec4(color, 1.0);
    gl_FragColor *= heightOffset;
//    gl_FragColor = vec4( (normal+1.0) * .5, 1.0);
}