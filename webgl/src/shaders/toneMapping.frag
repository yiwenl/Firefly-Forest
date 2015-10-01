// toneMapping.frag

#define SHADER_NAME FRAGMENT_TONEMAPPING
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D texture;

uniform float exposure;

void main(void) {
	vec4 color = texture2D(texture, vTextureCoord);
	color.rgb *= exposure;
	color.rgb = color.rgb/(1.0 + color.rgb);
	vec3 retColor = color.rgb;
	gl_FragColor = vec4(retColor, 1.0);	
}