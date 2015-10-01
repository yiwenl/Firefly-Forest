// SubSceneTerrain.js
var GL              = bongiovi.GL, gl;
var ViewNoise       = require("./terrain/ViewNoise");
var ViewTerrain     = require("./terrain/ViewTerrain");
var ViewNormal      = require("./terrain/ViewNormal");
var ViewSphere      = require("./terrain/ViewSphere");
var ViewStarsSphere = require("./terrain/ViewStarsSphere");
var size            = 1000;

var SubSceneTerrain = function(mParentScene) {
	gl = GL.gl;
	this.parentScene = mParentScene;
	this._initTextures();
	this._initViews();
	this._initTerrain();
};


var p = SubSceneTerrain.prototype;


p._initTextures = function() {
	var noiseSize             = 512;
	var oNearest 			  = {minFilter:gl.NEAREST, magFilter:gl.NEAREST};
	this._fboNoise            = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboNormal           = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._textureNoiseBump    = new bongiovi.GLTexture(images.noise, false, oNearest);
	this._textureDetailHeight = new bongiovi.GLTexture(images.detailHeight, false, oNearest);
	this._textureStarmap      = new bongiovi.GLTexture(images.starsmap);
};


p._initViews = function() {
	this._vNoise       = new ViewNoise(params.noise);
	this._vNormal      = new ViewNormal(300/size/3);
	this._vStars       = new ViewStarsSphere();
};


p._initTerrain = function() {
	this._fboNoise.bind();
	GL.clear();
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	GL.setMatrices(this.parentScene.cameraOtho);
	GL.rotate(this.parentScene.rotationFront);
	this._vNoise.setNoise(params.noise);
	this._vNoise.render(this._textureDetailHeight);
	this._fboNoise.unbind();

	//	RENDER NORMAL MAP
	this._fboNormal.bind();
	GL.clear();
	this._vNormal.render(this._fboNoise.getTexture());
	this._fboNormal.unbind();
	
	
	this._vTerrain = new ViewTerrain(10, size, 300);
	this._terrains = [];
	var num = 4;
	var uvgap = 1/num;
	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			var o = {};
			var x = (i-num/2) * size + size * .5;
			var z = (j-num/2) * size + size * .5;
			o.pos = [x, 0, z];
			o.uv = [i * uvgap, j * uvgap];
			o.numseg = num;
			this._terrains.push(o);
		}
	}
};


p.getNoise = function() {
	return this._fboNoise.getTexture();
};


p.render = function(lightPos, cameraPosition, spotLightPos) {
	gl.disable(gl.CULL_FACE);
	this._vStars.render(this._textureStarmap);
	gl.enable(gl.CULL_FACE);

	for(var i=0; i<this._terrains.length;i++) {
		var t = this._terrains[i];
		this._vTerrain.render(this._fboNoise.getTexture(), this._fboNormal.getTexture(), this._textureNoiseBump, t.pos, t.uv, t.numseg, lightPos, cameraPosition, spotLightPos);
	}
};


module.exports = SubSceneTerrain;
