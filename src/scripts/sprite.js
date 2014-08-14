var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
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

Sprite.prototype.pos = function(h,d){
	this.pos = new Polar(h,d);
	return this;
};

Sprite.prototype.posInc = function(h,d){
	this.pos.r += h;
	this.pos.d += d;
	return this;
};

Sprite.prototype.getPos = function(delta){

};

Sprite.prototype.draw = function(delta, ctx){
	var img = this.img;
	var xy = this.pos.toCartesian();
	if(img && img.width){
		ctx.save();
		ctx.translate(xy.x,xy.y);
		ctx.rotate(this.pos.rad());
		ctx.drawImage(
			img,
			0,
			0-this.w,
			this.w,
			img.height*(this.w/img.width)
		);
		ctx.restore();
	} else {
		console.log('no image');
	}
};

module.exports = Sprite;