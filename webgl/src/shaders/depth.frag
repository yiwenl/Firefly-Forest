// depth.frag

precision highp float;

uniform sampler2D texture;
varying vec2 vTextureCoord;

const float NEAR = 5.0;
const float FAR = 4000.0;
//float f = 800.0;
    
float getDepth(float z, float n, float f) {
    return (2.0 * n) / (f + n - z*(f-n));
}


void main(void) {
	vec4 color = texture2D(texture, vTextureCoord);

	float grey = getDepth(color.r, NEAR, FAR);

	color.rgb = vec3(grey);

	gl_FragColor = color;
}