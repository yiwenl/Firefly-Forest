// gradientMap.frag
#define SHADER_NAME FRAGMENT_GRADIENT_MAP

precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureMap;

const float RADIUS = 0.75;
const float SOFTNESS = 0.35;


void main(void) {
	vec3 color = texture2D(texture, vTextureCoord).rgb;
	float maxLength = length(vec3(1.0));
	vec2 uv = vec2(length(color) / maxLength, .5);
	vec3 colorMapped = texture2D(textureMap, uv).rgb;

	float len = distance(vTextureCoord, vec2(.5));
    float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);

	gl_FragColor = vec4(colorMapped * vignette, 1.0);
}