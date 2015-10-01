// ViewTerrain.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewTerrain(mSegs, mSize, mHeight) {
	this._height = mHeight || 0.0;
	console.log(this._height);
	this._size   = mSize;
	this._numSeg = mSegs;
	bongiovi.View.call(this, glslify("../../shaders/terrain.vert"), glslify("../../shaders/terrain.frag"));
	gl = GL.gl;
	// new TangledShader(gl, this.shader.fragmentShader, this._onShaderUpdate.bind(this));
}

var p = ViewTerrain.prototype = new bongiovi.View();
p.constructor = ViewTerrain;


p._init = function() {
	gl            = GL.gl;
	var positions = [];
	var coords    = [];
	var indices   = []; 
	var index     = 0;
	var size      = this._size;
	var uvgap     = 1/this._numSeg;

	function getPos(i, j, num) {
		var sx = -size * .5;
		var x = sx + i/num * size;
		var z = sx + j/num * size;
		return [x, 0, z];
	}


	for(var j=0; j<this._numSeg; j++) {
		for(var i=0; i<this._numSeg; i++) {
			positions.push(getPos(i, j+1, this._numSeg));
			positions.push(getPos(i+1, j+1, this._numSeg));
			positions.push(getPos(i+1, j, this._numSeg));
			positions.push(getPos(i, j, this._numSeg));

			coords.push([i/this._numSeg, j/this._numSeg+uvgap]);
			coords.push([i/this._numSeg+uvgap, j/this._numSeg+uvgap]);
			coords.push([i/this._numSeg+uvgap, j/this._numSeg]);
			coords.push([i/this._numSeg, j/this._numSeg]);

			indices.push(index * 4 + 0);
			indices.push(index * 4 + 1);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 0);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 3)

			index++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};


p._onShaderUpdate = function(shader) {
	this.shader.attachShaderProgram();
};


p.render = function(texture, textureNormal, textureBump, pos, uvOffset, numTiles, lightPos, eyePos, spotLightPos) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	this.shader.uniform("textureBump", "uniform1i", 2);
	this.shader.uniform("position", "uniform3fv", pos);
	this.shader.uniform("uvOffset", "uniform2fv", uvOffset);
	this.shader.uniform("numTiles", "uniform1f", numTiles);
	this.shader.uniform("height", "uniform1f", this._height);
	this.shader.uniform("lightPos", "uniform3fv", lightPos);
	this.shader.uniform("spotLightPos", "uniform3fv", spotLightPos);
	this.shader.uniform("eyePos", "uniform3fv", [ -eyePos[0], eyePos[1], eyePos[2]]);
	this.shader.uniform("bumpOffset", "uniform1f", params.bump);
	this.shader.uniform("spotlightRadius", "uniform1f", params.spotlightRadius);
	this.shader.uniform("spotLightShiness", "uniform1f", params.spotLightShiness);
	this.shader.uniform("noiseSandUVScale", "uniform1f", params.noiseSandUVScale);
	this.shader.uniform("showSpecularLight", "uniform1f", params.showSpecularLight ? 1.0 : 0.0);
	this.shader.uniform("showGlitterLight", "uniform1f", params.showGlitterLight ? 1.0 : 0.0);
	this.shader.uniform("specularLightStrendght", "uniform1f", params.specularLightStrendght);
	this.shader.uniform("spotLightStrength", "uniform1f", params.spotLightStrength);
	this.shader.uniform("diffuseLightStrendght", "uniform1f", params.diffuseLightStrendght);
	texture.bind(0);
	textureNormal.bind(1);
	textureBump.bind(2);
	GL.draw(this.mesh);
};

module.exports = ViewTerrain;