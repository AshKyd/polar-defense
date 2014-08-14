var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var math = Math;
/**
 * Super simpe sprite placeholder.
 */
var Sprite = function(opts){
	for(var i in opts){
		this[i] = opts[i];
	}
	if(this.src){
		this.img = document.createElement('img');
		this.img.src = 'img/'+opts.src+'.svg';
	}
};


/**
 * Set the position.
 * @param  {Number} h Height
 * @param  {Number} d Degree
 * @return {Object}   this
 */
Sprite.prototype.pos = function(h,d){
	this.pos = new Polar(h,d);
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