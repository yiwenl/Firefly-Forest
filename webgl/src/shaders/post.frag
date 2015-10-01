// toneMapping.frag

precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureMap;

uniform float exposure;
uniform float opacity;

const float RADIUS = 0.75;
const float SOFTNESS = 0.35;

void main(void) {
	vec4 color       = texture2D(texture, vTextureCoord);
	
	float maxLength  = length(vec3(1.0));
	vec2 uv          = vec2(length(color.rgb) / maxLength, .5);
	color.rgb  		 = texture2D(textureMap, uv).rgb;
	
	float len        = distance(vTextureCoord, vec2(.5));
	float vignette   = smoothstep(RADIUS, RADIUS-SOFTNESS, len);

	color.rgb        *= exposure;
	color.rgb        = color.rgb/(1.0 + color.rgb);

	gl_FragColor = vec4(color.rgb * vignette, opacity);

}