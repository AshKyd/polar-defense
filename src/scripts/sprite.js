var p = require('./polar');
var draw = require('./canv');
var Cartesian = p.cartesian;
var Polar = p.polar;

var behaviours = {
	particle: require('./bhv.particle'),
	missile1: require('./bhv.missile1'),
	inv1: require('./bhv.inv1'),
	invmis: require('./bhv.invmiss'),
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
		_this.b = behaviours[_this.behaviour];
		if(_this.b.init){
			_this.b.init.call(this, opts);
		}
		_this.kinetic = _this.b.kinetic || _this.kinetic;
	}
	if(_this.src){
		_this.img = document.createElement('img');
		// Calculate the height based on the width provided.
		_this.img.onload = function(){
			_this.h = _this.img.height * (_this.w / _this.img.width);
		};
		_this.img.src = 'img/'+_this.src+'.svg';
	}
};

var sp = Sprite.prototype;


/**
 * Set the position.
 * @param  {Number} h Height
 * @param  {Number} d Degree
 * @return {Object}   this
 */
sp.setpos = function(h,d){
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
sp.posInc = function(h,d){
	this.pos.d += d;
	this.pos.abs().r += h;
	return this;
};

/**
 * Draw this sprite somewhere.
 * @param  {Number} delta ms elapsed since last draw.
 * @param  {Object} ctx   Canvas context on which to draw.
 * @return {Object}       this
 */
sp.draw = function(delta, ctx){
	var _this = this;
	var img = _this.img;
	var xy = _this.pos.toCartesian();
	if(_this.b){
		_this.b.tick.call(_this,delta);
	}

	// DEBUG STUFF. Display bounding boxes.
	// Commented out because 13k.
	if(this.kinetic){
		var bb = _this.box();
		draw.line(ctx,[
			bb[0].toCartesian(),
			new Polar(bb[0].r,bb[1].d).toCartesian(),
			bb[1].toCartesian(),
			new Polar(bb[1].r,bb[0].d).toCartesian()
		]);
	}

	ctx.save();
	ctx.globalAlpha = this.alpha || 1;
	if(img && img.width){
		ctx.translate(xy.x,xy.y);
		ctx.rotate(_this.pos.rad()+(m.PI/2));
		ctx.drawImage(
			img,
			0-_this.w/2,
			0-_this.h,
			_this.w,
			_this.h
		);
	} else {
		draw.circle(ctx,_this.pos.toCartesian(),{
			width: _this.w,
			fill: _this.fill || '#fff'
		});
	}
	ctx.restore();

	return _this;
};

/**
 * Calculate a loose bounding box.
 * This is actually super inaccurate because I didn't realise how complex it was
 * going to be, and didn't account for it.
 */
sp.box = function(){
	var _this = this;
	var radialWidth = (_this.pos.r)/25;
	return [
		new Polar(this.pos.r+_this.h,this.pos.d-_this.w/radialWidth),
		new Polar(this.pos.r,this.pos.d+_this.w/radialWidth)
	];
};

module.exports = Sprite;