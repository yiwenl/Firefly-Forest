// tree.frag

#define SHADER_NAME FRAGMENT_TREE

precision highp float;

uniform vec3 lightPos;
uniform vec3 eyePos;
uniform vec3 spotLightPos;
uniform float showSpecularLight;
uniform float treeDiffuseLightStrendght;
uniform float specularLightStrendght;
uniform float spotLightStrength;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertexPosition;
varying float vDepth;
varying float vDeferLight;

uniform sampler2D texture;

const vec3 ambientColor = vec3(10.0/255.0, 9.0/255.0, 15.0/255.0) * .5;
const vec3 diffuseColor = vec3(1.0, 1.0, .95);
const vec3 specularColor = vec3(1.0) * .25;
const vec3 spotlightColor = vec3(1.0);
const float shininess = 2.0;
const float screenGamma = 2.0; // Assume the monitor is calibrated to the sRGB color space

//	SPOT LIGHT
const vec3 spotLightDirection = vec3(0.0, -1.0, 0.0);
uniform float spotLightShiness;
uniform float spotlightRadius;

float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / (sy - sx);
	p = clamp(p, 0.0, 1.0);
	return tx + p * ( ty - tx);
}

void main(void) {
	vec2 uv = vTextureCoord;
	// uv.y /= 10.0;
	vec3 treeNormal = texture2D(texture, uv).rgb;
	treeNormal = (treeNormal- .5) * 2.0;

	vec3 normal = normalize(vNormal + treeNormal);
	vec3 lightDir = normalize(lightPos);
	vec3 dirToEye = normalize(eyePos - vVertexPosition);

	vec3 color = ambientColor;
	vec3 diffuse = vec3(0.0);
	vec3 specular = vec3(0.0);
	vec3 spot = vec3(0.0);

	float lambertian = max(dot( normal , lightDir ), 0.0);
	if(lambertian > 0.0) {

		//	DIFFUSE LIGHT
		diffuse = diffuseColor * lambertian * treeDiffuseLightStrendght;

		// //	SPECULAR LIGHT
		vec3 vertexToLight = normalize(lightPos - vVertexPosition);
		vec3 lightReflect = normalize(reflect(-vertexToLight, normal));
		float specularFactor = max(dot(dirToEye, lightReflect), 0.0);
		
		if(specularFactor > 0.0 && showSpecularLight > 0.0) {
			specularFactor = pow(specularFactor, shininess);
			specular = specularColor * specularFactor * lambertian * specularLightStrendght;
		}		
	}

	// //	SPOT LIGHT
	// vec3 dirToSpotLight = normalize(vVertexPosition - spotLightPos);
	// vec3 dirSpotlight = normalize(spotLightDirection);
	// float spotlightFactor = dot(dirSpotlight, dirToSpotLight);

	// if(spotlightFactor > spotlightRadius) {
	// 	spotlightFactor = (spotlightFactor-spotlightRadius) / ( 1.0 - spotlightRadius);
	// 	if(spotlightFactor > 0.0) {
	// 		spotlightFactor = pow(spotlightFactor, spotLightShiness);
	// 		float lambertianSpotLight = max(dot(normalize(spotLightPos - vVertexPosition), normal), 0.0);
	// 		spotlightFactor *= lambertianSpotLight;
	// 		spot = spotlightColor * spotlightFactor * spotLightStrength;	
	// 	}
	// }

	color += diffuse + specular + spot + vec3(vDeferLight);
	float heightOffset = 1.0;
	const float heightThreshold = .85;
	if(vTextureCoord.y > heightThreshold) {
		heightOffset = map(vTextureCoord.y, heightThreshold, 1.0, 1.0, 0.0);
	}

	float depthOffset = pow(clamp(vDepth+.35, 0.0, 1.0), 6.0);
	color *= depthOffset;

	gl_FragColor = vec4(color, 1.0);
	gl_FragColor *= heightOffset;
	// gl_FragColor = vec4(vec3(depthOffset), 1.0);
}