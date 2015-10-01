// ViewToneMapping.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewToneMapping() {
	this.exposure = 2.5;
	bongiovi.ViewCopy.call(this, null, glslify("../shaders/toneMapping.frag"));
}

var p = ViewToneMapping.prototype = new bongiovi.ViewCopy();
p.constructor = ViewToneMapping;

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("exposure", "uniform1f", this.exposure);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewToneMapping;