// ViewFilmGrain.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewFilmGrain() {
	this.count = 0;
	bongiovi.ViewCopy.call(this, null, glslify("../shaders/panorama.frag"));
}

var p = ViewFilmGrain.prototype = new bongiovi.ViewCopy();
p.constructor = ViewFilmGrain;


p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this.count);
	this.count += .01;
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewFilmGrain;