// ViewNoise.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewNoise(mNoise) {
	this._noise = mNoise == undefined ? 1.0 : mNoise;
	bongiovi.View.call(this, null, glslify("../../shaders/noise.frag"));
	this._time = Math.random() * 0xFF;
	gl = GL.gl;
	// new TangledShader(gl, this.shader.fragmentShader, this._onShaderUpdate.bind(this));
}

var p = ViewNoise.prototype = new bongiovi.View();
p.constructor = ViewNoise;

p._onShaderUpdate = function(shader) {
	this.shader.attachShaderProgram();
};

p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.setNoise = function(mNoise) {
	this._noise = mNoise;
};

p.render = function(texture) {
	this._time += .001;
	this.shader.bind();
	this.shader.uniform("noiseOffset", "uniform1f", this._noise);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", 0.0);
	this.shader.uniform("detailMapScale", "uniform1f", params.detailMapScale);
	this.shader.uniform("detailMapHeight", "uniform1f", params.detailMapHeight);
	this.shader.uniform("noiseScale", "uniform1f", params.noiseScale);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNoise;