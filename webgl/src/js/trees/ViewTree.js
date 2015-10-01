// ViewTree.js

var GL = bongiovi.GL;
var gl;
var random = function(min, max) { return min + Math.random() * (max - min);	}
var distance = function(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.sqrt( dx*dx + dy*dy );
}
var glslify = require("glslify");

function ViewTree() {
	this.radius = 75;
	this.height = 2000;
	bongiovi.View.call(this, glslify("../../shaders/tree.vert"), glslify("../../shaders/tree.frag"));
}

var p = ViewTree.prototype = new bongiovi.View();
p.constructor = ViewTree;


p._init = function() {

	this._textureNormal = new bongiovi.GLTexture(images.treeNormal);

	var positions = [];
	var coords = [];
	var indices = [];
	var numCircle = 12 * 1;
	var numHeight = 10 * 3;
	var index = 0;
	var posOffset = [];

	function getPos(i, j, radius, height, treeIndex) {
		var y       = i/numHeight * height;
		var theta   = j/numCircle * Math.PI * 2.0;
		var rOffset = 1.0 - Math.sin(i/numHeight * Math.PI * .5);
		rOffset     = Math.pow(rOffset, 12.0);
		var rPerlin = Perlin.noise(i*.15, treeIndex, 0) - .5;
		var r       = radius + rOffset * 40 + rPerlin * 30;
		var x       = Math.cos(theta) * r;
		var z       = Math.sin(theta) * r;

		return [x, y, z];
	}


	function createTree(tx, ty, tz, radius, height, treeIndex) {
		for(var i=0; i<numHeight; i++) {
			for(var j=0; j<numCircle; j++) {
				positions.push(getPos(i, j, radius, height, treeIndex));
				positions.push(getPos(i, j+1, radius, height, treeIndex));
				positions.push(getPos(i-1 , j+1, radius, height, treeIndex));
				positions.push(getPos(i-1, j, radius, height, treeIndex));

				posOffset.push([tx, ty, tz]);
				posOffset.push([tx, ty, tz]);
				posOffset.push([tx, ty, tz]);
				posOffset.push([tx, ty, tz]);

				coords.push([j/numCircle, (i+1)/numHeight]);
				coords.push([(j+1)/numCircle, (i+1)/numHeight]);
				coords.push([(j+1)/numCircle, i/numHeight]);
				coords.push([j/numCircle, i/numHeight]);

				indices.push(index * 4 + 0);
				indices.push(index * 4 + 1);
				indices.push(index * 4 + 2);
				indices.push(index * 4 + 0);
				indices.push(index * 4 + 2);
				indices.push(index * 4 + 3)

				index++;
			}
		}
	}


	function checkTreePos(x, y, radius) {
		var minDist = 350;
		for(var i=0; i<treePos.length; i++) {
			var t = treePos[i];
			if(distance(x, y, t.x, t.y) < minDist) {
				return false;
			}
		}

		treePos.push({x:x, y:y, radius:radius});
		return true;
	}

	
	var useStaticPos = false;
	if(useStaticPos) {
		var treePos = [{"x":-293.54302771389484,"y":520.4603394493461,"radius":36.75406054593623},{"x":-1037.8730781376362,"y":1086.4977618679404,"radius":32.08076622337103},{"x":-369.4632841274142,"y":-242.91295688599348,"radius":36.36323704384267},{"x":-836.7491863667965,"y":-854.9695339053869,"radius":69.0351954754442},{"x":-1024.1067571565509,"y":250.92562437057495,"radius":66.36707925237715},{"x":1134.2855589464307,"y":-245.18567081540823,"radius":63.58641539700329},{"x":-1196.281429566443,"y":748.2667760923505,"radius":33.642820259556174},{"x":93.97468250244856,"y":1186.3147180527449,"radius":36.79412445984781},{"x":890.4755037277937,"y":426.18278358131647,"radius":40.198218347504735},{"x":210.92528030276299,"y":193.8076738268137,"radius":60.565632497891784},{"x":872.8103762492537,"y":-1100.4804946482182,"radius":33.017036905512214},{"x":297.32723627239466,"y":715.570554882288,"radius":59.10820403136313},{"x":-708.8858066126704,"y":-30.279360339045525,"radius":56.500643203035},{"x":135.90815495699644,"y":-694.2145837470889,"radius":51.41557809896767},{"x":563.0035758018494,"y":-276.1978581547737,"radius":61.19064029306173},{"x":770.9520164877176,"y":778.5313479602337,"radius":30.09425336495042},{"x":-263.1049918010831,"y":105.28227277100086,"radius":66.65063723921776},{"x":-656.9155169650912,"y":810.0876638665795,"radius":61.62748905830085},{"x":537.2396238148212,"y":-902.7603283524513,"radius":55.09750599041581},{"x":-802.6183806359768,"y":-493.30631364136934,"radius":31.613288894295692}];
		for(var i=0; i<treePos.length; i++) {
			var tree = treePos[i];
			var tx = tree.x;
			var tz = tree.y;
			var radius = tree.radius;
			createTree(tx, -300, tz, radius, this.height, i);
		}	
	} else {
		var numTrees = 20;
		var range = 1200;
		var treePos = [];
		for(var i=0; i<numTrees; i++) {
			var tx, tz;
			var radius = random(30, 70);
			do {
				tx = random(-range, range);
				tz = random(-range, range);	
			} while(!checkTreePos(tx, tz, radius));
			createTree(tx, -300, tz, radius, this.height, i);
		}
		// saveJson(treePos);
	}

	this.treePos = treePos;
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(posOffset, "aPosOffset", 3);

};

p.render = function(camPos, lightPos, spotLightPos, textureParticles) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this._textureNormal.bind(0);
	this.shader.uniform("textureParticles", "uniform1i", 1);
	textureParticles.bind(1);
	this.shader.uniform("lightPos", "uniform3fv", lightPos);
	this.shader.uniform("spotLightPos", "uniform3fv", spotLightPos);
	this.shader.uniform("eyePos", "uniform3fv", camPos);
	this.shader.uniform("showSpecularLight", "uniform1f", params.showSpecularLight ? 1.0 : 0.0);
	this.shader.uniform("treeDiffuseLightStrendght", "uniform1f", params.treeDiffuseLightStrendght);
	this.shader.uniform("specularLightStrendght", "uniform1f", params.specularLightStrendght);
	this.shader.uniform("spotLightStrength", "uniform1f", params.spotLightStrength);
	this.shader.uniform("spotlightRadius", "uniform1f", params.spotlightRadius);
	this.shader.uniform("spotLightShiness", "uniform1f", params.spotLightShiness);
	this.shader.uniform("flashingRange", "uniform1f", params.particles.flashingRange);
	GL.draw(this.mesh);
};

module.exports = ViewTree;