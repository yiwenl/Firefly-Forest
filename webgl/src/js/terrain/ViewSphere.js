// ViewSphere.js

var GL = bongiovi.GL;
var gl;

function ViewSphere(mSize) {
	this._size = mSize || 20.0;
	bongiovi.View.call(this, bongiovi.ShaderLibs.get("generalVert"), bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createSphere(this._size, 10);
};

p.render = function(pos) {
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", pos);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("color", "uniform3fv", [1, 1, .96]);
	this.shader.uniform("opacity", "uniform1f", 1);


	GL.draw(this.mesh);
};

module.exports = ViewSphere;