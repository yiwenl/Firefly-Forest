// ViewFXAA.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewFXAA() {
	bongiovi.ViewCopy.call(this, null, glslify("../shaders/FXAA.frag"));
}

var p = ViewFXAA.prototype = new bongiovi.ViewCopy();
p.constructor = ViewFXAA;


p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("rtWidth", "uniform1f", GL.width);
	this.shader.uniform("rtHeight", "uniform1f", GL.height);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewFXAA;