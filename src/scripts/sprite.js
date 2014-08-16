var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var math = Math;

var behaviours = {
	missile1: require('./bhv.missile1'),
	inv1: require('./bhv.inv1')
};

/**
 * Super simpe sprite placeholder.
 */
var Sprite = function(opts){
	var _this = this;
	for(var i in opts){
		_this[i] = opts[i];
	}
	if(opts.behaviour){
		_this.behaviour = behaviours[_this.behaviour];
		if(_this.behaviour && _this.behaviour.init){
			_this.behaviour.init.call(this);
		}
	}
	if(_this.src){
		_this.img = document.createElement('img');
		_this.img.src = 'img/'+_this.src+'.svg';
	}
};


/**
 * Set the position.
 * @param  {Number} h Height
 * @param  {Number} d Degree
 * @return {Object}   this
 */
Sprite.prototype.pos = function(h,d){
	if(typeof d === 'undefined'){
		this.pos = h;
	} else {
		this.pos = new Polar(h,d);
	}
	return this;
};

/**
 * Increment a position. Useful for changing the position.
 * @param  {Number} h Height
 * @param  {Number} d Degree
 * @return {Object}   this
 */
Sprite.prototype.posInc = function(h,d){
	this.pos.r += h;
	this.pos.d += d;
	return this;
};

/**
 * Draw this sprite somewhere.
 * @param  {Number} delta ms elapsed since last draw.
 * @param  {Object} ctx   Canvas context on which to draw.
 * @return {Object}       this
 */
Sprite.prototype.draw = function(delta, ctx){
	var img = this.img;
	var xy = this.pos.toCartesian();
	if(this.behaviour){
		this.behaviour.tick.call(this,delta);
	}
	if(img && img.width){
		ctx.save();
		ctx.translate(xy.x,xy.y);
		ctx.rotate(this.pos.rad()+(math.PI/2));
		var height = img.height*(this.w/img.width);
		ctx.drawImage(
			img,
			0-this.w/2,
			0-height,
			this.w,
			height
		);
		ctx.restore();
	} else {
		console.log('no image');
	}
	return this;
};

module.exports = Sprite;