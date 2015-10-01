// SubSceneParticles.js

var GL             = bongiovi.GL, gl;
var ViewSave       = require("./particles/ViewSave");
var ViewRender     = require("./particles/ViewRender");
var ViewSimulation = require("./particles/ViewSimulation");

var SubSceneParticles = function(mParentScene) {
	gl                 = GL.gl;
	this.parentScene   = mParentScene;
	this.camera        = this.parentScene.camera;
	this.cameraOtho    = this.parentScene.cameraOtho;
	this.sceneRotation = this.parentScene.sceneRotation;
	this.rotationFront = this.parentScene.rotationFront;
	this._frameCount   = 0;
	this._initTextures();
	this._initViews();

	this.reset();
}


var p = SubSceneParticles.prototype;

p._initTextures = function() {
	var numParticles = params.particles.numParticles;
	var pars = { minFilter:gl.NEAREST, magFilter:gl.NEAREST };

	this._fboCurrent 	= new bongiovi.FrameBuffer(numParticles*2.0, numParticles*2.0, pars);
	this._fboTarget 	= new bongiovi.FrameBuffer(numParticles*2.0, numParticles*2.0, pars);

	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._fboCurrent.bind();
	GL.clear(0, 0, 0, 0);
	this._fboCurrent.unbind();

	this._fboTarget.bind();
	GL.clear(0, 0, 0, 0);
	this._fboTarget.unbind();

	GL.setViewport(0, 0, GL.canvas.width, GL.canvas.height);
};


p._initViews = function() {
	this._vSave     = new ViewSave(params.particles.numParticles);
	this._vRender   = new ViewRender(params.particles.numParticles);
	this._vSim      = new ViewSimulation();
	// this._vCopy 	= new bongiovi.ViewCopy();
};


p.reset = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._fboCurrent.bind();
	this._vSave.render();
	this._fboCurrent.unbind();
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);

	GL.setViewport(0, 0, GL.canvas.width, GL.canvas.height);
};


p.update = function(trees) {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._fboTarget.bind();
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture(), trees );
	this._fboTarget.unbind();

	this.swap();
};


p.render = function(percent) {
	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent);
};


p.getFbo = function() {
	return this._fboCurrent;
};

p.swap = function() {
	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;
};

module.exports = SubSceneParticles;