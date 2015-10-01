// SceneApp.js

var GL                = bongiovi.GL, gl;
var glslify           = require("glslify");
var SubSceneTree      = require("./SubSceneTree");
var SubSceneTerrain   = require("./SubSceneTerrain");
var SubSceneParticles = require("./SubSceneParticles");

var ViewGradientMap   = require("./ViewGradientMap");
var ViewToneMapping   = require("./ViewToneMapping");
var ViewFXAA          = require("./ViewFXAA");
var ViewFilmGrain 	  = require("./ViewFilmGrain");
var ViewDepth 		  = require("./ViewDepth");
var ViewPost 		  = require("./ViewPost");
var size              = 1000;

function SceneApp() {
	gl = GL.gl;
	this.fboScale 			 = 1.5;

	bongiovi.Scene.call(this);
	this.sceneRotation.lock(true);
	this.camera.setPerspective(95 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	
	// this.camera.lockZoom();
	this.camera._rx.setEasing(.02);
	this.camera._ry.setEasing(.02);
	this.camera.radius.setEasing(.005);
	this.camera._rx.limit(-.3, .1);
	// this.camera.rx           = -Math.PI;
	this.camera.rx           = -.1;
	this.camera.ry           = .15;
	this.camera.radius.setTo(1000);
	this.camera.radius.value = 1300;
	this.camera.center       = [0, -500, 0];
	
	this.count               = 0;
	this.lightPos            = [-100, 800, 0];
	this.spotLightPos        = [0, 2000, 0];

	this._initSubScenes();
	this._initSound();

	this.counter			 = 0;
	this._isSoundOn		     = false;
	this._volume			 = new bongiovi.EaseNumber(0);
	this.btnSound 			 = document.body.querySelector('.Sound-Icon');
	this.btnSound.addEventListener("click", this._onToggleSound.bind(this));


	this.stats = new Stats();
	// document.body.appendChild(this.stats.domElement);

	var that = this;
	GL.canvas.addEventListener("mousedown", function() {
		that.camera.radius.value = 1000;
	});
	window.addEventListener("mouseup", function() {
		that.camera.radius.value = 1300;
	});

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	var gl = GL.gl;

	this.depthTextureExt        = gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	this.floatTextureExt        = gl.getExtension("OES_texture_float"); // Or browser-appropriate prefix
	this.floatTextureLinearExt  = gl.getExtension("OES_texture_float_linear"); // Or browser-appropriate prefix
	this.standardDerivativesExt = gl.getExtension("OES_standard_derivatives"); // Or browser-appropriate prefix

	var scale = this.fboScale;
	// this._fboRender 		  = new bongiovi.FrameBuffer(GL.width*scale, GL.height*scale, {minFilter:gl.LINEAR, magFilter:gl.LINEAR});
	this._fboRender 		  = new bongiovi.FrameBuffer(GL.width*scale, GL.height*scale);
};

p._initViews = function() {
	this._vCopy        = new bongiovi.ViewCopy();
	this._vDepth 	   = new ViewDepth();
	this._vGradientMap = new ViewGradientMap();
	this._vTone		   = new ViewToneMapping();
	this._vPost 	   = new ViewPost();
};

p._initSubScenes = function() {
	this._sceneTerrain = new SubSceneTerrain(this);
	this._sceneTree = new SubSceneTree(this);
	this._sceneParticles = new SubSceneParticles(this);
};

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/Oscillate.mp3'],
	    volume: .0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(256);
	    	sound.play();
	    }
	});
};


p.render = function() {
	// this.camera.ry += .001;
	this.stats.update();
	this._updateLight();
	var percent = 0.0;
	if(++this.counter % params.skipCount == 0) {
		this._sceneParticles.update(this._sceneTree.getTrees());
		this.counter = 0;
	} else {
		percent = this.counter / params.skipCount;
	}
	

	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, this._fboRender.width, this._fboRender.height);
	this._fboRender.bind();
	GL.clear(0, 0, 0, 0);


	if(params.renderParticles) {
		this._sceneParticles.render( percent );
	}

	//	RENDER TERRAIN
	if(params.renderTerrain) {
		this._sceneTerrain.render(this.lightPos, this.camera.position, this.spotLightPos);	
	}

	//	RENDER TREE
	if(params.renderTrees) {
		this._sceneTree.render(this.camera.position, this.lightPos, this.spotLightPos, this._sceneParticles.getFbo());	
	}
	

	this._fboRender.unbind();
	

	//	OUTPUT FOR POST EFFECTS
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, GL.width, GL.height);

	if(params.debugDepth) {
		this._vDepth.render(this._fboRender.getDepthTexture());
	} else {
		if(params.enablePostEffect) {
			// this._vTone.exposure = params.exposure;
			// this._composer.render(this._fboRender.getTexture() );
			// this._vCopy.render(this._composer.getTexture());
			this._vPost.render(this._fboRender.getTexture());
		} else {
			this._vCopy.render(this._fboRender.getTexture());
		}	
	}
	
/*
	if(params.debugFbo) {
		gl.disable(gl.DEPTH_TEST);
		var fbo = this._sceneParticles.getFbo();
		GL.setViewport(0, 0, fbo.width*4, fbo.height*4);
		this._vCopy.render(fbo.getTexture());
		gl.enable(gl.DEPTH_TEST);	
	}
	*/

	this.sound.volume = this._volume.value;
};


p._updateLight = function() {
	this.count += .01;
	if(!params.autoLightMoving) this.count = .15;
	var radius = 1500.0;
	this.lightPos[0] = Math.cos(this.count) * radius;
	this.lightPos[2] = Math.sin(this.count) * radius;
};


p._onToggleSound = function() {
	this._isSoundOn = !this._isSoundOn;
	this.btnSound.classList.toggle('isOn', this._isSoundOn);
	this._volume.value = this._isSoundOn ? 1 : 0;
};

p.resize = function() {
	var ratio = window.innerHeight / window.innerWidth;
	var scale = 1.0;
	var W = Math.min(1920*2.0, window.innerWidth * scale);
	var H = W * ratio;
	// GL.setSize(window.innerWidth, window.innerHeight);
	GL.setSize(W, H);
	this.camera.resize(GL.aspectRatio);

	// console.log('Resizing : resetting fbo ');
	scale = this.fboScale;
	this._fboRender 		  = new bongiovi.FrameBuffer(GL.width*scale, GL.height*scale);
};

module.exports = SceneApp;