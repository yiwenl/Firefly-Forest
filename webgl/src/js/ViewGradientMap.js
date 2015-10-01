// ViewGradientMap.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewGradientMap() {
	bongiovi.View.call(this, null, glslify("../shaders/gradientMap.frag"));
}

var p = ViewGradientMap.prototype = new bongiovi.View();
p.constructor = ViewGradientMap;


p._init = function() {
	gl = GL.gl;
	this.textureMap = new bongiovi.GLTexture(images.gradientMap);
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureMap", "uniform1i", 1);
	texture.bind(0);
	this.textureMap.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewGradientMap;