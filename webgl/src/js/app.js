// app.js
window.bongiovi = require("./libs/bongiovi-post.js");
window.Sono     = require("./libs/sono.min.js");
var dat         = require("dat-gui");
var NoiseNumber = require("./NoiseNumber");

window.params = {
	noise:.3,
	noiseScale:.25,
	detailMapScale:3.4,
	detailMapHeight:.05,
	bump:.35,
	spotlightRadius:.62,
	spotLightShiness:8.0,
	noiseSandUVScale:12.0,
	exposure:3.5,
	showSpecularLight:true,
	showGlitterLight:true,
	showLightSource:false,
	
	spotLightStrength:0.4,
	specularLightStrendght:.2,
	diffuseLightStrendght:.16,
	treeDiffuseLightStrendght:.1,
	autoLightMoving:false,

	enablePostEffect:true,
	renderTerrain:true,
	renderTrees:true,
	renderParticles:true,
	debugDepth:false,
	debugFbo:false,
	frameGap:1,
	speedMultiplier:1,

	skipCount:7
};

window.params.particles = {
	numParticles:64,
	maxSpeed:1.25,
	minSpeed:.01,
	zoneRadius:130,

	noiseZoneRadius:new NoiseNumber(70, 150, .0013248395),
	repelStrength:.020,
	orientStrength:.010,
	attractStrength:.005,

	noiseRepelStrength: new NoiseNumber(.020, .060, .00248397),
	noiseOrientStrength: new NoiseNumber(.002, .015, .00138289475893),
	noiseAttractStrength: new NoiseNumber(.001, .008, .0011203904),

	maxThreshold:.7,
	minThreshold:.45,
	flockingStrength:1.0,
	posOffset:0.0025,
	maxRadius:1000.0,

	noiseMaxThreshold:new NoiseNumber(.6, .8, .00142378638),
	noiseMinThreshold:new NoiseNumber(.3, .4, .0014892357329),
	noiseOffset:new NoiseNumber(0.25, 1, .0014892357329),


	maxThetaDiff:.6,
	catchingSpeed:.003,
	flashingSpeed:.025,
	flashingRange:1.15,
	syncRadius:50
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		new bongiovi.SimpleImageLoader().load([
			"assets/bg.jpg",
			"assets/noise.png",
			"assets/starsmap.jpg",
			"assets/treeNormal.jpg",
			"assets/gradientMap.png",
			"assets/detailHeight.png"
			], this, this._onImageLoaded, this._onImageProgress);
	}

	var p = App.prototype;

	p._onImageProgress = function(p) {
		var pp = Math.floor(p*100) + "%";
		document.body.querySelector('.Loading-Bar').style.width = pp;
	};

	p._onImageLoaded = function(img) {
		document.body.querySelector('.Loading-Bar').style.width = "100%";
		
		window.images = img;
		bongiovi.Scheduler.delay(this, this.delayHide, null, 500);
		bongiovi.Scheduler.delay(this, this.delayInit, null, 600);
	};

	p.delayHide = function() {
		document.body.querySelector('.Loading-Container').classList.add("hide");
	};

	p.delayInit = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		console.log('Canvas : ', this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);
		return;

		this.gui = new dat.GUI({width:300});
		var fTerrain = this.gui.addFolder('Terrain');
		fTerrain.add(params, "noise", 0.0, 2.0).step(.01);
		fTerrain.add(params, "noiseScale", 0.0, 1.0).step(.01);
		fTerrain.add(params, "detailMapHeight", 0.0, 0.2).step(.01);
		fTerrain.add(params, "detailMapScale", .1, 10.0).step(.01);
		fTerrain.add(params, "bump", 0.0, .5).step(.01);
		fTerrain.add(params, "spotlightRadius", 0.0, 1.0).step(.01);
		fTerrain.add(params, "spotLightShiness", 0.0, 10.0).step(.01);
		fTerrain.add(params, "noiseSandUVScale", 0.0, 100.0).step(.1);
		fTerrain.add(params, "exposure", 0.0, 5.0).step(.01);
		fTerrain.add(params, "showSpecularLight");
		fTerrain.add(params, "showGlitterLight");
		fTerrain.add(params, "showLightSource");

		var fParticles = this.gui.addFolder('Particles');
		fParticles.add(params.particles, 'maxSpeed', 0.1, 2.0).step(.01);
		fParticles.add(params.particles, 'minSpeed', 0.001, .05).step(.001);
		fParticles.add(params.particles, 'zoneRadius', 20.0, 150.0);
		fParticles.add(params.particles, 'repelStrength', 0.01, 0.5).step(.01);
		fParticles.add(params.particles, 'orientStrength', 0.001, 0.05).step(.001);
		fParticles.add(params.particles, 'attractStrength', 0.001, 0.01).step(.001);
		fParticles.add(params.particles, 'maxThreshold', 0.0, 1.0).step(.01);
		fParticles.add(params.particles, 'minThreshold', 0.0, 1.0).step(.01);
		fParticles.add(params.particles, 'flockingStrength', 0.0, 1.0).step(.01);
		fParticles.add(params.particles, 'posOffset', 0.001, .01).step(.001);
		fParticles.add(params.particles, 'catchingSpeed', 0.001, .03).step(.001);
		fParticles.add(params.particles, 'flashingSpeed', 0.001, .1).step(.001);
		fParticles.add(params.particles, 'syncRadius', 10.0, 150.0);
		// fParticles.open();


		this.gui.add(params, "spotLightStrength", 0.0, 1.0).step(.01);
		this.gui.add(params, "specularLightStrendght", 0.0, 1.0).step(.01);
		this.gui.add(params, "diffuseLightStrendght", 0.0, 1.0).step(.01);
		this.gui.add(params, "treeDiffuseLightStrendght", 0.0, 1.0).step(.01);
		this.gui.add(params, "autoLightMoving");
		this.gui.add(params, "enablePostEffect");
		this.gui.add(params, "renderTerrain");
		this.gui.add(params, "renderTrees");
		this.gui.add(params, "renderParticles");
		this.gui.add(params, "debugFbo");
		this.gui.add(params, "debugDepth");
		this.gui.add(params, "frameGap", 1.0, 10.0);
		this.gui.add(params, "speedMultiplier", 1.0, 2.0).step(.01);
		window.gui = this.gui;

		this.gui.close();
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();