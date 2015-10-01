// ViewStarsSphere.js

var GL = bongiovi.GL;
var gl;

function ViewStarsSphere() {
	bongiovi.View.call(this);
}

var p = ViewStarsSphere.prototype = new bongiovi.View();
p.constructor = ViewStarsSphere;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(2000, 24);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewStarsSphere;