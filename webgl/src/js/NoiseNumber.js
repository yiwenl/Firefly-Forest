// NoiseNumber.js

function NoiseNumber(min, max, speed) {
	this.setRange(min, max);
	this._speed = speed;
	this._seed = Math.random() * 0xFF;
	this._pivot = Math.random() * 0xFF;
	this._value = (min + max) * .5;
	this._init();
}


var p = NoiseNumber.prototype;

p._init = function() {
	bongiovi.Scheduler.addEF(this, this._loop);
};


p._loop = function() {
	this._pivot += this._speed;
	var r = (noise.simplex2(this._seed, this._pivot) + 1.0) * .5;
	this._value = this._min + r * this._diff;
};


p.setRange = function(min, max) {
	this._min = min;
	this._max = max;
	this._diff = this._max - this._min;
};

p.getValue = function() {
	return this._value;
};

module.exports = NoiseNumber;