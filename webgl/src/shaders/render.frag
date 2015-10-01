#define SHADER_NAME RENDER_FRAGMENT

precision highp float;
varying float alpha;
varying float opacity;

const vec2 center = vec2(.5);
const float br = .96;
const float minY = .1;
const float PI = 3.141592657;
uniform float hasOpacity;


void main(void) {
	if(opacity == 0.0) discard;
	if(distance(gl_PointCoord, center) > .5) discard;
	if(hasOpacity > .5) {
		gl_FragColor = vec4(vec3(alpha*opacity), opacity);	
	} else {
		gl_FragColor = vec4(vec3(alpha*opacity), 1.0);
	}
    
}