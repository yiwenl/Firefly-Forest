// ViewSave.js

var GL = bongiovi.GL, gl;
var random = function(min, max) {	return min + Math.random() * (max - min); };
var glslify = require("glslify");

function ViewSave(mNumParticles) {
	gl = GL;
	console.log(mNumParticles);
	this._numParticles = mNumParticles;
	this._totalParticles = this._numParticles * this._numParticles;
	console.log("Total Particles = ", this._totalParticles);

	bongiovi.View.call(this, glslify("../../shaders/save.vert"), glslify("../../shaders/save.frag"));
}

var p = ViewSave.prototype = new bongiovi.View();
p.constructor = ViewSave;

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;

	var x, y, z, u, v, range = params.particles.maxRadius;
	for( var i=0; i<this._totalParticles; i++) {
		x = random(-range, range);
		y = random(-80, 400);
		z = random(-range, range);

		u = (i % this._numParticles) / this._numParticles;
		u -= .5;
		u *= 2.0;
		u += 1.0/this._numParticles;
		u = u * .5 - .5;

		v = Math.floor(i / this._numParticles) / this._numParticles;
		v -= .5;
		v *= 2.0;
		v += 1.0/this._numParticles;
		v = v * .5 - .5;

		positions.push([x, y, z]);
		coords.push([u, v]);
		indices.push(index);

		index++;

		//	SPEED LIMITS / FLAHSING CYCLE 
		var speedLimit = .4 * params.skipCount;
		var min = random(.5, 1.0) * speedLimit;
		var max = random(1.5, 2.5) * speedLimit;
		positions.push([Math.random() * Math.PI * 2.0, min, max]);
		coords.push([u, v+1]);
		indices.push(index);

		index++;


		//	EXTRA RANDOMS
		positions.push([Math.random(), Math.random(), Math.random()]);
		coords.push([u+1, v+1]);
		indices.push(index);

		index++;
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};


p.render = function() {
	if(!this.shader.isReady()) return;
	this.shader.bind();
	GL.draw(this.mesh);
};

module.exports = ViewSave;