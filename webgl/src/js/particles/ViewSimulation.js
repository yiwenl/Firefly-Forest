var GL = bongiovi.GL, gl;

var glslify = require("glslify");

function ViewSimulation() {
	gl = GL.gl;
	this._count = Math.random() * 0xFF;
	this._isFirstTime = true;
	// bongiovi.View.call(this, null, glslify("../../shaders/simOptimised.frag"));
	bongiovi.View.call(this, null, glslify("../../shaders/sim.frag"));
}


var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;

p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};


p.render = function(mTexture, trees) {
	if(!this.shader.isReady()) return;

	this.shader.bind();

	// console.log(trees);
	if(this._isFirstTime) {
		var aryTrees = [];
		for(var i=0; i<trees.length; i++) {
			var o = trees[i];
			// console.log(o.radius);
			aryTrees.push(o.x);
			aryTrees.push(o.y);
			aryTrees.push(o.radius);
			// aryTrees.push(0, 0, 0);
		}	

		this.shader.uniform("trees", "uniform3fv", aryTrees);
		this._isFirstTime = false;
	}
	

	
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("numParticles", "uniform1f", params.particles.numParticles);

	this.shader.uniform('skipCount', "uniform1f", params.skipCount);
	// this.shader.uniform('zoneRadius', "uniform1f", params.particles.zoneRadius);
	this.shader.uniform('zoneRadius', "uniform1f", params.particles.noiseZoneRadius.getValue());
	// this.shader.uniform('repelStrength',"uniform1f", params.particles.repelStrength);
	// this.shader.uniform('orientStrength', "uniform1f", params.particles.orientStrength);
	// this.shader.uniform('attractStrength', "uniform1f", params.particles.attractStrength);

	this.shader.uniform('repelStrength',"uniform1f", params.particles.noiseRepelStrength.getValue() * params.skipCount);
	this.shader.uniform('orientStrength', "uniform1f", params.particles.noiseOrientStrength.getValue() * params.skipCount);
	this.shader.uniform('attractStrength', "uniform1f", params.particles.noiseAttractStrength.getValue() * params.skipCount);

	// this.shader.uniform('minThreshold', "uniform1f", params.particles.minThreshold);
	// this.shader.uniform('maxThreshold', "uniform1f", params.particles.maxThreshold);
	this.shader.uniform('minThreshold', "uniform1f", params.particles.noiseMinThreshold.getValue());
	this.shader.uniform('maxThreshold', "uniform1f", params.particles.noiseMaxThreshold.getValue());

	this.shader.uniform('flockingStrength', "uniform1f", params.particles.flockingStrength);
	this.shader.uniform('posOffset', "uniform1f", params.particles.posOffset);
	this.shader.uniform('maxRadius', "uniform1f", params.particles.maxRadius);
	



	//	SYNC
	this.shader.uniform('maxThetaDiff', "uniform1f", params.particles.maxThetaDiff);
	this.shader.uniform('catchingSpeed', "uniform1f", params.particles.catchingSpeed * params.skipCount);
	this.shader.uniform('flashingSpeed', "uniform1f", params.particles.flashingSpeed * params.skipCount);
	this.shader.uniform('syncRadius', "uniform1f", params.particles.syncRadius * ( 1 + params.skipCount/5.0));


	this.shader.uniform('noiseOffset', "uniform1f", params.particles.noiseOffset.getValue() );
	// console.log(params.particles.noiseOffset.getValue() );

	this.shader.uniform('frameGap', "uniform1f", params.frameGap);
	this.shader.uniform('speedMultiplier', "uniform1f", params.speedMultiplier);

	mTexture.bind(0);
	GL.draw(this.mesh);

	this._count += .01;
};

module.exports = ViewSimulation;