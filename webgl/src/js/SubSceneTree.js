// SubSceneTree.js

var ViewTree = require("./trees/ViewTree");

var SubSceneTree = function() {
	this._init();
};


var p = SubSceneTree.prototype;


p._init = function() {
	this._vTree = new ViewTree();
};


p.getTrees = function() {
	return this._vTree.treePos;
};


p.render = function(mCamPos, mLightPos, mSpotLightPos, fboParticles) {
	// console.log('render');
	this._vTree.render(mCamPos, mLightPos, mSpotLightPos, fboParticles.getTexture() );
};



module.exports = SubSceneTree;