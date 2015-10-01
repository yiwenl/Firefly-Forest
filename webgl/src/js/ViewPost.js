// ViewPost.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	this.exposure = 2.5;
	this.opacity = new bongiovi.EaseNumber(-1, .01);
	this.opacity.value = 1;
	bongiovi.View.call(this, null, glslify("../shaders/post.frag"));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	gl = GL.gl;
	this.textureMap = new bongiovi.GLTexture(images.gradientMap);
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;
	this.shader.bind();
	this.shader.uniform("exposure", "uniform1f", this.exposure);
	this.shader.uniform("opacity", "uniform1f", this.opacity.value < 0 ? 0 : this.opacity.value);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureMap", "uniform1i", 1);
	texture.bind(0);
	this.textureMap.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewPost;