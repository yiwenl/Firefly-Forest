varying vec2 vGloabalUV;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;

uniform vec3 lightPos;
uniform vec3 eyePos;
uniform sampler2D textureBump;


uniform float bumpOffset;
uniform float spakleStrength;
uniform float noiseSandUVScale;
uniform float specularLightStrength;
uniform float diffuseLightStrength;
uniform vec3 diffuseColor;


const vec3 spotLightPos = vec3(0.0, 2000.0, 0.0);
const vec3 spotLightDirection = vec3(0.0, -1.0, 0.0);
uniform float spotLightShiness;
uniform float spotlightRadius;
uniform float spotLightStrength;



const vec3 ambientColor     = vec3(10.0/255.0, 9.0/255.0, 15.0/255.0) * .01;
const vec3 specularColor    = vec3(1.0);
const vec3 spotlightColor   = vec3(1.0);
const float shininess       = 25.0;
const float screenGamma     = 2.0; // Assume the monitor is calibrated to the sRGB color space

const float PI              = 3.141592657;
const vec2 CENTER           = vec2(.5);

float contrast(float mValue, float mScale, float mMidPoint) {	return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);	}
float contrast(float mValue, float mScale) {return contrast(mValue,  mScale, .5);}
vec3 contrast(vec3 mValue, float mScale, float mMidPoint) {return vec3( contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint), contrast(mValue.b, mScale, mMidPoint) );}
vec3 contrast(vec3 mValue, float mScale) {return contrast(mValue, mScale, .5);}
float saturate(float value) {return clamp(value, 0.0, 1.0);}
vec3 saturate(vec3 value) {return clamp(value, 0.0, 1.0);}
float Noise3D(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
vec3 gammaCorrection(vec3 color) {return pow(color, vec3(1.0 / 2.2));}

void main(void) {
    vec2 texCoord   = gl_TexCoord[0].st;
    vec3 color      = ambientColor;
    vec3 diffuse    = vec3(0.0);
    vec3 specular   = vec3(0.0);
    vec3 spot       = vec3(0.0);
    
    vec3 noiseSand = texture2D(textureBump, texCoord * noiseSandUVScale).rgb;
    noiseSand = noiseSand * 2.0 - 1.0;
    vec3 normal = normalize(vNormal + noiseSand * bumpOffset);
    vec3 normalOrg = normalize(vNormal);
    vec3 lightDir = normalize(lightPos);
    vec3 dirToEye = normalize(eyePos - vVertexPosition);
    
    float lambertian = max(dot( normal , lightDir ), 0.0);
    if(lambertian > 0.0) {
        
        //	DIFFUSE LIGHT
        diffuse = diffuseColor * lambertian * diffuseLightStrength;
        
        
        //	SPECULAR LIGHT
        vec3 vertexToLight = normalize(lightPos - vVertexPosition);
        vec3 lightReflect = normalize(reflect(-vertexToLight, normal));
        float specularFactor = max(dot(dirToEye, lightReflect), 0.0);
        
        if(specularFactor > 0.0) {
            specularFactor = pow(specularFactor, shininess);
            specular = specularColor * specularFactor * lambertian * specularLightStrength;
        }
    }
    
    
    //	SPOT LIGHT
    vec3 dirToSpotLight = normalize(vVertexPosition - spotLightPos);
    vec3 dirSpotlight = normalize(spotLightDirection);
    float spotlightFactor = dot(dirSpotlight, dirToSpotLight);
    
    if(spotlightFactor > spotlightRadius) {
        spotlightFactor = (spotlightFactor-spotlightRadius) / ( 1.0 - spotlightRadius);
        if(spotlightFactor > 0.0) {
            spotlightFactor = pow(spotlightFactor, spotLightShiness);
            float lambertianSpotLight = max(dot(normalize(spotLightPos - vVertexPosition), normal), 0.0);
            spotlightFactor *= lambertianSpotLight;
            spot = spotlightColor * spotlightFactor * spotLightStrength;
        }
    }
    
    vec3 sparkle = vec3(0.0);
    float specBase = saturate(dot(reflect(-dirToEye, normal), lightDir));
    vec3 fp = fract(0.7 * vVertexPosition + 9. * Noise3D( vVertexPosition.xz * 1.0) + 0.1 * dirToEye);
    fp *= (1.0 - fp);
    float glitter = saturate(1.0 - 5.0 * (fp.x + fp.y + fp.z));
    sparkle = vec3(glitter * pow(specBase, 1.5)) * spakleStrength;
    
    color += diffuse + specular + sparkle + spot;
    float t = min(distance(vGloabalUV, CENTER) / .65, 1.0);
    t = cos(t * PI * .5);
    color *= t;
    color = mix(color, diffuse*t, 1.0 - vDepth);
    gl_FragColor = vec4(color, 1.0);
    //    gl_FragColor = vec4(noiseSand, 1.0);
}