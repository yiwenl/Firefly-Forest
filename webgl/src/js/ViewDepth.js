// ViewDepth.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewDepth() {
	bongiovi.View.call(this, null, glslify("../shaders/depth.frag"));
}

var p = ViewDepth.prototype = new bongiovi.View();
p.constructor = ViewDepth;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewDepth;