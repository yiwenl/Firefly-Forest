// ViewRender.js

var GL = bongiovi.GL, gl;
var glslify = require("glslify");

function ViewRender(mNumParticles) {
	gl = GL.gl;
	this._numParticles = mNumParticles;
	// this.revealing = new bongiovi.EaseNumber(0, .0025);
	this.revealing = -.3;
	bongiovi.View.call(this, glslify("../../shaders/render.vert"), glslify("../../shaders/render.frag"));
}
 
var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];

	var total = this._numParticles * this._numParticles;
	var u, v;
	for( var i=0; i<total; i++) {
		positions.push([0, 0, 0]);
		u = (i % this._numParticles) / this._numParticles;
		v = Math.floor(i / this._numParticles) / this._numParticles;
		coords.push([u, v])
		indices.push(i);
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};


p.render = function(mTexture, mTextureNext, percent) {
	if(!this.shader.isReady()) return;

	if(this.revealing < 1) this.revealing += .0015;
	// if(this.revealing < 1) this.revealing += .01;


	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureNext", "uniform1i", 1);

	this.shader.uniform("flashingRange", "uniform1f", params.particles.flashingRange);
	this.shader.uniform("isRenderLight", "uniform1f", 0.0);
	this.shader.uniform("percent", "uniform1f", percent);
	this.shader.uniform("revealPercent", "uniform1f", this.revealing < 0 ? 0 : this.revealing);

	// var hasOpacity = 1.0;
	var hasOpacity = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 0.0 : 1.0;
	this.shader.uniform("hasOpacity", "uniform1f", hasOpacity);
	// console.log(this.revealing.value);
	mTexture.bind(0);
	mTextureNext.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewRender;